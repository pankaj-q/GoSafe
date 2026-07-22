'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import NavHeader from '@/components/NavHeader'
import SearchBar from '@/components/SearchBar'
import BusCard from '@/components/BusCard'
import FilterSidebar from '@/components/FilterSidebar'
import AdSlot from '@/components/AdSlot'
import { SlidersHorizontal, Frown, Star, Clock, ArrowUpDown, Zap, IndianRupee, ChevronDown } from 'lucide-react'

interface SearchResult {
  scheduleId: number
  operatorName: string
  busType: string
  busRating: number
  totalRatings: number
  busImages: { url: string; altText?: string | null }[]
  amenities: string[]
  departureTime: string
  arrivalTime: string
  durationMin: number
  baseFare: number
  availableSeats: number
  totalSeats: number
  boardingPoints?: { name: string; time: string }[]
  droppingPoints?: { name: string; time: string }[]
}

type SortKey = 'rating' | 'departure' | 'arrival' | 'duration' | 'price'

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'rating', label: 'Best Rating' },
  { key: 'departure', label: 'Departure' },
  { key: 'arrival', label: 'Arrival' },
  { key: 'duration', label: 'Fastest' },
  { key: 'price', label: 'Cheapest' },
]

function SortDropdown({ value, onChange }: { value: SortKey; onChange: (k: SortKey) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handle(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const active = sortOptions.find(o => o.key === value)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
      >
        <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
        Sort: <span className="text-blue-600">{active?.label}</span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-elevated z-30 py-1 animate-fade-in">
          {sortOptions.map(o => (
            <button
              key={o.key}
              onClick={() => { onChange(o.key); setOpen(false) }}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                value === o.key ? 'text-blue-700 bg-blue-50 font-semibold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {o.key === 'rating' && <Star className="w-3.5 h-3.5" />}
              {o.key === 'departure' && <Clock className="w-3.5 h-3.5" />}
              {o.key === 'arrival' && <Clock className="w-3.5 h-3.5" />}
              {o.key === 'duration' && <Zap className="w-3.5 h-3.5" />}
              {o.key === 'price' && <IndianRupee className="w-3.5 h-3.5" />}
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SearchContent({ source, destination, date, queryString }: {
  source: string; destination: string; date: string; queryString: string
}) {
  const router = useRouter()

  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('departure')

  useEffect(() => {
    if (!source && !destination) {
      router.push('/')
      return
    }

    const params = new URLSearchParams({ source, destination })
    fetch(`/api/search?${params.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error('Search failed')
        return res.json()
      })
      .then(data => {
        setResults(data.results || [])
      })
      .catch(err => {
        setError('Failed to load results. Please try again.')
        console.error('Search fetch error:', err)
      })
      .finally(() => setLoading(false))
  }, [source, destination, router])

  const sorted = [...results].sort((a, b) => {
    switch (sortKey) {
      case 'rating': return b.busRating - a.busRating
      case 'departure': return a.departureTime.localeCompare(b.departureTime)
      case 'arrival': return a.arrivalTime.localeCompare(b.arrivalTime)
      case 'duration': return a.durationMin - b.durationMin
      case 'price': return a.baseFare - b.baseFare
      default: return 0
    }
  })

  const available = sorted.filter(r => r.availableSeats > 0)

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    : ''

  return (
    <>
      <div className="sticky top-0 z-50">
        <NavHeader sticky={false} />
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="gosafe-container py-2.5 sm:py-3">
            <SearchBar compact initialSource={source} initialDest={destination} updateMode />
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-gray-50">
        <div className="gosafe-container py-6">
          <div className="flex gap-6">
            <FilterSidebar isOpen={showFilters} onClose={() => setShowFilters(false)} />

            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    {loading ? (
                      <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      <>
                        <h1 className="text-base font-bold text-gray-900 truncate">
                          {source} → {destination}
                        </h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formattedDate}{formattedDate ? ' · ' : ''}
                          <span className="font-semibold text-gray-700">{available.length}</span> buses
                          {available.length < sorted.length && <span className="text-gray-400"> ({sorted.length - available.length} sold out)</span>}
                          <button
                            onClick={() => window.location.reload()}
                            className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Update Search
                          </button>
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setShowFilters(true)}
                      className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      Filters
                    </button>
                    <SortDropdown value={sortKey} onChange={setSortKey} />
                  </div>
                </div>
              </div>

              <AdSlot format="leaderboard" className="mb-4" />

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                      <div className="flex gap-4">
                        <div className="w-44 shrink-0 space-y-2">
                          <div className="w-14 h-14 bg-gray-200 rounded-xl" />
                          <div className="h-3 w-24 bg-gray-200 rounded" />
                          <div className="h-3 w-16 bg-gray-200 rounded" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-32 bg-gray-200 rounded" />
                          <div className="h-3 w-48 bg-gray-200 rounded" />
                        </div>
                        <div className="w-36 space-y-2">
                          <div className="h-5 w-20 bg-gray-200 rounded ml-auto" />
                          <div className="h-8 w-28 bg-gray-200 rounded ml-auto" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <Frown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-blue-600 font-medium text-sm hover:text-blue-700"
                  >
                    Try again
                  </button>
                </div>
              ) : sorted.length === 0 ? (
                <div className="text-center py-20">
                  <Frown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No buses found for this route.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sorted.map((bus, i) => (
                    <div key={bus.scheduleId} style={{ animationDelay: `${i * 60}ms` }}>
                      <BusCard
                        scheduleId={bus.scheduleId}
                        operatorName={bus.operatorName}
                        busType={bus.busType}
                        busRating={bus.busRating}
                        totalRatings={bus.totalRatings}
                        busImages={bus.busImages}
                        amenities={bus.amenities}
                        departureTime={bus.departureTime}
                        arrivalTime={bus.arrivalTime}
                        durationMin={bus.durationMin}
                        baseFare={bus.baseFare}
                        availableSeats={bus.availableSeats}
                        totalSeats={bus.totalSeats}
                        boardingPoints={bus.boardingPoints}
                        droppingPoints={bus.droppingPoints}
                        queryString={queryString}
                      />
                    </div>
                  ))}
                  <AdSlot format="rectangle" className="my-4" />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

function SearchParamsReader() {
  const searchParams = useSearchParams()
  const source = searchParams.get('source') || ''
  const destination = searchParams.get('destination') || ''
  const date = searchParams.get('date') || ''
  const queryString = searchParams.toString()
  return (
    <SearchContent
      key={`${source}-${destination}-${date}`}
      source={source}
      destination={destination}
      date={date}
      queryString={queryString}
    />
  )
}

export default function SearchClient() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    }>
      <SearchParamsReader />
    </Suspense>
  )
}
