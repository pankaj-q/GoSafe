'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import NavHeader from '@/components/NavHeader'
import AdSlot from '@/components/AdSlot'
import {
  Bus, Clock, MapPin, Calendar, IndianRupee, Loader2, ChevronRight, Frown,
  Award, Ticket, Gift, TrendingUp, Flame, Route, Hotel, UtensilsCrossed, Camera, TrendingDown, BadgePercent,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface BookingItem {
  id: number
  referenceCode: string
  journeyDate: string
  passengerCount: number
  totalAmount: number
  status: string
  schedule: {
    departureTime: string
    arrivalTime: string
    baseFare: number
    bus: { busType: string }
    route: {
      source: { name: string }
      dest: { name: string }
    }
  }
}

interface ProfileStats {
  trips: number
  totalSpent: number
  citiesVisited: number
  points: number
  tier: { label: string; color: string }
  upcoming: BookingItem | null
  topSource: string
  popularRoutes: { source: string; dest: string; count: number }[]
}

const offers = [
  { code: 'MONSOON10', title: 'Flat 10% OFF', detail: 'On all intercity trips', bg: 'from-blue-600 to-indigo-600' },
  { code: 'GOFIRST20', title: '20% off your first trip', detail: 'New travellers only', bg: 'from-emerald-600 to-teal-600' },
  { code: 'WEEKEND5', title: 'Extra 5% off', detail: 'On weekend journeys', bg: 'from-violet-600 to-purple-600' },
]

function computeStats(bookings: BookingItem[]): ProfileStats {
  const fare = (b: BookingItem) => bookFare(b)
  const totalSpent = bookings.reduce((sum, b) => sum + fare(b), 0)
  const citiesVisited = new Set(bookings.map(b => b.schedule.route.dest.name)).size
  const trips = bookings.length
  const points = Math.floor(totalSpent / 10)

  let tier: { label: string; color: string }
  if (trips >= 10) tier = { label: 'Platinum Traveller', color: 'from-slate-600 to-slate-800' }
  else if (trips >= 5) tier = { label: 'Gold Traveller', color: 'from-amber-500 to-yellow-600' }
  else if (trips >= 2) tier = { label: 'Silver Traveller', color: 'from-gray-400 to-gray-600' }
  else tier = { label: 'Explorer', color: 'from-blue-500 to-indigo-600' }

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const confirmedFuture = bookings
    .filter(b => b.status === 'CONFIRMED' && new Date(b.journeyDate) >= todayStart)
    .sort((a, b) => new Date(a.journeyDate).getTime() - new Date(b.journeyDate).getTime())
  const upcoming = confirmedFuture[0] || null

  const routeCount = new Map<string, { source: string; dest: string; count: number }>()
  for (const b of bookings) {
    const key = `${b.schedule.route.source.name}-${b.schedule.route.dest.name}`
    const cur = routeCount.get(key)
    if (cur) cur.count++
    else routeCount.set(key, { source: b.schedule.route.source.name, dest: b.schedule.route.dest.name, count: 1 })
  }
  const popularRoutes = [...routeCount.values()].sort((a, b) => b.count - a.count).slice(0, 4)

  const sourceCount = new Map<string, number>()
  for (const b of bookings) {
    const s = b.schedule.route.source.name
    sourceCount.set(s, (sourceCount.get(s) || 0) + 1)
  }
  const topSource = [...sourceCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || ''

  return { trips, totalSpent, citiesVisited, points, tier, upcoming, topSource, popularRoutes }
}

function bookFare(b: BookingItem): number {
  return b.totalAmount || b.schedule.baseFare * b.passengerCount || 0
}

function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.max(0, Math.round((target.getTime() - today.getTime()) / 86400000))
}

function StatsCard({ icon: Icon, label, value, sub }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3">
      <div className="flex items-center gap-2 text-blue-100 text-xs">
        <Icon className="w-3.5 h-3.5" />
        <span className="opacity-90">{label}</span>
      </div>
      <div className="text-lg font-bold text-white mt-1">{value}</div>
      {sub ? <div className="text-[11px] text-blue-100/80 mt-0.5">{sub}</div> : null}
    </div>
  )
}

