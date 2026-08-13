import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cacheGet, cacheSet } from '@/lib/cache'

interface LiveStop {
  name: string
  time: string
  type: string
  passed: boolean
}

interface LiveBus {
  scheduleId: number
  busNumber: string
  operatorName: string
  busType: string
  rating: number
  from: string
  to: string
  departureTime: string
  arrivalTime: string
  durationMin: number
  distanceKm: number
  state: 'SCHEDULED' | 'RUNNING' | 'ARRIVED'
  departsInMin: number | null
  progressPct: number
  kmLeft: number
  avgSpeedKmh: number
  etaMinutes: number | null
  etaLabel: string
  totalSeats: number
  seatsLeft: number
  stops: LiveStop[]
  nextStop: string | null
}

function parseOperatingDays(raw: string): number[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(Number) : []
  } catch {
    return []
  }
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function minutesToLabel(mins: number): string {
  const m = Math.max(0, Math.round(mins))
  const h = Math.floor(m / 60)
  const min = m % 60
  if (h === 0) return `${min}m`
  if (min === 0) return `${h}h`
  return `${h}h ${min}m`
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const scheduleIdParam = searchParams.get('scheduleId')
  const cacheKey = `tracking:${scheduleIdParam || 'all'}`

  const cached = await cacheGet(cacheKey)
  if (cached && typeof cached === 'object' && 'buses' in cached) {
    return NextResponse.json(cached)
  }

  try {
    const where = {
      status: 'ACTIVE' as const,
      ...(scheduleIdParam ? { id: Number(scheduleIdParam) } : {}),
    }

    const schedules = await prisma.schedule.findMany({
      where,
      include: {
        bus: { include: { operator: true } },
        route: { include: { source: true, dest: true } },
        boardingPoints: { orderBy: { sortOrder: 'asc' } },
        bookings: {
          where: { status: { not: 'CANCELLED' } },
          select: { passengerCount: true },
        },
        holds: { where: { expiresAt: { gt: new Date() } }, select: { id: true } },
      },
      orderBy: { departureTime: 'asc' },
    })

    if (!schedules.length) {
      const empty = { buses: [], now: new Date().toISOString() }
      await cacheSet(cacheKey, empty, 20_000)
      return NextResponse.json(empty)
    }

    const now = new Date()
    const nowMin = now.getHours() * 60 + now.getMinutes()
    const todayDay = now.getDay()

    const buses: LiveBus[] = schedules
      .filter(s => parseOperatingDays(s.operatingDays).includes(todayDay))
      .map(s => {
        const departMin = toMinutes(s.departureTime)
        const duration = s.durationMin
        const totalSeats = s.bus.totalSeats
        const booked = s.bookings.reduce((sum, b) => sum + b.passengerCount, 0)
        const held = s.holds.length
        const seatsLeft = Math.max(0, totalSeats - booked - held)

        // Overnight trips depart late evening and arrive next morning.
        // elapsed relative to today's departure moment decides the state.
        const elapsed = nowMin - departMin

        let state: LiveBus['state']
        let progressPct = 0
        let departsInMin: number | null = null
        let etaMinutes: number | null = null
        let etaLabel = ''

        if (elapsed < 0) {
          state = 'SCHEDULED'
          departsInMin = -elapsed
          etaLabel = `Departs in ${minutesToLabel(-elapsed)}`
        } else if (elapsed <= duration) {
          state = 'RUNNING'
          progressPct = Math.min(100, Math.round((elapsed / duration) * 100))
          const remainMin = duration - elapsed
          etaMinutes = remainMin
          etaLabel = `Arriving in ${minutesToLabel(remainMin)}`
        } else {
          state = 'ARRIVED'
          progressPct = 100
          etaLabel = 'Arrived'
        }

        const distanceKm = s.route.distanceKm || 0
        const kmLeft = Math.round(distanceKm * (1 - progressPct / 100))
        const avgSpeedKmh = duration > 0 ? Math.round(distanceKm / (duration / 60)) : 0

        const stops: LiveStop[] = s.boardingPoints
          .filter(bp => bp.type === 'BOARDING' || bp.type === 'DROPPING')
          .map(bp => ({
            name: bp.name,
            time: bp.time,
            type: bp.type,
            passed: nowMin >= toMinutes(bp.time),
          }))

        const nextStop = stops.find(st => !st.passed)?.name || null

        return {
          scheduleId: s.id,
          busNumber: s.bus.busNumber,
          operatorName: s.bus.operator.name,
          busType: s.bus.busType,
          rating: s.bus.rating,
          from: s.route.source.name,
          to: s.route.dest.name,
          departureTime: s.departureTime,
          arrivalTime: s.arrivalTime,
          durationMin: duration,
          distanceKm,
          state,
          departsInMin: state === 'SCHEDULED' ? departsInMin : null,
          progressPct,
          kmLeft,
          avgSpeedKmh,
          etaMinutes,
          etaLabel,
          totalSeats,
          seatsLeft,
          stops,
          nextStop,
        }
      })

    // Sort: RUNNING first (closest to arrival), then SCHEDULED (soonest), then ARRIVED
    const ordered = buses.sort((a, b) => {
      const rank = (x: LiveBus) => x.state === 'RUNNING' ? 0 : x.state === 'SCHEDULED' ? 1 : 2
      if (rank(a) !== rank(b)) return rank(a) - rank(b)
      if (a.state === 'RUNNING') return b.progressPct - a.progressPct
      if (a.state === 'SCHEDULED') return (a.departsInMin ?? 9999) - (b.departsInMin ?? 9999)
      return 0
    })

    const payload = { buses: ordered, now: new Date().toISOString() }
    await cacheSet(cacheKey, payload, 20_000)
    return NextResponse.json(payload)
  } catch (error) {
    console.error('Tracking error:', error)
    return NextResponse.json({ error: 'Failed to fetch tracking data' }, { status: 500 })
  }
}