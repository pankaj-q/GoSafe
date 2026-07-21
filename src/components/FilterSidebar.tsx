'use client'

import { useState } from 'react'
import { X, Star, ChevronDown, TrendingUp, Clock, MapPin, Building2 } from 'lucide-react'

const popularRoutes = [
  ['Delhi', 'Varanasi'], ['Mumbai', 'Pune'], ['Delhi', 'Jaipur'],
  ['Bangalore', 'Chennai'], ['Delhi', 'Lucknow'], ['Delhi', 'Mumbai'],
]
const busTypes = ['AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Volvo AC', 'AC Semi-Sleeper', 'Non-AC Seater']
const seatTypes = ['Sleeper', 'Seater / Semi-Sleeper']
const timeSlots = [
  { label: '00:00 – 06:00', sub: 'Early Morning' },
  { label: '06:00 – 12:00', sub: 'Morning' },
  { label: '12:00 – 18:00', sub: 'Afternoon' },
  { label: '18:00 – 23:59', sub: 'Evening' },
]
const operators = ['Royal Travels', 'Shree Balaji', 'Hans Travels', 'Varanasi Express', 'Maa Vaishno', 'Pawna Travels']
const boardingPoints = ['ISBT Kashmere Gate', 'Anand Vihar', 'DND Flyway', 'Sarai Kale Khan', 'Karol Bagh']
const droppingPoints = ['Varanasi Junction', 'Lanka (BHU)', 'Mughal Sarai', 'Sarnath']

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function FilterSidebar({ isOpen, onClose }: FilterSidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    popular: false, busType: true, seatType: true, departure: true, arrival: false,
    boarding: false, dropping: false, operator: false,
  })
  const toggle = (key: string) => setExpanded(p => ({ ...p, [key]: !p[key] }))

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />
      )}
      <aside className={`
        fixed lg:sticky top-0 lg:top-24 z-50 lg:z-0
        w-72 lg:w-64 bg-white border-r lg:border border-gray-200 lg:rounded-xl lg:shadow-sm
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isOpen ? '' : 'lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto'}
      `}>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between lg:hidden z-10">
          <span className="font-semibold text-sm text-gray-900 flex items-center gap-2">
            Filters
          </span>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {/* Popular Routes */}
          <FilterSection title="Popular Routes" icon={TrendingUp} expanded={expanded.popular} onToggle={() => toggle('popular')}>
            <div className="flex flex-wrap gap-1.5">
              {popularRoutes.map(([from, to]) => (
                <button key={`${from}-${to}`} className="text-xs px-2.5 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
                  {from} → {to}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Bus Type */}
          <FilterSection title="Bus Type" icon={Building2} expanded={expanded.busType} onToggle={() => toggle('busType')}>
            <div className="space-y-1.5">
              {busTypes.map(type => (
                <label key={type} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{type}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Seat Type */}
          <FilterSection title="Seat Type" icon={Star} expanded={expanded.seatType} onToggle={() => toggle('seatType')}>
            <div className="space-y-1.5">
              {seatTypes.map(st => (
                <label key={st} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{st}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Departure Time */}
          <FilterSection title="Departure Time" icon={Clock} expanded={expanded.departure} onToggle={() => toggle('departure')}>
            <div className="space-y-1.5">
              {timeSlots.map(ts => (
                <label key={ts.label} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {ts.label} <span className="text-gray-400 text-xs">({ts.sub})</span>
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Arrival Time */}
          <FilterSection title="Arrival Time" icon={Clock} expanded={expanded.arrival} onToggle={() => toggle('arrival')}>
            <div className="space-y-1.5">
              {timeSlots.map(ts => (
                <label key={ts.label} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {ts.label} <span className="text-gray-400 text-xs">({ts.sub})</span>
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Boarding Point */}
          <FilterSection title="Boarding Point" icon={MapPin} expanded={expanded.boarding} onToggle={() => toggle('boarding')}>
            <div className="space-y-1.5">
              {boardingPoints.map(bp => (
                <label key={bp} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{bp}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Dropping Point */}
          <FilterSection title="Dropping Point" icon={MapPin} expanded={expanded.dropping} onToggle={() => toggle('dropping')}>
            <div className="space-y-1.5">
              {droppingPoints.map(dp => (
                <label key={dp} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{dp}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Operator */}
          <FilterSection title="Operator" icon={Building2} expanded={expanded.operator} onToggle={() => toggle('operator')}>
            <div className="space-y-1.5">
              {operators.map(op => (
                <label key={op} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{op}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        </div>

        {/* Apply / Clear — sticky at bottom */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-2">
          <button className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Clear
          </button>
          <button className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            Apply
          </button>
        </div>
      </aside>
    </>
  )
}

function FilterSection({ title, icon: Icon, expanded, onToggle, children }: { title: string; icon?: React.ComponentType<{ className?: string }>; expanded: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-50 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2.5 text-sm font-semibold text-gray-900"
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
          {title}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && <div className="pb-3">{children}</div>}
    </div>
  )
}
