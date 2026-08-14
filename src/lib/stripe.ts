import Stripe from 'stripe'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

let stripeClient: Stripe | null = null

function isConfigured(): boolean {
  return Boolean(STRIPE_SECRET_KEY)
}

export function getStripe(): Stripe {
  if (!isConfigured()) {
    throw new Error('Stripe is not configured (STRIPE_SECRET_KEY missing)')
  }
  if (!stripeClient) {
    stripeClient = new Stripe(STRIPE_SECRET_KEY)
  }
  return stripeClient
}

export function isStripeConfigured(): boolean {
  return isConfigured()
}

export function getStripeWebhookSecret(): string {
  return STRIPE_WEBHOOK_SECRET
}

export interface StripeCheckoutParams {
  amountPaise: number
  currency?: string
  bookingId: number
  referenceCode: string
  successUrl: string
  cancelUrl: string
  customerEmail?: string | null
  description?: string
  metadata?: Record<string, string>
}

export async function createStripeCheckoutSession(params: StripeCheckoutParams): Promise<{
  sessionId: string
  url: string
  mock?: boolean
}> {
  if (!isConfigured()) {
    if (IS_PRODUCTION) {
      throw new Error('Stripe is not configured (STRIPE_SECRET_KEY missing)')
    }
    // Mock mode — mirror the payment as if a session was created
    console.log('[Stripe] Mock: checkout session skipped (no keys)')
    return {
      sessionId: `cs_mock_${Date.now()}`,
      url: params.successUrl,
      mock: true,
    }
  }

  const stripe = getStripe()

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card', 'upi'],
    line_items: [
      {
        price_data: {
          currency: params.currency || 'inr',
          product_data: {
            name: 'GoSafe Bus Ticket',
            description: params.description || `Booking ${params.referenceCode}`,
            metadata: {
              bookingId: String(params.bookingId),
              referenceCode: params.referenceCode,
            },
          },
          unit_amount: Math.round(params.amountPaise),
        },
        quantity: 1,
      },
    ],
    customer_email: params.customerEmail || undefined,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      bookingId: String(params.bookingId),
      referenceCode: params.referenceCode,
      ...params.metadata,
    },
  })

  if (!session.url) {
    throw new Error('Stripe returned a session without a URL')
  }

  return {
    sessionId: session.id,
    url: session.url,
  }
}

export function verifyStripeWebhook(body: string, signature: string): Stripe.Event {
  if (!STRIPE_WEBHOOK_SECRET) {
    if (IS_PRODUCTION) {
      throw new Error('Stripe webhook is not configured (STRIPE_WEBHOOK_SECRET missing)')
    }
    // Mock mode: accept and parse body without verification
    return JSON.parse(body) as Stripe.Event
  }

  return Stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
}

export interface StripeRefundParams {
  paymentId: string
  amountPaise: number
  reason?: string
  referenceCode: string
}

export async function createStripeRefund(params: StripeRefundParams): Promise<{
  refundId: string
  status: string
  mock?: boolean
}> {
  if (!isConfigured()) {
    if (IS_PRODUCTION) {
      throw new Error('Stripe is not configured (STRIPE_SECRET_KEY missing)')
    }
    console.log('[Stripe] Mock: refund skipped (no keys)')
    return { refundId: `re_mock_${Date.now()}`, status: 'succeeded', mock: true }
  }

  const stripe = getStripe()

  const refund = await stripe.refunds.create({
    payment_intent: params.paymentId,
    amount: Math.round(params.amountPaise),
    reason: (params.reason as Stripe.RefundCreateParams['reason']) || 'requested_by_customer',
    metadata: { referenceCode: params.referenceCode },
  })

  return { refundId: refund.id, status: refund.status ?? 'pending' }
}