export default function MyBookingsPage() {
  const { data: session, status } = useSession()
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn()
      return
    }
    if (status !== 'authenticated') return

    fetch('/api/bookings/user')
      .then(res => res.json())
      .then(data => setBookings(data.bookings || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [status])

  const stats = computeStats(bookings)
  const upcoming = stats.upcoming
  const daysToGo = upcoming ? daysUntil(upcoming.journeyDate) : 0
  const destCity = upcoming?.schedule.route.dest.name || stats.topSource || 'India'

  function copyCode(code: string) {
    navigator.clipboard?.writeText(code).catch(() => {})
    setCopied(code)
    setTimeout(() => setCopied(null), 1500)
  }

  if (status === 'loading') {
    return (
      <>
        <NavHeader />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </>
    )
  }

  const name = session?.user?.name
  const initial = name?.[0]?.toUpperCase() || 'U'
  const firstTrip = bookings.length
    ? bookings[bookings.length - 1]
    : null

  return (
    <>
      <NavHeader />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="gosafe-container py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Account</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {name ? `Hello, ${name}` : 'Your booking history'}
              </p>
            </div>
            <Link href="/search" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Book New Ticket
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.length > 0 && (
                <section className="rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-6 text-white">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-xl font-bold shrink-0">
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-lg font-bold truncate">{name}</h2>
                        <p className="text-sm text-blue-100 mt-0.5">
                          {session?.user?.email || ''}
                          {firstTrip ? ` · Member since ${formatDate(firstTrip.journeyDate)}` : ''}
                        </p>
                      </div>
                      <div className="sm:ml-auto flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-1.5">
                        <Award className="w-4 h-4 text-yellow-300" />
                        <span className="text-sm font-semibold">{stats.tier.label}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                      <StatsCard icon={Bus} label="Total Trips" value={String(stats.trips)} />
                      <StatsCard icon={TrendingUp} label="Total Spent" value={formatCurrency(stats.totalSpent)} />
                      <StatsCard icon={MapPin} label="Cities Visited" value={String(stats.citiesVisited)} />
                      <StatsCard icon={Ticket} label="GoSafe Points" value={stats.points.toLocaleString('en-IN')} sub="1 pt per ₹10 spent" />
                    </div>
                  </div>
                </section>
              )}

              <AdSlot format="leaderboard" className="my-1" />

              {upcoming && (
                <section className="rounded-2xl border border-blue-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shrink-0">
                        <Flame className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                          Your next trip {daysToGo === 0 ? 'is today' : `in ${daysToGo} day${daysToGo > 1 ? 's' : ''}`}
                        </p>
                        <p className="font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                          {upcoming.schedule.route.source.name} → {upcoming.schedule.route.dest.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {formatDate(upcoming.journeyDate)} · {upcoming.schedule.departureTime}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/confirmation/${upcoming.id}`}
                      className="sm:ml-auto text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      View ticket <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </section>
              )}

              {upcoming && (
                <section className="rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 p-5 text-white shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                      <BadgePercent className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold">Plan your stay in {upcoming.schedule.route.dest.name}</p>
                      <p className="text-sm text-teal-50 mt-0.5">
                        Hotels from ₹999/night · Sightseeing tours · Local cabs
                      </p>
                      <p className="text-xs text-teal-100/80 mt-1">
                        Up to 25% off with code <span className="font-semibold bg-white/20 rounded px-1.5 py-0.5">STAY25</span>
                      </p>
                    </div>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(`hotels in ${upcoming.schedule.route.dest.name}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sm:ml-auto shrink-0 inline-flex items-center gap-1 text-sm font-semibold bg-white text-teal-700 rounded-lg px-4 py-2 hover:bg-teal-50 transition-colors"
                    >
                      Explore <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </section>
              )}

              {bookings.length > 0 && stats.popularRoutes.length > 0 && (
                <section className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">Save on your regular routes</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {stats.popularRoutes.slice(0, 4).map(r => (
                      <Link
                        key={`deal-${r.source}-${r.dest}`}
                        href={`/search?source=${encodeURIComponent(r.source)}&destination=${encodeURIComponent(r.dest)}`}
                        className="rounded-xl border border-dashed border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/10 p-4 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 hover:border-emerald-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{r.source} → {r.dest}</p>
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 rounded-full px-2 py-0.5">
                            Up to 12% off
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                          You travelled this {r.count} time{r.count > 1 ? 's' : ''} · Book again for member pricing
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <AdSlot format="rectangle" className="my-1" />

              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-blue-600" />
                    Offers for you
                  </h3>
                  <span className="text-xs text-gray-400 dark:text-gray-500">Tap a code to copy</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {offers.map(offer => (
                    <button
                      key={offer.code}
                      onClick={() => copyCode(offer.code)}
                      className={`rounded-xl bg-gradient-to-r ${offer.bg} p-5 text-left text-white shadow-sm hover:shadow-md transition-shadow`}
                    >
                      <p className="font-bold text-lg">{offer.title}</p>
                      <p className="text-xs text-white/90 mt-1">{offer.detail}</p>
                      <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold bg-white/20 backdrop-blur-sm rounded-md px-2.5 py-1 border border-white/30">
                        <Ticket className="w-3 h-3" />
                        {offer.code}
                        <span className="text-[10px] opacity-80">
                          {copied === offer.code ? 'Copied!' : 'Copy'}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {bookings.length > 0 && stats.popularRoutes.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Route className="w-4 h-4 text-blue-600" />
                      Your favourite routes
                    </h3>
                    <Link href="/search" className="text-xs font-medium text-blue-600 hover:text-blue-700">
                      See all trips
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {stats.popularRoutes.map(r => (
                      <Link
                        key={`${r.source}-${r.dest}`}
                        href={`/search?source=${encodeURIComponent(r.source)}&destination=${encodeURIComponent(r.dest)}`}
                        className="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-blue-100 transition-all p-4"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                          <Bus className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                            {r.source} → {r.dest}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            Travelled {r.count} time{r.count > 1 ? 's' : ''}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 ml-auto shrink-0" />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <AdSlot format="banner" />

              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">Experiences worth adding</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(`${destCity} hotels`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-blue-100 transition-all p-5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                      <Hotel className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm mt-3">Hotels & Stays</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {upcoming
                        ? `Verified stays near ${upcoming.schedule.route.dest.name}`
                        : stats.topSource
                          ? `Verified stays from ${stats.topSource}`
                          : 'Verified stays across 500+ cities'}
                    </p>
                  </a>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(`${destCity} restaurants`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-blue-100 transition-all p-5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                      <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm mt-3">Food & Cafés</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Local favourites and hidden gems at your destination</p>
                  </a>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(`${destCity} tourist attractions`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-blue-100 transition-all p-5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                      <Camera className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm mt-3">Tours & Activities</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {upcoming
                        ? `Tours in ${upcoming.schedule.route.dest.name}`
                        : 'Curated tours from chaperoned guides'}
                    </p>
                  </a>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">Booking History</h3>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{bookings.length} total</span>
                </div>
                {bookings.length === 0 ? (
                  <div className="text-center py-14 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <Frown className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">No bookings yet</p>
                    <Link href="/search" className="gosafe-btn gosafe-btn-primary">
                      Book Your First Ticket
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.map(booking => (
                      <Link
                        key={booking.id}
                        href={`/confirmation/${booking.id}`}
                        className="block bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-blue-100 transition-all p-4 sm:p-5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                              <Bus className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                                  {booking.schedule.route.source.name} → {booking.schedule.route.dest.name}
                                </span>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  booking.status === 'CONFIRMED' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' :
                                  booking.status === 'CANCELLED' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' :
                                  'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                                }`}>
                                  {booking.status}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(booking.journeyDate).toLocaleDateString('en-IN')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {booking.schedule.departureTime} - {booking.schedule.arrivalTime}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {booking.passengerCount} seat{booking.passengerCount > 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <div className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-0.5">
                                <IndianRupee className="w-3 h-3" />
                                {formatCurrency(booking.totalAmount)}
                              </div>
                              <div className="text-[10px] text-gray-400 dark:text-gray-500">Ref: {booking.referenceCode}</div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
    </>
  )
}