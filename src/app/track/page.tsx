'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import NavHeader from '@/components/NavHeader'
import { SkeletonBusCard, SkeletonDestination } from '@/components/LoadingSkeleton'
import {
  Bus, Clock, MapPin, Users, Gauge, Route as RouteIcon, RefreshCw, ChevronRight, Search, ArrowRight, Zap,
} from 'lucide-react'

interface LiveStop { name: string; time: string; type: string; passed: boolean }
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

function minutesToLabel(mins: number): string {
  const m = Math.max(0, Math.round(mins))
  const h = Math.floor(m / 60)
  const min = m % 60
  if (h === 0) return `${min}m`
  if (min === 0) return `${h}h`
  return `${h}h ${min}m`
}

function stateBadge(b: LiveBus) {
  if (b.state === 'RUNNING') return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 rounded-full px-2.5 py-1">
      <span className="relative flex w-2 h-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      On the move
    </span>
  )
  if (b.state === 'SCHEDULED') return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-full px-2.5 py-1">
      <Clock className="w-3 h-3" /> Departs {b.departureTime}
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-2.5 py-1">
      <CheckIcon /> Arrived
    </span>
  )
}

function CheckIcon() {
  return <svg viewBox="0 0 20 20" className="w-3 h-3" fill="currentColor"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z" clipRule="evenodd" /></svg>
}

