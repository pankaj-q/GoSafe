'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bus, MapPin, Users, Clock, Gauge, ChevronRight } from 'lucide-react'

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

export default function LiveBusCard() {
  const [bus, setBus] = useState<LiveBus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/tracking')
        const data = await res.json()
        if (cancelled) return
        const running = Array.isArray(data.buses) ? data.buses.find((b: LiveBus) => b.state === 'RUNNING') : null
        setBus(running || null)
      } catch {
        if (!cancelled) setBus(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    const interval = setInterval(load, 20000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sm:p-6 animate-pulse">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
        <div className="mt-6 h-1.5 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[0, 1, 2].map(i => <div key={i} className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (!bus) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Bus className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">GoSafe Live</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" /> Sample route · Delhi → Varanasi
              </div>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-md">Live</span>
        </div>

        {/* Stops */}
        <div className="flex items-center justify-between mb-3">
          {[
            { label: 'Delhi', time: '10:30 PM', done: true },
            { label: 'Agra', time: '1:15 AM', done: true },
            { label: 'Kanpur', time: '4:40 AM', done: false },
            { label: 'Varanasi', time: '8:10 AM', done: false },
          ].map(pt => (
            <div key={pt.label} className="flex flex-col items-center gap-1 z-10">
              <div className={`w-2.5 h-2.5 rounded-full ${pt.done ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
              <span className={`text-[10px] font-medium ${pt.done ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>{pt.label}</span>
              <span className="text-[9px] text-gray-400 dark:text-gray-600">{pt.time}</span>
            </div>
          ))}
        </div>

        {/* Progress track + moving bus */}
        <div className="relative h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-visible">
          <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
          <div className="absolute top-1/2 -translate-y-1/2 animate-bus-move">
            <div className="w-9 h-9 -ml-4 rounded-full bg-white dark:bg-gray-900 shadow-lg border-2 border-emerald-500 flex items-center justify-center">
              <Bus className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { v: '2h 45m', l: 'Arriving in' },
            { v: '412 km', l: 'Distance left' },
            { v: '36 km/h', l: 'Avg speed' },
          ].map(s => (
            <div key={s.l} className="text-center bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 px-2 py-3">
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{s.v}</div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>

        <Link
          href="/track"
          className="mt-4 w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl px-3 py-2.5 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
        >
          View live board <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <Bus className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">GoSafe Live {bus.busNumber}</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" /> On the move · {bus.from} → {bus.to}
            </div>
          </div>
        </div>
        <Link
          href="/track"
          className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
        >
          {bus.seatsLeft} seats left
        </Link>
      </div>

      {/* Stops */}
      <div className="flex items-center justify-between mb-3">
        {bus.stops.slice(0, 4).map((st, i) => (
          <div key={`${st.name}-${i}`} className="flex flex-col items-center gap-1 z-10">
            <div className={`w-2.5 h-2.5 rounded-full ${st.passed ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
            <span className={`text-[10px] font-medium ${st.passed ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>{st.name}</span>
            <span className="text-[9px] text-gray-400 dark:text-gray-600">{st.time}</span>
          </div>
        ))}
      </div>

      {/* Progress track */}
      <div className="relative h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-visible">
        <div className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700`} style={{ width: `${Math.max(bus.progressPct, 2)}%` }} />
        <div className="absolute top-1/2 -translate-y-1/2 animate-bus-move" style={{ left: `${bus.progressPct}%` }}>
          <div className="w-9 h-9 -ml-4 rounded-full bg-white dark:bg-gray-900 shadow-lg border-2 border-emerald-500 flex items-center justify-center">
            <Bus className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] text-gray-400 dark:text-gray-500">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {bus.from}</span>
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{bus.etaLabel}</span>
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {bus.to}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {[
          { icon: Clock, v: minutesToLabel(bus.etaMinutes || 0), l: 'Arriving in' },
          { icon: Gauge, v: `${bus.avgSpeedKmh} km/h`, l: 'Avg speed' },
          { icon: Users, v: `${bus.seatsLeft}`, l: 'Seats left' },
        ].map(s => (
          <div key={s.l} className="text-center bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 px-2 py-3">
            <s.icon className="w-3.5 h-3.5 text-blue-500 mx-auto mb-1" />
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{s.v}</div>
            <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      <Link
        href="/track"
        className="mt-4 w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl px-3 py-2.5 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
      >
        Open live tracking <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}
