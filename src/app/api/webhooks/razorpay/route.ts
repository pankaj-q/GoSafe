import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRazorpayWebhook } from '@/lib/razorpay'
import { confirmPaidBooking } from '@/lib/confirmBooking'

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-razorpay-signature') || ''
  const rawBody = await req.text()

  if (!verifyRazorpayWebhook(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const payload = JSON.parse(rawBody)
  const event = payload.event
  const eventId = payload.id
  const payment = payload.payload?.payment?.entity

  if (!payment) {
    return NextResponse.json({ error: 'Missing payment entity' }, { status: 400 })
  }

  const existing = await prisma.paymentWebhook.findUnique({
    where: { eventId },
  })

  if (existing && existing.status === 'PROCESSED') {
    return NextResponse.json({ status: 'already_processed' })
  }

  await prisma.paymentWebhook.upsert({
    where: { eventId },
    update: { status: 'PROCESSING', payload: JSON.stringify(payload), rawBody, eventType: event },
    create: {
      eventId,
      eventType: event,
      payload: JSON.stringify(payload),
      rawBody,
      status: 'PROCESSING',
    },
  })

  try {
    if (event === 'payment.captured') {
      const razorpayPaymentId = payment.id
      const razorpayOrderId = payment.order_id

      const dbPayment = await prisma.payment.findFirst({
        where: { razorpayOrderId },
        select: { id: true, bookingId: true, status: true },
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
          razorpayPaymentId,
          razorpaySignature: signature,
          status: 'CAPTURED',
          gatewayResponse: JSON.stringify(payment),
        },
      })

      await confirmPaidBooking(dbPayment.bookingId)
    }
  } finally {
    await prisma.paymentWebhook.update({
      where: { eventId },
      data: { status: 'PROCESSED' },
    })
  }

  return NextResponse.json({ status: 'ok' })
}
