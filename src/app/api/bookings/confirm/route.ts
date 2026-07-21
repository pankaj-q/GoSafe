import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRazorpayPayment } from '@/lib/razorpay'
import { generateTicketPDF } from '@/lib/pdf'
import { sendTicketEmail } from '@/lib/email'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        schedule: {
          include: {
            bus: { include: { operator: true } },
            route: { include: { source: true, dest: true } },
          },
        },
        passengers: true,
        payments: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.status === 'CONFIRMED') {
      return NextResponse.json({ success: true, alreadyConfirmed: true, referenceCode: booking.referenceCode })
    }

    if (razorpayPaymentId && razorpayOrderId && razorpaySignature) {
      const isValid = verifyRazorpayPayment({
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      })

      if (!isValid) {
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: booking.id },
        data: { status: 'CONFIRMED' },
      })

      const payment = booking.payments[0]
      if (payment) {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            razorpayPaymentId: razorpayPaymentId || payment.razorpayPaymentId,
            razorpaySignature: razorpaySignature || payment.razorpaySignature,
            status: 'CAPTURED',
          },
        })
      }
    })

    const schedule = booking.schedule
    const bus = schedule.bus
    const route = schedule.route

    let pdfBuffer: Buffer | undefined

    try {
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
      console.error('[PDF] Generation failed:', err)
    }

    const emailPromise = booking.contactEmail
      ? sendTicketEmail({
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
        })
      : Promise.resolve({ success: true, skipped: true })

    const whatsappPromise = sendWhatsAppMessage({
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

    const [emailResult, whatsappResult] = await Promise.allSettled([emailPromise, whatsappPromise])

    return NextResponse.json({
      success: true,
      referenceCode: booking.referenceCode,
      email: emailResult.status === 'fulfilled' ? emailResult.value : { success: false, error: emailResult.reason },
      whatsapp: whatsappResult.status === 'fulfilled' ? whatsappResult.value : { success: false, error: whatsappResult.reason },
    })
  } catch (error) {
    console.error('Booking confirmation error:', error)
    return NextResponse.json({ error: 'Confirmation failed' }, { status: 500 })
  }
}
