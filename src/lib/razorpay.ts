import crypto from 'crypto'

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || ''
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || ''

export function getRazorpayKeyId() {
  return RAZORPAY_KEY_ID
}

export async function createRazorpayOrder(params: {
  amount: number
  currency?: string
  receipt: string
  notes?: Record<string, string>
}) {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    console.log('[Razorpay] Mock: order creation skipped (no keys)')
    return {
      id: `order_mock_${Date.now()}`,
      amount: params.amount,
      currency: params.currency || 'INR',
      receipt: params.receipt,
      status: 'created',
      mock: true,
    }
  }

  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')

  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(params.amount),
      currency: params.currency || 'INR',
      receipt: params.receipt,
      notes: params.notes,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Razorpay order failed: ${err}`)
  }

  return res.json()
}

export function verifyRazorpayPayment(params: {
  orderId: string
  paymentId: string
  signature: string
}): boolean {
  const body = `${params.orderId}|${params.paymentId}`
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex')

  return expectedSignature === params.signature
}

export function verifyRazorpayWebhook(body: string, signature: string): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || ''
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex')

  return expectedSignature === signature
}

export function capturePayment(paymentId: string, amount: number) {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    console.log('[Razorpay] Mock: payment capture skipped')
    return { success: true, mock: true }
  }

  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')

  return fetch(`https://api.razorpay.com/v1/payments/${paymentId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, currency: 'INR' }),
  }).then(r => r.json())
}
