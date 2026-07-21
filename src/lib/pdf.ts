import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { formatDate, formatCurrency } from '@/lib/utils'

interface TicketPDFProps {
  referenceCode: string
  operatorName: string
  busType: string
  busNumber: string
  source: string
  destination: string
  departureTime: string
  arrivalTime: string
  journeyDate: string
  passengers: { name: string; age: number; gender: string; seat: string }[]
  totalAmount: number
  insuranceOpted: boolean
}

export async function generateTicketPDF(props: TicketPDFProps): Promise<Buffer> {
  const doc = await PDFDocument.create()
  const page = doc.addPage([595.28, 841.89])
  const { width, height } = page.getSize()

  const font = await doc.embedFont(StandardFonts.Helvetica)
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold)

  const primaryBlue = rgb(0.1, 0.33, 0.86)
  const darkGray = rgb(0.16, 0.22, 0.28)
  const midGray = rgb(0.44, 0.49, 0.54)
  const lightGray = rgb(0.89, 0.91, 0.94)
  const white = rgb(1, 1, 1)
  const borderColor = rgb(0.85, 0.87, 0.9)

  let y = height - 50

  function text(
    str: string, x: number, yPos: number,
    opts?: { size?: number; color?: ReturnType<typeof rgb>; font?: typeof font }
  ) {
    const f = opts?.font || font
    const s = opts?.size || 10
    page.drawText(str, {
      x,
      y: yPos,
      size: s,
      font: f,
      color: opts?.color || darkGray,
    })
  }

  // Header bar
  page.drawRectangle({
    x: 0, y: height - 80, width, height: 80,
    color: primaryBlue,
  })
  text('GoSafe', 40, height - 55, { font: boldFont, size: 22, color: white })
  text('Bus Booking · India', 40, height - 72, { size: 9, color: rgb(0.7, 0.8, 1) })
  text('E-TICKET', width - 110, height - 55, { font: boldFont, size: 12, color: white })
  y = height - 110

  // Divider line
  page.drawLine({
    start: { x: 40, y: y + 10 },
    end: { x: width - 40, y: y + 10 },
    thickness: 0.5,
    color: borderColor,
  })

  // Reference & Date in two columns
  text('Reference No.', 40, y - 15, { color: midGray, size: 9 })
  text(props.referenceCode, 40, y - 30, { font: boldFont, size: 12, color: primaryBlue })
  text('Date of Journey', width / 2 + 20, y - 15, { color: midGray, size: 9 })
  text(formatDate(props.journeyDate), width / 2 + 20, y - 30, { font: boldFont, size: 10 })
  y -= 55

  // Operator info
  text('Bus Operator', 40, y - 15, { color: midGray, size: 9 })
  text(props.operatorName, 40, y - 30, { font: boldFont, size: 10 })
  text('Bus Type', width / 2 + 20, y - 15, { color: midGray, size: 9 })
  text(props.busType, width / 2 + 20, y - 30, { font: boldFont, size: 10 })
  y -= 55

  // Bus Number
  text('Bus Number', 40, y - 15, { color: midGray, size: 9 })
  text(props.busNumber, 40, y - 30, { font: boldFont, size: 10 })
  y -= 50

  // Timeline section
  const timelineY = y - 20
  page.drawRectangle({
    x: 40, y: timelineY - 50, width: width - 80, height: 70,
    color: rgb(0.97, 0.98, 1),
  })

  // From
  text(props.source, 60, timelineY - 18, { font: boldFont, size: 14, color: darkGray })
  text(props.departureTime, 60, timelineY - 36, { font: boldFont, size: 12, color: primaryBlue })
  text('Departure', 60, timelineY - 48, { color: midGray, size: 7 })

  // Arrow
  const arrowX = width / 2 - 10
  text('________________________', arrowX, timelineY - 18, { color: midGray, size: 7 })
  text('➤', arrowX + 110, timelineY - 30, { color: primaryBlue, size: 14 })

  // To
  text(props.destination, arrowX + 130, timelineY - 18, { font: boldFont, size: 14, color: darkGray })
  text(props.arrivalTime, arrowX + 130, timelineY - 36, { font: boldFont, size: 12, color: primaryBlue })
  text('Arrival', arrowX + 130, timelineY - 48, { color: midGray, size: 7 })

  y = timelineY - 80

  // Passengers section
  text('Passenger Details', 40, y - 10, { font: boldFont, size: 11, color: darkGray })
  y -= 30

  // Table header
  page.drawRectangle({
    x: 40, y: y - 14, width: width - 80, height: 20,
    color: lightGray,
  })
  const colW = [(width - 100) * 0.4, (width - 100) * 0.2, (width - 100) * 0.2, (width - 100) * 0.2]
  let cx = 45
  const headers = ['Name', 'Age', 'Gender', 'Seat']
  headers.forEach((h, i) => {
    text(h, cx, y - 9, { font: boldFont, size: 9, color: darkGray })
    cx += colW[i]
  })
  y -= 20

  // Table rows
  props.passengers.forEach((p) => {
    cx = 45
    const rowData = [p.name, String(p.age), p.gender === 'MALE' ? 'M' : p.gender === 'FEMALE' ? 'F' : 'O', p.seat]
    rowData.forEach((d, i) => {
      text(d, cx, y - 9, { size: 9, font: i === 3 ? boldFont : font })
      cx += colW[i]
    })
    y -= 18
  })

  y -= 10

  // Fare section
  text('Fare Details', 40, y - 10, { font: boldFont, size: 11, color: darkGray })
  y -= 25

  const fareLeft = width - 220
  text('Total Fare', fareLeft, y, { color: midGray, size: 9 })
  text(formatCurrency(props.totalAmount), fareLeft + 100, y, { font: boldFont, size: 9 })
  y -= 15

  if (props.insuranceOpted) {
    text('Insurance', fareLeft, y, { color: midGray, size: 9 })
    text('₹19', fareLeft + 100, y, { font: boldFont, size: 9 })
    y -= 15
  }

  page.drawLine({
    start: { x: fareLeft, y },
    end: { x: width - 40, y },
    thickness: 1,
    color: darkGray,
  })
  y -= 15
  text('Total Paid', fareLeft, y, { font: boldFont, size: 11, color: primaryBlue })
  text(formatCurrency(props.totalAmount), fareLeft + 100, y, { font: boldFont, size: 11, color: primaryBlue })

  // Footer
  page.drawLine({
    start: { x: 40, y: 60 },
    end: { x: width - 40, y: 60 },
    thickness: 0.5,
    color: borderColor,
  })
  text('GoSafe Bus Booking · gosafe.in', 40, 44, { color: midGray, size: 8 })
  text('Thank you for travelling with GoSafe!', width - 220, 44, { color: midGray, size: 8 })

  const pdfBytes = await doc.save()
  return Buffer.from(pdfBytes)
}
