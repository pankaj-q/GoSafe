import { NextRequest } from 'next/server'
import { streamText, isStepCount, convertToModelMessages, tool, type UIMessage } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { retrieveContext } from '@/lib/knowledge'
import { lookupBooking, cancelBooking, computeCancellation } from '@/lib/cancelBooking'
import { resendTicket } from '@/lib/resendTicket'
import { sendOtp, verifyOtp } from '@/lib/otp'

export const runtime = 'nodejs'

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

const SESSION_COOKIE = 'gosafe-chat-session'
const MAX_OTP_REQUESTS_PER_MIN = 3

const otpRequestLog = new Map<string, number[]>()

function allowOtpRequest(key: string): boolean {
  const now = Date.now()
  const windowStart = now - 60_000
  const hits = (otpRequestLog.get(key) || []).filter(t => t > windowStart)
  if (hits.length >= MAX_OTP_REQUESTS_PER_MIN) return false
  otpRequestLog.set(key, [...hits, now])
  return true
}

function buildSystemPrompt(query: string) {
  const { articles: matches, policies } = retrieveContext(query)

  const contextArticleText = matches.length
    ? matches.map(a => `[${a.category}] Q: ${a.question}\nA: ${a.answer}`).join('\n\n')
    : 'No specific FAQ matched this query; rely on policy facts and your own GoSafe knowledge, staying within the documented rules.'

  const policyText = policies.map(p => `- ${p.key}: ${p.value}`).join('\n')

  return `You are the GoSafe support assistant — a friendly, professional agent for GoSafe, an Indian online bus ticketing platform (gosafe.in). You answer passenger questions about booking, payments, cancellations, refunds, ticket delivery, insurance, offers, and technical issues.

RULES YOU MUST FOLLOW:
1. Answer in ENGLISH, be concise and warm. Use short paragraphs or bullets when helpful.
2. Only base answers on the KNOWLEDGE CONTEXT and the POLICY FACTS below. Never invent policies, refund amounts, statuses, reference codes, or OTP codes.
3. If the user wants to look up a real booking (status, seats, refund, cancellation), you MUST use the lookup_booking tool — never guess the status.
4. Cancellation, refunds, tickets, and seat availability always require the user's booking reference code AND their registered phone number. NEVER proceed with account actions without both.
5. For cancellation or ticket resend, you MUST first call request_otp (sends a 6-digit OTP via SMS), collect the OTP from the user, then call the corresponding verify/cancel action tool. Never ask the user to share an OTP in plaintext unnecessarily — but they must provide it to proceed.
6. If a tool returns "not found" or mismatch, tell the user honestly and suggest 24/7 support (call 1800-800-1234, WhatsApp +91 8000 123 456, support@gosafe.in).
7. Never invent the existence of features. If unsure, offer to connect to a human agent.
8. For questions you cannot answer from context, say so and point to support.

KNOWLEDGE CONTEXT (highest priority):
${contextArticleText}

POLICY FACTS:
${policyText}
`
}

async function getOrCreateSession(deviceKey: string) {
  let session = await prisma.chatSession.findFirst({
    where: { deviceKey },
    orderBy: { updatedAt: 'desc' },
  })
  if (!session) {
    session = await prisma.chatSession.create({
      data: { deviceKey },
    })
  }
  return session
}

function persistMessage(
  sessionId: string,
  role: string,
  content: string,
  toolInfo?: unknown
) {
  return prisma.chatMessage.create({
    data: {
      sessionId,
      role,
      content,
      toolInfo: toolInfo ? JSON.parse(JSON.stringify(toolInfo)) : undefined,
    },
  }).catch(err => {
    console.error('[Chat] persist failed:', err)
  })
}

