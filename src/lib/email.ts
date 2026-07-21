import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

interface SendTicketEmailParams {
  to: string
  referenceCode: string
  operatorName: string
  source: string
  destination: string
  departureTime: string
  arrivalTime: string
  journeyDate: string
  passengerNames: string[]
  seatNumbers: string[]
  totalAmount: number
  pdfBuffer?: Buffer
}

export async function sendTicketEmail(params: SendTicketEmailParams) {
  if (!resend) {
    console.log('[Email] Mock: ticket email skipped (no RESEND_API_KEY)')
    console.log('[Email] Would send to:', params.to)
    return { success: true, mock: true }
  }

  const seatList = params.seatNumbers.join(', ')
  const passengerList = params.passengerNames.join(', ')

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a56db; padding: 20px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">GoSafe</h1>
        <p style="color: #93c5fd; margin: 4px 0 0;">Bus Booking Confirmed</p>
      </div>
      <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0;">
        <p style="font-size: 14px; color: #475569;">Hi ${params.passengerNames[0]},</p>
        <p style="font-size: 14px; color: #475569;">Your bus ticket is confirmed!</p>

        <div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 4px; font-size: 11px; color: #64748b;">Reference No.</p>
          <p style="margin: 0; font-size: 20px; font-weight: bold; color: #1a56db;">${params.referenceCode}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="text-align: center; padding: 12px; background: white; border-radius: 8px;">
              <p style="font-size: 18px; font-weight: bold; margin: 0;">${params.departureTime}</p>
              <p style="font-size: 12px; color: #64748b; margin: 2px 0;">${params.source}</p>
            </td>
            <td style="text-align: center; padding: 12px; font-size: 18px; color: #94a3b8;">→</td>
            <td style="text-align: center; padding: 12px; background: white; border-radius: 8px;">
              <p style="font-size: 18px; font-weight: bold; margin: 0;">${params.arrivalTime}</p>
              <p style="font-size: 12px; color: #64748b; margin: 2px 0;">${params.destination}</p>
            </td>
          </tr>
        </table>

        <div style="margin: 16px 0; padding: 12px; background: white; border-radius: 8px;">
          <p style="margin: 0 0 8px; font-size: 12px; color: #64748b;">
            <strong>Bus:</strong> ${params.operatorName}<br/>
            <strong>Date:</strong> ${params.journeyDate}<br/>
            <strong>Seats:</strong> ${seatList}<br/>
            <strong>Passengers:</strong> ${passengerList}<br/>
            <strong>Amount Paid:</strong> ₹${params.totalAmount}
          </p>
        </div>

        <div style="text-align: center; margin: 16px 0;">
          <a href="#" style="background: #1a56db; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 14px;">
            Download E-Ticket PDF
          </a>
        </div>

        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
          Have a safe journey! 🚌
        </p>
      </div>
      <div style="background: #1e293b; padding: 12px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="margin: 0; font-size: 11px; color: #64748b;">GoSafe Bus Booking · gosafe.in</p>
      </div>
    </div>
  `

  try {
    const attachments = params.pdfBuffer
      ? [{ filename: `${params.referenceCode}.pdf`, content: params.pdfBuffer }]
      : undefined

    await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME || 'GoSafe'} <${process.env.RESEND_FROM_EMAIL || 'bookings@gosafe.in'}>`,
      to: params.to,
      subject: `Booking Confirmed - ${params.referenceCode} | GoSafe`,
      html,
      attachments,
    })

    return { success: true }
  } catch (error) {
    console.error('[Email] Send failed:', error)
    return { success: false, error }
  }
}
