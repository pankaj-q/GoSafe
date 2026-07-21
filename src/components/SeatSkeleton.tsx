interface SeatSkeletonProps {
  busType: string
}

export default function SeatSkeleton({ busType }: SeatSkeletonProps) {
  const isSleeper = busType.includes('SLEEPER')

  if (isSleeper) {
    return (
      <div className="animate-pulse">
        {/* Legend */}
        <div className="flex items-center gap-4 mb-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded border-2 border-gray-300 bg-gray-100" />
              <div className="h-2 w-12 bg-gray-200 rounded" />
            </div>
          ))}
        </div>

        {/* Driver cabin */}
        <div className="flex justify-center mb-3">
          <div className="h-6 w-20 bg-gray-200 rounded-t-lg" />
        </div>

        {/* Lower Berth */}
        <div className="mb-5">
          <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
          <div className="bg-gray-100 rounded-lg p-3">
            {/* 3-column berth layout */}
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 15 }).map((_, i) => {
                const col = i % 3
                // Left side: 2 seats side-by-side, Right side: 1 single
                const isAisle = col === 1
                return (
                  <div
                    key={i}
                    className={`rounded-lg border ${isAisle ? 'bg-transparent border-transparent' : 'bg-gray-200 border-gray-300'} h-12 flex items-center justify-center`}
                  >
                    {!isAisle && (
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-3 h-3 rounded bg-gray-300" />
                        <div className="w-5 h-1.5 bg-gray-300 rounded" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Upper Berth */}
        <div>
          <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }).map((_, i) => {
                const col = i % 3
                const isAisle = col === 1
                return (
                  <div
                    key={i}
                    className={`rounded-lg border ${isAisle ? 'bg-transparent border-transparent' : 'bg-gray-200 border-gray-300'} h-10 flex items-center justify-center`}
                  >
                    {!isAisle && (
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-3 h-3 rounded bg-gray-300" />
                        <div className="w-5 h-1.5 bg-gray-300 rounded" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Seater skeleton — rows of 4 seats with aisle
  return (
    <div className="animate-pulse">
      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded border-2 border-gray-300 bg-gray-100" />
            <div className="h-2 w-12 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Driver */}
      <div className="flex justify-center mb-3">
        <div className="h-6 w-20 bg-gray-200 rounded-t-lg" />
      </div>

      {/* Seat rows: 2 seats | aisle | 2 seats */}
      <div className="bg-gray-100 rounded-lg p-3">
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, row) => (
            <div key={row} className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map(col => {
                const isAisle = col === 2
                return (
                  <div
                    key={col}
                    className={`rounded-lg border ${isAisle ? 'bg-transparent border-transparent' : 'bg-gray-200 border-gray-300'} h-10 flex items-center justify-center`}
                  >
                    {!isAisle && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
