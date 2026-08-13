'use client'

import { useState, useRef, useEffect } from 'react'
import { Bus, BadgePercent, Radio, CalendarDays, Search, Headphones, Clock, Navigation, Ticket } from 'lucide-react'
import Link from 'next/link'

const STORAGE_KEY = 'gosafe-floating-bus'
const DEFAULT_X = 20
const DEFAULT_Y = 20
const BUS_W = 48
const BUS_H = 36

// Per-chip placement: each keyword gets its own angle + distance from the bus
// so they scatter around it instead of riding one orbit track.
const CHIP_LAYOUT = [
  { angle: 0, r: 115 },
  { angle: 45, r: 160 },
  { angle: 90, r: 120 },
  { angle: 135, r: 165 },
  { angle: 180, r: 118 },
  { angle: 225, r: 155 },
  { angle: 270, r: 122 },
  { angle: 315, r: 158 },
]

const keywords = [
  { label: 'Offers', href: '/offers', icon: BadgePercent },
  { label: 'Track Bus', href: '/track', icon: Radio },
  { label: 'My Trips', href: '/my-bookings', icon: CalendarDays },
  { label: 'Book Now', href: '/search', icon: Search },
  { label: 'Help', href: '/help', icon: Headphones },
  { label: '24×7', href: '/help', icon: Clock },
  { label: 'Live GPS', href: '/track', icon: Navigation },
  { label: 'E-Ticket', href: '/help', icon: Ticket },
]

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
  const [burstOpen, setBurstOpen] = useState(false)
  const dragRef = useRef<{ dx: number; dy: number } | null>(null)
  const pressRef = useRef<{ x: number; y: number; moved: boolean }>({ x: 0, y: 0, moved: false })
  const chipRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Persist position
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pos))
    } catch { /* ignore */ }
  }, [pos])

  // Auto-close the burst after a while
  useEffect(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    if (burstOpen) {
      closeTimer.current = setTimeout(() => setBurstOpen(false), 9000)
    }
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [burstOpen])

  // 3D scatter: chips float around the bus at their own angle/distance, gently bobbing
  useEffect(() => {
    if (!burstOpen) return
    let t = 0
    let raf = 0
    const step = () => {
      t += 1
      chipRefs.current.forEach((chip, i) => {
        if (!chip) return
        const { angle, r } = CHIP_LAYOUT[i % CHIP_LAYOUT.length]
        const wobble = Math.sin(t / 26 + i) * 12
        chip.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${r + wobble}px) rotateY(${-angle}deg)`
      })
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [burstOpen])

  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    pressRef.current = { x: e.clientX, y: e.clientY, moved: false }
    dragRef.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y }
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!dragRef.current) return
    const moved = Math.abs(e.clientX - pressRef.current.x) + Math.abs(e.clientY - pressRef.current.y) > 6
    if (moved) pressRef.current.moved = true
    setPos({
      x: Math.max(0, Math.min(window.innerWidth - BUS_W, e.clientX - dragRef.current.dx)),
      y: Math.max(0, Math.min(window.innerHeight - BUS_H, e.clientY - dragRef.current.dy)),
    })
  }

  function onPointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    const wasClick = !pressRef.current.moved
    dragRef.current = null
    setDragging(false)
    if (wasClick) setBurstOpen(o => !o)
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* ignore */ }
  }

  const cx = pos.x + BUS_W / 2
  const cy = pos.y + BUS_H / 2

  return (
    <>
      {/* Click-away backdrop */}
      {burstOpen && (
        <button
          aria-label="Close floating bus keywords"
          onClick={() => setBurstOpen(false)}
          className="fixed inset-0 z-[59] cursor-default"
          style={{ background: 'transparent' }}
        />
      )}

      {/* 3D keyword burst — rendered separately so bus dragging stays smooth */}
      {burstOpen && (
        <div
          className="fixed z-[61] pointer-events-none animate-pop-in"
          style={{ left: cx, top: cy, perspective: 900 }}
        >
          {/* Orbit ring (chip holder) — chips carry their own 3D transform */}
          <div className="absolute left-0 top-0" style={{ transformStyle: 'preserve-3d' }}>
            {keywords.map((k, i) => {
              const Icon = k.icon
              const { angle, r } = CHIP_LAYOUT[i % CHIP_LAYOUT.length]
              return (
                <Link
                  key={k.label}
                  ref={el => { chipRefs.current[i] = el }}
                  href={k.href}
                  onClick={() => setBurstOpen(false)}
                  className="absolute left-0 top-0 pointer-events-auto"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${r}px) rotateY(${-angle}deg)`,
                  }}
                >
                  <span
                    className="flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 rounded-full font-[Aquire] text-sm sm:text-base tracking-wider text-white italic"
                    style={{
                      background: 'linear-gradient(135deg, #ff6b35, #e14e18)',
                      boxShadow: '0 6px 20px rgba(255, 107, 53, 0.45), inset 0 1px 0 rgba(255,255,255,0.35)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.35)',
                    }}
                  >
                    <Icon className="w-3.5 h-3.5 text-white" />
                    {k.label}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Spinning 3D cube */}
          <div className="absolute left-0 top-0 pointer-events-none animate-orb" style={{ transform: 'translate(-70px, -14px)', animationDelay: '0.2s' }}>
            <div className="animate-cube-spin" style={{ transformStyle: 'preserve-3d' }}>
              {[
                { t: 'rotateY(0deg) translateZ(16px)', c: 'from-[#ff6b35] to-[#e14e18]' },
                { t: 'rotateY(90deg) translateZ(16px)', c: 'from-[#12335c] to-[#0b1f3a]' },
                { t: 'rotateY(180deg) translateZ(16px)', c: 'from-[#ff6b35] to-[#ff914d]' },
                { t: 'rotateY(270deg) translateZ(16px)', c: 'from-[#12335c] to-[#081f3a]' },
                { t: 'rotateX(90deg) translateZ(16px)', c: 'from-white to-[#ffd8c2]' },
                { t: 'rotateX(-90deg) translateZ(16px)', c: 'from-[#0b1f3a] to-[#1c3d66]' },
              ].map((f, i) => (
                <div
                  key={i}
                  className={`absolute w-8 h-8 rounded-md bg-gradient-to-br ${f.c} border border-white/30`}
                  style={{ transform: f.t, backfaceVisibility: 'hidden' }}
                />
              ))}
            </div>
          </div>

          {/* Glossy 3D sphere */}
          <div className="absolute left-0 top-0 pointer-events-none animate-orb" style={{ transform: 'translate(66px, 34px)', animationDelay: '0.5s' }}>
            <div
              className="w-9 h-9 rounded-full"
              style={{
                background: 'radial-gradient(circle at 32% 30%, #ffffff 0%, #ffb58a 22%, #ff6b35 55%, #c44115 100%)',
                boxShadow: '0 10px 24px rgba(255, 107, 53, 0.45), inset -4px -6px 12px rgba(0,0,0,0.18)',
              }}
            />
          </div>

          {/* Orbiting rings (gyroscope) */}
          <div className="absolute left-0 top-0 animate-ring pointer-events-none" style={{ transform: 'rotateX(75deg)' }}>
            <div
              className="rounded-full border-2 border-dashed border-[#ff6b35]/60"
              style={{ width: 150, height: 150, transform: 'translate(-50%, -50%)' }}
            />
          </div>
          <div className="absolute left-0 top-0 animate-ring-rev pointer-events-none" style={{ transform: 'rotateY(75deg)' }}>
            <div
              className="rounded-full border-2 border-dashed border-white/40"
              style={{ width: 180, height: 180, transform: 'translate(-50%, -50%)' }}
            />
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label="Floating GoSafe bus — drag to place, click for quick links"
        aria-expanded={burstOpen}
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
    </>
  )
}