export async function GET(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie') || ''
  const sessionMatch = cookieHeader.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`))
  const sessionId = sessionMatch ? decodeURIComponent(sessionMatch[1]) : ''
  if (!sessionId) {
    return Response.json({ messages: [] })
  }

  const session = await prisma.chatSession.findUnique({ where: { id: sessionId } })
  if (!session) {
    return Response.json({ messages: [] })
  }

  const rows = await prisma.chatMessage.findMany({
    where: { sessionId: session.id },
    orderBy: { createdAt: 'asc' },
    take: 100,
  })

  const messages = rows.map(row => ({
    id: row.id,
    role: row.role as 'user' | 'assistant',
    parts: row.content ? [{ type: 'text', text: row.content }] : [],
    createdAt: row.createdAt,
  }))

  return Response.json({ messages })
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { messages?: UIMessage[] }
  const messages = body.messages || []

  const cookieHeader = req.headers.get('cookie') || ''
  const sessionMatch = cookieHeader.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`))
  const sessionId = sessionMatch ? decodeURIComponent(sessionMatch[1]) : ''
  const deviceKey = sessionId || `anon-${crypto?.randomUUID?.() || Date.now().toString(36)}`

  const session = await getOrCreateSession(deviceKey)

  const lastUserText = [...messages].reverse().find(m => m.role === 'user')
  const queryText = typeof lastUserText?.parts?.find(p => p.type === 'text') === 'undefined'
    ? ''
    : (lastUserText.parts.find(p => p.type === 'text') as { text?: string })?.text || ''

  if (queryText) {
    await persistMessage(session.id, 'user', queryText)
  }

  const system = buildSystemPrompt(queryText)
  const modelMessages = await convertToModelMessages(messages)

  const tools = {
    lookup_booking: tool({
      description: 'Look up a booking by reference code and registered phone number. Returns status, seats, passengers and refund eligibility. Use before answering any question about a specific booking.',
      inputSchema: z.object({
        referenceCode: z.string().describe('The booking reference code, e.g. GS12345'),
        phone: z.string().describe('The phone number registered on the booking (10 digits)'),
      }),
      execute: async ({ referenceCode, phone }) => {
        const booking = await lookupBooking(referenceCode, phone)
        if (!booking) return { ok: false, reason: 'No booking found for that reference + phone combination.' }
        return {
          ok: true,
          referenceCode: booking.referenceCode,
          status: booking.status,
          source: booking.source,
          destination: booking.destination,
          journeyDate: booking.journeyDate.toISOString(),
          departureTime: booking.departureTime,
          arrivalTime: booking.arrivalTime,
          busType: booking.busType,
          operatorName: booking.operatorName,
          seatNumbers: booking.seatNumbers,
          passengerNames: booking.passengerNames,
          totalAmount: booking.totalAmount,
          insuranceOpted: booking.insuranceOpted,
          paymentStatus: booking.paymentStatus,
          cancellation: computeCancellation(booking),
        }
      },
    }),

    request_otp: tool({
      description: 'Send a fresh 6-digit OTP to the phone number registered on the booking. Call this BEFORE cancel_booking or resend_ticket. The user must tell you the OTP they received.',
      inputSchema: z.object({
        referenceCode: z.string().describe('The booking reference code'),
        phone: z.string().describe('The registered phone number'),
        purpose: z.enum(['CANCEL_BOOKING', 'RESEND_TICKET']),
      }),
      execute: async ({ referenceCode, phone, purpose }) => {
        const booking = await lookupBooking(referenceCode, phone)
        if (!booking) {
          return { ok: false, reason: 'No booking found for that reference + phone combination.' }
        }
        if (!allowOtpRequest(`${phone}:${purpose}`)) {
          return { ok: false, reason: 'Too many OTP requests. Please wait a minute before trying again.' }
        }
        const result = await sendOtp(phone, purpose)
        if (result.sent === false) {
          return { ok: false, reason: 'Failed to send OTP. Please try again or contact support.' }
        }
        return { ok: true, mock: result.mock === true, message: 'A 6-digit OTP has been sent via SMS to the registered phone number. Ask the user to share it to proceed.' }
      },
    }),

    resend_ticket: tool({
      description: 'Resend the e-ticket (email + WhatsApp) for a CONFIRMED booking after OTP verification. Requires the OTP the user received.',
      inputSchema: z.object({
        referenceCode: z.string(),
        phone: z.string(),
        otp: z.string().describe('The 6-digit OTP received on the registered phone'),
      }),
      execute: async ({ referenceCode, phone, otp }) => {
        const check = await verifyOtp(phone, 'RESEND_TICKET', otp)
        if (!check.valid) return { ok: false, reason: check.reason }
        const result = await resendTicket(referenceCode, phone)
        return { ok: result.ok, reason: result.error, email: result.email?.success, whatsapp: result.whatsapp?.success }
      },
    }),

    cancel_booking: tool({
      description: 'Cancel a booking and trigger the refund, after OTP verification. Requires the OTP the user received. The refund % follows the cancellation policy.',
      inputSchema: z.object({
        referenceCode: z.string(),
        phone: z.string(),
        otp: z.string().describe('The 6-digit OTP received on the registered phone'),
      }),
      execute: async ({ referenceCode, phone, otp }) => {
        const check = await verifyOtp(phone, 'CANCEL_BOOKING', otp)
        if (!check.valid) return { ok: false, reason: check.reason }
        const result = await cancelBooking(referenceCode, phone)
        return result
      },
    }),

    contact_human: tool({
      description: 'Provide the human support contact options. Use when the user asks to speak to a human or when you cannot resolve their issue.',
      inputSchema: z.object({ reason: z.string().optional() }),
      execute: async () => {
        return {
          ok: true,
          call: '+91 8000 123 456',
          whatsapp: '+91 8000 123 456',
          email: 'support@gosafe.in',
          hours: '24/7',
        }
      },
    }),
  }

  const result = streamText({
    model: google(GEMINI_MODEL),
    system,
    messages: modelMessages,
    tools,
    stopWhen: isStepCount(8),
    temperature: 0.4,
    maxRetries: 2,
    onFinish: async ({ text }) => {
      if (text) await persistMessage(session.id, 'assistant', text)
    },
  })

  const response = result.toUIMessageStreamResponse()

  response.headers.set('Set-Cookie', `${SESSION_COOKIE}=${encodeURIComponent(session.id)}; Path=/; HttpOnly; Max-Age=2592000; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}SameSite=Lax`)

  return response
}