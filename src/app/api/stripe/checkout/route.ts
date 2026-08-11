import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createStripeCheckoutSession } from '@/lib/stripe'

const MAX_BODY_SIZE = 16384

function getBaseUrl(req: NextRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000'
  const proto = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}

export async function POST(req: NextRequest) {
  try {
    const contentLength = parseInt(req.headers.get('content-length') || '0', 10)
    if (contentLength > MAX_BODY_SIZE) {
      return NextResponse.json({ error: 'Request body too large' }, { status: 413 })
    }

    const { bookingId, scheduleId, source, destination, date, seats, insurance } = await req.json()

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payments: { orderBy: { createdAt: 'asc' } } },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.status === 'CONFIRMED') {
      return NextResponse.json({ error: 'Booking already confirmed' }, { status: 409 })
    }

    const payment = booking.payments[0]
    if (!payment) {
      return NextResponse.json({ error: 'Payment record missing for booking' }, { status: 400 })
    }

    if (payment.status === 'CAPTURED') {
      return NextResponse.json({ error: 'Payment already captured' }, { status: 409 })
    }

    const baseUrl = getBaseUrl(req)
    const amountPaise = Math.round(booking.totalAmount * 100)

    const qs = new URLSearchParams({
      bookingId: String(booking.id),
      scheduleId: String(scheduleId || ''),
      source: source || '',
      destination: destination || '',
      date: date || '',
      seats: seats || '',
      insurance: String(insurance ?? false),
    }).toString()

    const session = await createStripeCheckoutSession({
      amountPaise,
      currency: 'inr',
      bookingId: booking.id,
      referenceCode: booking.referenceCode,
      successUrl: `${baseUrl}/confirmation/${booking.id}?${qs}&status=success`,
      cancelUrl: `${baseUrl}/booking/${scheduleId || booking.scheduleId}?${qs}`,
      customerEmail: booking.contactEmail,
      description: `Bus ticket ${booking.referenceCode} — ${booking.contactName}`,
    })

    await prisma.payment.update({
      where: { id: payment.id },
      data: { stripeSessionId: session.sessionId },
    })

    return NextResponse.json({
      sessionId: session.sessionId,
      url: session.url,
      bookingId: booking.id,
      referenceCode: booking.referenceCode,
      mock: !!session.mock,
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to start checkout' }, { status: 500 })
  }
}
