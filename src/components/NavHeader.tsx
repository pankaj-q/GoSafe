'use client'

import Link from 'next/link'
import { Bus, Phone, Menu, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export default function NavHeader({ sticky = true }: { sticky?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (currentY < 60) {
        setVisible(true)
      } else if (currentY > lastScrollY.current) {
        setVisible(false)
      } else {
        setVisible(true)
      }
      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`bg-white border-b border-gray-200 ${
        sticky ? 'sticky top-0 z-50' : ''
      } transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="gosafe-container">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">GoSafe</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/search" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Book Tickets
            </Link>
            <a href="tel:1800-XXX-XXXX" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              <Phone className="w-3.5 h-3.5" />
              1800-XXX-XXXX
            </a>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-sm font-medium text-gray-600 px-2 py-1.5" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link href="/search" className="text-sm font-medium text-gray-600 px-2 py-1.5" onClick={() => setMenuOpen(false)}>
                Book Tickets
              </Link>
              <a href="tel:1800-XXX-XXXX" className="text-sm font-medium text-gray-600 px-2 py-1.5" onClick={() => setMenuOpen(false)}>
                Contact: 1800-XXX-XXXX
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
