import type { Metadata } from 'next'
import NavHeader from '@/components/NavHeader'
import Footer from '@/components/Footer'
import { Search, Ticket, CreditCard, XCircle, RotateCcw, Wrench, ChevronRight, MessageCircle, Phone, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Help Centre | GoSafe Bus Booking Support',
  description: 'Get help with bus booking, payments, cancellations, refunds, and technical issues. GoSafe Help Centre available 24/7.',
  openGraph: {
    title: 'GoSafe Help Centre',
    description: 'Find answers to your bus booking questions. 24/7 support for cancellations, refunds, payments & more.',
  },
  keywords: ['GoSafe help', 'bus booking help', 'cancel bus ticket', 'refund support', 'payment issue bus booking'],
}

const categories = [
  {
    icon: Ticket,
    title: 'Booking',
    desc: 'How to book, modify tickets, select seats, add insurance, and receive e-tickets.',
    articles: [
      'How do I book a bus ticket on GoSafe?',
      'How do I receive my e-ticket?',
      'Can I modify my booking after payment?',
      'What is bus travel insurance and how do I add it?',
      'How do I select preferred seats?',
    ],
  },
  {
    icon: CreditCard,
    title: 'Payments',
    desc: 'Payment methods, failed transactions, UPI issues, and receipt downloads.',
    articles: [
      'What payment methods are accepted?',
      'My payment was deducted but booking is not confirmed',
      'How do I download my payment receipt?',
      'Is it safe to pay on GoSafe?',
      'Why was my UPI transaction declined?',
    ],
  },
  {
    icon: XCircle,
    title: 'Cancellation',
    desc: 'Cancel tickets, understand cancellation charges, and timelines.',
    articles: [
      'How do I cancel my bus ticket?',
      'What is the cancellation policy?',
      'How much cancellation fee will be charged?',
      'Can I cancel a partially used ticket?',
      'How do I cancel a group booking?',
    ],
  },
  {
    icon: RotateCcw,
    title: 'Refunds',
    desc: 'Refund timelines, modes, tracking status, and partial refunds.',
    articles: [
      'How long does a refund take?',
      'Where will my refund be credited?',
      'How do I track my refund status?',
      'I received a partial refund — why?',
      'Can I get a refund to a different account?',
    ],
  },
  {
    icon: Wrench,
    title: 'Technical Support',
    desc: 'App issues, website problems, login help, and error messages.',
    articles: [
      'GoSafe app is not working — what to do?',
      'I can\'t log in to my account',
      'Website is loading slowly',
      'How to clear cache and cookies?',
      'Supported browsers for GoSafe website?',
    ],
  },
]

const faqs = [
  { q: 'How do I book a bus ticket?', a: 'Enter source and destination, select travel date, choose a bus, pick your seat, enter passenger details, and pay. Your e-ticket is sent via email and WhatsApp instantly.' },
  { q: 'Can I cancel my ticket and get a refund?', a: 'Yes. Free cancellation up to 6 hours before departure (90% refund). 50% refund up to 2 hours before. No refund within 2 hours of departure.' },
  { q: 'How long does a refund take?', a: 'Refunds are processed within 5-7 business days. UPI payments are refunded within 24 hours, card payments within 3-5 days, and netbanking within 5-7 days.' },
]

export default function HelpPage() {
  return (
    <>
      <NavHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
        <div className="gosafe-container py-14 sm:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Help Centre
            </h1>
            <p className="text-blue-200 text-sm mb-6">Find answers to your questions or reach out to our support team</p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help topics..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border-0 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="gosafe-container py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => {
            const Icon = cat.icon
            return (
              <div key={cat.title} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-blue-100 hover:shadow-sm transition-all">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-sm">{cat.title}</h2>
                    <p className="text-[10px] text-gray-500">{cat.desc}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {cat.articles.map((article, i) => (
                    <li key={i}>
                      <a href="#" className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-600 transition-colors">
                        <ChevronRight className="w-3 h-3 text-gray-300" />
                        {article}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* Quick FAQs */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="gosafe-container py-10">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-6">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-2.5">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl border border-gray-100 p-4 open:border-blue-200 open:shadow-sm transition-all">
                <summary className="font-medium text-sm text-gray-900 cursor-pointer list-none flex items-center justify-between gap-4">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="gosafe-container py-10 text-center">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Still need help?</h2>
        <p className="text-sm text-gray-500 mb-6">Our support team is available 24/7</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="tel:+918000123456" className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors">
            <Phone className="w-4 h-4" /> +91 8000 123 456
          </a>
          <a href="mailto:support@gosafe.in" className="inline-flex items-center gap-2 bg-white text-gray-700 font-medium px-5 py-2.5 rounded-xl text-sm border border-gray-200 hover:border-blue-200 transition-colors">
            <Mail className="w-4 h-4" /> support@gosafe.in
          </a>
          <a href="#" className="inline-flex items-center gap-2 bg-white text-gray-700 font-medium px-5 py-2.5 rounded-xl text-sm border border-gray-200 hover:border-blue-200 transition-colors">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </>
  )
}
