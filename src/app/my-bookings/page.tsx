'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import NavHeader from '@/components/NavHeader'
import { Bus, Clock, MapPin, Calendar, IndianRupee, Loader2, ChevronRight, Frown } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

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

export default function MyBookingsPage() {
  const { data: session, status } = useSession()
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(true)

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

  if (status === 'loading') {
    return (
      <>
        <NavHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </>
    )
  }

  return (
    <>
      <NavHeader />
      <main className="min-h-screen bg-gray-50">
        <div className="gosafe-container py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-sm text-gray-500 mt-1">
                {session?.user?.name ? `Hello, ${session.user.name}` : 'Your booking history'}
              </p>
            </div>
            <Link
              href="/search"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Book New Ticket
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20">
              <Frown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-4">No bookings yet</p>
              <Link
                href="/search"
                className="gosafe-btn gosafe-btn-primary"
              >
                Book Your First Ticket
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map(booking => (
                <Link
                  key={booking.id}
                  href={`/confirmation/${booking.id}`}
                  className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all p-4 sm:p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                        <Bus className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 text-sm truncate">
                            {booking.schedule.route.source.name} → {booking.schedule.route.dest.name}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                            booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
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
                        <div className="text-sm font-bold text-gray-900 flex items-center gap-0.5">
                          <IndianRupee className="w-3 h-3" />
                          {formatCurrency(booking.totalAmount)}
                        </div>
                        <div className="text-[10px] text-gray-400">Ref: {booking.referenceCode}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
