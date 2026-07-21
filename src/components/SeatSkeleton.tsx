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
            <div key={i} className="h-3 w-16 bg-gray-200 rounded" />
          ))}
        </div>
        {/* Driver */}
        <div className="flex justify-center mb-4">
          <div className="h-5 w-24 bg-gray-200 rounded-t-lg" />
        </div>
        {/* Lower Berth */}
        <div className="mb-5">
          <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="aspect-[3/2] bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
        {/* Upper Berth */}
        <div>
          <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="aspect-[3/2] bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-pulse">
      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-3 w-16 bg-gray-200 rounded" />
        ))}
      </div>
      {/* Driver */}
      <div className="flex justify-center mb-4">
        <div className="h-5 w-24 bg-gray-200 rounded-t-lg" />
      </div>
      {/* Seats grid */}
      <div className="bg-gray-100 rounded-lg p-3">
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 20 }).map((_, i) => {
            const isAisle = i % 4 === 2
            return (
              <div
                key={i}
                className={`h-10 rounded-lg ${isAisle ? 'bg-transparent' : 'bg-gray-200'}`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
