import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRazorpayPayment } from '@/lib/razorpay'
import { confirmPaidBooking } from '@/lib/confirmBooking'

const MAX_BODY_SIZE = 65536

export async function POST(req: NextRequest) {
  try {
    const contentLength = parseInt(req.headers.get('content-length') || '0', 10)
    if (contentLength > MAX_BODY_SIZE) {
      return NextResponse.json({ error: 'Request body too large' }, { status: 413 })
    }

    const body = await req.json()
    const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payments: true },
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

    const result = await confirmPaidBooking(booking.id)

    return NextResponse.json({
      success: true,
      referenceCode: result.booking.referenceCode,
      email: result.email,
      whatsapp: result.whatsapp,
    })
  } catch (error) {
    console.error('Booking confirmation error:', error)
    return NextResponse.json({ error: 'Confirmation failed' }, { status: 500 })
  }
}
