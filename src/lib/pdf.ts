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
  const lightGray = rgb(0.92, 0.94, 0.96)
  const softFill = rgb(0.97, 0.98, 1)
  const white = rgb(1, 1, 1)
  const borderColor = rgb(0.85, 0.87, 0.9)

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

  // ---- Header ----
  page.drawRectangle({ x: 0, y: height - 70, width, height: 70, color: primaryBlue })
  text('GoSafe', MARGIN, height - 44, { font: boldFont, size: 22, color: white })
  text('Bus Booking · India', MARGIN, height - 58, { size: 9, color: rgb(0.7, 0.8, 1) })
  rightText('E-TICKET', RIGHT, height - 44, { font: boldFont, size: 13, color: white })
  rightText(props.referenceCode, RIGHT, height - 59, { size: 10, color: rgb(0.8, 0.88, 1) })

  let y = height - 102

  // ---- Journey summary strip ----
  const stripH = 74
  const stripY = y - stripH
  roundedRect(MARGIN, stripY, CONTENT_W, stripH, 10, softFill, borderColor)

  const departCx = MARGIN + CONTENT_W * 0.27
  const arrivalCx = MARGIN + CONTENT_W * 0.73
  const arrowCx = MARGIN + CONTENT_W * 0.5

  centerText(props.source, departCx, stripY + 54, { font: boldFont, size: 15, color: darkGray })
  centerText(props.departureTime, departCx, stripY + 31, { font: boldFont, size: 13, color: primaryBlue })
  centerText('DEPARTURE', departCx, stripY + 20, { size: 7, color: midGray })
  centerText(props.destination, arrivalCx, stripY + 54, { font: boldFont, size: 15, color: darkGray })
  centerText(props.arrivalTime, arrivalCx, stripY + 31, { font: boldFont, size: 13, color: primaryBlue })
  centerText('ARRIVAL', arrivalCx, stripY + 20, { size: 7, color: midGray })

  page.drawLine({
    start: { x: MARGIN + CONTENT_W * 0.17, y: stripY + 48 },
    end: { x: MARGIN + CONTENT_W * 0.83, y: stripY + 48 },
    thickness: 1, color: borderColor,
  })
  page.drawCircle({ x: arrowCx, y: stripY + 48, size: 2.5, color: primaryBlue })

  // Route + date line under the strip
  y = stripY - 20
  text(formatDate(props.journeyDate), MARGIN, y, { size: 9, color: midGray })
  rightText(`${props.operatorName} · ${props.busType}`, RIGHT, y, { size: 9, color: midGray })
  y -= 18

  // ---- Info grid (two columns) ----
  const colGap = 40
  const colW = (CONTENT_W - colGap) / 2
  const x2 = MARGIN + colW + colGap

  function infoBlock(label: string, value: string, x: number, yTop: number) {
    text(label, x, yTop, { size: 8, color: midGray })
    text(value, x, yTop - 15, { font: boldFont, size: 10 })
  }

  infoBlock('Reference No.', props.referenceCode, MARGIN, y)
  infoBlock('Date of Journey', formatDate(props.journeyDate), x2, y)
  y -= 40

  infoBlock('Bus Operator', props.operatorName, MARGIN, y)
  infoBlock('Bus Type', props.busType, x2, y)
  y -= 40

  infoBlock('Bus Number', props.busNumber, MARGIN, y)
  infoBlock('Total Passengers', `${props.passengers.length}`, x2, y)
  y -= 44

  // ---- Passengers table ----
  text('Passenger Details', MARGIN, y, { font: boldFont, size: 11, color: darkGray })
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

  y -= 20

  // ---- Fare section ----
  text('Fare Details', MARGIN, y, { font: boldFont, size: 11, color: darkGray })

  const fareBlockW = CONTENT_W * 0.55
  const fareX = RIGHT - fareBlockW
  const fareH = props.insuranceOpted ? 150 : 128
  const fareTop = y - 16 - fareH

  roundedRect(fareX, fareTop, fareBlockW, fareH, 8, softFill, borderColor)

  let fareY = y - 40
  function fareRow(labelStr: string, valueStr: string, bold = false, color?: RGBColor) {
    text(labelStr, fareX + 16, fareY, { size: 9, color: midGray, font: bold ? boldFont : font })
    rightText(valueStr, RIGHT - 16, fareY, { size: 9, font: bold ? boldFont : font, color: color || darkGray })
    fareY -= 24
  }

  fareRow('Total Fare', formatRupee(props.totalAmount))
  if (props.insuranceOpted) fareRow('Insurance', 'Rs. 19')
  page.drawLine({ start: { x: fareX + 16, y: fareY + 12 }, end: { x: RIGHT - 16, y: fareY + 12 }, thickness: 0.8, color: borderColor })
  fareY -= 6
  fareRow('Total Paid', formatRupee(props.totalAmount), true, primaryBlue)

  // ---- Footer ----
  const footY = 60
  page.drawLine({ start: { x: MARGIN, y: footY }, end: { x: RIGHT, y: footY }, thickness: 0.5, color: borderColor })
  text('GoSafe Bus Booking · gosafe.in', MARGIN, footY - 20, { size: 8, color: midGray })
  rightText('Thank you for travelling with GoSafe!', RIGHT, footY - 20, { size: 8, color: midGray })

  const pdfBytes = await doc.save()
  return Buffer.from(pdfBytes)
}
