import { prisma } from '@/lib/prisma'
import { generateTicketPDF } from '@/lib/pdf'
import { sendTicketEmail } from '@/lib/email'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

/**
 * Confirm a booking as paid and deliver notifications (PDF + email + WhatsApp).
 * Safe to call more than once — it checks the current status first.
 */
export async function confirmPaidBooking(bookingId: number) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      schedule: {
        include: {
          bus: { include: { operator: true } },
          route: { include: { source: true, dest: true } },
          seats: { select: { id: true, seatNumber: true } },
          boardingPoints: {
            orderBy: { sortOrder: 'asc' },
            select: { name: true, time: true, address: true, type: true },
          },
        },
      },
      passengers: true,
    },
  })

  if (!booking) {
    throw new Error('Booking not found')
  }

  // Atomic status flip acts as a one-time gate: only the caller that transitions
  // PENDING → CONFIRMED delivers the ticket. Webhook replays / double-confirm
  // calls become no-ops so email + WhatsApp are never sent twice.
  const flipped = await prisma.booking.updateMany({
    where: { id: booking.id, status: 'PENDING' },
    data: { status: 'CONFIRMED' },
  })

  const justConfirmed = flipped.count === 1

  // Idempotent re-entry: already confirmed → return without re-sending anything.
  if (!justConfirmed && booking.status === 'CONFIRMED') {
    return { booking, alreadyConfirmed: true, email: { success: true, skipped: true }, whatsapp: { success: true, skipped: true } }
  }

  // Edge: booking is CANCELLED or in another non-PENDING state — never resurrect.
  if (booking.status !== 'PENDING') {
    return { booking, alreadyConfirmed: true, email: { success: true, skipped: true }, whatsapp: { success: true, skipped: true } }
  }

  const schedule = booking.schedule
  const bus = schedule.bus
  const route = schedule.route
  const seatIdToNumber = new Map(schedule.seats.map(s => [s.id, s.seatNumber]))
  const seatNumbers = booking.passengers.map(p => seatIdToNumber.get(p.seatId) ?? String(p.seatId))
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
      operatorName: bus.operator.name,
      busType: bus.busType.replace(/_/g, ' '),
      busNumber: bus.busNumber,
      source: route.source.name,
      destination: route.dest.name,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      journeyDate: booking.journeyDate.toISOString(),
      passengers: booking.passengers.map((p, i) => ({
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
    console.error('[Confirm] PDF generation failed:', err)
  }

  const emailPromise = booking.contactEmail
    ? sendTicketEmail({
        to: booking.contactEmail,
        referenceCode: booking.referenceCode,
        operatorName: bus.operator.name,
        source: route.source.name,
        destination: route.dest.name,
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        journeyDate: booking.journeyDate.toISOString(),
        passengerNames: booking.passengers.map(p => p.name),
        seatNumbers,
        totalAmount: booking.totalAmount,
        pdfBuffer,
      }).catch(err => {
        console.error('[Confirm] Email send failed:', err)
        return { success: false, error: 'Email failed' }
      })
    : Promise.resolve({ success: true, skipped: true })

  const whatsappPromise = sendWhatsAppMessage({
    to: booking.contactPhone,
    referenceCode: booking.referenceCode,
    operatorName: bus.operator.name,
    source: route.source.name,
    destination: route.dest.name,
    departureTime: schedule.departureTime,
    arrivalTime: schedule.arrivalTime,
    journeyDate: booking.journeyDate.toISOString(),
    seatNumbers,
    passengerNames: booking.passengers.map(p => p.name),
    totalAmount: booking.totalAmount,
  }).catch(err => {
    console.error('[Confirm] WhatsApp send failed:', err)
    return { success: false, error: 'WhatsApp failed' }
  })

  const [email, whatsapp] = await Promise.all([emailPromise, whatsappPromise])

  return { booking, email, whatsapp, pdfGenerated: Boolean(pdfBuffer) }
}
