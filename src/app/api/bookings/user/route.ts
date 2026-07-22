import { NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = parseInt(session.user.id, 10)

    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        schedule: {
          select: {
            departureTime: true,
            arrivalTime: true,
            baseFare: true,
            bus: { select: { busType: true } },
            route: {
              select: {
                source: { select: { name: true } },
                dest: { select: { name: true } },
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('User bookings error:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}
