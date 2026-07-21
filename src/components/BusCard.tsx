'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ChevronRight, BatteryCharging, Wifi, Droplets, Camera, MapPin, Bus as BusIcon } from 'lucide-react'
import { BUS_TYPE_LABELS } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'

interface BusCardProps {
  scheduleId: number
  operatorName: string
  busType: string
  busRating: number
  totalRatings: number
  busImages: { url: string; altText?: string | null }[]
  amenities: string[]
  departureTime: string
  arrivalTime: string
  durationMin: number
  baseFare: number
  availableSeats: number
  totalSeats: number
  boardingPoints?: { name: string; time: string }[]
  droppingPoints?: { name: string; time: string }[]
  queryString?: string
}

const amenityIcons: Record<string, React.ReactNode> = {
  'Charging Port': <BatteryCharging className="w-3.5 h-3.5" />,
  'WiFi': <Wifi className="w-3.5 h-3.5" />,
  'Water Bottle': <Droplets className="w-3.5 h-3.5" />,
  'CCTV': <Camera className="w-3.5 h-3.5" />,
}

export default function BusCard({
  scheduleId, operatorName, busType, busRating, totalRatings,
  busImages, amenities, departureTime, arrivalTime, durationMin,
  baseFare, availableSeats, totalSeats, boardingPoints, droppingPoints, queryString
}: BusCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const seatPercent = availableSeats / totalSeats
  const seatStatus = seatPercent > 0.3 ? 'good' : seatPercent > 0.1 ? 'low' : 'critical'

  return (
    <div className="gosafe-card overflow-hidden animate-fade-in">
      <div className="p-4 sm:p-5">
        {/* Bus Images Gallery */}
        {busImages.length > 0 && (
          <div className="relative mb-3 rounded-lg overflow-hidden bg-gray-100">
            <div className="flex gap-0 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
              {busImages.map((img, i) => (
                <div key={i} className="snap-start shrink-0 w-full sm:w-48 h-28 relative overflow-hidden">
                  <Image
                    src={img.url}
                    alt={img.altText || `${operatorName} bus`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 192px"
                  />
                </div>
              ))}
            </div>
            {busImages.length > 1 && (
              <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                1/{busImages.length}
              </div>
            )}
          </div>
        )}

        {/* Operator & Type Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
              {operatorName.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{operatorName}</h3>
              <span className="gosafe-badge gosafe-badge-primary text-[10px]">
                {BUS_TYPE_LABELS[busType] || busType.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold">{busRating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">({totalRatings})</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-3 mb-3 bg-gray-50 rounded-lg p-3">
          <div className="text-center min-w-[60px]">
            <div className="text-lg font-bold text-gray-900">{departureTime}</div>
            <div className="text-[10px] text-gray-500">Departure</div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="text-xs text-gray-500 font-medium">{Math.floor(durationMin / 60)}h {durationMin % 60}m</div>
            <div className="w-full h-px bg-gray-300 relative my-1">
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between">
                <div className="w-2 h-2 rounded-full bg-gray-400" />
                <div className="w-2 h-2 rounded-full bg-gray-400" />
              </div>
            </div>
            <div className="flex justify-between w-full text-[10px] text-gray-400">
              <span className="truncate max-w-[80px]">Delhi</span>
              <span className="truncate max-w-[80px]">Varanasi</span>
            </div>
          </div>
          <div className="text-center min-w-[60px]">
            <div className="text-lg font-bold text-gray-900">{arrivalTime}</div>
            <div className="text-[10px] text-gray-500">Arrival</div>
          </div>
        </div>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {amenities.slice(0, 6).map(a => (
              <span key={a} className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                {amenityIcons[a] || <BusIcon className="w-3 h-3" />}
                {a}
              </span>
            ))}
            {amenities.length > 6 && (
              <span className="text-[11px] text-blue-600 font-medium">+{amenities.length - 6} more</span>
            )}
          </div>
        )}

        {/* Price & Seat Availability Row */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-gray-900">{formatCurrency(baseFare)}</span>
            <span className="text-xs text-gray-500 ml-1">per seat</span>
            <div className={`text-xs font-medium mt-0.5 ${
              seatStatus === 'critical' ? 'text-red-500' : seatStatus === 'low' ? 'text-amber-500' : 'text-green-600'
            }`}>
              {availableSeats === 0 ? 'Sold Out' : `${availableSeats} seats left`}
            </div>
          </div>

          <Link
            href={`/booking/${scheduleId}?${queryString || ''}`}
            className="gosafe-btn gosafe-btn-primary text-sm"
            aria-label={`Book bus ${operatorName}`}
          >
            {availableSeats === 0 ? 'Sold Out' : 'Book Now'}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Boarding/Dropping Toggle */}
        {(boardingPoints && boardingPoints.length > 0) && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-2 w-full text-xs text-gray-500 hover:text-blue-600 py-1.5 flex items-center justify-center gap-1 transition-colors"
          >
            <MapPin className="w-3 h-3" />
            {showDetails ? 'Hide boarding points' : 'View boarding & dropping points'}
          </button>
        )}

        {showDetails && (
          <div className="mt-2 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-fade-in">
            {boardingPoints && boardingPoints.length > 0 && (
              <div>
                <div className="font-semibold text-gray-800 mb-1.5 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Boarding Points
                </div>
                {boardingPoints.map((bp, i) => (
                  <div key={i} className="flex items-center gap-2 py-1">
                    <span className="font-medium text-gray-600 w-10">{bp.time}</span>
                    <span className="text-gray-700">{bp.name}</span>
                  </div>
                ))}
              </div>
            )}
            {droppingPoints && droppingPoints.length > 0 && (
              <div>
                <div className="font-semibold text-gray-800 mb-1.5 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  Dropping Points
                </div>
                {droppingPoints.map((dp, i) => (
                  <div key={i} className="flex items-center gap-2 py-1">
                    <span className="font-medium text-gray-600 w-10">{dp.time}</span>
                    <span className="text-gray-700">{dp.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
