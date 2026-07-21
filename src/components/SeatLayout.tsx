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
  busType: string
}

export default function SeatLayout({ seats, selectedSeats, onSeatToggle, busType }: SeatLayoutProps) {
  const isSleeper = busType.includes('SLEEPER')

  const lowerSeats = seats.filter(s => s.floor === 1)
  const upperSeats = seats.filter(s => s.floor === 2)

  function renderSeat(seat: Seat) {
    const isSelected = selectedSeats.includes(seat.id)
    let className = ''
    let label = seat.seatNumber

    if (seat.status === 'LOCKED') className = 'seat-locked'
    else if (isSelected) className = 'seat-selected'
    else if (seat.status === 'BOOKED') {
      className = 'seat-booked'
      label = seat.passengerName?.[0] || '✕'
    }
    else if (seat.status === 'PENDING') className = 'seat-pending'
    else className = 'seat-available'

    return (
      <button
        key={seat.id}
        onClick={() => {
          if (seat.status === 'AVAILABLE') onSeatToggle(seat.id)
        }}
        className={className}
        title={`${seat.seatNumber} - ${seat.status === 'AVAILABLE' ? 'Available' : seat.status === 'BOOKED' ? 'Booked' : seat.status === 'PENDING' ? 'Pending' : 'Not available'}`}
        disabled={seat.status !== 'AVAILABLE'}
      >
        {label}
      </button>
    )
  }

  function renderDeck(deckSeats: Seat[], deckLabel: string) {
    if (deckSeats.length === 0) return null

    const maxRow = Math.max(...deckSeats.map(s => s.rowPos))
    const maxCol = Math.max(...deckSeats.map(s => s.colPos))

    const grid: (Seat | null)[][] = Array.from({ length: maxRow + 1 }, () =>
      Array(maxCol + 1).fill(null)
    )

    deckSeats.forEach(s => {
      if (s.rowPos >= 0 && s.colPos >= 0) {
        if (!grid[s.rowPos]) grid[s.rowPos] = Array(maxCol + 1).fill(null)
        grid[s.rowPos][s.colPos] = s
      }
    })

    return (
      <div className="mb-4">
        <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">{deckLabel}</div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div
            className="grid gap-1.5 mx-auto"
            style={{ gridTemplateColumns: `repeat(${maxCol + 1}, minmax(0, 1fr))` }}
          >
            {grid.flatMap((row, ri) =>
              row.map((seat, ci) => {
                if (!seat) {
                  const isAisle = ci === 1 || ci === Math.floor(maxCol / 2)
                  return (
                    <div
                      key={`empty-${ri}-${ci}`}
                      className={`w-10 h-10 ${isAisle ? '' : ''}`}
                    />
                  )
                }
                if (seat.status === 'LOCKED') {
                  return (
                    <div key={seat.id} className="seat-locked text-[8px]">
                      {seat.seatNumber}
                    </div>
                  )
                }
                return renderSeat(seat)
              })
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-4 text-xs flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded border-2 border-green-400 bg-green-50" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-blue-600" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-gray-300" />
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded border-2 border-amber-400 bg-amber-50" />
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-gray-100 border border-dashed border-gray-200" />
          <span>Not Available</span>
        </div>
      </div>

      {/* Driver cabin */}
      <div className="text-center mb-3">
        <div className="inline-block bg-gray-200 rounded-t-lg px-8 py-1 text-xs text-gray-500 font-medium">
          Driver
        </div>
      </div>

      {isSleeper ? (
        <>
          {renderDeck(lowerSeats, 'Lower Berth')}
          {renderDeck(upperSeats, 'Upper Berth')}
        </>
      ) : (
        renderDeck(seats, 'Seats')
      )}

      {selectedSeats.length > 0 && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm flex items-center justify-between">
          <span className="text-gray-700">
            Selected: <strong>{selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''}</strong>
          </span>
          <span className="text-blue-700 font-medium">
            {seats.filter(s => selectedSeats.includes(s.id)).map(s => s.seatNumber).join(', ')}
          </span>
        </div>
      )}
    </div>
  )
}
