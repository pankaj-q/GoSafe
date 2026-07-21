import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRazorpayWebhook } from '@/lib/razorpay'
import { sendTicketEmail } from '@/lib/email'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-razorpay-signature') || ''
  const rawBody = await req.text()

  if (!verifyRazorpayWebhook(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const payload = JSON.parse(rawBody)
  const event = payload.event
  const payment = payload.payload?.payment?.entity

  if (!payment) {
    return NextResponse.json({ error: 'Missing payment entity' }, { status: 400 })
  }

  const eventId = payment.id
  const existing = await prisma.paymentWebhook.findUnique({
    where: { eventId },
  })

  if (existing && existing.status === 'PROCESSED') {
    return NextResponse.json({ status: 'already_processed' })
  }

  await prisma.paymentWebhook.upsert({
    where: { eventId },
    update: { status: 'PROCESSED', payload: JSON.stringify(payload), rawBody },
    create: {
      eventId,
      eventType: event,
      payload: JSON.stringify(payload),
      rawBody,
      status: 'PROCESSED',
    },
  })

  if (event === 'payment.captured') {
    const razorpayPaymentId = payment.id
    const razorpayOrderId = payment.order_id

    const dbPayment = await prisma.payment.findFirst({
      where: { razorpayOrderId },
      include: {
        booking: {
          include: {
            schedule: { include: { bus: { include: { operator: true } }, route: { include: { source: true, dest: true } } } },
            passengers: true,
          },
        },
      },
    })

    if (!dbPayment) {
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

    await prisma.booking.update({
      where: { id: dbPayment.booking.id },
      data: { status: 'CONFIRMED' },
    })

    const booking = dbPayment.booking
    const schedule = booking.schedule
    const bus = schedule.bus
    const route = schedule.route

    const pdfBuffer = null

    if (booking.contactEmail) {
      await sendTicketEmail({
        to: booking.contactEmail,
        referenceCode: booking.referenceCode,
        operatorName: bus.operator.name,
        source: route.source.name,
        destination: route.dest.name,
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        journeyDate: booking.journeyDate.toISOString(),
        passengerNames: booking.passengers.map(p => p.name),
        seatNumbers: booking.passengers.map(p => String(p.seatId)),
        totalAmount: booking.totalAmount,
        pdfBuffer: pdfBuffer || undefined,
      })
    }

    await sendWhatsAppMessage({
      to: booking.contactPhone,
      referenceCode: booking.referenceCode,
      operatorName: bus.operator.name,
      source: route.source.name,
      destination: route.dest.name,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      journeyDate: booking.journeyDate.toISOString(),
      seatNumbers: booking.passengers.map(p => String(p.seatId)),
      passengerNames: booking.passengers.map(p => p.name),
      totalAmount: booking.totalAmount,
    })
  }

  return NextResponse.json({ status: 'ok' })
}
