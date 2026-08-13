import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const HOLD_DURATION_MS = 10 * 60 * 1000

const MAX_BODY_SIZE = 16384

export async function POST(req: NextRequest) {
  try {
    const contentLength = parseInt(req.headers.get('content-length') || '0', 10)
    if (contentLength > MAX_BODY_SIZE) {
      return NextResponse.json({ error: 'Request body too large' }, { status: 413 })
    }

    const body = await req.json()
    const { scheduleId, sessionId, seatIds } = body

    if (!scheduleId || !sessionId || !Array.isArray(seatIds) || seatIds.length === 0) {
      return NextResponse.json({ error: 'scheduleId, sessionId and seatIds are required' }, { status: 400 })
    }
    if (seatIds.length > 10) {
      return NextResponse.json({ error: 'Too many seats to hold' }, { status: 400 })
    }

    const now = new Date()
    const expiry = new Date(now.getTime() + HOLD_DURATION_MS)

    // Clear any expired holds for this schedule so stale locks don't block seats
    await prisma.bookingHold.deleteMany({
      where: { scheduleId, expiresAt: { lt: now } },
    })

    // Sanity-check the seat ids belong to this schedule
    const seatCount = await prisma.seat.count({
      where: { id: { in: seatIds }, scheduleId },
    })
    if (seatCount !== seatIds.length) {
      return NextResponse.json({ error: 'Seats do not belong to this schedule' }, { status: 400 })
    }

    // Reject seats that are already paid for (confirmed or pending bookings)
    const bookedSeatIds = await prisma.bookingPassenger.findMany({
      where: {
        seatId: { in: seatIds },
        booking: { scheduleId, status: { not: 'CANCELLED' } },
      },
      select: { seatId: true },
    })
    if (bookedSeatIds.length > 0) {
      return NextResponse.json(
        { error: 'Some seats are already booked', conflictSeats: bookedSeatIds.map(b => b.seatId) },
        { status: 409 }
      )
    }

    // Reject seats actively held by another session
    const heldElsewhere = await prisma.bookingHold.findMany({
      where: {
        scheduleId,
        seatId: { in: seatIds },
        sessionId: { not: sessionId },
        expiresAt: { gt: now },
      },
      select: { seatId: true },
    })
    if (heldElsewhere.length > 0) {
      return NextResponse.json(
        { error: 'Some seats are held by other users', conflictSeats: heldElsewhere.map(h => h.seatId) },
        { status: 409 }
      )
    }

    // Upsert a hold for each requested seat (same session renews its own hold)
    await prisma.$transaction(
      seatIds.map(seatId =>
        prisma.bookingHold.upsert({
          where: { sessionId_seatId_scheduleId: { sessionId, seatId, scheduleId } },
          create: { sessionId, seatId, scheduleId, expiresAt: expiry },
          update: { expiresAt: expiry },
        })
      )
    )

    return NextResponse.json({ success: true, expiresAt: expiry.toISOString() })
  } catch (error) {
    console.error('Hold creation error:', error)
    return NextResponse.json({ error: 'Failed to hold seats' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const scheduleId = searchParams.get('scheduleId')
    const sessionId = searchParams.get('sessionId')
    const seatIds = searchParams.get('seatIds')?.split(',').map(Number).filter(Boolean)

    if (!scheduleId || !sessionId) {
      return NextResponse.json({ error: 'scheduleId and sessionId are required' }, { status: 400 })
    }

    await prisma.bookingHold.deleteMany({
      where: {
        scheduleId: Number(scheduleId),
        sessionId,
        ...(seatIds?.length ? { seatId: { in: seatIds } } : {}),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Hold release error:', error)
    return NextResponse.json({ error: 'Failed to release seats' }, { status: 500 })
  }
}
