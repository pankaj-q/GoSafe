import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const numericId = parseInt(id, 10)

    const booking = await prisma.booking.findFirst({
      where: numericId
        ? { id: numericId }
        : { referenceCode: id },
      include: {
        schedule: {
          include: {
            bus: { include: { operator: true } },
            route: { include: { source: true, dest: true } },
            seats: { select: { id: true, seatNumber: true } },
          },
        },
        passengers: true,
        payments: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const seatIdToNumber = new Map(
      booking.schedule.seats.map(s => [s.id, s.seatNumber])
    )

    return NextResponse.json({
      booking: {
        id: booking.id,
        referenceCode: booking.referenceCode,
        status: booking.status,
        totalAmount: booking.totalAmount,
        insuranceOpted: booking.insuranceOpted,
        journeyDate: booking.journeyDate,
        contactName: booking.contactName,
        source: booking.schedule.route.source.name,
        destination: booking.schedule.route.dest.name,
        departureTime: booking.schedule.departureTime,
        arrivalTime: booking.schedule.arrivalTime,
        durationMin: booking.schedule.durationMin,
        busType: booking.schedule.bus.busType,
        operatorName: booking.schedule.bus.operator.name,
        seatNumbers: booking.passengers.map(p => seatIdToNumber.get(p.seatId) ?? String(p.seatId)),
        passengerNames: booking.passengers.map(p => p.name),
        paymentStatus: booking.payments[0]?.status ?? null,
      },
    })
  } catch (error) {
    console.error('Booking lookup error:', error)
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 })
  }
}
