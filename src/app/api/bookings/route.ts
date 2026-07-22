import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { generateReference, calculateGST } from '@/lib/utils'
import { bookingFormSchema } from '@/lib/validations'

const MAX_PASSENGERS = 10
const MAX_BODY_SIZE = 65536

export async function POST(req: NextRequest) {
  try {
    const contentLength = parseInt(req.headers.get('content-length') || '0', 10)
    if (contentLength > MAX_BODY_SIZE) {
      return NextResponse.json({ error: 'Request body too large' }, { status: 413 })
    }

    const body = await req.json()
    const parsed = bookingFormSchema.safeParse(body)

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]
      return NextResponse.json({
        error: firstIssue?.message || 'Invalid input',
        fields: parsed.error.issues.map(e => ({ field: e.path.join('.'), message: e.message })),
      }, { status: 400 })
    }

    const { scheduleId, journeyDate, selectedSeatIds } = body
    const { contactName, contactPhone, contactEmail, insuranceOpted, passengers } = parsed.data

    if (!scheduleId) {
      return NextResponse.json({ error: 'Schedule ID is required' }, { status: 400 })
    }

    if (passengers.length > MAX_PASSENGERS) {
      return NextResponse.json({ error: `Maximum ${MAX_PASSENGERS} passengers allowed` }, { status: 400 })
    }

    if (selectedSeatIds && selectedSeatIds.length !== passengers.length) {
      return NextResponse.json({ error: 'Number of seats must match number of passengers' }, { status: 400 })
    }

    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: { bus: true },
    })

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
    }

    if (selectedSeatIds && selectedSeatIds.length > 0) {
      const existingBookings = await prisma.booking.findMany({
        where: {
          scheduleId,
          status: { not: 'CANCELLED' },
          passengers: {
            some: { seatId: { in: selectedSeatIds } },
          },
        },
        select: { id: true, passengers: { select: { seatId: true } } },
      })

      if (existingBookings.length > 0) {
        return NextResponse.json({ error: 'Some seats are already booked', conflictSeats: existingBookings.flatMap(b => b.passengers.map(p => p.seatId)) }, { status: 409 })
      }
    }

    const bookingDate = journeyDate ? new Date(journeyDate) : new Date()
    if (isNaN(bookingDate.getTime())) {
      return NextResponse.json({ error: 'Invalid journey date' }, { status: 400 })
    }

    const passengerCount = passengers.length
    const baseAmount = schedule.baseFare * passengerCount
    const gst = calculateGST(baseAmount)
    const insuranceAmount = insuranceOpted ? 19 : 0
    const totalAmount = baseAmount + gst + insuranceAmount

    const referenceCode = generateReference()
    const session = await auth()
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : undefined

    const booking = await prisma.booking.create({
      data: {
        referenceCode,
        scheduleId,
        userId,
        journeyDate: bookingDate,
        passengerCount,
        totalAmount,
        gstAmount: gst,
        insuranceAmount,
        insuranceOpted,
        status: 'PENDING',
        contactName,
        contactPhone,
        contactEmail: contactEmail || null,
        passengers: {
          create: passengers.map((p, i) => ({
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
