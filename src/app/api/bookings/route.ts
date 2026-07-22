import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { generateReference, calculateGST } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const body = await req.json()
    const { scheduleId, journeyDate, passengers, contactName, contactPhone, contactEmail, insuranceOpted, selectedSeatIds } = body

    if (!scheduleId || !journeyDate || !passengers?.length || !contactName || !contactPhone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: { bus: true },
    })

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
    }

    const passengerCount = passengers.length
    const baseAmount = schedule.baseFare * passengerCount
    const gst = calculateGST(baseAmount)
    const insuranceAmount = insuranceOpted ? 19 : 0
    const totalAmount = baseAmount + gst + insuranceAmount

    const referenceCode = generateReference()
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : undefined

    const booking = await prisma.booking.create({
      data: {
        referenceCode,
        scheduleId,
        userId,
        journeyDate: new Date(journeyDate),
        passengerCount,
        totalAmount,
        gstAmount: gst,
        insuranceAmount,
        insuranceOpted,
        status: 'PENDING',
        contactName,
        contactPhone,
        contactEmail,
        passengers: {
          create: passengers.map((p: { name: string; age: number; gender: string }, i: number) => ({
            seatId: selectedSeatIds?.[i] || 0,
            name: p.name,
            age: p.age,
            gender: p.gender,
          })),
        },
      },
    })

    const idempotencyKey = `booking_${referenceCode}_${Date.now()}`

    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: Math.round(totalAmount * 100),
        currency: 'INR',
        status: 'CREATED',
        idempotencyKey,
      },
    })

    return NextResponse.json({
      booking: {
        id: booking.id,
        referenceCode: booking.referenceCode,
        totalAmount,
        status: booking.status,
      },
      payment: {
        id: payment.id,
        amount: payment.amount,
        idempotencyKey,
      },
    })
  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
