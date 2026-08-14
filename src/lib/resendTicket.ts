import { prisma } from '@/lib/prisma'
import { generateTicketPDF } from '@/lib/pdf'
import { sendTicketEmail } from '@/lib/email'
import { sendWhatsAppMessage } from '@/lib/whatsapp'
import { lookupBooking } from '@/lib/cancelBooking'

export async function resendTicket(referenceCode: string, phone: string): Promise<{
  ok: boolean
  error?: string
  email?: { success: boolean; mock?: boolean; skipped?: boolean }
  whatsapp?: { success: boolean; mock?: boolean; skipped?: boolean }
  pdfGenerated?: boolean
}> {
  const booking = await lookupBooking(referenceCode, phone)
  if (!booking) {
    return { ok: false, error: 'Booking not found, or the phone number does not match this booking reference.' }
  }

  if (booking.status !== 'CONFIRMED' && booking.status !== 'PENDING') {
    return { ok: false, error: `This ticket is ${booking.status.toLowerCase()} and cannot be resent.` }
  }

  const dbBooking = await prisma.booking.findUnique({
    where: { id: booking.id },
    include: {
      schedule: {
        include: {
          bus: { include: { operator: true } },
          route: { include: { source: true, dest: true } },
          seats: { select: { id: true, seatNumber: true } },
          boardingPoints: { orderBy: { sortOrder: 'asc' } },
        },
      },
      passengers: true,
    },
  })

  if (!dbBooking) {
    return { ok: false, error: 'Booking record could not be loaded.' }
  }

  const schedule = dbBooking.schedule
  const seatIdToNumber = new Map(schedule.seats.map(s => [s.id, s.seatNumber]))
  const seatNumbers = dbBooking.passengers.map(p => seatIdToNumber.get(p.seatId) ?? String(p.seatId))

  const boardingPoints = schedule.boardingPoints
    .filter(bp => bp.type === 'BOARDING')
    .map(bp => ({ name: bp.name, time: bp.time }))
  const droppingPoints = schedule.boardingPoints
    .filter(bp => bp.type === 'DROPPING')
    .map(bp => ({ name: bp.name, time: bp.time }))

  let pdfBuffer: Buffer | undefined
  try {
    pdfBuffer = await generateTicketPDF({
      referenceCode: booking.referenceCode,
      operatorName: booking.operatorName,
      busType: booking.busType,
      busNumber: schedule.bus.busNumber,
      source: booking.source,
      destination: booking.destination,
      departureTime: booking.departureTime,
      arrivalTime: booking.arrivalTime,
      journeyDate: booking.journeyDate.toISOString(),
      passengers: dbBooking.passengers.map((p, i) => ({
        name: p.name,
        age: p.age,
        gender: p.gender,
        seat: seatNumbers[i],
      })),
      totalAmount: booking.totalAmount,
      insuranceOpted: booking.insuranceOpted,
      contactName: booking.contactName,
      contactPhone: booking.contactPhone,
      boardingPoints,
      droppingPoints,
    })
  } catch (err) {
    console.error('[Resend] PDF generation failed:', err)
  }

  const emailPromise = booking.contactEmail
    ? sendTicketEmail({
        to: booking.contactEmail,
        referenceCode: booking.referenceCode,
        operatorName: booking.operatorName,
        source: booking.source,
        destination: booking.destination,
        departureTime: booking.departureTime,
        arrivalTime: booking.arrivalTime,
        journeyDate: booking.journeyDate.toISOString(),
        passengerNames: booking.passengerNames,
        seatNumbers,
        totalAmount: booking.totalAmount,
        pdfBuffer,
      }).catch(() => ({ success: false, error: 'Email failed' }))
    : Promise.resolve({ success: true, skipped: true })

  const whatsappPromise = sendWhatsAppMessage({
    to: booking.contactPhone,
    referenceCode: booking.referenceCode,
    operatorName: booking.operatorName,
    source: booking.source,
    destination: booking.destination,
    departureTime: booking.departureTime,
    arrivalTime: booking.arrivalTime,
    journeyDate: booking.journeyDate.toISOString(),
    seatNumbers,
    passengerNames: booking.passengerNames,
    totalAmount: booking.totalAmount,
  }).catch(() => ({ success: false, error: 'WhatsApp failed' }))

  const [email, whatsapp] = await Promise.all([emailPromise, whatsappPromise])

  return { ok: true, email, whatsapp, pdfGenerated: Boolean(pdfBuffer) }
}

export interface BookingContact {
  email: string | null
}

export async function bookingContact(referenceCode: string): Promise<BookingContact | null> {
  const booking = await prisma.booking.findUnique({
    where: { referenceCode },
    select: { contactEmail: true },
  })
  return booking ? { email: booking.contactEmail } : null
}