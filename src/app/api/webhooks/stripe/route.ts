import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyStripeWebhook } from '@/lib/stripe'
import { confirmPaidBooking } from '@/lib/confirmBooking'

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature') || ''
  const rawBody = await req.text()

  let event
  try {
    event = verifyStripeWebhook(rawBody, signature)
  } catch (err) {
    console.error('[Stripe webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const eventId = event.id

  const existing = await prisma.paymentWebhook.findUnique({
    where: { eventId },
  })

  if (existing && existing.status === 'PROCESSED') {
    return NextResponse.json({ status: 'already_processed' })
  }

  await prisma.paymentWebhook.upsert({
    where: { eventId },
    update: { status: 'PROCESSING', payload: JSON.stringify(event), rawBody, eventType: event.type },
    create: {
      eventId,
      gateway: 'stripe',
      eventType: event.type,
      payload: JSON.stringify(event),
      rawBody,
      status: 'PROCESSING',
    },
  })

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as {
          id: string
          payment_intent?: string | null
          metadata?: Record<string, string> | null
        }

        const dbPayment = await prisma.payment.findUnique({
          where: { stripeSessionId: session.id },
        })

        if (!dbPayment) {
          await prisma.paymentWebhook.update({
            where: { eventId },
            data: { status: 'PROCESSED' },
          })
          return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
        }

        await prisma.payment.update({
          where: { id: dbPayment.id },
          data: {
            stripePaymentId: session.payment_intent || dbPayment.stripePaymentId,
            status: 'CAPTURED',
            gatewayResponse: JSON.stringify(session),
          },
        })

        await confirmPaidBooking(dbPayment.bookingId)

        await prisma.paymentWebhook.update({
          where: { eventId },
          data: { status: 'PROCESSED' },
        })
        return NextResponse.json({ status: 'ok' })
      }

      case 'checkout.session.expired':
      case 'payment_intent.payment_failed': {
        const session = event.data.object as { id?: string; metadata?: Record<string, string> | null }

        const lookupId =
          session.id ||
          (event.type === 'payment_intent.payment_failed'
            ? (event.data.object as { metadata?: Record<string, string> }).metadata?.bookingId
            : undefined)

        if (lookupId) {
          const dbPayment = await prisma.payment.findUnique({
            where: { stripeSessionId: lookupId },
          })
          if (dbPayment && dbPayment.status !== 'CAPTURED') {
            await prisma.payment.update({
              where: { id: dbPayment.id },
              data: { status: 'FAILED', gatewayResponse: JSON.stringify(event.data.object) },
            })
          }
        }

        await prisma.paymentWebhook.update({
          where: { eventId },
          data: { status: 'PROCESSED' },
        })
        return NextResponse.json({ status: 'ok' })
      }

      default: {
        await prisma.paymentWebhook.update({
          where: { eventId },
          data: { status: 'PROCESSED' },
        })
        return NextResponse.json({ status: 'ignored' })
      }
    }
  } catch (err) {
    console.error('[Stripe webhook] Processing error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
