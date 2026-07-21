'use client'

import { Bus, Clock, Star } from 'lucide-react'
import { BUS_TYPE_LABELS } from '@/lib/constants'
import { formatCurrency, formatDate } from '@/lib/utils'

interface BookingSummaryProps {
  operatorName: string
  busType: string
  departureTime: string
  arrivalTime: string
  durationMin: number
  baseFare: number
  seatCount: number
  selectedSeats: string[]
  insuranceOpted: boolean
  insuranceAmount: number
  journeyDate: string
  source: string
  destination: string
  rating: number
}

export default function BookingSummary({
  operatorName, busType, departureTime, arrivalTime, durationMin,
  baseFare, seatCount, selectedSeats, insuranceOpted, insuranceAmount,
  journeyDate, source, destination, rating
}: BookingSummaryProps) {
  const subtotal = baseFare * seatCount
  const gst = Math.round(subtotal * 0.05 * 100) / 100
  const total = subtotal + gst + (insuranceOpted ? insuranceAmount : 0)

  return (
    <div className="gosafe-card p-5 space-y-4">
      <h3 className="font-semibold text-gray-900 text-sm">Booking Summary</h3>

      {/* Bus info */}
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
          <Bus className="w-5 h-5 text-blue-600" />
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm text-gray-900 truncate">{operatorName}</div>
          <div className="text-xs text-gray-500">{BUS_TYPE_LABELS[busType] || busType}</div>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-semibold">{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Journey details */}
      <div className="flex items-center gap-2 text-sm pb-3 border-b border-gray-100">
        <div className="text-center">
          <div className="font-bold text-gray-900">{departureTime}</div>
          <div className="text-[10px] text-gray-500">{source}</div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <Clock className="w-3 h-3 text-gray-400" />
          <div className="text-[10px] text-gray-500">{Math.floor(durationMin / 60)}h {durationMin % 60}m</div>
          <div className="w-full h-px bg-gray-200" />
        </div>
        <div className="text-center">
          <div className="font-bold text-gray-900">{arrivalTime}</div>
          <div className="text-[10px] text-gray-500">{destination}</div>
        </div>
      </div>

      {/* Date & seats */}
      <div className="text-sm space-y-1.5 pb-3 border-b border-gray-100">
        <div className="flex justify-between">
          <span className="text-gray-500">Date</span>
          <span className="font-medium text-gray-800">{formatDate(journeyDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Seats</span>
          <span className="font-medium text-gray-800">{selectedSeats.join(', ')} ({seatCount})</span>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="text-sm space-y-1.5">
        <div className="flex justify-between">
          <span className="text-gray-500">Base Fare × {seatCount}</span>
          <span className="text-gray-700">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">GST (5%)</span>
          <span className="text-gray-700">{formatCurrency(gst)}</span>
        </div>
        {insuranceOpted && (
          <div className="flex justify-between">
            <span className="text-gray-500">Insurance</span>
            <span className="text-gray-700">{formatCurrency(insuranceAmount)}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <span className="font-bold text-gray-900">Total Amount</span>
          <span className="font-bold text-lg text-blue-600">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  )
}
