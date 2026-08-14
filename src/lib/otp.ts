import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendSMS } from '@/lib/whatsapp'

const OTP_TTL_MS = 5 * 60 * 1000
const MAX_ATTEMPTS = 5

export type OtpPurpose = 'CANCEL_BOOKING' | 'RESEND_TICKET'

function hashCode(code: string): string {
  return crypto.createHash('sha256').update(`gosafe-otp:${code}`).digest('hex')
}

function generateCode(): string {
  return String(crypto.randomInt(100000, 1000000))
}

export async function sendOtp(phone: string, purpose: OtpPurpose): Promise<{ sent: boolean; mock?: boolean }> {
  const normalized = phone.replace(/[^0-9]/g, '')
  const code = generateCode()

  await prisma.supportOtp.deleteMany({
    where: { phone: normalized, purpose },
  })

  await prisma.supportOtp.create({
    data: {
      phone: normalized,
      purpose,
      codeHash: hashCode(code),
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  })

  const body = `GoSafe verification: Your OTP is ${code}. It is valid for 5 minutes. Do not share it with anyone.`

  const result = await sendSMS({ to: normalized, message: body })
  if (result.success === false) {
    return { sent: false }
  }
  return { sent: true, mock: result.mock }
}

export async function verifyOtp(
  phone: string,
  purpose: OtpPurpose,
  code: string
): Promise<{ valid: boolean; reason?: string }> {
  const normalized = phone.replace(/[^0-9]/g, '')

  const otp = await prisma.supportOtp.findFirst({
    where: { phone: normalized, purpose },
    orderBy: { createdAt: 'desc' },
  })

  if (!otp) {
    return { valid: false, reason: 'No OTP was requested for this number. Ask the user to request a fresh OTP.' }
  }

  if (otp.used) {
    return { valid: false, reason: 'This OTP has already been used. Request a new one.' }
  }

  if (otp.expiresAt < new Date()) {
    return { valid: false, reason: 'This OTP has expired. Request a new one.' }
  }

  if (otp.attempts >= MAX_ATTEMPTS) {
    return { valid: false, reason: 'Too many attempts. Request a fresh OTP.' }
  }

  const matches = hashCode(code.trim()) === otp.codeHash

  if (!matches) {
    await prisma.supportOtp.update({
      where: { id: otp.id },
      data: { attempts: { increment: 1 } },
    })
    return { valid: false, reason: 'Incorrect OTP. Please re-check the code sent to your phone.' }
  }

  await prisma.supportOtp.update({
    where: { id: otp.id },
    data: { used: true, attempts: { increment: 1 } },
  })

  return { valid: true }
}