'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowLeftRight, Calendar, MapPin } from 'lucide-react'
import { INDIAN_CITIES } from '@/lib/constants'

export default function SearchBar({ compact = false }: { compact?: boolean }) {
  const router = useRouter()
  const [source, setSource] = useState('')
  const [dest, setDest] = useState('')
  const [date, setDate] = useState(() => {
    const d = new Date()
    return d.toISOString().split('T')[0]
  })
  const [sourceSuggestions, setSourceSuggestions] = useState<string[]>([])
  const [destSuggestions, setDestSuggestions] = useState<string[]>([])
  const [focusedField, setFocusedField] = useState<'source' | 'dest' | null>(null)
  const sourceRef = useRef<HTMLDivElement>(null)
  const destRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sourceRef.current && !sourceRef.current.contains(e.target as Node)) {
        setSourceSuggestions([])
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setDestSuggestions([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function filterCities(input: string): string[] {
    if (!input || input.length < 1) return []
    const q = input.toLowerCase()
    return INDIAN_CITIES
      .filter(c => c.toLowerCase().includes(q))
      .slice(0, 8)
  }

  function handleSwap() {
    const temp = source
    setSource(dest)
    setDest(temp)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!source || !dest || !date) return
    if (source.toLowerCase() === dest.toLowerCase()) return

    router.push(
      `/search?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(dest)}&date=${date}`
    )
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSearch} className={compact ? '' : ''}>
      <div className={`${compact ? 'flex flex-col sm:flex-row items-end gap-3' : 'space-y-4'}`}>
        <div className={`${compact ? 'flex-1' : ''} grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-2 items-center`}>
          <div ref={sourceRef} className="relative">
            <label className="gosafe-label flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              From
            </label>
            <input
              type="text"
              value={source}
              onChange={e => { setSource(e.target.value); setSourceSuggestions(filterCities(e.target.value)) }}
              onFocus={() => setFocusedField('source')}
              placeholder="Enter source city"
              className="gosafe-input"
              required
              autoComplete="off"
            />
            {focusedField === 'source' && sourceSuggestions.length > 0 && (
              <div className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-elevated max-h-48 overflow-y-auto">
                {sourceSuggestions.map(city => (
                  <button
                    key={city}
                    type="button"
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2"
                    onClick={() => { setSource(city); setSourceSuggestions([]) }}
                  >
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSwap}
            className="mt-5 p-2 rounded-full hover:bg-gray-100 transition-colors self-center"
            title="Swap cities"
          >
            <ArrowLeftRight className="w-4 h-4 text-gray-500" />
          </button>

          <div ref={destRef} className="relative">
            <label className="gosafe-label flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              To
            </label>
            <input
              type="text"
              value={dest}
              onChange={e => { setDest(e.target.value); setDestSuggestions(filterCities(e.target.value)) }}
              onFocus={() => setFocusedField('dest')}
              placeholder="Enter destination city"
              className="gosafe-input"
              required
              autoComplete="off"
            />
            {focusedField === 'dest' && destSuggestions.length > 0 && (
              <div className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-elevated max-h-48 overflow-y-auto">
                {destSuggestions.map(city => (
                  <button
                    key={city}
                    type="button"
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2"
                    onClick={() => { setDest(city); setDestSuggestions([]) }}
                  >
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={compact ? 'w-full sm:w-40' : ''}>
          <label className="gosafe-label flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-600" />
            Date
          </label>
          <input
            type="date"
            value={date}
            min={today}
            onChange={e => setDate(e.target.value)}
            className="gosafe-input"
            required
          />
        </div>

        <button
          type="submit"
          className={`gosafe-btn gosafe-btn-primary ${compact ? 'h-[46px] w-full sm:w-auto' : 'w-full'}`}
          disabled={!source || !dest || !date || source.toLowerCase() === dest.toLowerCase()}
        >
          <Search className="w-4 h-4" />
          Search Buses
        </button>
      </div>
    </form>
  )
}
