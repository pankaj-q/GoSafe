'use client'

import { useState, useMemo, useRef } from 'react'
import {
  Search, Ticket, CreditCard, XCircle, RotateCcw, Wrench, ChevronRight,
  MessageCircle, Phone, Mail, X, Sparkles,
} from 'lucide-react'

interface Article {
  id: string
  category: string
  question: string
  answer: string
}

const articles: Article[] = [
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

export default function HelpCentre() {
  const [query, setQuery] = useState('')
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set())
  const resultsRef = useRef<HTMLDivElement>(null)

  const trimmed = query.trim().toLowerCase()
  const DEFAULT_ANSWERS = 8

  const results = useMemo(() => {
    if (!trimmed) return []
    return articles.filter(a =>
      a.question.toLowerCase().includes(trimmed) ||
      a.answer.toLowerCase().includes(trimmed) ||
      a.category.toLowerCase().includes(trimmed)
    )
  }, [trimmed])

  const displayedArticles = useMemo(() => {
    if (trimmed) {
      return results.length > 0 ? results : []
    }
    const base = articles.slice(0, DEFAULT_ANSWERS)
    const pinned = articles.filter(a => pinnedIds.has(a.id) && !base.some(b => b.id === a.id))
    return [...base, ...pinned]
  }, [trimmed, results, pinnedIds])

  function highlight(text: string) {
    if (!trimmed) return text
    const idx = text.toLowerCase().indexOf(trimmed)
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-amber-100 dark:bg-amber-500/30 text-inherit rounded px-0.5">{text.slice(idx, idx + trimmed.length)}</mark>
        {text.slice(idx + trimmed.length)}
      </>
    )
  }

  function openArticle(id: string) {
    setPinnedIds(prev => new Set(prev).add(id))
    setOpenIds(prev => new Set(prev).add(id))
    setQuery('')
    requestAnimationFrame(() => {
      document.getElementById(`article-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function toggleArticle(id: string) {
    setOpenIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
        <div className="gosafe-container py-14 sm:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">Help Centre</h1>
            <p className="text-blue-200 text-sm mb-6">Find answers to your questions or reach out to our support team</p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for help topics..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border-0 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 bg-white"
                aria-label="Search help topics"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live search results */}
            {trimmed && (
              <div ref={resultsRef} className="max-w-md mx-auto mt-3 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 text-left overflow-hidden animate-fade-in">
                {results.length > 0 ? (
                  <ul className="max-h-72 overflow-y-auto no-scrollbar divide-y divide-gray-50 dark:divide-gray-800">
                    {results.map(r => (
                      <li key={r.id}>
                        <button
                          onClick={() => { openArticle(r.id); setQuery('') }}
                          className="w-full flex items-start gap-2.5 px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{highlight(r.question)}</div>
                            <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{r.category}</div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">No answers found</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Try a different keyword, or reach us on WhatsApp 24×7.</p>
                    <a
                      href="https://wa.me/918000123456"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-500 text-white rounded-lg px-3.5 py-2 hover:bg-emerald-600 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Chat on WhatsApp
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories with working article links */}
      <section className="gosafe-container py-10">
        {!trimmed ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => {
              const Icon = cat.icon
              const catArticles = articles.filter(a => a.category === cat.title)
              return (
                <div key={cat.title} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 hover:border-blue-100 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{cat.title}</h2>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">{cat.desc}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {catArticles.map(article => (
                      <li key={article.id}>
                        <button
                          onClick={() => openArticle(article.id)}
                          className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                        >
                          <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-600 shrink-0" />
                          {article.question}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
            Showing {results.length} answer{results.length === 1 ? '' : 's'} for “{query}” — click a result above to open it.
          </div>
        )}
      </section>

      {/* All answers (accordions, anchored per article) */}
      <section id="faqs" className="bg-gray-50 dark:bg-gray-900/60 border-y border-gray-100 dark:border-gray-800">
        <div className="gosafe-container py-10">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {trimmed ? 'Matching answers' : 'Popular answers'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {trimmed
                ? `${displayedArticles.length} result${displayedArticles.length === 1 ? '' : 's'} for “${query}”`
                : `Showing ${displayedArticles.length} of ${articles.length} answers — search above to find more`}
            </p>
          </div>
          {trimmed && displayedArticles.length === 0 ? (
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 text-center">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">No matching answers</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Try a different keyword, or reach us on WhatsApp 24×7.</p>
              <a
                href="https://wa.me/918000123456"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-500 text-white rounded-lg px-3.5 py-2 hover:bg-emerald-600 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Chat on WhatsApp
              </a>
            </div>
          ) : (
          <div className="max-w-2xl mx-auto space-y-2.5">
            {displayedArticles.map(a => (
              <details
                key={a.id}
                id={`article-${a.id}`}
                open={openIds.has(a.id)}
                className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 open:border-blue-200 dark:open:border-blue-500/40 open:shadow-sm transition-all scroll-mt-28"
              >
                <summary
                  onClick={e => { e.preventDefault(); toggleArticle(a.id) }}
                  className="font-medium text-sm text-gray-900 dark:text-gray-100 cursor-pointer list-none flex items-center justify-between gap-4"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded px-1.5 py-0.5 shrink-0">{a.category}</span>
                    {a.question}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-gray-400 dark:text-gray-500 group-open:rotate-90 transition-transform shrink-0`} />
                </summary>
                <p className="mt-2 pl-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{a.answer}</p>
              </details>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section className="gosafe-container py-10 text-center">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Still need help?</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Our support team is available 24/7</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="tel:+918000123456" className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors">
            <Phone className="w-4 h-4" /> +91 8000 123 456
          </a>
          <a href="mailto:support@gosafe.in" className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-medium px-5 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-800 hover:border-blue-200 transition-colors">
            <Mail className="w-4 h-4" /> support@gosafe.in
          </a>
          <a href="https://wa.me/918000123456" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-medium px-5 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-800 hover:border-blue-200 transition-colors">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        </div>
      </section>
    </>
  )
}

const categories = [
  { icon: Ticket, title: 'Booking', desc: 'How to book, modify tickets, select seats, add insurance, and receive e-tickets.' },
  { icon: CreditCard, title: 'Payments', desc: 'Payment methods, failed transactions, UPI issues, and receipt downloads.' },
  { icon: XCircle, title: 'Cancellation', desc: 'Cancel tickets, understand cancellation charges, and timelines.' },
  { icon: RotateCcw, title: 'Refunds', desc: 'Refund timelines, modes, tracking status, and partial refunds.' },
  { icon: Wrench, title: 'Technical Support', desc: 'App issues, website problems, login help, and error messages.' },
]
