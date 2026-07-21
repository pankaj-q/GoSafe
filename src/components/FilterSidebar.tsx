'use client'

import { useState } from 'react'
import { SlidersHorizontal, X, Star, ChevronDown } from 'lucide-react'

const busTypes = ['AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Volvo AC', 'AC Semi-Sleeper', 'Non-AC Seater']
const amenities = ['Charging Port', 'WiFi', 'Blanket', 'Water Bottle', 'Reading Light', 'CCTV', 'First Aid', 'Snacks', 'Pillow']
const boardingTimes = [
  { label: 'Early Morning (00:00–06:00)', range: '00:00-06:00' },
  { label: 'Morning (06:00–12:00)', range: '06:00-12:00' },
  { label: 'Afternoon (12:00–18:00)', range: '12:00-18:00' },
  { label: 'Evening (18:00–00:00)', range: '18:00-00:00' },
]
const priceRanges = [
  { label: 'Under ₹500', range: '0-500' },
  { label: '₹500 – ₹1,000', range: '500-1000' },
  { label: '₹1,000 – ₹1,500', range: '1000-1500' },
  { label: '₹1,500+', range: '1500-99999' },
]

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function FilterSidebar({ isOpen, onClose }: FilterSidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    busType: true,
    price: true,
    time: true,
    rating: false,
    amenities: false,
  })

  const toggle = (key: string) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed lg:sticky top-0 lg:top-4 z-50 lg:z-0 h-full lg:h-auto
        w-72 lg:w-64 bg-white border-r lg:border border-gray-200 lg:rounded-xl lg:shadow-sm
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between lg:hidden">
          <span className="font-semibold text-sm text-gray-900 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </span>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Bus Type */}
          <FilterSection title="Bus Type" expanded={expanded.busType} onToggle={() => toggle('busType')}>
            <div className="space-y-2">
              {busTypes.map(type => (
                <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{type}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Price Range" expanded={expanded.price} onToggle={() => toggle('price')}>
            <div className="space-y-2">
              {priceRanges.map(pr => (
                <label key={pr.range} className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="radio" name="price" className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{pr.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Boarding Time */}
          <FilterSection title="Boarding Time" expanded={expanded.time} onToggle={() => toggle('time')}>
            <div className="space-y-2">
              {boardingTimes.map(bt => (
                <label key={bt.range} className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{bt.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Rating */}
          <FilterSection title="Minimum Rating" expanded={expanded.rating} onToggle={() => toggle('rating')}>
            <div className="space-y-2">
              {[4, 3, 2, 1].map(r => (
                <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="radio" name="rating" className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 flex items-center gap-1">
                    {r}+ <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Amenities */}
          <FilterSection title="Amenities" expanded={expanded.amenities} onToggle={() => toggle('amenities')}>
            <div className="space-y-2">
              {amenities.map(a => (
                <label key={a} className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{a}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        </div>

        {/* Apply / Clear */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-2">
          <button className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Clear All
          </button>
          <button className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            Apply Filters
          </button>
        </div>
      </aside>
    </>
  )
}

function FilterSection({ title, expanded, onToggle, children }: { title: string; expanded: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 text-sm font-semibold text-gray-900"
      >
        {title}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && <div className="pt-1 pb-2">{children}</div>}
    </div>
  )
}
