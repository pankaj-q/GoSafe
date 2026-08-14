import { prisma } from '@/lib/prisma'
import { createStripeRefund } from '@/lib/stripe'
import { createRazorpayRefund } from '@/lib/razorpay'

export interface BookingLookup {
  id: number
  referenceCode: string
  status: string
  totalAmount: number
  insuranceOpted: boolean
  insuranceAmount: number
  journeyDate: Date
  contactName: string
  contactPhone: string
  contactEmail: string | null
  source: string
  destination: string
  departureTime: string
  arrivalTime: string
  busType: string
  operatorName: string
  seatNumbers: string[]
  passengerNames: string[]
  paymentStatus: string | null
  paymentId: string | null
  gateway: string | null
}

export async function lookupBooking(referenceCode: string, phone: string): Promise<BookingLookup | null> {
  const booking = await prisma.booking.findFirst({
    where: { referenceCode: referenceCode.trim().toUpperCase() },
    include: {
      schedule: {
        include: {
          bus: { include: { operator: true } },
          route: { include: { source: true, dest: true } },
          seats: { select: { id: true, seatNumber: true } },
        },
      },
      passengers: true,
      payments: true,
    },
  })

  if (!booking) return null
  if (booking.contactPhone.replace(/[^0-9]/g, '') !== phone.replace(/[^0-9]/g, '')) return null

  const seatIdToNumber = new Map(booking.schedule.seats.map(s => [s.id, s.seatNumber]))
  const payment = booking.payments[0]

  return {
    id: booking.id,
    referenceCode: booking.referenceCode,
    status: booking.status,
    totalAmount: booking.totalAmount,
    insuranceOpted: booking.insuranceOpted,
    insuranceAmount: booking.insuranceAmount,
    journeyDate: booking.journeyDate,
    contactName: booking.contactName,
    contactPhone: booking.contactPhone,
    contactEmail: booking.contactEmail,
    source: booking.schedule.route.source.name,
    destination: booking.schedule.route.dest.name,
    departureTime: booking.schedule.departureTime,
    arrivalTime: booking.schedule.arrivalTime,
    busType: booking.schedule.bus.busType.replace(/_/g, ' '),
    operatorName: booking.schedule.bus.operator.name,
    seatNumbers: booking.passengers.map(p => seatIdToNumber.get(p.seatId) ?? String(p.seatId)),
    passengerNames: booking.passengers.map(p => p.name),
    paymentStatus: payment?.status ?? null,
    paymentId: payment?.stripePaymentId || payment?.razorpayPaymentId || null,
    gateway: payment?.stripeSessionId ? 'stripe' : payment?.razorpayOrderId ? 'razorpay' : null,
  }
}

export interface CancellationSummary {
  refundPercent: number
  refundAmount: number
  feeAmount: number
  policy: string
}

export function computeCancellation(booking: Pick<BookingLookup, 'journeyDate' | 'departureTime' | 'totalAmount'>): CancellationSummary {
  const [hour, minute] = booking.departureTime.split(':').map(Number)
  const departure = new Date(booking.journeyDate)
  departure.setHours(hour, minute, 0, 0)

  const hoursUntil = (departure.getTime() - Date.now()) / (1000 * 60 * 60)

  let refundPercent: number
  let policy: string
  if (hoursUntil > 6) {
    refundPercent = 90
    policy = 'More than 6 hours before departure → 90% refund.'
  } else if (hoursUntil > 2) {
    refundPercent = 50
    policy = 'Between 2 and 6 hours before departure → 50% refund.'
  } else {
    refundPercent = 0
    policy = 'Within 2 hours of departure → non-refundable.'
  }

  const feeAmount = Math.round(booking.totalAmount * (100 - refundPercent) / 100)
  const refundAmount = Math.round(booking.totalAmount * refundPercent / 100)

  return { refundPercent, refundAmount, feeAmount, policy }
}

/**
 * Cancel a confirmed/pending booking and trigger a gateway refund.
 * Requires an OTP already verified for the booking's phone.
 */
export async function cancelBooking(referenceCode: string, phone: string): Promise<{
  ok: boolean
  error?: string
  booking?: BookingLookup
  cancellation?: CancellationSummary
  refund?: { refundId?: string; status: string; mock?: boolean }
}> {
  const booking = await lookupBooking(referenceCode, phone)
  if (!booking) {
    return { ok: false, error: 'Booking not found, or the phone number does not match this booking reference.' }
  }

  if (booking.status === 'CANCELLED') {
    return { ok: false, error: 'This booking is already cancelled.' }
  }

  const cancellation = computeCancellation(booking)

  const flipped = await prisma.booking.updateMany({
    where: { id: booking.id, status: { not: 'CANCELLED' } },
    data: { status: 'CANCELLED' },
  })

  if (flipped.count !== 1) {
    return { ok: false, error: 'This booking could not be cancelled right now. Please try again or contact support.' }
  }

  let refund: { refundId?: string; status: string; mock?: boolean } | undefined

  if (cancellation.refundAmount > 0 && booking.paymentId) {
    try {
      if (booking.gateway === 'stripe') {
        const r = await createStripeRefund({
          paymentId: booking.paymentId,
          amountPaise: cancellation.refundAmount * 100,
          reason: 'requested_by_customer',
          referenceCode: booking.referenceCode,
        })
        refund = { refundId: r.refundId, status: r.status, mock: r.mock }
      } else if (booking.gateway === 'razorpay') {
        const r = await createRazorpayRefund({
          paymentId: booking.paymentId,
          amount: cancellation.refundAmount * 100,
          notes: { referenceCode: booking.referenceCode, bookingId: String(booking.id) },
        })
        refund = { refundId: r.id, status: r.status, mock: r.mock }
      } else {
        refund = { status: 'PROCESSING' }
      }
    } catch (err) {
      console.error('[Cancel] Refund failed:', err)
      refund = { status: 'FAILED', mock: true }
    }
  } else {
    refund = { status: 'NONE' }
  }

  return { ok: true, booking, cancellation, refund }
}