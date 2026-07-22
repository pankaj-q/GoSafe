'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NavHeader from '@/components/NavHeader'
import SeatLayout from '@/components/SeatLayout'
import PassengerForm from '@/components/PassengerForm'
import InsuranceSelector from '@/components/InsuranceSelector'
import BookingSummary from '@/components/BookingSummary'
import { CreditCard, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { PassengerData } from '@/lib/validations'

interface Seat {
  id: number
  seatNumber: string
  seatType: string
  floor: number
  rowPos: number
  colPos: number
  status: 'AVAILABLE' | 'BOOKED' | 'PENDING' | 'LOCKED'
  passengerName?: string
}

interface ScheduleData {
  schedule: { departureTime: string; arrivalTime: string; durationMin: number; baseFare: number }
  bus: { operatorName: string; busType: string; rating: number; totalRatings: number }
  seats: Seat[]
  boardingPoints: { name: string; time: string }[]
  droppingPoints: { name: string; time: string }[]
}

export default function BookingClient({ scheduleId }: { scheduleId: number }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const source = searchParams.get('source') || 'Delhi'
  const destination = searchParams.get('destination') || 'Varanasi'
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
  const seatIdsParam = searchParams.get('seats') || ''
  const initialSeatIds = seatIdsParam.split(',').map(Number).filter(Boolean)

  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/schedules/${scheduleId}/seats`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load schedule')
        return res.json()
      })
      .then(data => setScheduleData(data))
      .catch(err => {
        setError('Could not load booking data')
        console.error('Schedule fetch error:', err)
      })
      .finally(() => setLoading(false))
  }, [scheduleId])

  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>(initialSeatIds)
  const [step, setStep] = useState(1)
  const [insuranceOpted, setInsuranceOpted] = useState(false)
  const [passengers, setPassengers] = useState<PassengerData[]>([{ name: '', age: 18, gender: 'MALE' }])
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [paying, setPaying] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const insurancePremium = 19
  const insuranceCoverage = 500000

  if (loading) {
    return (
      <>
        <NavHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </>
    )
  }

  if (error || !scheduleData) {
    return (
      <>
        <NavHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-4">{error || 'Data not available'}</p>
            <button onClick={() => router.back()} className="text-blue-600 font-medium text-sm">Go back</button>
          </div>
        </div>
      </>
    )
  }

  const busData = scheduleData.bus
  const schedule = scheduleData.schedule
  const seats = scheduleData.seats

  function handleSeatToggle(seatId: number) {
    setSelectedSeatIds(prev =>
      prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
    )
  }

  const selectedSeatsData = seats.filter(s => selectedSeatIds.includes(s.id))
  const selectedCount = selectedSeatIds.length
  const subtotal = schedule.baseFare * selectedCount
  const gst = Math.round(subtotal * 0.05 * 100) / 100
  const total = subtotal + gst + (insuranceOpted ? insurancePremium : 0)

  function validateStep1(): boolean {
    if (selectedCount === 0) { setErrors({ seats: 'Please select at least one seat' }); return false }
    setErrors({}); return true
  }

  function validateStep2(): boolean {
    const errs: Record<string, string> = {}
    if (!contactName.trim()) errs.contactName = 'Enter your name'
    if (!/^[6-9]\d{9}$/.test(contactPhone)) errs.contactPhone = 'Enter valid 10-digit phone number'
    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) errs.contactEmail = 'Enter valid email'
    if (passengers.some(p => !p.name.trim() || !p.age || p.age < 1)) errs.passengers = 'Fill all passenger details'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handlePayment() {
    setPaying(true)
    try {
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduleId,
          journeyDate: date,
          contactName,
          contactPhone,
          contactEmail: contactEmail || undefined,
          insuranceOpted,
          passengers: passengers.filter(p => p.name.trim()),
          selectedSeatIds,
        }),
      })

      const bookingData = await bookingRes.json()
      if (!bookingRes.ok) {
        setErrors({ submit: bookingData.error || 'Failed to create booking' })
        setPaying(false)
        return
      }

      const params = new URLSearchParams({
        source, destination, date,
        seats: selectedSeatsData.map(s => s.seatNumber).join(','),
        amount: String(total),
        insurance: String(insuranceOpted),
        bookingId: String(bookingData.booking?.id || bookingData.booking?.referenceCode || ''),
      })

      router.push(`/confirmation/${scheduleId}?${params.toString()}`)
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again.' })
      setPaying(false)
    }
  }

  return (
    <>
      <NavHeader />
      <main className="min-h-screen bg-gray-50 pb-24">
        <div className="bg-white border-b border-gray-200">
          <div className="gosafe-container py-3">
            <div className="flex items-center gap-2 text-sm">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center gap-1.5 flex-1">
                  <div className={`flex items-center gap-1.5 ${step >= s ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
                    <span className="hidden sm:inline font-medium">{['Seats', 'Details', 'Pay'][s - 1]}</span>
                  </div>
                  {s < 3 && <div className={`flex-1 h-px ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="gosafe-container py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {step === 1 && (
                <div className="animate-fade-in">
                  <div className="gosafe-card p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-gray-900">Select Your Seats</h2>
                      <div className="text-xs text-gray-500">{busData.operatorName} · {schedule.departureTime} - {schedule.arrivalTime}</div>
                    </div>
                    <SeatLayout seats={seats} selectedSeats={selectedSeatIds} onSeatToggle={handleSeatToggle} />
                    {errors.seats && <p className="text-red-500 text-xs mt-2">{errors.seats}</p>}
                  </div>
                  <div className="flex justify-end mt-4">
                    <button onClick={() => { if (validateStep1()) setStep(2) }} className="gosafe-btn gosafe-btn-primary" disabled={selectedCount === 0}>
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-fade-in space-y-5">
                  <div className="gosafe-card p-5">
                    <h2 className="font-bold text-gray-900 mb-4">Contact Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="gosafe-label">Full Name</label>
                        <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Your name" className={`gosafe-input ${errors.contactName ? 'gosafe-input-error' : ''}`} />
                        {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>}
                      </div>
                      <div>
                        <label className="gosafe-label">Phone Number</label>
                        <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" className={`gosafe-input ${errors.contactPhone ? 'gosafe-input-error' : ''}`} />
                        {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>}
                      </div>
                      <div>
                        <label className="gosafe-label">Email (optional)</label>
                        <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="email@example.com" className={`gosafe-input ${errors.contactEmail ? 'gosafe-input-error' : ''}`} />
                        {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
                      </div>
                    </div>
                  </div>

                  <PassengerForm count={selectedCount} passengers={passengers} onChange={setPassengers} />
                  {errors.passengers && <p className="text-red-500 text-xs">{errors.passengers}</p>}

                  <InsuranceSelector opted={insuranceOpted} premium={insurancePremium} coverage={insuranceCoverage} onToggle={setInsuranceOpted} />

                  <div className="flex justify-between">
                    <button onClick={() => setStep(1)} className="gosafe-btn gosafe-btn-secondary"><ChevronLeft className="w-4 h-4" /> Back</button>
                    <button onClick={() => { if (validateStep2()) setStep(3) }} className="gosafe-btn gosafe-btn-primary">Continue <ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="animate-fade-in space-y-5">
                  <div className="gosafe-card p-5">
                    <h2 className="font-bold text-gray-900 mb-4">Review & Pay</h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Contact</span>
                        <span className="font-medium">{contactName} · {contactPhone}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Passengers</span>
                        <span className="font-medium">{passengers.filter(p => p.name).map(p => p.name).join(', ')}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Seats</span>
                        <span className="font-medium">{selectedSeatsData.map(s => s.seatNumber).join(', ')}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Insurance</span>
                        <span className="font-medium">{insuranceOpted ? formatCurrency(insurancePremium) : 'Not opted'}</span>
                      </div>
                    </div>
                  </div>

                  {errors.submit && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{errors.submit}</div>
                  )}

                  <div className="flex justify-between">
                    <button onClick={() => setStep(2)} className="gosafe-btn gosafe-btn-secondary"><ChevronLeft className="w-4 h-4" /> Back</button>
                    <button onClick={handlePayment} disabled={paying} className="gosafe-btn gosafe-btn-primary text-base py-3 px-8">
                      {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                      {paying ? 'Processing...' : `Pay ${formatCurrency(total)}`}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <BookingSummary
                  operatorName={busData.operatorName}
                  busType={busData.busType}
                  departureTime={schedule.departureTime}
                  arrivalTime={schedule.arrivalTime}
                  durationMin={schedule.durationMin}
                  baseFare={schedule.baseFare}
                  seatCount={selectedCount}
                  selectedSeats={selectedSeatsData.map(s => s.seatNumber)}
                  insuranceOpted={insuranceOpted}
                  insuranceAmount={insurancePremium}
                  journeyDate={date}
                  source={source}
                  destination={destination}
                  rating={busData.rating}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
