'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Wifi, BatteryCharging, Droplets, Camera, ChevronDown, ArmchairIcon } from 'lucide-react'
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
  'Charging Port': <BatteryCharging className="w-3 h-3" />,
  'WiFi': <Wifi className="w-3 h-3" />,
  'Water Bottle': <Droplets className="w-3 h-3" />,
  'CCTV': <Camera className="w-3 h-3" />,
}

export default function BusCard(props: BusCardProps) {
  const { scheduleId, operatorName, busType, busRating, totalRatings, busImages, amenities, departureTime, arrivalTime, durationMin, baseFare, availableSeats, totalSeats, boardingPoints, droppingPoints, queryString } = props
  const [showPoints, setShowPoints] = useState(false)

  const seatPercent = availableSeats / totalSeats
  const seatStatus = seatPercent > 0.3 ? 'good' : seatPercent > 0.1 ? 'low' : 'critical'

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 overflow-hidden group">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Left — Operator & Image */}
          <div className="sm:w-44 shrink-0">
            <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm">
                {operatorName.charAt(0)}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">{operatorName}</h3>
                <span className="inline-block mt-0.5 text-[10px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                  {BUS_TYPE_LABELS[busType] || busType.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold text-gray-800">{busRating.toFixed(1)}</span>
                  <span className="text-[10px] text-gray-400">({totalRatings})</span>
                </div>
              </div>
            </div>

            {/* Thumbnail strip */}
            {busImages.length > 0 && (
              <div className="hidden sm:flex gap-1 mt-2">
                {busImages.slice(0, 3).map((img, i) => (
                  <div key={i} className="w-12 h-9 rounded-md overflow-hidden bg-gray-100 relative">
                    <Image src={img.url} alt="" fill className="object-cover" sizes="48px" />
                  </div>
                ))}
                {busImages.length > 3 && (
                  <div className="w-12 h-9 rounded-md bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-500">
                    +{busImages.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Center — Timeline + Amenities */}
          <div className="flex-1 min-w-0">
            {/* Timeline */}
            <div className="flex items-center gap-3">
              <div className="text-center min-w-[70px]">
                <div className="text-xl font-bold text-gray-900 leading-none">{departureTime}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Departure</div>
              </div>
              <div className="flex-1 flex flex-col items-center px-2">
                <div className="text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
                  {Math.floor(durationMin / 60)}h {durationMin % 60}m
                </div>
                <div className="w-full flex items-center gap-1 my-0.5">
                  <div className="w-2 h-2 rounded-full border-2 border-blue-500 bg-white shrink-0" />
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  </div>
                  <div className="w-2 h-2 rounded-full border-2 border-blue-500 bg-white shrink-0" />
                </div>
              </div>
              <div className="text-center min-w-[70px]">
                <div className="text-xl font-bold text-gray-900 leading-none">{arrivalTime}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Arrival</div>
              </div>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {amenities.slice(0, 5).map(a => (
                  <span key={a} className="inline-flex items-center gap-1 text-[10px] text-gray-600 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                    {amenityIcons[a] || <ArmchairIcon className="w-3 h-3" />}
                    {a}
                  </span>
                ))}
                {amenities.length > 5 && (
                  <span className="text-[10px] text-blue-600 font-medium px-2 py-1">+{amenities.length - 5}</span>
                )}
              </div>
            )}

            {/* Boarding/Dropping points toggle */}
            {(boardingPoints && boardingPoints.length > 0) && (
              <button
                onClick={() => setShowPoints(!showPoints)}
                className="mt-2 flex items-center gap-1 text-[11px] text-gray-500 hover:text-blue-600 transition-colors"
              >
                <MapPin className="w-3 h-3" />
                {showPoints ? 'Hide' : 'View'} boarding & dropping points
                <ChevronDown className={`w-3 h-3 transition-transform ${showPoints ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>

          {/* Right — Price + Select Seat */}
          <div className="sm:w-36 shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-3 border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(baseFare)}</div>
              <div className="text-[10px] text-gray-400 -mt-0.5">per seat</div>
              <div className={`text-[10px] font-medium mt-1 ${
                seatStatus === 'critical' ? 'text-red-500' : seatStatus === 'low' ? 'text-amber-500' : 'text-green-600'
              }`}>
                {availableSeats === 0 ? 'Sold Out' : `${availableSeats} seats`}
              </div>
            </div>
            <Link
              href={`/booking/${scheduleId}?${queryString || ''}`}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-center transition-all ${
                availableSeats === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md active:scale-[0.97]'
              }`}
              aria-label={`Select seats for ${operatorName}`}
            >
              {availableSeats === 0 ? 'Sold Out' : 'Select Seat'}
            </Link>
          </div>
        </div>

        {/* Expanded boarding/dropping points */}
        {showPoints && (
          <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-fade-in">
            {boardingPoints && boardingPoints.length > 0 && (
              <div>
                <div className="font-semibold text-gray-800 mb-1.5 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Boarding Points
                </div>
                <div className="space-y-1.5">
                  {boardingPoints.map((bp, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="font-medium text-gray-500 w-12 shrink-0">{bp.time}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                      <span className="text-gray-700">{bp.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {droppingPoints && droppingPoints.length > 0 && (
              <div>
                <div className="font-semibold text-gray-800 mb-1.5 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  Dropping Points
                </div>
                <div className="space-y-1.5">
                  {droppingPoints.map((dp, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="font-medium text-gray-500 w-12 shrink-0">{dp.time}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                      <span className="text-gray-700">{dp.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
