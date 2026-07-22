'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Bus, Download, Smartphone, Mail, ArrowRight, Loader2 } from 'lucide-react'
import NavHeader from '@/components/NavHeader'
import { formatCurrency, formatDate } from '@/lib/utils'

function genRef() {
  return `GS${String(Math.floor(10000000 + Math.random() * 90000000))}`
}

export default function ConfirmationClient() {
  const searchParams = useSearchParams()

  const source = searchParams.get('source') || 'Delhi'
  const destination = searchParams.get('destination') || 'Varanasi'
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
  const seats = searchParams.get('seats') || ''
  const total = searchParams.get('amount') || '0'
  const insurance = searchParams.get('insurance') === 'true'
  const bookingId = searchParams.get('bookingId') || ''

  const [refNo, setRefNo] = useState(bookingId ? '' : genRef())
  const [loading, setLoading] = useState(Boolean(bookingId))
  const [sentTo, setSentTo] = useState<{ email?: boolean; whatsapp?: boolean }>({})

  useEffect(() => {
    if (!bookingId) return

    fetch(`/api/bookings/user`)
      .then(res => res.json())
      .then(data => {
        const booking = data.bookings?.find((b: { id: number; referenceCode: string }) =>
          String(b.id) === bookingId || b.referenceCode === bookingId
        )
        if (booking?.referenceCode) setRefNo(booking.referenceCode)
        else setRefNo(genRef())
      })
      .catch(() => setRefNo(genRef()))
      .finally(() => setLoading(false))
  }, [bookingId])

  function handleSend(type: 'whatsapp' | 'email') {
    setSentTo(prev => ({ ...prev, [type]: true }))
  }

  return (
    <>
      <NavHeader />
      <main className="min-h-screen bg-gray-50">
        <div className="gosafe-container py-8 sm:py-12">
          <div className="max-w-lg mx-auto text-center mb-8 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-9 h-9 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Booking Confirmed!</h1>
            <p className="text-gray-500 text-sm">Your ticket has been booked successfully</p>
            <div className="mt-3 inline-block bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-xs text-gray-500">Reference No.</span>
              <div className="text-lg font-bold text-blue-700 tracking-wider">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : refNo}
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto gosafe-card overflow-hidden animate-slide-up">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Bus className="w-5 h-5" />
                  <span className="font-bold">GoSafe</span>
                </div>
                <span className="text-xs text-blue-200">e-Ticket</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-xl font-bold">{'22:00'}</div>
                  <div className="text-[10px] text-blue-200">{source}</div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="text-xs text-blue-200 text-center">10h 30m</div>
                  <div className="border-t border-blue-400 border-dashed relative my-1">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-300" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-300" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{'07:30'}</div>
                  <div className="text-[10px] text-blue-200">{destination}</div>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-800">{formatDate(date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Bus</span>
                <span className="font-medium text-gray-800">Royal Travels · AC Sleeper</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Seats</span>
                <span className="font-medium text-gray-800">{seats}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Insurance</span>
                <span className={`font-medium ${insurance ? 'text-green-600' : 'text-gray-500'}`}>
                  {insurance ? 'Covered ✓' : 'Not opted'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-900">Total Paid</span>
                <span className="font-bold text-lg text-blue-600">{formatCurrency(Number(total))}</span>
              </div>
            </div>

            <div className="px-5 pb-5 flex justify-center">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <span className="text-[8px] text-gray-400 text-center leading-tight">QR Code<br/>(PDF)</span>
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto mt-6 space-y-3">
            <button className="w-full gosafe-btn gosafe-btn-primary py-3">
              <Download className="w-4 h-4" />
              Download Ticket PDF
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSend('whatsapp')}
                className={`gosafe-btn gosafe-btn-secondary justify-center ${sentTo.whatsapp ? 'border-green-400 text-green-700 bg-green-50' : ''}`}
              >
                <Smartphone className="w-4 h-4" />
                {sentTo.whatsapp ? 'Sent ✓' : 'WhatsApp'}
              </button>
              <button
                onClick={() => handleSend('email')}
                className={`gosafe-btn gosafe-btn-secondary justify-center ${sentTo.email ? 'border-green-400 text-green-700 bg-green-50' : ''}`}
              >
                <Mail className="w-4 h-4" />
                {sentTo.email ? 'Sent ✓' : 'Email'}
              </button>
            </div>

            <Link href="/" className="block w-full gosafe-btn gosafe-btn-secondary justify-center">
              <ArrowRight className="w-4 h-4" />
              Book Another Ticket
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
