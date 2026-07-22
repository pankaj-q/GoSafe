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
    update: { status: 'PROCESSED', payload: JSON.stringify(payload), rawBody, eventType: event },
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

    if (dbPayment.booking.status !== 'CONFIRMED') {
      await prisma.booking.update({
        where: { id: dbPayment.booking.id },
        data: { status: 'CONFIRMED' },
      })
    }

    const booking = dbPayment.booking
    const schedule = booking.schedule
    const bus = schedule.bus
    const route = schedule.route

    let pdfBuffer: Buffer | undefined
    try {
      const { generateTicketPDF } = await import('@/lib/pdf')
      pdfBuffer = await generateTicketPDF({
        referenceCode: booking.referenceCode,
        operatorName: bus.operator.name,
        busType: bus.busType.replace(/_/g, ' '),
        busNumber: bus.busNumber,
        source: route.source.name,
        destination: route.dest.name,
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        journeyDate: booking.journeyDate.toISOString(),
        passengers: booking.passengers.map(p => ({
          name: p.name,
          age: p.age,
          gender: p.gender,
          seat: String(p.seatId),
        })),
        totalAmount: booking.totalAmount,
        insuranceOpted: booking.insuranceOpted,
      })
    } catch (err) {
      console.error('[Webhook PDF] Generation failed:', err)
    }

    const notificationPromises: Promise<unknown>[] = []

    if (booking.contactEmail) {
      notificationPromises.push(
        sendTicketEmail({
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
          pdfBuffer,
        }).catch(err => console.error('[Webhook Email] Send failed:', err))
      )
    }

    notificationPromises.push(
      sendWhatsAppMessage({
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
      }).catch(err => console.error('[Webhook WhatsApp] Send failed:', err))
    )

    await Promise.allSettled(notificationPromises)
  }

  return NextResponse.json({ status: 'ok' })
}
