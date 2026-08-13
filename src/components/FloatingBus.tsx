'use client'

import { useState, useRef, useEffect } from 'react'
import { Bus } from 'lucide-react'

const STORAGE_KEY = 'gosafe-floating-bus'
const DEFAULT_X = 20
const DEFAULT_Y = 20
const BUS_SIZE = 56

function loadSavedPos(): { x: number; y: number } {
  if (typeof window === 'undefined') return { x: DEFAULT_X, y: DEFAULT_Y }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      if (typeof saved.x === 'number' && typeof saved.y === 'number') {
        return { x: saved.x, y: saved.y }
      }
    }
  } catch { /* ignore */ }
  return { x: DEFAULT_X, y: DEFAULT_Y }
}

export default function FloatingBus() {
  const [pos, setPos] = useState(loadSavedPos)
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef<{ dx: number; dy: number } | null>(null)

  // Persist position
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pos))
    } catch { /* ignore */ }
  }, [pos])

  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    dragRef.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y }
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!dragRef.current) return
    setPos({
      x: Math.max(0, Math.min(window.innerWidth - BUS_SIZE, e.clientX - dragRef.current.dx)),
      y: Math.max(0, Math.min(window.innerHeight - BUS_SIZE, e.clientY - dragRef.current.dy)),
    })
  }

  function onPointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    dragRef.current = null
    setDragging(false)
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* ignore */ }
  }

  return (
    <button
      type="button"
      aria-label="Floating GoSafe bus — drag to place anywhere"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ left: pos.x, top: pos.y }}
      className={`fixed z-[60] select-none touch-none cursor-grab active:cursor-grabbing group transition-[transform] duration-150 ${
        dragging ? 'scale-110' : ''
      }`}
    >
      <div className={`relative flex flex-col items-center ${dragging ? '' : 'animate-float-bus'}`}>
        <div className="relative">
          {/* Bus body */}
          <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-600/30 border border-blue-400/40 flex items-center justify-center transition-transform duration-150 group-hover:-translate-y-0.5">
            <Bus className="w-5 h-5 text-white" />
          </div>
          {/* Wheels */}
          <div className="absolute -bottom-1.5 left-1.5 w-3 h-3 rounded-full bg-gray-900 border-2 border-gray-700 animate-wheel-spin" />
          <div className="absolute -bottom-1.5 right-1.5 w-3 h-3 rounded-full bg-gray-900 border-2 border-gray-700 animate-wheel-spin" />
          {/* Headlights */}
          <div className="absolute top-1.5 right-1 w-1.5 h-1 rounded-full bg-yellow-300 animate-headlight" />
          {/* Moving trail */}
          {!dragging && (
            <div className="absolute -left-5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 animate-trail">
              <span className="w-2 h-1 rounded-full bg-blue-400/50" />
              <span className="w-1.5 h-1 rounded-full bg-blue-400/40" />
              <span className="w-1 h-1 rounded-full bg-blue-400/30" />
            </div>
          )}
        </div>
        <span className="mt-2 text-[9px] font-bold tracking-widest text-blue-700 dark:text-blue-400 bg-white/80 dark:bg-gray-900/80 px-1.5 py-0.5 rounded-full shadow-sm">
          GoSafe
        </span>
      </div>
    </button>
  )
}