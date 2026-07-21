'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowLeftRight, Calendar, MapPin, TrendingUp } from 'lucide-react'
import { INDIAN_CITIES } from '@/lib/constants'

interface SearchBarProps {
  compact?: boolean
  initialSource?: string
  initialDest?: string
  updateMode?: boolean
}

export default function SearchBar({ compact = false, initialSource = '', initialDest = '', updateMode = false }: SearchBarProps) {
  const router = useRouter()
  const [source, setSource] = useState(initialSource)
  const [dest, setDest] = useState(initialDest)
  const [date, setDate] = useState(() => {
    const d = new Date()
    return d.toISOString().split('T')[0]
  })
  const [sourceSuggestions, setSourceSuggestions] = useState<string[]>([])
  const [destSuggestions, setDestSuggestions] = useState<string[]>([])
  const [sourceActive, setSourceActive] = useState(false)
  const [destActive, setDestActive] = useState(false)
  const [sourceIdx, setSourceIdx] = useState(-1)
  const [destIdx, setDestIdx] = useState(-1)
  const sourceRef = useRef<HTMLDivElement>(null)
  const destRef = useRef<HTMLDivElement>(null)
  const sourceInputRef = useRef<HTMLInputElement>(null)
  const destInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sourceRef.current && !sourceRef.current.contains(e.target as Node)) setSourceActive(false)
      if (destRef.current && !destRef.current.contains(e.target as Node)) setDestActive(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function filterCities(input: string): string[] {
    if (!input || input.length < 1) return []
    const q = input.toLowerCase()
    return INDIAN_CITIES
      .filter(c => c.toLowerCase().includes(q) && c.toLowerCase() !== (sourceActive ? dest.toLowerCase() : source.toLowerCase()))
      .slice(0, 8)
  }

  function handleSourceChange(val: string) {
    setSource(val); setSourceIdx(-1); setSourceSuggestions(filterCities(val)); setSourceActive(true)
  }

  function handleDestChange(val: string) {
    setDest(val); setDestIdx(-1); setDestSuggestions(filterCities(val)); setDestActive(true)
  }

  function selectSource(city: string) {
    setSource(city); setSourceSuggestions([]); setSourceActive(false); destInputRef.current?.focus()
  }

  function selectDest(city: string) {
    setDest(city); setDestSuggestions([]); setDestActive(false)
  }

  function handleSourceKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSourceIdx(i => Math.min(i + 1, sourceSuggestions.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSourceIdx(i => Math.max(i - 1, -1)) }
    else if (e.key === 'Enter' && sourceIdx >= 0 && sourceSuggestions[sourceIdx]) { e.preventDefault(); selectSource(sourceSuggestions[sourceIdx]) }
  }

  function handleDestKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setDestIdx(i => Math.min(i + 1, destSuggestions.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setDestIdx(i => Math.max(i - 1, -1)) }
    else if (e.key === 'Enter' && destIdx >= 0 && destSuggestions[destIdx]) { e.preventDefault(); selectDest(destSuggestions[destIdx]) }
  }

  function handleSwap() {
    const temp = source; setSource(dest); setDest(temp)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!source || !dest || !date) return
    if (source.toLowerCase() === dest.toLowerCase()) return
    router.push(`/search?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(dest)}&date=${date}`)
  }

  function handlePopularRoute(from: string, to: string) {
    setSource(from); setDest(to); setSourceSuggestions([]); setDestSuggestions([])
  }

  const today = new Date().toISOString().split('T')[0]
  const disabled = !source || !dest || !date || source.toLowerCase() === dest.toLowerCase()

  const inp = 'w-full px-3 py-2.5 sm:py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400'
  const ico = 'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none'
  const dd = 'absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-elevated max-h-56 overflow-y-auto animate-fade-in'

  return (
    <form onSubmit={handleSearch}>
      {/* Desktop: single horizontal row */}
      <div className="hidden sm:flex items-end gap-2">
        <div ref={sourceRef} className="relative flex-1 min-w-0">
          <div className="relative">
            <MapPin className={`${ico} text-blue-400`} />
            <input
              ref={sourceInputRef} type="text" value={source}
              onChange={e => handleSourceChange(e.target.value)}
              onFocus={() => { setSourceActive(true); if (source) setSourceSuggestions(filterCities(source)) }}
              onBlur={() => setTimeout(() => setSourceActive(false), 200)}
              onKeyDown={handleSourceKeyDown}
              placeholder="From" className={`${inp} pl-9`} required autoComplete="off"
              role="combobox" aria-expanded={sourceActive && sourceSuggestions.length > 0}
              aria-controls={sourceActive && sourceSuggestions.length > 0 ? 'src-suggestions' : undefined} aria-autocomplete="list"
            />
          </div>
          {sourceActive && sourceSuggestions.length > 0 && (
            <div className={dd} role="listbox" id="src-suggestions">
              {sourceSuggestions.map((city, i) => (
                <button key={city} type="button" role="option" aria-selected={i === sourceIdx}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${i === sourceIdx ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  onMouseDown={e => { e.preventDefault(); selectSource(city) }}>
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{city}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button type="button" onClick={handleSwap}
          className="shrink-0 p-2 rounded-full hover:bg-gray-100 transition-colors mb-0.5" title="Swap">
          <ArrowLeftRight className="w-4 h-4 text-gray-500" />
        </button>

        <div ref={destRef} className="relative flex-1 min-w-0">
          <div className="relative">
            <MapPin className={`${ico} text-red-400`} />
            <input
              ref={destInputRef} type="text" value={dest}
              onChange={e => handleDestChange(e.target.value)}
              onFocus={() => { setDestActive(true); if (dest) setDestSuggestions(filterCities(dest)) }}
              onBlur={() => setTimeout(() => setDestActive(false), 200)}
              onKeyDown={handleDestKeyDown}
              placeholder="To" className={`${inp} pl-9`} required autoComplete="off"
              role="combobox" aria-expanded={destActive && destSuggestions.length > 0}
              aria-controls={destActive && destSuggestions.length > 0 ? 'dest-suggestions' : undefined} aria-autocomplete="list"
            />
          </div>
          {destActive && destSuggestions.length > 0 && (
            <div className={dd} role="listbox" id="dest-suggestions">
              {destSuggestions.map((city, i) => (
                <button key={city} type="button" role="option" aria-selected={i === destIdx}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${i === destIdx ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  onMouseDown={e => { e.preventDefault(); selectDest(city) }}>
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{city}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative w-40 shrink-0">
          <Calendar className={`${ico} text-gray-400`} />
          <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)} className={`${inp} pl-9`} required />
        </div>

        <button type="submit" disabled={disabled}
          className={`shrink-0 px-5 py-2.5 sm:py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
            disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-[0.98]'
          }`}>
          <Search className="w-4 h-4" />
          {updateMode ? 'Update Search' : 'Search'}
        </button>
      </div>

      {/* Mobile: stacked */}
      <div className="sm:hidden space-y-2.5">
        <div ref={sourceRef} className="relative">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none" />
            <input ref={sourceInputRef} type="text" value={source}
              onChange={e => handleSourceChange(e.target.value)}
              onFocus={() => { setSourceActive(true); if (source) setSourceSuggestions(filterCities(source)) }}
              onBlur={() => setTimeout(() => setSourceActive(false), 200)}
              onKeyDown={handleSourceKeyDown}
              placeholder="From" className={`${inp} pl-9`} required autoComplete="off"
              role="combobox" aria-expanded={sourceActive && sourceSuggestions.length > 0}
              aria-controls={sourceActive && sourceSuggestions.length > 0 ? 'src-suggestions-m' : undefined} aria-autocomplete="list"
            />
          </div>
          {sourceActive && sourceSuggestions.length > 0 && (
            <div className={dd} role="listbox" id="src-suggestions-m">
              {sourceSuggestions.map((city, i) => (
                <button key={city} type="button" role="option" aria-selected={i === sourceIdx}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${i === sourceIdx ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  onMouseDown={e => { e.preventDefault(); selectSource(city) }}>
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {city}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={handleSwap} className="p-1.5 rounded-full hover:bg-gray-100 shrink-0">
            <ArrowLeftRight className="w-4 h-4 text-gray-500" />
          </button>
          <div ref={destRef} className="relative flex-1">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none" />
              <input ref={destInputRef} type="text" value={dest}
                onChange={e => handleDestChange(e.target.value)}
                onFocus={() => { setDestActive(true); if (dest) setDestSuggestions(filterCities(dest)) }}
                onBlur={() => setTimeout(() => setDestActive(false), 200)}
                onKeyDown={handleDestKeyDown}
                placeholder="To" className={`${inp} pl-9`} required autoComplete="off"
                role="combobox" aria-expanded={destActive && destSuggestions.length > 0}
                aria-controls={destActive && destSuggestions.length > 0 ? 'dest-suggestions-m' : undefined} aria-autocomplete="list"
              />
            </div>
            {destActive && destSuggestions.length > 0 && (
              <div className={dd} role="listbox" id="dest-suggestions-m">
                {destSuggestions.map((city, i) => (
                  <button key={city} type="button" role="option" aria-selected={i === destIdx}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${i === destIdx ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                    onMouseDown={e => { e.preventDefault(); selectDest(city) }}>
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {city}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2.5">
          <div className="relative flex-1">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)} className={`${inp} pl-9`} required />
          </div>
          <button type="submit" disabled={disabled}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
            }`}>
            <Search className="w-4 h-4" />
            {updateMode ? 'Update' : 'Go'}
          </button>
        </div>
      </div>

      {/* Popular routes chips */}
      {!compact && (
        <div className="flex flex-wrap items-center gap-2 pt-2.5">
          <span className="text-xs text-gray-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Popular:</span>
          {[['Delhi', 'Varanasi'], ['Mumbai', 'Pune'], ['Delhi', 'Jaipur'], ['Bangalore', 'Chennai']].map(([from, to]) => (
            <button key={`${from}-${to}`} type="button" onClick={() => handlePopularRoute(from, to)}
              className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
              {from} → {to}
            </button>
          ))}
        </div>
      )}
    </form>
  )
}
