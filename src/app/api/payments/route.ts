import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRazorpayPayment } from '@/lib/razorpay'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature, idempotencyKey } = body

    if (!bookingId || !idempotencyKey) {
      return NextResponse.json({ error: 'Booking ID and idempotency key required' }, { status: 400 })
    }

    const existingPayment = await prisma.payment.findUnique({
      where: { idempotencyKey },
    })

    if (!existingPayment) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 })
    }

    if (existingPayment.status === 'CAPTURED') {
      return NextResponse.json({ success: true, message: 'Payment already processed', payment: existingPayment })
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
    } else if (razorpayPaymentId) {
      return NextResponse.json({ error: 'Missing signature or order ID for verification' }, { status: 400 })
    }

    const payment = await prisma.payment.update({
      where: { idempotencyKey },
      data: {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        status: razorpayPaymentId ? 'CAPTURED' : 'FAILED',
        gatewayResponse: JSON.stringify(body),
      },
    })

    if (razorpayPaymentId) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CONFIRMED' },
      })
    }

    return NextResponse.json({ success: true, payment })
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 })
  }
}
