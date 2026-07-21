import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const source = searchParams.get('source')
  const destination = searchParams.get('destination')

  if (!source || !destination) {
    return NextResponse.json({ error: 'Source and destination required' }, { status: 400 })
  }

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
          include: {
            bus: {
              include: {
                operator: true,
                images: { orderBy: { sortOrder: 'asc' }, take: 5 },
                amenities: { include: { amenity: true } },
              },
            },
            boardingPoints: { orderBy: { sortOrder: 'asc' } },
          },
        },
      },
    })

    if (!route) {
      return NextResponse.json({ results: [] })
    }

    const results = route.schedules.map(schedule => {
      const totalSeats = schedule.bus.totalSeats
      const bookedCount = 0
      const availableSeats = totalSeats - bookedCount

      return {
        id: schedule.id,
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

    return NextResponse.json({ results, source: route.source.name, destination: route.dest.name })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
