import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { formatDate } from '@/lib/utils'

type RGBColor = ReturnType<typeof rgb>

function formatRupee(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-IN')}`
}

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
  contactName: string
  contactPhone: string
  boardingPoints: { name: string; time: string }[]
  droppingPoints: { name: string; time: string }[]
}

export async function generateTicketPDF(props: TicketPDFProps): Promise<Buffer> {
  const doc = await PDFDocument.create()
  const page = doc.addPage([595.28, 841.89])
  const { width, height } = page.getSize()

  const font = await doc.embedFont(StandardFonts.Helvetica)
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold)

  const primaryBlue = rgb(0.09, 0.3, 0.82)
  const darkGray = rgb(0.15, 0.2, 0.26)
  const midGray = rgb(0.44, 0.49, 0.54)
  const lightGray = rgb(0.92, 0.94, 0.96)
  const softFill = rgb(0.965, 0.98, 1)
  const white = rgb(1, 1, 1)
  const borderColor = rgb(0.85, 0.87, 0.9)
  const green = rgb(0.05, 0.62, 0.35)
  const red = rgb(0.85, 0.2, 0.2)

  const MARGIN = 40
  const CONTENT_W = width - MARGIN * 2
  const RIGHT = width - MARGIN

  function truncate(str: string, f: typeof font, size: number, maxW: number): string {
    if (f.widthOfTextAtSize(str, size) <= maxW) return str
    let t = str
    while (t.length > 1 && f.widthOfTextAtSize(`${t}…`, size) > maxW) t = t.slice(0, -1)
    return `${t}…`
  }

  function text(
    str: string, x: number, yPos: number,
    opts?: { size?: number; color?: RGBColor; font?: typeof font }
  ) {
    const f = opts?.font || font
    const s = opts?.size || 10
    page.drawText(truncate(str, f, s, CONTENT_W), { x, y: yPos, size: s, font: f, color: opts?.color || darkGray })
  }

  function rightText(
    str: string, rightX: number, yPos: number,
    opts?: { size?: number; color?: RGBColor; font?: typeof font }
  ) {
    const f = opts?.font || font
    const s = opts?.size || 10
    const label = truncate(str, f, s, CONTENT_W)
    page.drawText(label, { x: rightX - f.widthOfTextAtSize(label, s), y: yPos, size: s, font: f, color: opts?.color || darkGray })
  }

  function centerText(
    str: string, cx: number, yPos: number,
    opts?: { size?: number; color?: RGBColor; font?: typeof font }
  ) {
    const f = opts?.font || font
    const s = opts?.size || 10
    const label = truncate(str, f, s, CONTENT_W / 2)
    page.drawText(label, { x: cx - f.widthOfTextAtSize(label, s) / 2, y: yPos, size: s, font: f, color: opts?.color || darkGray })
  }

  function roundedRect(
    x: number, yPos: number, w: number, h: number,
    r: number, color?: RGBColor, border?: RGBColor
  ) {
    const d = `M ${r} 0 L ${w - r} 0 Q ${w} 0 ${w} ${r} L ${w} ${h - r} Q ${w} ${h} ${w - r} ${h} L ${r} ${h} Q 0 ${h} 0 ${h - r} L 0 ${r} Q 0 0 ${r} 0 Z`
    page.drawSvgPath(d, {
      x, y: yPos,
      ...(color ? { color } : {}),
      ...(border ? { borderColor: border, borderWidth: 1 } : {}),
    })
  }

  function sectionTitle(label: string, yPos: number) {
    text(label, MARGIN, yPos, { font: boldFont, size: 11, color: primaryBlue })
  }

  // ================= HEADER =================
  page.drawRectangle({ x: 0, y: height - 72, width, height: 72, color: primaryBlue })
  text('GoSafe', MARGIN, height - 42, { font: boldFont, size: 24, color: white })
  text('Bus Booking · India', MARGIN, height - 58, { size: 9, color: rgb(0.72, 0.82, 1) })
  rightText('E-TICKET', RIGHT, height - 42, { font: boldFont, size: 14, color: white })
  rightText(props.referenceCode, RIGHT, height - 59, { size: 10, color: rgb(0.8, 0.88, 1) })

  let y = height - 104

  // ================= JOURNEY STRIP =================
  const stripH = 76
  const stripY = y - stripH
  roundedRect(MARGIN, stripY, CONTENT_W, stripH, 10, softFill, borderColor)

  const departCx = MARGIN + CONTENT_W * 0.27
  const arrivalCx = MARGIN + CONTENT_W * 0.73
  const arrowCx = MARGIN + CONTENT_W * 0.5

  centerText(props.source, departCx, stripY + 56, { font: boldFont, size: 16, color: darkGray })
  centerText(props.departureTime, departCx, stripY + 33, { font: boldFont, size: 14, color: primaryBlue })
  centerText('DEPARTURE', departCx, stripY + 21, { size: 7, color: midGray })
  centerText(props.destination, arrivalCx, stripY + 56, { font: boldFont, size: 16, color: darkGray })
  centerText(props.arrivalTime, arrivalCx, stripY + 33, { font: boldFont, size: 14, color: primaryBlue })
  centerText('ARRIVAL', arrivalCx, stripY + 21, { size: 7, color: midGray })

  page.drawLine({
    start: { x: MARGIN + CONTENT_W * 0.17, y: stripY + 50 },
    end: { x: MARGIN + CONTENT_W * 0.83, y: stripY + 50 },
    thickness: 1, color: borderColor,
  })
  page.drawCircle({ x: arrowCx, y: stripY + 50, size: 2.5, color: primaryBlue })

  y = stripY - 22
  text(formatDate(props.journeyDate), MARGIN, y, { size: 9, color: midGray })
  rightText(`${props.operatorName} · ${props.busType}`, RIGHT, y, { size: 9, color: midGray })
  y -= 20

  // ================= INFO GRID =================
  const colGap = 40
  const colW = (CONTENT_W - colGap) / 2
  const x2 = MARGIN + colW + colGap

  function infoBlock(label: string, value: string, x: number, yTop: number, valueColor?: RGBColor) {
    text(label, x, yTop, { size: 8, color: midGray })
    text(value, x, yTop - 15, { font: boldFont, size: 10, color: valueColor || darkGray })
  }

  infoBlock('Reference No.', props.referenceCode, MARGIN, y)
  infoBlock('Date of Journey', formatDate(props.journeyDate), x2, y)
  y -= 38

  infoBlock('Bus Operator', props.operatorName, MARGIN, y)
  infoBlock('Bus Type', props.busType, x2, y)
  y -= 38

  infoBlock('Bus Number', props.busNumber, MARGIN, y)
  infoBlock('Total Passengers', `${props.passengers.length}`, x2, y)
  y -= 42

  // ================= PASSENGERS TABLE =================
  sectionTitle('Passenger Details', y)
  y -= 10

  const headH = 22
  const nameW = CONTENT_W * 0.42
  const ageW = CONTENT_W * 0.16
  const genW = CONTENT_W * 0.2
  const seatW = CONTENT_W - nameW - ageW - genW

  page.drawRectangle({ x: MARGIN, y: y - headH, width: CONTENT_W, height: headH, color: lightGray })
  const headCols: [string, number][] = [
    ['Name', nameW],
    ['Age', ageW],
    ['Gender', genW],
    ['Seat', seatW],
  ]
  let cum = MARGIN
  headCols.forEach(([h, w]) => {
    text(h, cum, y - headH / 2 - 3, { font: boldFont, size: 9, color: darkGray })
    cum += w
  })

  y -= headH

  const rowH = 24
  props.passengers.forEach((p, i) => {
    const row = [p.name, String(p.age), p.gender === 'MALE' ? 'M' : p.gender === 'FEMALE' ? 'F' : 'O', p.seat]
    const ws = [nameW, ageW, genW, seatW]
    let xx = MARGIN
    row.forEach((d, j) => {
      text(d, xx, y - rowH / 2 - 3, { size: 9, font: j === 3 ? boldFont : font })
      xx += ws[j]
    })
    if (i < props.passengers.length - 1) {
      page.drawLine({ start: { x: MARGIN, y: y - rowH }, end: { x: RIGHT, y: y - rowH }, thickness: 0.4, color: borderColor })
    }
    y -= rowH
  })

  y -= 18

  // ================= BOARDING / DROPPING POINTS =================
  sectionTitle('Boarding & Dropping Points', y)
  y -= 26

  const pointColW = (CONTENT_W - colGap) / 2

  function pointList(items: { name: string; time: string }[], x: number, color: RGBColor) {
    items.slice(0, 5).forEach((p) => {
      text(p.time, x, y, { font: boldFont, size: 9, color: darkGray })
      page.drawCircle({ x: x + 26, y: y + 3, size: 2, color })
      text(truncate(p.name, font, 9, pointColW - 60), x + 34, y, { size: 9, color: darkGray })
      y -= 17
    })
  }

  pointList(props.boardingPoints, MARGIN, green)
  pointList(props.droppingPoints, x2, red)
  y -= 6

  // ================= FARE SECTION =================
  const fareBlockW = CONTENT_W * 0.48
  const fareX = RIGHT - fareBlockW
  const fareH = 96
  const fareTop = y - 14 - fareH

  roundedRect(fareX, fareTop, fareBlockW, fareH, 8, softFill, borderColor)

  let fareY = y - 42
  function fareRow(labelStr: string, valueStr: string, bold = false, color?: RGBColor) {
    text(labelStr, fareX + 16, fareY, { size: 9, color: midGray, font: bold ? boldFont : font })
    rightText(valueStr, RIGHT - 16, fareY, { size: 9, font: bold ? boldFont : font, color: color || darkGray })
    fareY -= 24
  }

  text('Fare Details', MARGIN, y - 20, { font: boldFont, size: 11, color: primaryBlue })
  fareRow('Total Fare', formatRupee(props.totalAmount))
  fareRow('Insurance', props.insuranceOpted ? 'Rs. 19 (Included)' : 'Not opted', false, props.insuranceOpted ? green : midGray)
  page.drawLine({ start: { x: fareX + 16, y: fareY + 12 }, end: { x: RIGHT - 16, y: fareY + 12 }, thickness: 0.8, color: borderColor })
  fareY -= 6
  fareRow('Total Paid', formatRupee(props.totalAmount), true, primaryBlue)

  y = fareTop - 16

  // ================= GUIDELINES =================
  sectionTitle('Journey Guidelines', y)
  y -= 24

  const guidelines = [
    'Carry a valid photo ID (Aadhaar / Driving Licence) matching the passenger name.',
    `Reach your boarding point ${props.boardingPoints.length ? 'on time — buses wait only 5 minutes' : '15 minutes before departure'}.`,
    'Present this e-ticket (digital or printed) on your phone at boarding.',
    'Water bottle & light snacks allowed; no luggage above 15 kg per passenger.',
    'Please do not smoke or consume alcohol inside the bus.',
  ]
  guidelines.forEach(g => {
    page.drawCircle({ x: MARGIN + 4, y: y + 3, size: 1.8, color: primaryBlue })
    text(g, MARGIN + 14, y, { size: 8.5, color: darkGray })
    y -= 16
  })

  y -= 10

  // ================= SUPPORT & LINKS =================
  const linkBlockH = 78
  const linkTop = y - 12 - linkBlockH
  page.drawRectangle({ x: MARGIN, y: linkTop, width: CONTENT_W, height: linkBlockH, color: softFill })
  page.drawLine({ start: { x: MARGIN, y: linkTop }, end: { x: RIGHT, y: linkTop }, thickness: 1, color: borderColor })
  page.drawLine({ start: { x: MARGIN, y: linkTop + 28 }, end: { x: RIGHT, y: linkTop + 28 }, thickness: 0.5, color: borderColor })

  text('Need help? We are here 24×7', MARGIN + 10, linkTop + 18, { font: boldFont, size: 9.5, color: primaryBlue })
  text('Support: 1800-800-1234', MARGIN + 10, linkTop + 6, { size: 8.5, color: darkGray })
  rightText('WhatsApp: +91 80001 23456', RIGHT - 10, linkTop + 6, { size: 8.5, color: darkGray })

  text('Help Centre: gosafe.in/help', MARGIN + 10, linkTop - 12, { font: boldFont, size: 8.5, color: darkGray })
  text('Live Bus Tracking: gosafe.in/track', MARGIN + 10, linkTop - 25, { font: boldFont, size: 8.5, color: darkGray })
  rightText('Cancel / Refund: gosafe.in/refund', RIGHT - 10, linkTop - 12, { font: boldFont, size: 8.5, color: darkGray })
  rightText('www.gosafe.in', RIGHT - 10, linkTop - 25, { size: 8.5, color: midGray })

  // ================= FOOTER =================
  const footY = 52
  page.drawLine({ start: { x: MARGIN, y: footY }, end: { x: RIGHT, y: footY }, thickness: 0.5, color: borderColor })
  text('This is a computer-generated e-ticket and does not require a physical signature.', MARGIN, footY - 18, { size: 7.5, color: midGray })
  rightText(`Traveller: ${props.contactName} · ${props.contactPhone}`, RIGHT, footY - 18, { size: 7.5, color: midGray })
  text('Thank you for travelling with GoSafe! Safe journey.', MARGIN, footY - 32, { font: boldFont, size: 8.5, color: green })

  const pdfBytes = await doc.save()
  return Buffer.from(pdfBytes)
}
