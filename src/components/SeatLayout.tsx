'use client'

import { useMemo, useState } from 'react'
import { Bed, Armchair, ChevronDown, Grid2X2, Rows3 } from 'lucide-react'

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

export default function SeatLayout({ seats, selectedSeats, onSeatToggle }: SeatLayoutProps) {
  const lowerSeats = useMemo(() => seats.filter(s => s.floor === 1), [seats])
  const upperSeats = useMemo(() => seats.filter(s => s.floor === 2), [seats])
  const hasUpper = upperSeats.length > 0
  const [viewMode, setViewMode] = useState<'full' | 'compact'>('full')
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set())

  function toggleCollapse(floor: number) {
    setCollapsed(prev => {
      const next = new Set(prev)
      if (next.has(floor)) next.delete(floor)
      else next.add(floor)
      return next
    })
  }

  function renderSeat(seat: Seat, index: number) {
    const isSleeperStyle = seat.seatType === 'SLEEPER'
    const prefix = isSleeperStyle ? 'seat-sleeper' : 'seat-seater'
    const isSelected = selectedSeats.includes(seat.id)

    const stateKey = seat.status === 'LOCKED' ? 'locked'
      : isSelected ? 'selected'
      : seat.status === 'BOOKED' ? 'booked'
      : seat.status === 'PENDING' ? 'pending'
      : 'available'

    const cls = `${prefix}-${stateKey}`
    let label: React.ReactNode = seat.seatNumber

    if (seat.status === 'BOOKED') {
      label = seat.passengerName?.[0] || '✕'
    }

    return (
      <button
        key={seat.id}
        onClick={() => {
          if (seat.status === 'AVAILABLE') onSeatToggle(seat.id)
        }}
        className={`${cls} animate-seat-in`}
        style={{ animationDelay: `${index * 20}ms` }}
        title={`${seat.seatNumber} - ${seat.status === 'AVAILABLE' ? 'Available' : seat.status === 'BOOKED' ? 'Booked' : seat.status === 'PENDING' ? 'Held by another user' : 'Not available'}`}
        disabled={seat.status !== 'AVAILABLE'}
        aria-label={`Seat ${seat.seatNumber}`}
      >
        {isSleeperStyle && seat.status === 'AVAILABLE' && !isSelected && (
          <Bed className="w-3 h-3 mb-0.5 text-green-400" />
        )}
        {isSleeperStyle && seat.status === 'AVAILABLE' && isSelected && (
          <Bed className="w-3 h-3 mb-0.5 text-blue-200" />
        )}
        {!isSleeperStyle && seat.status === 'AVAILABLE' && !isSelected && (
          <Armchair className="w-3 h-3 mb-0.5 text-green-400" />
        )}
        {!isSleeperStyle && seat.status === 'AVAILABLE' && isSelected && (
          <Armchair className="w-3 h-3 mb-0.5 text-blue-200" />
        )}
        <span>{label}</span>
      </button>
    )
  }

  function renderDeck(deckSeats: Seat[], label: string, isSleeper: boolean, floor: number) {
    if (deckSeats.length === 0) return null

    const isCollapsed = collapsed.has(floor)

    const maxRow = Math.max(...deckSeats.map(s => s.rowPos))
    const maxCol = Math.max(...deckSeats.map(s => s.colPos))
    const totalCols = maxCol + 1
    const aisleCol = Math.floor(maxCol / 2)

    const grid: (Seat | null)[][] = Array.from({ length: maxRow + 1 }, () =>
      Array(totalCols).fill(null)
    )

    deckSeats.forEach(s => {
      if (s.rowPos >= 0 && s.colPos >= 0) {
        if (!grid[s.rowPos]) grid[s.rowPos] = Array(totalCols).fill(null)
        grid[s.rowPos][s.colPos] = s
      }
    })

    const firstSeat = deckSeats.find(s => s.seatType) || deckSeats[0]
    const isSleeperStyle = isSleeper || firstSeat?.seatType === 'SLEEPER'
    const cellH = isSleeperStyle
      ? viewMode === 'compact' ? 'h-7 sm:h-8' : 'h-9 sm:h-11'
      : viewMode === 'compact' ? 'h-7 sm:h-8' : 'h-9 sm:h-10'
    const seatW = isSleeperStyle
      ? viewMode === 'compact' ? 'w-8 sm:w-10' : 'w-11 sm:w-14'
      : viewMode === 'compact' ? 'w-7 sm:w-8' : 'w-9 sm:w-10'
    const prefix = isSleeperStyle ? 'seat-sleeper' : 'seat-seater'

    return (
      <div>
        <button
          onClick={() => toggleCollapse(floor)}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          aria-expanded={!isCollapsed}
        >
          {isSleeperStyle ? <Bed className="w-3.5 h-3.5 text-indigo-400" /> : <Armchair className="w-3.5 h-3.5 text-blue-400" />}
          {label}
          <span className="text-gray-300 dark:text-gray-600 font-normal">{deckSeats.length} seats</span>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
        </button>
        {!isCollapsed && (
          <div
            className="grid gap-0.5 sm:gap-1 mx-auto"
            style={{ gridTemplateColumns: `repeat(${maxRow + 1}, auto)` }}
          >
            {Array.from({ length: totalCols }, (_, ci) =>
              Array.from({ length: maxRow + 1 }, (_, ri) => {
                const seat = grid[ri][ci]
                const idx = ci * (maxRow + 1) + ri
                if (!seat) {
                  const isAisle = ci === aisleCol
                  return (
                    <div key={`empty-${ri}-${ci}`} className={`${cellH} ${isAisle ? 'w-4' : seatW}`} />
                  )
                }
                if (seat.status === 'LOCKED') {
                  return (
                    <div key={seat.id} className={`${prefix}-locked`}>
                      {seat.seatNumber}
                    </div>
                  )
                }
                return renderSeat(seat, idx)
              })
            ).flat()}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Choose your seats</span>
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
          <span className="w-3 h-3 rounded border border-green-500 bg-green-50" />
          Available
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-blue-600" />
          Selected
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-100 border border-red-300" />
          Booked
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded border border-amber-400 bg-amber-50" />
          Held by other
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-100 border border-dashed border-gray-300" />
          Not Available
        </span>
      </div>

      <div className="flex items-center gap-3 mb-3 text-[11px] flex-wrap">
        <span className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
          <Bed className="w-3.5 h-3.5 text-indigo-400" />
          Sleeper berth (lying)
        </span>
        <span className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
          <Armchair className="w-3.5 h-3.5 text-blue-400" />
          Seater (sitting)
        </span>
      </div>

      <div className="relative bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-200/40 rounded-l-xl" />
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-200/40 rounded-r-xl" />

        <div className="flex justify-end mb-3">
          <div className="flex flex-col items-center gap-0.5">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-400">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <line x1="12" y1="3" x2="12" y2="9" stroke="currentColor" strokeWidth="1.5" />
              <line x1="12" y1="15" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5" />
              <line x1="3" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5" />
              <line x1="15" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="text-[10px] text-gray-400 font-medium">Driver</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className={`space-y-5 ${viewMode === 'compact' ? 'seat-layout-compact' : ''}`}>
            {renderDeck(lowerSeats, hasUpper ? 'Lower Deck — Seater (Sitting)' : 'Seater (Sitting)', false, 1)}
            {hasUpper && renderDeck(upperSeats, 'Upper Deck — Sleeper (Lying)', true, 2)}
          </div>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="mt-3 p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-sm flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">
            <strong>{selectedSeats.length}</strong> seat{selectedSeats.length > 1 ? 's' : ''} selected
          </span>
          <span className="text-blue-700 font-medium">
            {seats.filter(s => selectedSeats.includes(s.id)).map(s => s.seatNumber).join(', ')}
          </span>
        </div>
      )}
    </div>
  )
}
