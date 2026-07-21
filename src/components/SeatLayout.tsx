'use client'

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
  const lowerSeats = seats.filter(s => s.floor === 1)
  const upperSeats = seats.filter(s => s.floor === 2)
  const hasUpper = upperSeats.length > 0

  function renderSeat(seat: Seat) {
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
        className={cls}
        title={`${seat.seatNumber} - ${seat.status === 'AVAILABLE' ? 'Available' : seat.status === 'BOOKED' ? 'Booked' : seat.status === 'PENDING' ? 'Pending' : 'Not available'}`}
        disabled={seat.status !== 'AVAILABLE'}
      >
        {label}
      </button>
    )
  }

  function renderDeck(deckSeats: Seat[], label: string) {
    if (deckSeats.length === 0) return null

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
    const isSleeperStyle = firstSeat?.seatType === 'SLEEPER'
    const cellH = isSleeperStyle ? 'h-11' : 'h-10'
    const seatW = isSleeperStyle ? 'w-14' : 'w-10'
    const prefix = isSleeperStyle ? 'seat-sleeper' : 'seat-seater'

    return (
      <div>
        {label && (
          <div className="text-[11px] font-semibold text-gray-500 mb-1.5">{label}</div>
        )}
        <div
          className="grid gap-1 mx-auto"
          style={{ gridTemplateColumns: `repeat(${totalCols}, auto)` }}
        >
          {grid.flatMap((row, ri) =>
            row.map((seat, ci) => {
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
              return renderSeat(seat)
            })
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
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
          Pending
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-100 border border-dashed border-gray-300" />
          Not Available
        </span>
      </div>

      <div className="relative bg-gray-50 rounded-xl border border-gray-200 p-3 sm:p-4">
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
          <div className="space-y-5">
            {renderDeck(lowerSeats, hasUpper ? 'Lower — Seater (Sitting)' : '')}
            {hasUpper && renderDeck(upperSeats, 'Upper — Sleeper (Lying)')}
          </div>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="mt-3 p-2.5 bg-blue-50 rounded-lg text-sm flex items-center justify-between">
          <span className="text-gray-700">
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
