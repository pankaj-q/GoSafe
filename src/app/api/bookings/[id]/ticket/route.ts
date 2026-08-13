import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateTicketPDF } from '@/lib/pdf'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
      include: {
        schedule: {
          include: {
            bus: { include: { operator: true } },
            route: { include: { source: true, dest: true } },
            seats: { select: { id: true, seatNumber: true } },
            boardingPoints: {
              orderBy: { sortOrder: 'asc' },
              select: { name: true, time: true, address: true, type: true },
            },
          },
        },
        passengers: true,
      },
    })

    if (!booking) {
      return new Response('Booking not found', { status: 404 })
    }

    const schedule = booking.schedule
    const bus = schedule.bus
    const route = schedule.route
    const seatIdToNumber = new Map(schedule.seats.map(s => [s.id, s.seatNumber]))

    const boardingPoints = schedule.boardingPoints
      .filter(bp => bp.type === 'BOARDING')
      .map(bp => ({ name: bp.name, time: bp.time }))
    const droppingPoints = schedule.boardingPoints
      .filter(bp => bp.type === 'DROPPING')
      .map(bp => ({ name: bp.name, time: bp.time }))

    const pdfBuffer = await generateTicketPDF({
      referenceCode: booking.referenceCode,
      operatorName: bus.operator.name,
      busType: bus.busType.replace(/_/g, ' '),
      busNumber: bus.busNumber,
      source: route.source.name,
      destination: route.dest.name,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      journeyDate: booking.journeyDate.toISOString(),
      passengers: booking.passengers.map(p => ({
        name: p.name,
        age: p.age,
        gender: p.gender,
        seat: seatIdToNumber.get(p.seatId) ?? String(p.seatId),
      })),
      totalAmount: booking.totalAmount,
      insuranceOpted: booking.insuranceOpted,
      contactName: booking.contactName,
      contactPhone: booking.contactPhone,
      boardingPoints,
      droppingPoints,
    })

    const pdfArrayBuffer = pdfBuffer.buffer.slice(
      pdfBuffer.byteOffset,
      pdfBuffer.byteOffset + pdfBuffer.byteLength
    ) as ArrayBuffer

    return new Response(pdfArrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="gosafe-${booking.referenceCode}.pdf"`,
        'Cache-Control': 'private, max-age=60',
      },
    })
  } catch (error) {
    console.error('Ticket PDF error:', error)
    return new Response('Failed to generate ticket', { status: 500 })
  }
}
