interface SeatSkeletonProps {
  busType: string
}

export default function SeatSkeleton({ busType }: SeatSkeletonProps) {
  const isSleeper = busType.includes('SLEEPER')

  if (isSleeper) {
    const lowerRows = 5
    const lowerCols = 3
    const upperRows = 4
    const upperCols = 3

    return (
      <div className="animate-pulse">
        <div className="flex items-center gap-4 mb-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded border-2 border-gray-300 bg-gray-100" />
              <div className="h-2 w-12 bg-gray-200 rounded" />
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-3">
          <div className="h-6 w-20 bg-gray-200 rounded-t-lg" />
        </div>

        <div className="mb-5">
          <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="grid gap-1 sm:gap-2" style={{ gridTemplateColumns: `repeat(${lowerRows}, auto)` }}>
              {Array.from({ length: lowerCols * lowerRows }).map((_, i) => {
                const ci = Math.floor(i / lowerRows)
                const isAisle = ci === 1
                return (
                  <div
                    key={i}
                    className={`rounded-lg border ${isAisle ? 'bg-transparent border-transparent' : 'bg-gray-200 border-gray-300'} h-10 sm:h-12 flex items-center justify-center`}
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

        <div>
          <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="grid gap-1 sm:gap-2" style={{ gridTemplateColumns: `repeat(${upperRows}, auto)` }}>
              {Array.from({ length: upperCols * upperRows }).map((_, i) => {
                const ci = Math.floor(i / upperRows)
                const isAisle = ci === 1
                return (
                  <div
                    key={i}
                    className={`rounded-lg border ${isAisle ? 'bg-transparent border-transparent' : 'bg-gray-200 border-gray-300'} h-9 sm:h-10 flex items-center justify-center`}
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

  // Seater skeleton — columns of seats
  const seaterRows = 8
  const seaterCols = 5

  return (
    <div className="animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded border-2 border-gray-300 bg-gray-100" />
            <div className="h-2 w-12 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      <div className="flex justify-center mb-3">
        <div className="h-6 w-20 bg-gray-200 rounded-t-lg" />
      </div>

      <div className="bg-gray-100 rounded-lg p-3">
        <div className="grid gap-1 sm:gap-2" style={{ gridTemplateColumns: `repeat(${seaterRows}, auto)` }}>
          {Array.from({ length: seaterCols * seaterRows }).map((_, i) => {
            const ci = Math.floor(i / seaterRows)
            const isAisle = ci === 2
            return (
              <div
                key={i}
                className={`rounded-lg border ${isAisle ? 'bg-transparent border-transparent' : 'bg-gray-200 border-gray-300'} h-9 sm:h-10 flex items-center justify-center`}
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
      </div>
    </div>
  )
}
