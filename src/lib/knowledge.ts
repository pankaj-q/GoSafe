export interface Article {
  id: string
  category: string
  question: string
  answer: string
}

export const articles: Article[] = [
  {
    id: 'booking-1', category: 'Booking',
    question: 'How do I book a bus ticket on GoSafe?',
    answer: 'Enter your source and destination cities, pick a travel date, and hit Search. Compare available buses, then select a bus and choose your preferred seats — they get held for 10 minutes. Add passenger details, optional insurance, apply a coupon, and pay. Your e-ticket is sent via email and WhatsApp instantly.',
  },
  {
    id: 'booking-2', category: 'Booking',
    question: 'How do I receive my e-ticket?',
    answer: 'As soon as payment succeeds, your e-ticket is emailed and sent on WhatsApp to the number you provided. You can also download the PDF ticket anytime from the confirmation page or from My Bookings. No need to print it — showing the ticket on your phone at boarding is enough.',
  },
  {
    id: 'booking-3', category: 'Booking',
    question: 'Can I modify my booking after payment?',
    answer: 'Seat changes or date modifications are not available for already-paid tickets. Instead, you can cancel and re-book: cancellation up to 6 hours before departure gets a 90% refund, then re-book instantly at the new date or seat. You will not lose much, and re-booking takes under a minute.',
  },
  {
    id: 'booking-4', category: 'Booking',
    question: 'What is bus travel insurance and how do I add it?',
    answer: 'Travel insurance is an optional add-on of just ₹19 per seat, covering accidental death, medical expenses, baggage loss, and journey cancellation. It is added with one tap during the seat-selection step — tick the insurance option for the seats you want covered before you pay.',
  },
  {
    id: 'booking-5', category: 'Booking',
    question: 'How do I select preferred seats?',
    answer: 'On the booking page you will see a live seat map: green seats are available, blue are your selection, red with an ✕ are booked, amber is held by another user, and grey dashed means not available for sale. Simply tap an available seat — it will be locked for 10 minutes while you finish paying.',
  },
  {
    id: 'payment-1', category: 'Payments',
    question: 'What payment methods are accepted?',
    answer: 'We accept UPI, credit/debit cards, and netbanking through our secure Stripe gateway. All transactions are PCI-DSS compliant and encrypted. You can also apply offer codes like GOFIRST20 (20% off your first trip) at checkout before paying.',
  },
  {
    id: 'payment-2', category: 'Payments',
    question: 'My payment was deducted but booking is not confirmed',
    answer: 'Do not worry — this is rare and auto-resolved. A confirmation email is usually generated within a few minutes once the payment gateway reconciles. If you still do not see your booking after 10 minutes, contact us on WhatsApp or call 1800-800-1234 with the payment reference, and our team will confirm or refund immediately.',
  },
  {
    id: 'payment-3', category: 'Payments',
    question: 'How do I download my payment receipt?',
    answer: 'Open My Bookings, select the trip, and open the ticket. The payment receipt is included on the ticket page and in the PDF ticket — you can download or share it from there. For wallet or bank references, use the transaction ID shown in the ticket.',
  },
  {
    id: 'payment-4', category: 'Payments',
    question: 'Is it safe to pay on GoSafe?',
    answer: 'Yes. Payments are processed by Stripe, a PCI-DSS Level 1 certified gateway. Your card details are never stored on our servers, all traffic is HTTPS-encrypted, and every transaction is verified. You can pay with confidence on any device.',
  },
  {
    id: 'payment-5', category: 'Payments',
    question: 'Why was my UPI transaction declined?',
    answer: 'A UPI transaction can be declined if the UPI PIN is entered incorrectly, the daily limit is exhausted, the bank is facing downtime, or the app used for verification rejects the payment. Try a different UPI app, check your limit, or use card/netbanking instead. Your money is never deducted for a declined payment.',
  },
  {
    id: 'cancel-1', category: 'Cancellation',
    question: 'How do I cancel my bus ticket?',
    answer: 'Go to My Bookings, open the trip you want to cancel, and tap Cancel. Choose the seats to cancel and confirm. The refund is processed automatically based on the cancellation policy — no calls, no forms, and you will see the status update instantly.',
  },
  {
    id: 'cancel-2', category: 'Cancellation',
    question: 'What is the cancellation policy?',
    answer: 'Cancel more than 6 hours before departure for a 90% refund. Cancel between 6 and 2 hours before departure for a 50% refund. Cancellations within 2 hours of departure are non-refundable. Free cancellation windows are always counted from your scheduled departure time.',
  },
  {
    id: 'cancel-3', category: 'Cancellation',
    question: 'How much cancellation fee will be charged?',
    answer: 'The fee depends on when you cancel: 10% of the fare is deducted when cancelling more than 6 hours before departure, and 50% of the fare is deducted when cancelling between 6 and 2 hours before. No deduction at all applies to journeys you cancel via our free-cancellation offers.',
  },
  {
    id: 'cancel-4', category: 'Cancellation',
    question: 'Can I cancel a partially used ticket?',
    answer: 'Once a journey has started, cancellation is not possible and no refund is available for departed legs. If only some passengers travelled, let us know via support and we will review a partial refund for the unused seats where the policy allows.',
  },
  {
    id: 'cancel-5', category: 'Cancellation',
    question: 'How do I cancel a group booking?',
    answer: 'Open the group booking in My Bookings and choose Cancel. You can select specific seats to cancel individually — each seat is refunded per the policy — or cancel the whole booking in one go. Partial group cancellations are fully supported.',
  },
  {
    id: 'refund-1', category: 'Refunds',
    question: 'How long does a refund take?',
    answer: 'UPI payments are refunded within 24 hours, card payments within 3–5 business days, and netbanking within 5–7 business days. In most cases the money lands faster than the quoted window. Your refund status updates live in My Bookings.',
  },
  {
    id: 'refund-2', category: 'Refunds',
    question: 'Where will my refund be credited?',
    answer: 'Refunds are credited to the same payment method you used: UPI refunds return to your UPI account, card refunds to the card, and netbanking refunds to your bank account. You will get an email confirmation with the reference the moment the refund is initiated.',
  },
  {
    id: 'refund-3', category: 'Refunds',
    question: 'How do I track my refund status?',
    answer: 'Open My Bookings, select the cancelled trip, and check the Refund status section. It shows one of: Processing, Refunded, or Failed. For Processing, the expected credit window is shown. If a refund ever fails, you will be notified and the amount is re-initiated automatically.',
  },
  {
    id: 'refund-4', category: 'Refunds',
    question: 'I received a partial refund — why?',
    answer: 'A partial refund usually means the cancellation fee was applied per the policy (10% or 50% depending on when you cancelled), or some seats in a group booking were refunded separately. The breakdown of the amount is shown in the cancellation receipt.',
  },
  {
    id: 'refund-5', category: 'Refunds',
    question: 'Can I get a refund to a different account?',
    answer: 'For security reasons, refunds always go back to the original payment method. If you no longer have access to it (for example a closed card), contact support with your booking reference and a bank statement, and we will help you route the refund safely.',
  },
  {
    id: 'tech-1', category: 'Technical Support',
    question: 'GoSafe app is not working — what to do?',
    answer: 'First try refreshing the page and checking your internet connection. If the issue persists, clear the browser cache for the site and log in again. If you still face problems, tell our support team the exact error message and steps you took — most issues are resolved within minutes.',
  },
  {
    id: 'tech-2', category: 'Technical Support',
    question: 'I can\'t log in to my account',
    answer: 'Make sure you are entering the phone number you registered with (or the email you added). If you forgot your password, use the Forgot password link to reset it. Still stuck? Contact support with your registered phone number and we will verify and restore access.',
  },
  {
    id: 'tech-3', category: 'Technical Support',
    question: 'Website is loading slowly',
    answer: 'Slow loading is usually a network issue. Try switching between Wi-Fi and mobile data, closing other tabs, and disabling VPNs. Make sure you are on the latest version of Chrome, Safari, Edge, or Firefox. If the site is slow only for you, your ISP may need a cache refresh.',
  },
  {
    id: 'tech-4', category: 'Technical Support',
    question: 'How to clear cache and cookies?',
    answer: 'In Chrome, go to Settings → Privacy and security → Clear browsing data → choose All time → tick Cookies and cached images → Clear. For Safari, open Preferences → Privacy → Manage Website Data → Remove All. Log back into GoSafe after clearing — your bookings remain safe on your account.',
  },
  {
    id: 'tech-5', category: 'Technical Support',
    question: 'Supported browsers for GoSafe website?',
    answer: 'GoSafe works best on the latest two versions of Chrome, Safari, Edge, and Firefox, on both desktop and mobile. We also support mobile browsers like Samsung Internet. For the smoothest experience with seat maps and payments, keep your browser updated.',
  },
]

