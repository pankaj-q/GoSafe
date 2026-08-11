import { prisma } from '@/lib/prisma'
import { generateTicketPDF } from '@/lib/pdf'
import { sendTicketEmail } from '@/lib/email'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

interface ConfirmOptions {
  /** Skip the DB status update and only send notifications */
  notifyOnly?: boolean
}

/**
 * Confirm a booking as paid and deliver notifications (PDF + email + WhatsApp).
 * Safe to call more than once — it checks the current status first.
 */
export async function confirmPaidBooking(bookingId: number, options: ConfirmOptions = {}) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      schedule: {
        include: {
          bus: { include: { operator: true } },
          route: { include: { source: true, dest: true } },
        },
      },
      passengers: true,
      payments: true,
    },
  })

  if (!booking) {
    throw new Error('Booking not found')
  }

  if (!options.notifyOnly && booking.status !== 'CONFIRMED') {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'CONFIRMED' },
    })
  }

  const schedule = booking.schedule
  const bus = schedule.bus
  const route = schedule.route

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
      passengers: booking.passengers.map(p => ({
        name: p.name,
        age: p.age,
        gender: p.gender,
        seat: String(p.seatId),
      })),
      totalAmount: booking.totalAmount,
      insuranceOpted: booking.insuranceOpted,
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
        seatNumbers: booking.passengers.map(p => String(p.seatId)),
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
    seatNumbers: booking.passengers.map(p => String(p.seatId)),
    passengerNames: booking.passengers.map(p => p.name),
    totalAmount: booking.totalAmount,
  }).catch(err => {
    console.error('[Confirm] WhatsApp send failed:', err)
    return { success: false, error: 'WhatsApp failed' }
  })

  const [email, whatsapp] = await Promise.all([emailPromise, whatsappPromise])

  return { booking, email, whatsapp, pdfGenerated: Boolean(pdfBuffer) }
}
