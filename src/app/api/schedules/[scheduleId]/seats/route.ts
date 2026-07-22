import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  const { scheduleId } = await params

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

    const bookedSeatIds = new Set(
      schedule.bookings.flatMap(b => b.passengers.map(p => p.seatId))
    )

    const seatData = schedule.seats.map(seat => ({
      id: seat.id,
      seatNumber: seat.seatNumber,
      seatType: seat.seatType,
      floor: seat.floor,
      rowPos: seat.rowPos,
      colPos: seat.colPos,
      status: bookedSeatIds.has(seat.id) ? 'BOOKED' as const : 'AVAILABLE' as const,
    }))

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
