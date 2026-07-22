'use client'

import Link from 'next/link'
import { Bus, Phone, Menu, X, User, LogOut, Calendar } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'

export default function NavHeader({ sticky = true }: { sticky?: boolean }) {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const lastScrollY = useRef(0)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sticky) return
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
  }, [sticky])

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const name = session?.user?.name
  const initial = name?.[0]?.toUpperCase() || 'U'

  return (
    <header
      className={`bg-white border-b border-gray-200 ${
        sticky ? 'sticky top-0 z-50' : ''
      } transition-all duration-300 ease-in-out overflow-hidden ${
        visible || sticky ? 'max-h-20' : 'max-h-0 border-transparent'
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

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/search" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Book Tickets
            </Link>
            <a href="tel:1800-XXX-XXXX" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">1800-XXX-XXXX</span>
            </a>

            {session ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {initial}
                  </div>
                  <span className="max-w-24 truncate">{name}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-gray-200 rounded-xl shadow-elevated z-30 py-1 animate-fade-in">
                    <Link
                      href="/my-bookings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-gray-400" />
                      My Bookings
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-semibold shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </Link>
            )}
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
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm font-medium text-gray-600 px-2 py-1.5" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link href="/search" className="text-sm font-medium text-gray-600 px-2 py-1.5" onClick={() => setMenuOpen(false)}>
                Book Tickets
              </Link>
              {session ? (
                <>
                  <Link href="/my-bookings" className="text-sm font-medium text-gray-600 px-2 py-1.5" onClick={() => setMenuOpen(false)}>
                    My Bookings
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); signOut() }}
                    className="text-left text-sm font-medium text-red-600 px-2 py-1.5"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-sm font-medium text-blue-600 px-2 py-1.5" onClick={() => setMenuOpen(false)}>
                  Sign In
                </Link>
              )}
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
