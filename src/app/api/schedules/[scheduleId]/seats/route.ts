import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  const { scheduleId } = await params
  const sessionId = new URL(req.url).searchParams.get('session') || ''

  try {
    const schedule = await prisma.schedule.findUnique({
      where: { id: Number(scheduleId) },
      include: {
        bus: { include: { operator: true } },
        seats: true,
        boardingPoints: { orderBy: { sortOrder: 'asc' } },
        bookings: {
          where: { status: { not: 'CANCELLED' } },
          include: { passengers: true },
        },
      },
    })

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
    }

    // Clear stale holds so they don't block seats forever
    await prisma.bookingHold.deleteMany({
      where: { scheduleId: schedule.id, expiresAt: { lt: new Date() } },
    })

    const bookedSeatIds = new Set(
      schedule.bookings.flatMap(b => b.passengers.map(p => p.seatId))
    )

    // Seats actively held by OTHER sessions render as PENDING
    const heldSeatIds = new Set(
      sessionId
        ? (await prisma.bookingHold.findMany({
            where: {
              scheduleId: schedule.id,
              sessionId: { not: sessionId },
              expiresAt: { gt: new Date() },
            },
            select: { seatId: true },
          })).map(h => h.seatId)
        : []
    )

    const seatData = schedule.seats.map(seat => {
      const status = bookedSeatIds.has(seat.id)
        ? 'BOOKED' as const
        : heldSeatIds.has(seat.id)
          ? 'PENDING' as const
          : 'AVAILABLE' as const
      return {
        id: seat.id,
        seatNumber: seat.seatNumber,
        seatType: seat.seatType,
        floor: seat.floor,
        rowPos: seat.rowPos,
        colPos: seat.colPos,
        status,
      }
    })

    const response = {
      schedule: {
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        durationMin: schedule.durationMin,
        baseFare: schedule.baseFare,
      },
      bus: {
        operatorName: schedule.bus.operator.name,
        busType: schedule.bus.busType,
        rating: schedule.bus.rating,
        totalRatings: schedule.bus.totalRatings,
      },
      seats: seatData,
      boardingPoints: schedule.boardingPoints
        .filter(bp => bp.type === 'BOARDING')
        .map(bp => ({ name: bp.name, address: bp.address, time: bp.time })),
      droppingPoints: schedule.boardingPoints
        .filter(bp => bp.type === 'DROPPING')
        .map(bp => ({ name: bp.name, address: bp.address, time: bp.time })),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Seats fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch seats' }, { status: 500 })
  }
}
