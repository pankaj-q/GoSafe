import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createRazorpayOrder } from '@/lib/razorpay'

export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json()

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

    const amountInPaise = Math.round(booking.totalAmount * 100)
    const receipt = `${booking.referenceCode}_${Date.now()}`
    const order = await createRazorpayOrder({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        bookingId: String(booking.id),
        referenceCode: booking.referenceCode,
      },
    })

    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: amountInPaise,
        currency: 'INR',
        status: 'CREATED',
        idempotencyKey: order.mock ? `mock_${receipt}` : receipt,
        razorpayOrderId: order.id,
      },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || '',
      bookingId: booking.id,
      referenceCode: booking.referenceCode,
      mock: !!order.mock,
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
