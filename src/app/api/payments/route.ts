import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature, idempotencyKey } = body

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 })
    }

    // Check idempotency
    const existingPayment = await prisma.payment.findUnique({
      where: { idempotencyKey },
    })

    if (existingPayment && existingPayment.status === 'CAPTURED') {
      return NextResponse.json({
        success: true,
        message: 'Payment already processed',
        payment: existingPayment,
      })
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

    if (razorpayPaymentId || payment.status === 'CAPTURED') {
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
