'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import NavHeader from '@/components/NavHeader'
import SearchBar from '@/components/SearchBar'
import BusCard from '@/components/BusCard'
import { SlidersHorizontal, Frown } from 'lucide-react'

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
}

const MOCK_RESULTS: SearchResult[] = [
  {
    id: 1,
    operatorName: 'Royal Travels',
    busType: 'AC_SLEEPER',
    busRating: 4.3,
    totalRatings: 234,
    busImages: [
      { url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=200&fit=crop', altText: 'Bus exterior' },
      { url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=200&fit=crop', altText: 'Bus interior' },
    ],
    amenities: ['Charging Port', 'WiFi', 'Blanket', 'Water Bottle', 'Reading Light', 'CCTV'],
    departureTime: '22:00',
    arrivalTime: '07:30',
    durationMin: 570,
    baseFare: 899,
    availableSeats: 12,
    totalSeats: 32,
  },
  {
    id: 2,
    operatorName: 'Shree Balaji Travels',
    busType: 'VOLVO_SLEEPER',
    busRating: 4.5,
    totalRatings: 567,
    busImages: [
      { url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=200&fit=crop', altText: 'Volvo bus' },
    ],
    amenities: ['Charging Port', 'WiFi', 'Blanket', 'Pillow', 'Water Bottle', 'Snacks', 'First Aid'],
    departureTime: '21:30',
    arrivalTime: '06:45',
    durationMin: 555,
    baseFare: 1299,
    availableSeats: 4,
    totalSeats: 28,
  },
  {
    id: 3,
    operatorName: 'Hans Travels',
    busType: 'AC_SEATER',
    busRating: 4.0,
    totalRatings: 189,
    busImages: [],
    amenities: ['Charging Port', 'Water Bottle'],
    departureTime: '23:00',
    arrivalTime: '09:00',
    durationMin: 600,
    baseFare: 649,
    availableSeats: 18,
    totalSeats: 40,
  },
  {
    id: 4,
    operatorName: 'Varanasi Express',
    busType: 'AC_SLEEPER',
    busRating: 4.1,
    totalRatings: 312,
    busImages: [
      { url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=200&fit=crop', altText: 'Bus front' },
    ],
    amenities: ['Charging Port', 'Blanket', 'Water Bottle', 'Reading Light'],
    departureTime: '20:00',
    arrivalTime: '06:30',
    durationMin: 630,
    baseFare: 799,
    availableSeats: 0,
    totalSeats: 32,
  },
  {
    id: 5,
    operatorName: 'Maa Vaishno Travels',
    busType: 'NON_AC_SLEEPER',
    busRating: 3.8,
    totalRatings: 98,
    busImages: [],
    amenities: ['Charging Port'],
    departureTime: '22:30',
    arrivalTime: '08:00',
    durationMin: 570,
    baseFare: 549,
    availableSeats: 22,
    totalSeats: 36,
  },
  {
    id: 6,
    operatorName: 'Pawna Travels',
    busType: 'AC_SEMI_SLEEPER',
    busRating: 4.2,
    totalRatings: 445,
    busImages: [
      { url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=200&fit=crop', altText: 'Interior' },
    ],
    amenities: ['Charging Port', 'WiFi', 'Water Bottle', 'Snacks', 'Hand Towel'],
    departureTime: '19:45',
    arrivalTime: '05:15',
    durationMin: 570,
    baseFare: 749,
    availableSeats: 8,
    totalSeats: 30,
  },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const source = searchParams.get('source') || ''
  const destination = searchParams.get('destination') || ''
  const date = searchParams.get('date') || ''

  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (!source && !destination) {
      router.push('/')
    }
  }, [source, destination, router])

  const queryString = searchParams.toString()

  return (
    <>
      <NavHeader />
      <main className="min-h-screen bg-gray-50">
        {/* Sticky compact search */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
          <div className="gosafe-container py-3">
            <SearchBar compact />
          </div>
        </div>

        <div className="gosafe-container py-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {source} → {destination}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {date ? new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                {' · '}{MOCK_RESULTS.filter(r => r.availableSeats > 0).length} buses available
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="gosafe-btn gosafe-btn-secondary text-xs flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="gosafe-card p-4 mb-4 animate-fade-in">
              <div className="flex flex-wrap gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Bus Type</label>
                  <div className="flex flex-wrap gap-2">
                    {['AC Sleeper', 'AC Seater', 'Volvo', 'Non-AC'].map(t => (
                      <button key={t} className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-colors">
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Departure</label>
                  <div className="flex flex-wrap gap-2">
                    {['Before 6am', '6am-12pm', '12pm-6pm', 'After 6pm'].map(t => (
                      <button key={t} className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-colors">
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {MOCK_RESULTS.length === 0 ? (
            <div className="text-center py-20">
              <Frown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No buses found for this route.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {MOCK_RESULTS.map((bus, i) => (
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
                    queryString={queryString}
                  />
                </div>
              ))}
            </div>
          )}
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
