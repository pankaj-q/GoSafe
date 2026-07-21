import twilio from 'twilio'

const twilioClient = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null

interface SendWhatsAppParams {
  to: string
  referenceCode: string
  operatorName: string
  source: string
  destination: string
  departureTime: string
  arrivalTime: string
  journeyDate: string
  seatNumbers: string[]
  passengerNames: string[]
  totalAmount: number
  pdfUrl?: string
}

export async function sendWhatsAppMessage(params: SendWhatsAppParams) {
  if (!twilioClient) {
    console.log('[WhatsApp] Mock: message skipped (no TWILIO credentials)')
    return { success: true, mock: true }
  }

  const seats = params.seatNumbers.join(', ')
  const passengers = params.passengerNames.join(', ')
  const from = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'
  const to = `whatsapp:${params.to.startsWith('+') ? '' : '+91'}${params.to.replace(/[^0-9]/g, '')}`

  const body = `🎫 *GoSafe - Bus Booking Confirmed!*
  *Ref:* ${params.referenceCode}
  *${params.source} → ${params.destination}*
  *Date:* ${params.journeyDate}
  *Time:* ${params.departureTime} - ${params.arrivalTime}
  *Bus:* ${params.operatorName}
  *Seats:* ${seats}
  *Passengers:* ${passengers}
  *Amount:* ₹${params.totalAmount}
  
  Download e-ticket: ${params.pdfUrl || 'Check your email'}
  
  Safe Journey! 🚌`

  try {
    await twilioClient.messages.create({ from, to, body })
    return { success: true }
  } catch (error) {
    console.error('[WhatsApp] Send failed:', error)
    return { success: false, error }
  }
}

export async function sendSMS(params: { to: string; message: string }) {
  if (!twilioClient) {
    console.log('[SMS] Mock: message skipped (no TWILIO credentials)')
    return { success: true, mock: true }
  }

  const from = process.env.TWILIO_SMS_FROM || '+1234567890'
  const to = params.to.startsWith('+') ? params.to : `+91${params.to}`

  try {
    await twilioClient.messages.create({ from, to, body: params.message })
    return { success: true }
  } catch (error) {
    console.error('[SMS] Send failed:', error)
    return { success: false, error }
  }
}
