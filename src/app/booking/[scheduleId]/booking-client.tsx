'use client'

import { useState } from 'react'
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

function generateMockSeats(busType: string): Seat[] {
  const seats: Seat[] = []
  const isSleeper = busType.includes('SLEEPER')
  const isVolvo = busType === 'VOLVO_SLEEPER'

  if (isSleeper) {
    const rows = isVolvo ? 14 : 16
    for (let row = 0; row < rows; row++) {
      const rowNum = row + 1
      seats.push({ id: row * 4 + 1, seatNumber: `L${rowNum}`, seatType: 'LOWER', floor: 1, rowPos: row, colPos: 0, status: Math.random() > 0.3 ? 'AVAILABLE' : 'BOOKED' })
      seats.push({ id: row * 4 + 2, seatNumber: `U${rowNum}`, seatType: 'UPPER', floor: 2, rowPos: row, colPos: 0, status: Math.random() > 0.35 ? 'AVAILABLE' : 'BOOKED' })
      seats.push({ id: row * 4 + 3, seatNumber: `L${rowNum}A`, seatType: 'LOWER', floor: 1, rowPos: row, colPos: 2, status: Math.random() > 0.4 ? 'AVAILABLE' : 'BOOKED' })
      seats.push({ id: row * 4 + 4, seatNumber: `U${rowNum}A`, seatType: 'UPPER', floor: 2, rowPos: row, colPos: 2, status: Math.random() > 0.4 ? 'AVAILABLE' : 'BOOKED' })
    }
  } else {
    for (let row = 0; row < 20; row++) {
      const rowNum = row + 1
      seats.push({ id: row * 3 + 1, seatNumber: `W${rowNum}`, seatType: 'WINDOW', floor: 1, rowPos: row, colPos: 0, status: Math.random() > 0.25 ? 'AVAILABLE' : 'BOOKED' })
      seats.push({ id: row * 3 + 2, seatNumber: `M${rowNum}`, seatType: 'AISLE', floor: 1, rowPos: row, colPos: 1, status: Math.random() > 0.3 ? 'AVAILABLE' : 'BOOKED' })
      seats.push({ id: row * 3 + 3, seatNumber: `A${rowNum}`, seatType: 'AISLE', floor: 1, rowPos: row, colPos: 2, status: Math.random() > 0.4 ? 'AVAILABLE' : 'BOOKED' })
    }
  }

  return seats
}

const MOCK_BUS_DATA: Record<number, {
  operatorName: string
  busType: string
  busRating: number
  totalRatings: number
  departureTime: string
  arrivalTime: string
  durationMin: number
  baseFare: number
  source: string
  destination: string
  boardingPoints: { name: string; time: string }[]
  droppingPoints: { name: string; time: string }[]
}> = {
  1: {
    operatorName: 'Royal Travels',
    busType: 'AC_SLEEPER',
    busRating: 4.3,
    totalRatings: 234,
    departureTime: '22:00',
    arrivalTime: '07:30',
    durationMin: 570,
    baseFare: 899,
    source: 'Delhi',
    destination: 'Varanasi',
    boardingPoints: [
      { name: 'ISBT Kashmere Gate', time: '22:00' },
      { name: 'Anand Vihar', time: '22:20' },
      { name: 'DND Flyway', time: '22:35' },
    ],
    droppingPoints: [
      { name: 'Varanasi Junction', time: '07:00' },
      { name: 'Lanka (BHU)', time: '07:30' },
    ],
  },
}

export default function BookingClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const source = searchParams.get('source') || 'Delhi'
  const destination = searchParams.get('destination') || 'Varanasi'
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
  const scheduleId = Number(searchParams.get('scheduleId')) || 1

  const busData = MOCK_BUS_DATA[scheduleId] || MOCK_BUS_DATA[1]
  const [seats] = useState<Seat[]>(() => generateMockSeats(busData.busType))
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([])
  const [step, setStep] = useState(1)
  const [insuranceOpted, setInsuranceOpted] = useState(false)
  const [passengers, setPassengers] = useState<PassengerData[]>([{ name: '', age: 18, gender: 'MALE' }])
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const insurancePremium = 19
  const insuranceCoverage = 500000

  function handleSeatToggle(seatId: number) {
    setSelectedSeatIds(prev =>
      prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
    )
  }

  const selectedSeatsData = seats.filter(s => selectedSeatIds.includes(s.id))
  const selectedCount = selectedSeatIds.length
  const subtotal = busData.baseFare * selectedCount
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

  const [paying, setPaying] = useState(false)

  function handleRazorpayPayment() {
    setPaying(true)
    const params = new URLSearchParams(searchParams.toString())
    params.set('seats', selectedSeatsData.map(s => s.seatNumber).join(','))
    params.set('insurance', String(insuranceOpted))
    params.set('amount', String(total))
    router.push(`/confirmation/${scheduleId}?${params.toString()}`)
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
                      <div className="text-xs text-gray-500">{busData.operatorName} · {busData.departureTime} - {busData.arrivalTime}</div>
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

                  <div className="flex justify-between">
                    <button onClick={() => setStep(2)} className="gosafe-btn gosafe-btn-secondary"><ChevronLeft className="w-4 h-4" /> Back</button>
                    <button onClick={handleRazorpayPayment} disabled={paying} className="gosafe-btn gosafe-btn-primary text-base py-3 px-8">
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
                  departureTime={busData.departureTime}
                  arrivalTime={busData.arrivalTime}
                  durationMin={busData.durationMin}
                  baseFare={busData.baseFare}
                  seatCount={selectedCount}
                  selectedSeats={selectedSeatsData.map(s => s.seatNumber)}
                  insuranceOpted={insuranceOpted}
                  insuranceAmount={insurancePremium}
                  journeyDate={date}
                  source={source}
                  destination={destination}
                  rating={busData.busRating}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