export interface PolicyFact {
  key: string
  value: string
}

export const policyBlock: PolicyFact[] = [
  { key: 'company', value: 'GoSafe is an Indian online bus ticketing platform (gosafe.in). Agents must always represent GoSafe accurately and answer in English.' },
  { key: 'cancellation_6h_plus', value: 'More than 6 hours before departure → 90% refund, 10% cancellation fee.' },
  { key: 'cancellation_2h_6h', value: 'Between 6 and 2 hours before departure → 50% refund, 50% cancellation fee.' },
  { key: 'cancellation_under_2h', value: 'Within 2 hours of departure → non-refundable, 100% cancellation fee.' },
  { key: 'seat_hold', value: 'Selected seats are held for 10 minutes while the passenger completes payment.' },
  { key: 'insurance', value: 'Optional travel insurance is ₹19 per seat, covering accidental death, medical expenses, baggage loss and journey cancellation.' },
  { key: 'refund_upi', value: 'UPI refunds complete within 24 hours.' },
  { key: 'refund_card', value: 'Card refunds complete within 3–5 business days.' },
  { key: 'refund_netbanking', value: 'Netbanking refunds complete within 5–7 business days.' },
  { key: 'refund_method', value: 'Refunds go back to the original payment method only.' },
  { key: 'offers', value: 'Active offers: GOFIRST20 (20% off first trip, new travellers), MONSOON10 (flat 10% off intercity trips), WEEKEND5 (extra 5% off weekend journeys), STAY25 (hotels, uncountable against bus fare).' },
  { key: 'payment_methods', value: 'UPI, credit/debit cards, and netbanking via Stripe (PCI-DSS Level 1). No cash, no COD.' },
  { key: 'e_ticket', value: 'E-ticket is delivered by email and WhatsApp immediately after payment, and downloadable from the confirmation page and My Bookings.' },
  { key: 'modification', value: 'Post-payment modifications (seat/date changes) are not available; passengers should cancel and re-book.' },
  { key: 'support', value: '24/7 support: call 1800-800-1234, email support@gosafe.in, or WhatsApp +91 8000 123 456.' },
  { key: 'agents_scope', value: 'Only use the provided tools for real booking lookups and actions. Never invent booking statuses, reference codes, refunds, or OTP codes. If a tool returns not-found, say so honestly and suggest contacting support.' },
  { key: 'agents_otp', value: 'Cancellation, refunds, and ticket resends for a booking always require OTP verification to the registered phone number before executing.' },
]

const STOPWORDS = new Set(['the', 'a', 'an', 'and', 'or', 'of', 'to', 'for', 'in', 'on', 'is', 'are', 'my', 'i', 'me', 'how', 'what', 'which', 'get', 'can', 'do', 'did', 'when'])

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOPWORDS.has(w))
}

export interface RetrievedContext {
  articles: Article[]
  policies: PolicyFact[]
}

/**
 * Keyword-overlap retrieval. Returns the best-matching articles (and their
 * category policy facts) to ground agent answers without a vector store.
 */
export function retrieveContext(query: string): RetrievedContext {
  const qTokens = tokens(query)
  if (qTokens.length === 0) return { articles: [], policies: [] }

  const scored = articles.map(a => {
    const body = `${a.question} ${a.answer} ${a.category}`
    const bodyTokens = tokens(body)
    let score = 0
    for (const qt of qTokens) {
      if (bodyTokens.includes(qt)) score += 2
      if (body.includes(qt)) score += 1
    }
    return { article: a, score }
  })

  const matches = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.article)

  return { articles: matches, policies: policyBlock }
}