export default function TrackPage() {
  const searchParams = useSearchParams()
  const initialScheduleId = searchParams.get('scheduleId') ? Number(searchParams.get('scheduleId')) : null

  const [buses, setBuses] = useState<LiveBus[]>([])
  const [loading, setLoading] = useState(true)
  const [focusedId, setFocusedId] = useState<number | null>(initialScheduleId)
  const [query, setQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  async function load(showSpinner = true) {
    if (showSpinner) setRefreshing(true)
    try {
      const res = await fetch('/api/tracking')
      const data = await res.json()
      if (Array.isArray(data.buses)) {
        setBuses(data.buses)
        if (focusedId === null && data.buses.length > 0) {
          setFocusedId(data.buses[0].scheduleId)
        }
      }
    } catch {
      // keep last data
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    async function poll() {
      try {
        const res = await fetch('/api/tracking')
        const data = await res.json()
        if (cancelled || !Array.isArray(data.buses)) return
        setBuses(data.buses)
        setFocusedId(prev => {
          if (prev === null && data.buses.length > 0) return data.buses[0].scheduleId
          return prev
        })
      } catch {
        // keep last data
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    poll()
    const interval = setInterval(poll, 20000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  const trimmed = query.trim().toLowerCase()
  const filtered = trimmed
    ? buses.filter(b =>
        b.busNumber.toLowerCase().includes(trimmed) ||
        b.from.toLowerCase().includes(trimmed) ||
        b.to.toLowerCase().includes(trimmed) ||
        b.operatorName.toLowerCase().includes(trimmed)
      )
    : buses

  const focused = buses.find(b => b.scheduleId === focusedId) || buses[0]

  return (
    <>
      <NavHeader />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
          <div className="gosafe-container py-10 sm:py-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold px-3 py-1 rounded-full mb-3">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  Live Bus Tracking
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Track your bus, right now</h1>
                <p className="text-blue-200 text-sm mt-1">Live position, ETA, and seats left — updated every 20 seconds</p>
              </div>
              <button
                onClick={() => load(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 text-sm font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl px-4 py-2.5 transition-colors backdrop-blur-sm"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh now
              </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md mt-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by bus number, city or operator..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-900 dark:text-gray-100 border-0 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </section>

        <div className="gosafe-container py-8 grid lg:grid-cols-3 gap-6 items-start">
          {/* LEFT — live bus list */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Bus className="w-4 h-4 text-blue-600" /> Today&apos;s buses
              <span className="text-xs font-normal text-gray-400 dark:text-gray-500">{filtered.length} on route</span>
            </h2>

            {loading ? (
              <div className="space-y-3">
                {[0, 1, 2].map(i => (
                  <SkeletonBusCard key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">No buses found</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Try a different search term.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(b => (
                  <button
                    key={b.scheduleId}
                    onClick={() => setFocusedId(b.scheduleId)}
                    className={`w-full text-left bg-white dark:bg-gray-900 rounded-xl border p-4 transition-all ${
                      focused?.scheduleId === b.scheduleId
                        ? 'border-blue-400 dark:border-blue-500 ring-2 ring-blue-100 dark:ring-blue-500/20'
                        : 'border-gray-100 dark:border-gray-800 hover:border-blue-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                          <Bus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{b.busNumber}</div>
                          <div className="text-[11px] text-gray-400 dark:text-gray-500">{b.from} → {b.to}</div>
                        </div>
                      </div>
                      {stateBadge(b)}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {b.seatsLeft} seats</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {b.state === 'SCHEDULED' ? `Departs ${b.departureTime}` : b.state === 'RUNNING' ? `${b.progressPct}% done` : 'Completed'}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — focused live bus detail */}
          <div className="lg:col-span-2">
            {loading ? (
              <SkeletonDestination />
            ) : !focused ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-10 text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">No buses running today</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Check back later or search for a trip instead.</p>
                <Link href="/search" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold bg-blue-600 text-white rounded-xl px-4 py-2.5 hover:bg-blue-700 transition-colors">
                  Book a bus <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                        <Bus className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold leading-tight">{focused.busNumber} · {focused.operatorName}</div>
                        <div className="text-xs text-blue-100 mt-0.5">{focused.busType.replace(/_/g, ' ')} · {focused.rating}★ · {focused.durationMin} min trip</div>
                      </div>
                    </div>
                    {stateBadge(focused)}
                  </div>
                </div>

                <div className="p-5">
                  {/* Route line */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{focused.from}</div>
                      <div className="text-[11px] text-gray-400">{focused.departureTime}</div>
                    </div>
                    <div className="flex-1 mx-4 flex items-center justify-center">
                      <div className="flex items-center gap-1 text-[10px] font-medium text-gray-400 dark:text-gray-500">
                        <RouteIcon className="w-3 h-3" /> {focused.distanceKm} km
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{focused.to}</div>
                      <div className="text-[11px] text-gray-400">{focused.arrivalTime}</div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="relative h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
                      style={{ width: `${focused.progressPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                    <span>{focused.state === 'SCHEDULED' ? 'Waiting at origin' : 'Delhi'}</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{focused.etaLabel}</span>
                  </div>

                  {/* Stops */}
                  <div className="mt-5">
                    <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> Route stops
                    </div>
                    <div className="space-y-1.5">
                      {focused.stops.map((st, i) => (
                        <div key={`${st.name}-${i}`} className={`flex items-center gap-3 text-xs ${st.passed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                          <span className={`w-2 h-2 rounded-full shrink-0 ${st.passed ? 'bg-emerald-500' : 'border-2 border-gray-300 dark:border-gray-600'}`} />
                          <span className="font-medium flex-1">{st.name}</span>
                          <span className="text-[11px] text-gray-400">{st.time}</span>
                          <span className={`text-[10px] w-16 text-right ${st.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-300 dark:text-gray-600'}`}>
                            {st.passed ? 'Left' : st.type === 'BOARDING' ? 'Boarding' : 'Dropping'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                    {[
                      { icon: Clock, v: focused.state === 'RUNNING' ? minutesToLabel(focused.etaMinutes || 0) : focused.state === 'SCHEDULED' ? `Departs ${focused.departureTime}` : 'Done', l: 'ETA' },
                      { icon: RouteIcon, v: focused.state === 'RUNNING' ? `${focused.kmLeft} km` : focused.state === 'SCHEDULED' ? `${focused.distanceKm} km` : '—', l: 'Distance left' },
                      { icon: Gauge, v: `${focused.avgSpeedKmh} km/h`, l: 'Avg speed' },
                      { icon: Users, v: `${focused.seatsLeft}/${focused.totalSeats}`, l: 'Seats left' },
                    ].map(s => (
                      <div key={s.l} className="text-center bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700 px-2 py-3">
                        <s.icon className="w-4 h-4 text-blue-500 mx-auto mb-1.5" />
                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{s.v}</div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{s.l}</div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/search?source=${encodeURIComponent(focused.from)}&destination=${encodeURIComponent(focused.to)}&date=${new Date().toISOString().split('T')[0]}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl px-4 py-3 transition-colors"
                    >
                      <Zap className="w-4 h-4" /> Book this route
                    </Link>
                    <Link
                      href={`/booking/${focused.scheduleId}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-semibold rounded-xl px-4 py-3 transition-colors"
                    >
                      View seats <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
