export function BusCardSkeleton() {
  return (
    <div className="gosafe-card dark:bg-gray-900 dark:border-gray-800 p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-800" />
        <div className="flex-1">
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-1" />
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded w-20" />
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-12" />
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        </div>
      </div>
      <div className="flex gap-2 mb-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-5 bg-gray-200 dark:bg-gray-800 rounded-full w-16" />
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-20" />
        <div className="h-9 bg-gray-200 dark:bg-gray-800 rounded w-24" />
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
            <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-14" />
          </div>
        ))}
      </div>
      <div className="text-center mb-3">
        <div className="inline-block h-5 bg-gray-200 dark:bg-gray-800 rounded-t-lg px-8 w-20" />
      </div>
      <div className="grid grid-cols-4 gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
    </div>
  )
}

export function ShelfSkeleton() {
  return (
    <div className="animate-pulse">
      {[1, 2].map(i => (
        <div key={i} className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24" />
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-200 dark:bg-gray-800 rounded animate-pulse ${className}`} />
}

export function SkeletonBusCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <SkeletonBlock className="w-9 h-9 rounded-lg" />
        <div className="flex-1">
          <SkeletonBlock className="h-3 w-1/2 mb-1.5" />
          <SkeletonBlock className="h-2 w-1/3" />
        </div>
        <SkeletonBlock className="h-4 w-16 rounded-full" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <SkeletonBlock className="h-6 w-12" />
        <SkeletonBlock className="h-2 flex-1" />
        <SkeletonBlock className="h-6 w-12" />
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="space-y-1.5">
          <SkeletonBlock className="h-3 w-16" />
          <SkeletonBlock className="h-2 w-12" />
        </div>
        <SkeletonBlock className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  )
}

export function SkeletonDestination() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="text-center space-y-2">
          <SkeletonBlock className="h-5 w-16" />
          <SkeletonBlock className="h-3 w-10 mx-auto" />
        </div>
        <SkeletonBlock className="h-2 flex-1 mx-3" />
        <div className="text-center space-y-2">
          <SkeletonBlock className="h-5 w-16" />
          <SkeletonBlock className="h-3 w-10 mx-auto" />
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-3 w-16" />
        <SkeletonBlock className="h-3 w-20" />
      </div>
      <div className="space-y-2 mt-5">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3">
            <SkeletonBlock className="w-2 h-2 rounded-full shrink-0" />
            <SkeletonBlock className="h-3 flex-1" />
            <SkeletonBlock className="h-2 w-12" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonBooking() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 animate-pulse">
      <SkeletonBlock className="h-4 w-1/3 mb-4" />
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <SkeletonBlock className="w-10 h-10 rounded-lg" />
          <div className="flex-1">
            <SkeletonBlock className="h-3 w-1/2 mb-1.5" />
            <SkeletonBlock className="h-2 w-1/3" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 py-3 border-t border-gray-100 dark:border-gray-800">
          <div className="space-y-2">
            <SkeletonBlock className="h-2 w-14" />
            <SkeletonBlock className="h-4 w-20" />
          </div>
          <div className="space-y-2">
            <SkeletonBlock className="h-2 w-14" />
            <SkeletonBlock className="h-4 w-20" />
          </div>
        </div>
        <div className="space-y-2 py-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex justify-between">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-3 w-16" />
          </div>
          <div className="flex justify-between">
            <SkeletonBlock className="h-3 w-12" />
            <SkeletonBlock className="h-3 w-16" />
          </div>
        </div>
        <SkeletonBlock className="h-11 w-full rounded-lg" />
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2].map(i => (
        <div key={i} className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24" />
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        </div>
      ))}
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse flex gap-3">
            <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="w-40 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="w-28 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg" />
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
