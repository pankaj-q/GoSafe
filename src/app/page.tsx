import type { Metadata } from 'next'
import NavHeader from '@/components/NavHeader'
import Footer from '@/components/Footer'
import SearchBar from '@/components/SearchBar'
import AdSlot from '@/components/AdSlot'
import NewsletterSignup from '@/components/NewsletterSignup'
import Link from 'next/link'
import {
  ShieldCheck, HeadphonesIcon, TicketCheck, Bus, Clock, ArrowRight,
  Search, CreditCard, Star, Users, ChevronRight,
  SmartphoneIcon, CheckCircle, TrendingUp, MapPin,
} from 'lucide-react'
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

const howItWorks = [
  { icon: Search, title: 'Search', desc: 'Enter source, destination & travel date' },
  { icon: Bus, title: 'Select', desc: 'Compare buses, pick seats & add insurance' },
  { icon: CreditCard, title: 'Pay', desc: 'Pay via UPI, card, netbanking — get instant e-ticket' },
]

const stats = [
  { icon: Users, value: '50K+', label: 'Happy Travellers' },
  { icon: MapPin, value: '80+', label: 'Cities Covered' },
  { icon: Bus, value: '200+', label: 'Bus Operators' },
  { icon: Star, value: '4.3', label: 'Average Rating' },
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

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-300 blur-3xl" />
        </div>
        <div className="relative gosafe-container py-10 sm:py-14">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/30 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-4">
              <TrendingUp className="w-3 h-3" /> India&apos;s Trusted Bus Platform
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3 leading-tight">
              Book Bus Tickets Across India
            </h1>
            <p className="text-blue-200 text-sm sm:text-base max-w-lg mx-auto">
              Safe, reliable & affordable bus travel for every route in India — AC Sleeper, Volvo, Non-AC.
              Instant e-tickets, free cancellation, 24/7 support.
            </p>
          </div>

          {/* Search card */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-4 sm:p-6 shadow-2xl ring-1 ring-black/5">
            <SearchBar />
          </div>

          {/* Trust bar */}
          <div className="max-w-3xl mx-auto mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map(s => {
              const Icon = s.icon
              return (
                <div key={s.label} className="flex items-center gap-2 justify-center sm:justify-start bg-white/10 rounded-xl px-3 py-2.5 backdrop-blur-sm">
                  <Icon className="w-5 h-5 text-blue-200 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-white">{s.value}</div>
                    <div className="text-[10px] text-blue-200">{s.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ AD SLOT 1 ============ */}
      <div className="gosafe-container pt-6">
        <AdSlot format="leaderboard" />
      </div>

      {/* ============ POPULAR ROUTES ============ */}
      <section className="gosafe-container py-8 sm:py-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Popular Bus Routes</h2>
            <p className="text-xs text-gray-500 mt-0.5">Most searched routes by travellers</p>
          </div>
          <Link href="/search" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {popularRoutes.map((route, i) => (
            <Link
              key={i}
              href={`/search?source=${encodeURIComponent(route.from)}&destination=${encodeURIComponent(route.to)}&date=${new Date().toISOString().split('T')[0]}`}
              className="group relative gosafe-card p-3.5 hover:border-blue-200 transition-all hover:-translate-y-0.5"
              aria-label={`Bus from ${route.from} to ${route.to}`}
            >
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                <span>{route.from}</span>
                <ArrowRight className="w-3 h-3 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                <span>{route.to}</span>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {route.duration}
                </span>
                <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-[11px]">
                  {route.fare}
                </span>
              </div>
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5 pointer-events-none" />
            </Link>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="bg-white border-t border-gray-100">
        <div className="gosafe-container py-10">
          <div className="text-center mb-8">
            <h2 className="text-lg font-bold text-gray-900">How GoSafe Works</h2>
            <p className="text-xs text-gray-500 mt-1">Book your bus ticket in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {howItWorks.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={i} className="text-center relative">
                  {i < howItWorks.length - 1 && (
                    <div className="hidden sm:block absolute top-8 left-[60%] w-[80%] h-0.5 border-t-2 border-dashed border-gray-200" />
                  )}
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3 relative">
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </div>
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-500">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="gosafe-container py-10">
          <div className="text-center mb-8">
            <h2 className="text-lg font-bold text-gray-900">Why Choose GoSafe?</h2>
            <p className="text-xs text-gray-500 mt-1">Everything you need for a safe, comfortable journey</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ AD SLOT 2 ============ */}
      <div className="gosafe-container py-6">
        <AdSlot format="rectangle" />
      </div>

      {/* ============ APP DOWNLOAD CTA ============ */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="gosafe-container py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-white mb-2">Get the GoSafe App</h2>
              <p className="text-blue-200 text-sm max-w-md">
                Download now for faster booking, exclusive app-only offers, and real-time bus tracking on the go.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-5">
                <span className="flex items-center gap-1.5 text-xs text-blue-200">
                  <CheckCircle className="w-3.5 h-3.5" /> Instant booking
                </span>
                <span className="flex items-center gap-1.5 text-xs text-blue-200">
                  <CheckCircle className="w-3.5 h-3.5" /> Live tracking
                </span>
                <span className="flex items-center gap-1.5 text-xs text-blue-200">
                  <CheckCircle className="w-3.5 h-3.5" /> Exclusive deals
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                <SmartphoneIcon className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-[10px] text-gray-400">Download on</div>
                  <div className="text-xs font-semibold -mt-0.5">App Store</div>
                </div>
              </button>
              <button className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                <SmartphoneIcon className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-[10px] text-gray-400">Get it on</div>
                  <div className="text-xs font-semibold -mt-0.5">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSignup />

      {/* ============ FAQ ============ */}
      <section className="gosafe-container py-8 sm:py-10">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="text-xs text-gray-500 mt-0.5">Everything you need to know about bus booking on GoSafe</p>
        </div>
        <div className="max-w-2xl mx-auto space-y-2.5">
          {faqData.map((faq, i) => (
            <details key={i} className="group bg-white rounded-xl border border-gray-100 p-4 open:border-blue-200 open:shadow-sm transition-all">
              <summary className="font-medium text-sm text-gray-900 cursor-pointer list-none flex items-center justify-between gap-4">
                {faq.question}
                <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0" />
              </summary>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ============ AD SLOT 3 ============ */}
      <div className="gosafe-container pb-6">
        <AdSlot format="leaderboard" />
      </div>

      <Footer />
    </>
  )
}
