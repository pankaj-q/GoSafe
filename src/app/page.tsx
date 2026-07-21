import type { Metadata } from 'next'
import NavHeader from '@/components/NavHeader'
import SearchBar from '@/components/SearchBar'
import Link from 'next/link'
import { ShieldCheck, HeadphonesIcon, TicketCheck, Bus, Clock, ArrowRight } from 'lucide-react'
import { jsonLdFAQ, jsonLdBreadcrumb } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'GoSafe - Bus Booking India | Book Online Bus Tickets',
  description: 'Book bus tickets online for routes across India. Compare AC Sleeper, Volvo, Non-AC buses. Best prices, safe travel, instant e-ticket & WhatsApp delivery.',
  openGraph: {
    title: 'GoSafe - Bus Booking India | Book Online Bus Tickets',
    description: 'Book bus tickets online for all India routes. AC Sleeper, Volvo, Non-AC. Instant confirmation.',
  },
  keywords: [
    'bus booking', 'book bus online', 'online bus ticket', 'bus ticket booking India',
    'GoSafe', 'Delhi to Varanasi bus', 'AC sleeper bus', 'volvo bus booking',
  ],
}

const popularRoutes = [
  { from: 'Delhi', to: 'Varanasi', duration: '10h 30m', fare: '₹899' },
  { from: 'Delhi', to: 'Mumbai', duration: '16h 0m', fare: '₹1,299' },
  { from: 'Delhi', to: 'Hyderabad', duration: '14h 0m', fare: '₹1,199' },
  { from: 'Mumbai', to: 'Pune', duration: '3h 30m', fare: '₹499' },
  { from: 'Bangalore', to: 'Chennai', duration: '6h 0m', fare: '₹699' },
  { from: 'Delhi', to: 'Jaipur', duration: '5h 0m', fare: '₹499' },
  { from: 'Delhi', to: 'Lucknow', duration: '7h 0m', fare: '₹699' },
  { from: 'Pune', to: 'Mumbai', duration: '3h 30m', fare: '₹499' },
]

const features = [
  { icon: ShieldCheck, title: 'Safe Travel', desc: 'Verified buses with CCTV, GPS tracking & emergency support' },
  { icon: TicketCheck, title: 'Easy Booking', desc: 'Simple 3-step booking. No hidden charges. Instant confirmation' },
  { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Call or WhatsApp support in Hindi & English' },
  { icon: Clock, title: 'Free Cancellation', desc: 'Cancel up to 6 hours before departure for full refund' },
]

const faqData = [
  { question: 'How to book bus tickets online in India?', answer: 'Simply enter your source and destination cities, select travel date, choose from available buses, pick seats, enter passenger details, and pay. You will receive e-ticket via email and WhatsApp instantly.' },
  { question: 'Can I cancel my bus ticket and get a refund?', answer: 'Yes. Cancel up to 6 hours before departure for 90% refund, up to 2 hours for 50% refund. Cancellations within 2 hours of departure are non-refundable.' },
  { question: 'What bus types are available on GoSafe?', answer: 'We offer AC Sleeper, Non-AC Sleeper, AC Seater, Non-AC Seater, Volvo AC, Volvo AC Sleeper, and AC Semi-Sleeper buses across all major routes in India.' },
  { question: 'Is bus travel insurance available?', answer: 'Yes. You can add travel insurance for just ₹19 per seat, covering accidental death, medical expenses, baggage loss, and journey cancellation.' },
  { question: 'How do I get my bus ticket after booking?', answer: 'Your e-ticket is sent via email and WhatsApp immediately after booking confirmation. You can also download the PDF ticket from the confirmation page.' },
]

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb([{ name: 'Home', url: '/' }])) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ(faqData)) }}
      />

      <NavHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="gosafe-container py-12 sm:py-16">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Book Bus Tickets Across India
            </h1>
            <p className="text-blue-100 text-base sm:text-lg">
              Safe, reliable & affordable bus travel for every route in India — AC Sleeper, Volvo, Non-AC
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-4 sm:p-6 shadow-elevated">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="gosafe-container py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Popular Bus Routes</h2>
          <Link href="/search" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {popularRoutes.map((route, i) => (
            <Link
              key={i}
              href={`/search?source=${encodeURIComponent(route.from)}&destination=${encodeURIComponent(route.to)}&date=${new Date().toISOString().split('T')[0]}`}
              className="gosafe-card p-3.5 hover:border-blue-200 transition-all group"
              aria-label={`Bus from ${route.from} to ${route.to}`}
            >
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                <span>{route.from}</span>
                <ArrowRight className="w-3 h-3 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                <span>{route.to}</span>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {route.duration}
                </span>
                <span className="font-semibold text-blue-600">{route.fare}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-10 border-t border-gray-100">
        <div className="gosafe-container">
          <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">Why Choose GoSafe for Bus Booking?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="text-center p-5 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors" itemScope itemType="https://schema.org/ItemList">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="gosafe-container py-10">
        <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
        <div className="max-w-2xl mx-auto space-y-3">
          {faqData.map((faq, i) => (
            <details key={i} className="gosafe-card p-4 group open:border-blue-200">
              <summary className="font-medium text-sm text-gray-900 cursor-pointer list-none flex items-center justify-between">
                {faq.question}
                <ArrowRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0" />
              </summary>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-sm">
        <div className="gosafe-container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <Bus className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">GoSafe</span>
            </div>
            <nav className="flex items-center gap-6" aria-label="Footer navigation">
              <span>© 2026 GoSafe</span>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </nav>
          </div>
        </div>
      </footer>
    </>
  )
}
