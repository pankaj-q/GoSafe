'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import NavHeader from '@/components/NavHeader'
import SearchBar from '@/components/SearchBar'
import BusCard from '@/components/BusCard'
import FilterSidebar from '@/components/FilterSidebar'
import AdSlot from '@/components/AdSlot'
import { SlidersHorizontal, Frown, Star, Clock, ArrowUpDown, Zap, IndianRupee, ChevronDown, Search, MapPin, Calendar } from 'lucide-react'

interface SearchResult {
  id: number
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

const MOCK_RESULTS: SearchResult[] = [
  { id: 1, operatorName: 'Royal Travels', busType: 'AC_SLEEPER', busRating: 4.3, totalRatings: 234,
    busImages: [{ url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=200&fit=crop', altText: 'Bus exterior' }, { url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=200&fit=crop', altText: 'Bus interior' }],
    amenities: ['Charging Port', 'WiFi', 'Blanket', 'Water Bottle', 'Reading Light', 'CCTV'],
    departureTime: '22:00', arrivalTime: '07:30', durationMin: 570, baseFare: 899, availableSeats: 12, totalSeats: 32,
    boardingPoints: [{ name: 'ISBT Kashmere Gate', time: '22:00' }, { name: 'Anand Vihar', time: '22:20' }, { name: 'DND Flyway', time: '22:35' }],
    droppingPoints: [{ name: 'Varanasi Junction', time: '07:00' }, { name: 'Lanka (BHU)', time: '07:30' }] },
  { id: 2, operatorName: 'Shree Balaji Travels', busType: 'VOLVO_SLEEPER', busRating: 4.5, totalRatings: 567,
    busImages: [{ url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=200&fit=crop', altText: 'Volvo bus' }],
    amenities: ['Charging Port', 'WiFi', 'Blanket', 'Pillow', 'Water Bottle', 'Snacks', 'First Aid'],
    departureTime: '21:30', arrivalTime: '06:45', durationMin: 555, baseFare: 1299, availableSeats: 4, totalSeats: 28,
    boardingPoints: [{ name: 'ISBT Kashmere Gate', time: '21:30' }, { name: 'Karol Bagh', time: '21:50' }],
    droppingPoints: [{ name: 'Varanasi Junction', time: '06:15' }, { name: 'Lanka (BHU)', time: '06:45' }] },
  { id: 3, operatorName: 'Hans Travels', busType: 'AC_SEATER', busRating: 4.0, totalRatings: 189,
    busImages: [], amenities: ['Charging Port', 'Water Bottle'],
    departureTime: '23:00', arrivalTime: '09:00', durationMin: 600, baseFare: 649, availableSeats: 18, totalSeats: 40,
    boardingPoints: [{ name: 'Anand Vihar', time: '23:00' }], droppingPoints: [{ name: 'Varanasi Junction', time: '08:30' }] },
  { id: 4, operatorName: 'Varanasi Express', busType: 'AC_SLEEPER', busRating: 4.1, totalRatings: 312,
    busImages: [{ url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=200&fit=crop', altText: 'Bus front' }],
    amenities: ['Charging Port', 'Blanket', 'Water Bottle', 'Reading Light'],
    departureTime: '20:00', arrivalTime: '06:30', durationMin: 630, baseFare: 799, availableSeats: 0, totalSeats: 32,
    boardingPoints: [{ name: 'ISBT Kashmere Gate', time: '20:00' }, { name: 'Sarai Kale Khan', time: '20:20' }],
    droppingPoints: [{ name: 'Varanasi Junction', time: '06:00' }] },
  { id: 5, operatorName: 'Maa Vaishno Travels', busType: 'NON_AC_SLEEPER', busRating: 3.8, totalRatings: 98,
    busImages: [], amenities: ['Charging Port'],
    departureTime: '22:30', arrivalTime: '08:00', durationMin: 570, baseFare: 549, availableSeats: 22, totalSeats: 36,
    boardingPoints: [{ name: 'DND Flyway', time: '22:30' }], droppingPoints: [{ name: 'Mughal Sarai', time: '07:30' }] },
  { id: 6, operatorName: 'Pawna Travels', busType: 'AC_SEMI_SLEEPER', busRating: 4.2, totalRatings: 445,
    busImages: [{ url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=200&fit=crop', altText: 'Interior' }],
    amenities: ['Charging Port', 'WiFi', 'Water Bottle', 'Snacks', 'Hand Towel'],
    departureTime: '19:45', arrivalTime: '05:15', durationMin: 570, baseFare: 749, availableSeats: 8, totalSeats: 30,
    boardingPoints: [{ name: 'Karol Bagh', time: '19:45' }, { name: 'ISBT Kashmere Gate', time: '20:10' }],
    droppingPoints: [{ name: 'Varanasi Junction', time: '04:45' }, { name: 'Lanka (BHU)', time: '05:15' }] },
]

type SortKey = 'rating' | 'departure' | 'arrival' | 'duration' | 'price'

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'rating', label: 'Best Rating' }, { key: 'departure', label: 'Departure' },
  { key: 'arrival', label: 'Arrival' }, { key: 'duration', label: 'Fastest' },
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

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const source = searchParams.get('source') || ''
  const destination = searchParams.get('destination') || ''
  const date = searchParams.get('date') || ''

  const [showFilters, setShowFilters] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('departure')

  useEffect(() => {
    if (!source && !destination) router.push('/')
  }, [source, destination, router])

  const queryString = searchParams.toString()

  const sorted = [...MOCK_RESULTS].sort((a, b) => {
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
      <NavHeader />
      <main className="min-h-screen bg-gray-50">
        {/* Sticky top bar — collapsible */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
          <div className="gosafe-container py-3">
            {showSearch ? (
              <SearchBar compact initialSource={source} initialDest={destination} />
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-semibold text-sm text-gray-900 truncate">{source}</span>
                    <div className="flex items-center gap-1 text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full border border-blue-500" />
                      <div className="w-8 h-px bg-gradient-to-r from-blue-400 to-blue-500 hidden sm:block" />
                      <div className="w-1.5 h-1.5 rounded-full border border-blue-500" />
                    </div>
                    <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="font-semibold text-sm text-gray-900 truncate">{destination}</span>
                  </div>
                  {formattedDate && (
                    <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500 shrink-0">
                      <Calendar className="w-3 h-3" />
                      {formattedDate}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowSearch(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-200 transition-all shrink-0"
                >
                  <Search className="w-3.5 h-3.5" />
                  Search Again
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="gosafe-container py-6">
          <div className="flex gap-6">
            <FilterSidebar isOpen={showFilters} onClose={() => setShowFilters(false)} />

            <div className="flex-1 min-w-0">
              {/* Sort bar */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="text-base font-bold text-gray-900 truncate">
                      {source} → {destination}
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formattedDate}{formattedDate ? ' · ' : ''}
                      <span className="font-semibold text-gray-700">{available.length}</span> buses
                      {available.length < sorted.length && <span className="text-gray-400"> ({sorted.length - available.length} sold out)</span>}
                    </p>
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

              {sorted.length === 0 ? (
                <div className="text-center py-20">
                  <Frown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No buses found for this route.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sorted.map((bus, i) => (
                    <div key={bus.id} style={{ animationDelay: `${i * 60}ms` }}>
                      <BusCard
                        scheduleId={bus.id}
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

export default function SearchClient() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
