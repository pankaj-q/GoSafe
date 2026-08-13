'use client'

import { useMemo, useState } from 'react'
import { Bed, Armchair, ChevronDown, Grid2X2, Rows3, PersonStanding, ArrowLeft, ArrowRight } from 'lucide-react'

interface Seat {
  id: number
  seatNumber: string
  seatType: string
  floor: number
  rowPos: number
  colPos: number
  status: 'AVAILABLE' | 'BOOKED' | 'PENDING' | 'LOCKED'
  passengerName?: string
}

interface SeatLayoutProps {
  seats: Seat[]
  selectedSeats: number[]
  onSeatToggle: (seatId: number) => void
}

type DeckSeat = Seat & { isSleeper: boolean }

export default function SeatLayout({ seats, selectedSeats, onSeatToggle }: SeatLayoutProps) {
  const decks = useMemo(() => {
    const lower = seats.filter(s => s.floor === 1)
    const upper = seats.filter(s => s.floor === 2)
    const list: { floor: number; seats: DeckSeat[] }[] = []
    if (lower.length) {
      const isSleeper = lower.some(s => s.seatType === 'SLEEPER')
      list.push({ floor: 1, seats: lower.map(s => ({ ...s, isSleeper })) })
    }
    if (upper.length) {
      const isSleeper = upper.some(s => s.seatType === 'SLEEPER')
      list.push({ floor: 2, seats: upper.map(s => ({ ...s, isSleeper })) })
    }
    return list
  }, [seats])

  const selectedIds = useMemo(() => new Set(selectedSeats), [selectedSeats])
  const hasUpper = decks.length > 1
  const [viewMode, setViewMode] = useState<'full' | 'compact'>('full')
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set())

  const selectedSeatList = useMemo(
    () => seats.filter(s => selectedIds.has(s.id)),
    [seats, selectedIds]
  )

  function toggleCollapse(floor: number) {
    setCollapsed(prev => {
      const next = new Set(prev)
      if (next.has(floor)) next.delete(floor)
      else next.add(floor)
      return next
    })
  }

  function isDoubleSeat(seat: Seat) {
    if (!selectedIds.has(seat.id)) return false
    const bay = seats.find(
      s => s.floor === seat.floor && s.rowPos === seat.rowPos && s.colPos !== seat.colPos && selectedIds.has(s.id)
    )
    return Boolean(bay)
  }

  function buildRows(deckSeats: DeckSeat[]) {
    const maxCol = Math.max(...deckSeats.map(s => s.colPos))
    const maxRow = Math.max(...deckSeats.map(s => s.rowPos))
    const rows: (DeckSeat | null)[][] = Array.from({ length: maxRow + 1 }, () =>
      Array(maxCol + 1).fill(null)
    )
    deckSeats.forEach(s => {
      if (s.rowPos >= 0 && s.colPos >= 0 && rows[s.rowPos]) rows[s.rowPos][s.colPos] = s
    })
    return { rows, maxCol, maxRow }
  }

  function renderSeat(seat: DeckSeat) {
    const isSelected = selectedIds.has(seat.id)
    const double = isDoubleSeat(seat)
    const stateKey = seat.status === 'LOCKED' ? 'locked'
      : isSelected ? 'selected'
      : seat.status === 'BOOKED' ? 'booked'
      : seat.status === 'PENDING' ? 'pending'
      : 'available'
    const prefix = seat.isSleeper ? 'seat-sleeper' : 'seat-seater'
    const cls = `${prefix}-${stateKey}${double ? ' seat-double' : ''}`
    const clickable = seat.status === 'AVAILABLE'

    let label: React.ReactNode = seat.seatNumber
    if (seat.status === 'BOOKED') label = seat.passengerName?.[0] || '✕'

    const Icon = seat.isSleeper ? Bed : Armchair
    const iconColor = seat.status === 'AVAILABLE'
      ? isSelected ? 'text-orange-300' : 'text-green-500 dark:text-green-400'
      : 'text-gray-300 dark:text-gray-600'

    return (
      <button
        key={seat.id}
        onClick={() => {
          if (clickable) onSeatToggle(seat.id)
        }}
        className={`${cls} animate-seat-in`}
        title={`${seat.seatNumber} — ${seat.status === 'AVAILABLE' ? 'Available' : seat.status === 'BOOKED' ? 'Booked' : seat.status === 'PENDING' ? 'Held by another passenger' : 'Not available'}`}
        disabled={!clickable}
        aria-label={`${seat.isSleeper ? 'Sleeper' : 'Seater'} ${seat.seatNumber}`}
      >
        <Icon className={`w-3 h-3 ${seat.isSleeper ? '' : 'mb-0.5'} ${iconColor}`} />
        <span>{label}</span>
      </button>
    )
  }

  function renderDeck(deckSeats: DeckSeat[], floor: number) {
    const isCollapsed = collapsed.has(floor)
    const firstSeat = deckSeats.find(s => s.seatType) || deckSeats[0]
    const isSleeperStyle = firstSeat?.seatType === 'SLEEPER'
    const deckLabel = floor === 2
      ? (hasUpper ? 'Upper Deck' : 'Deck') + ' — Sleeper (Lying)'
      : (hasUpper ? 'Lower Deck' : 'Deck') + ' — Seater (Sitting)'
    const { rows, aisleCol } = (() => {
      const r = buildRows(deckSeats)
      return { rows: r.rows, aisleCol: Math.floor(r.maxCol / 2) }
    })()

    const sideSeats = deckSeats.filter(s => s.colPos < aisleCol).length > 0

    return (
      <div>
        <button
          onClick={() => toggleCollapse(floor)}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          aria-expanded={!isCollapsed}
        >
          {isSleeperStyle ? <Bed className="w-3.5 h-3.5 text-orange-400" /> : <Armchair className="w-3.5 h-3.5 text-blue-400" />}
          {deckLabel}
          <span className="text-gray-300 dark:text-gray-600 font-normal">{deckSeats.length} berths</span>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
        </button>

        {!isCollapsed && (
          <div className="relative bg-gradient-to-b from-blue-50 to-blue-100/60 dark:from-blue-950/40 dark:to-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 px-2 py-3 sm:px-3 overflow-hidden">
            <div className="absolute inset-x-3 top-1.5 h-1 bg-gradient-to-r from-transparent via-blue-300/70 dark:via-blue-700/60 to-transparent rounded-full" />

            <div className="flex items-center gap-1.5 justify-center mb-3">
              <div className="flex flex-col items-center gap-0.5 px-2 py-1 bg-white dark:bg-blue-900/40 rounded-lg border border-blue-200 dark:border-blue-700">
                <ArrowRight className="w-3.5 h-3.5 text-blue-400 dark:text-blue-500" />
                <PersonStanding className="w-4 h-4 text-blue-500 dark:text-blue-300" />
                <span className="text-[9px] font-bold text-blue-500 dark:text-blue-300 tracking-wide">DRIVER</span>
              </div>
              <ArrowLeft className="w-4 h-4 text-blue-300 dark:text-blue-600" />
            </div>

            <div className="flex justify-between items-center px-1 mb-2">
              <span className="text-[9px] font-semibold text-blue-400 dark:text-blue-500 tracking-wide">ENTRANCE</span>
              <span className="text-[9px] font-semibold text-blue-400 dark:text-blue-500 tracking-wide">FRONT</span>
            </div>

            <div
              className={`space-y-2 ${viewMode === 'compact' ? 'seat-layout-compact' : ''}`}
            >
              {rows.map((row, ri) => (
                <div key={ri} className="flex items-stretch justify-center gap-1 sm:gap-1.5">
                  {row.map((seat, ci) => {
                    const isAisle = ci === aisleCol
                    if (!seat) {
                      if (isAisle) {
                        return (
                          <div
                            key={`aisle-${ri}`}
                            className={`flex items-center ${viewMode === 'compact' ? 'w-5 sm:w-6' : 'w-6 sm:w-8'}`}
                          >
                            <div className={`flex-1 border-t border-dashed border-blue-300 dark:border-blue-700 ${ri % 2 === 0 ? 'opacity-100' : 'opacity-60'}`} />
                          </div>
                        )
                      }
                      return <div key={`empty-${ri}-${ci}`} className="w-4 sm:w-5" />
                    }
                    return renderSeat(seat)
                  })}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-3 px-1">
              <span className="text-[9px] font-semibold text-blue-400 dark:text-blue-500 tracking-wide">REAR</span>
              <span className="text-[9px] font-semibold text-blue-400 dark:text-blue-500 tracking-wide">
                {sideSeats ? 'SIDE-WISE 2 + 2' : 'AISLE'}
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Choose your berth</span>
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-0.5">
          <button
            onClick={() => setViewMode('full')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              viewMode === 'full'
                ? 'bg-blue-600 text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <Rows3 className="w-3.5 h-3.5" />
            Full layout
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              viewMode === 'compact'
                ? 'bg-blue-600 text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            <Grid2X2 className="w-3.5 h-3.5" />
            Compact
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3 text-[11px] flex-wrap">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-md border border-green-500 bg-green-50" />
          Available
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-md bg-blue-600 ring-2 ring-orange-400/60" />
          Selected
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-md bg-red-100 border border-red-300" />
          Booked
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-md border border-amber-400 bg-amber-50" />
          Held by other
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-md bg-gray-100 border border-dashed border-gray-300" />
          Not Available
        </span>
      </div>

      <div className="flex items-center gap-3 mb-3 text-[11px] flex-wrap">
        <span className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
          <Bed className="w-3.5 h-3.5 text-orange-400" />
          Sleeper berth (lying)
        </span>
        <span className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
          <Armchair className="w-3.5 h-3.5 text-blue-400" />
          Seater (sitting)
        </span>
        <span className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
          <span className="w-3 h-3 rounded-md bg-blue-600" />
          <span className="w-3 h-3 rounded-md bg-blue-600 ml-0.5" />
          Double berth (2 in a bay)
        </span>
      </div>

      <div className="relative rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/60">
        <div className="flex justify-center">
          <div className={`flex flex-col lg:flex-row lg:items-start lg:gap-6 gap-5 ${
            viewMode === 'compact' ? 'seat-layout-compact' : ''
          }`}>
            {decks.map(d => renderDeck(d.seats, d.floor))}
          </div>
        </div>
      </div>

      {selectedSeatList.length > 0 && (
        <div className="mt-3 p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-700 dark:text-gray-300">
              <strong>{selectedSeatList.length}</strong> seat{selectedSeatList.length > 1 ? 's' : ''} selected
            </span>
            <span className="text-blue-700 dark:text-blue-400 font-medium">
              {selectedSeatList.map(s => s.seatNumber).join(', ')}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedSeatList.map(s => {
              const double = isDoubleSeat(s)
              return (
                <div
                  key={s.id}
                  className={`rounded-md bg-blue-600 text-white shadow ${
                    double ? 'seat-double-slots px-1 py-1' : 'flex items-center justify-center px-3 h-7'
                  }`}
                  title={`${s.seatNumber}${double ? ' (double berth)' : ''}`}
                >
                  {double ? (
                    <>
                      <div className="flex items-center justify-center h-7 px-2 rounded bg-blue-500/70 text-xs font-bold">
                        {s.seatNumber.split('-')[0]}
                      </div>
                      <div className="flex items-center justify-center h-7 px-2 rounded bg-blue-500/70 text-xs font-bold">
                        LOWER
                      </div>
                    </>
                  ) : (
                    <span className="text-xs font-bold">{s.seatNumber}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
