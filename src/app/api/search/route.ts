import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const source = searchParams.get('source')
  const destination = searchParams.get('destination')

  if (!source || !destination) {
    return NextResponse.json({ error: 'Source and destination required' }, { status: 400 })
  }

  if (source.length < 2 || destination.length < 2) {
    return NextResponse.json({ error: 'City names must be at least 2 characters' }, { status: 400 })
  }

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10) || 10))
  const skip = (page - 1) * pageSize

  try {
    const route = await prisma.route.findFirst({
      where: {
        source: { name: { contains: source } },
        dest: { name: { contains: destination } },
        isActive: true,
      },
      include: {
        source: true,
        dest: true,
        schedules: {
          where: { status: 'ACTIVE' },
          orderBy: { departureTime: 'asc' },
          skip,
          take: pageSize,
          include: {
            bus: {
              include: {
                operator: true,
                images: { orderBy: { sortOrder: 'asc' }, take: 5 },
                amenities: { include: { amenity: true } },
              },
            },
            boardingPoints: { orderBy: { sortOrder: 'asc' } },
            bookings: {
              where: { status: { not: 'CANCELLED' } },
              select: { passengerCount: true },
            },
          },
        },
      },
    })

    if (!route) {
      return NextResponse.json({ results: [], total: 0, page, pageSize, totalPages: 0 })
    }

    const totalScheduleCount = await prisma.schedule.count({
      where: { routeId: route.id, status: 'ACTIVE' },
    })

    const results = route.schedules.map(schedule => {
      const totalSeats = schedule.bus.totalSeats
      const bookedCount = schedule.bookings.reduce((sum, b) => sum + b.passengerCount, 0)
      const availableSeats = Math.max(0, totalSeats - bookedCount)

      return {
        scheduleId: schedule.id,
        operatorName: schedule.bus.operator.name,
        operatorLogo: schedule.bus.operator.logo,
        busType: schedule.bus.busType,
        busRating: schedule.bus.rating,
        totalRatings: schedule.bus.totalRatings,
        busImages: schedule.bus.images.map(img => ({ url: img.url, altText: img.altText })),
        amenities: schedule.bus.amenities.map(a => a.amenity.name),
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        durationMin: schedule.durationMin,
        baseFare: schedule.baseFare,
        availableSeats,
        totalSeats,
        boardingPoints: schedule.boardingPoints
          .filter(bp => bp.type === 'BOARDING')
          .map(bp => ({ name: bp.name, time: bp.time })),
        droppingPoints: schedule.boardingPoints
          .filter(bp => bp.type === 'DROPPING')
          .map(bp => ({ name: bp.name, time: bp.time })),
      }
    })

    return NextResponse.json({
      results,
      total: totalScheduleCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalScheduleCount / pageSize),
      source: route.source.name,
      destination: route.dest.name,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
