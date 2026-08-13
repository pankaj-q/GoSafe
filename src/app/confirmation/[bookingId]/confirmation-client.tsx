'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Bus, Download, Smartphone, Mail, ArrowRight, Loader2, FileText } from 'lucide-react'
import NavHeader from '@/components/NavHeader'
import { formatCurrency, formatDate } from '@/lib/utils'

function genRef() {
  return `GS${String(Math.floor(10000000 + Math.random() * 90000000))}`
}

interface BookingData {
  id: number
  referenceCode: string
  status: string
  totalAmount: number
  insuranceOpted: boolean
  journeyDate: string
  contactName: string
  source: string
  destination: string
  departureTime: string
  arrivalTime: string
  durationMin: number
  busType: string
  operatorName: string
  seatNumbers: string[]
  passengerNames: string[]
  paymentStatus: string | null
}

export default function ConfirmationClient({ bookingId }: { bookingId: string }) {
  const searchParams = useSearchParams()

  const source = searchParams.get('source') || ''
  const destination = searchParams.get('destination') || ''
  const date = searchParams.get('date') || ''
  const seats = searchParams.get('seats') || ''
  const total = searchParams.get('amount') || ''
  const insurance = searchParams.get('insurance') === 'true'
  const pdfUrl = bookingId ? `/api/bookings/${encodeURIComponent(bookingId)}/ticket` : ''

  const [refNo, setRefNo] = useState(bookingId ? '' : genRef())
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(Boolean(bookingId))
  const [pdfReady, setPdfReady] = useState(false)
  const [sentTo, setSentTo] = useState<{ email?: boolean; whatsapp?: boolean }>({})

  useEffect(() => {
    if (!bookingId) return

    fetch(`/api/bookings/${encodeURIComponent(bookingId)}`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.booking) {
          setBooking(data.booking)
          setRefNo(data.booking.referenceCode || genRef())
        } else {
          setRefNo(genRef())
        }
      })
      .catch(() => setRefNo(genRef()))
      .finally(() => setLoading(false))
  }, [bookingId])

  function handleSend(type: 'whatsapp' | 'email') {
    setSentTo(prev => ({ ...prev, [type]: true }))
  }

  const display = {
    source: source || booking?.source || 'Delhi',
    destination: destination || booking?.destination || 'Varanasi',
    date: date || (booking?.journeyDate ? booking.journeyDate.split('T')[0] : new Date().toISOString().split('T')[0]),
    seats: seats || booking?.seatNumbers?.join(', ') || '',
    amount: total || (booking ? String(booking.totalAmount) : '0'),
    insurance: insurance || booking?.insuranceOpted || false,
    departureTime: booking?.departureTime || '22:00',
    arrivalTime: booking?.arrivalTime || '07:30',
    durationMin: booking?.durationMin || 630,
    busType: booking?.busType ? booking.busType.replace(/_/g, ' ') : 'AC Sleeper',
    operatorName: booking?.operatorName || 'Royal Travels',
  }

  return (
    <>
      <NavHeader />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="gosafe-container py-8 sm:py-12">
          <div className="max-w-2xl mx-auto text-center mb-8 animate-fade-in">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-green-400/40 animate-celebrate-ring" />
              <div className="relative w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center animate-pop-in">
                <CheckCircle className="w-9 h-9 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Booking Confirmed!</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Your ticket has been booked successfully</p>
            <div className="mt-3 inline-block bg-blue-50 dark:bg-blue-500/10 px-4 py-2 rounded-lg">
              <span className="text-xs text-gray-500 dark:text-gray-400">Reference No.</span>
              <div className="text-lg font-bold text-blue-700 dark:text-blue-300 tracking-wider">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : refNo}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="animate-slide-up">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Your E-Ticket
                </h2>
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    download={`gosafe-${refNo || 'ticket'}.pdf`}
                    className="gosafe-btn gosafe-btn-primary text-xs py-2 px-3"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </a>
                )}
              </div>

              <div className="gosafe-card dark:bg-gray-900 dark:border-gray-800 overflow-hidden bg-white">
                {pdfUrl ? (
                  <iframe
                    src={pdfUrl}
                    title="E-Ticket PDF"
                    className="w-full h-[520px] sm:h-[560px]"
                    onLoad={() => setPdfReady(true)}
                  />
                ) : (
                  <div className="h-[520px] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
                    <FileText className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-400 dark:text-gray-500">PDF preview unavailable</p>
                  </div>
                )}
                {pdfUrl && !pdfReady && (
                  <div className="h-[520px] flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading your ticket…</p>
                  </div>
                )}
              </div>

              {pdfUrl && (
                <a
                  href={pdfUrl}
                  download={`gosafe-${refNo || 'ticket'}.pdf`}
                  className="block w-full gosafe-btn gosafe-btn-primary justify-center mt-3 py-3"
                >
                  <Download className="w-4 h-4" />
                  Download Ticket PDF
                </a>
              )}
            </div>

            <div className="space-y-4">
              <div className="gosafe-card dark:bg-gray-900 dark:border-gray-800 overflow-hidden animate-slide-up">
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
                      <div className="text-xl font-bold">{display.departureTime}</div>
                      <div className="text-[10px] text-blue-200">{display.source}</div>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="text-xs text-blue-200 text-center">
                        {Math.floor(display.durationMin / 60)}h {display.durationMin % 60}m
                      </div>
                      <div className="border-t border-blue-400 border-dashed relative my-1">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-300" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-300" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{display.arrivalTime}</div>
                      <div className="text-[10px] text-blue-200">{display.destination}</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Date</span>
                    <span className="font-medium text-gray-800 dark:text-gray-300">{formatDate(display.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Bus</span>
                    <span className="font-medium text-gray-800 dark:text-gray-300">{display.operatorName} · {display.busType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Seats</span>
                    <span className="font-medium text-gray-800 dark:text-gray-300">{display.seats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Insurance</span>
                    <span className={`font-medium ${display.insurance ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'}`}>
                      {display.insurance ? 'Covered ✓' : 'Not opted'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">Total Paid</span>
                    <span className="font-bold text-lg text-blue-600">{formatCurrency(Number(display.amount))}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSend('whatsapp')}
                  className={`gosafe-btn gosafe-btn-secondary justify-center ${sentTo.whatsapp ? 'border-green-400 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10' : ''}`}
                >
                  <Smartphone className="w-4 h-4" />
                  {sentTo.whatsapp ? 'Sent ✓' : 'WhatsApp'}
                </button>
                <button
                  onClick={() => handleSend('email')}
                  className={`gosafe-btn gosafe-btn-secondary justify-center ${sentTo.email ? 'border-green-400 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10' : ''}`}
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
        </div>
      </main>
    </>
  )
}
