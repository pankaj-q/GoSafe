export function BusCardSkeleton() {
  return (
    <div className="gosafe-card p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-gray-200" />
        <div className="flex-1">
          <div className="h-3 bg-gray-200 rounded w-32 mb-1" />
          <div className="h-2 bg-gray-200 rounded w-20" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-12" />
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1">
          <div className="h-8 bg-gray-200 rounded w-full" />
        </div>
      </div>
      <div className="flex gap-2 mb-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-5 bg-gray-200 rounded-full w-16" />
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="h-6 bg-gray-200 rounded w-20" />
        <div className="h-9 bg-gray-200 rounded w-24" />
      </div>
    </div>
  )
}

export function SeatGridSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex gap-4 mb-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-gray-200" />
            <div className="h-3 bg-gray-200 rounded w-14" />
          </div>
        ))}
      </div>
      <div className="text-center mb-3">
        <div className="inline-block h-5 bg-gray-200 rounded-t-lg px-8 w-20" />
      </div>
      <div className="grid grid-cols-4 gap-2 bg-gray-50 rounded-lg p-3">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="w-10 h-10 rounded-lg bg-gray-200" />
        ))}
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2].map(i => (
        <div key={i} className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>
      ))}
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse flex gap-3">
            <div className="flex-1 h-12 bg-gray-200 rounded-lg" />
            <div className="w-40 h-12 bg-gray-200 rounded-lg" />
            <div className="w-28 h-12 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto py-6 px-4 space-y-4">
        <BusCardSkeleton />
        <BusCardSkeleton />
        <BusCardSkeleton />
      </div>
    </div>
  )
}
