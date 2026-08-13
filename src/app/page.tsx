import type { Metadata } from 'next'
import NavHeader from '@/components/NavHeader'
import Footer from '@/components/Footer'
import SearchBar from '@/components/SearchBar'
import AdSlot from '@/components/AdSlot'
import NewsletterSignup from '@/components/NewsletterSignup'
import TypewriterText from '@/components/TypewriterText'
import OffersSection from '@/components/OffersSection'
import Link from 'next/link'
import {
  ShieldCheck, HeadphonesIcon, TicketCheck, Bus, Clock, ArrowRight,
  Search, CreditCard, Star, Users, ChevronRight,
  SmartphoneIcon, CheckCircle, TrendingUp, MapPin, Sparkles, Lightbulb, Backpack,
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
  { icon: CreditCard, title: 'Pay', desc: 'Pay securely via UPI, card or netbanking' },
  { icon: CheckCircle, title: 'Instant Ticket', desc: 'E-ticket on email & WhatsApp — just show it on board' },
]

const stats = [
  { icon: Users, value: '50K+', label: 'Happy Travellers' },
  { icon: MapPin, value: '80+', label: 'Cities Covered' },
  { icon: Bus, value: '200+', label: 'Bus Operators' },
  { icon: Star, value: '4.3', label: 'Average Rating' },
]

const faqData = [
  { question: 'How to book bus tickets online in India?', answer: 'Simply enter your source and destination cities, select travel date, compare available buses, pick seats, add optional insurance, and pay. Your e-ticket arrives via email and WhatsApp instantly — just show it on board.' },
  { question: 'What is the seat hold feature?', answer: 'When you select a seat, GoSafe locks it for you for 10 minutes free of cost. You can safely enter passenger details and pay without someone else grabbing your preferred seat. Your seats stay reserved until you complete payment or the timer runs out.' },
  { question: 'Can I track my bus in real time?', answer: 'Yes. Every GoSafe bus is GPS-tracked. On the booking page and in My Bookings, you can see the live location of your bus, the number of stops it has covered, and the estimated arrival time — so you always know when to head to the boarding point.' },
  { question: 'Can I cancel my bus ticket and get a refund?', answer: 'Yes. Cancel up to 6 hours before departure for a 90% refund, and up to 2 hours before for 50%. Cancellations within 2 hours of departure are non-refundable. UPI refunds are processed within 24 hours.' },
  { question: 'What bus types are available on GoSafe?', answer: 'We offer AC Sleeper, Non-AC Sleeper, AC Seater, Non-AC Seater, Volvo AC, Volvo AC Sleeper, and AC Semi-Sleeper buses across routes in India. Use the seater/sleeper and amenity filters to find exactly what you need.' },
  { question: 'What do the seat colors mean?', answer: 'Green means the seat is available, blue means you have selected it, red with an ✕ is already booked, amber is held by another user for the next 10 minutes, and grey dashed means the berth is not available for sale.' },
  { question: 'Is bus travel insurance available?', answer: 'Yes. Add travel insurance for just ₹19 per seat, covering accidental death, medical expenses, baggage loss, and journey cancellation. It’s optional, added in one tap at the seat-selection step.' },
  { question: 'How do I get my ticket after booking?', answer: 'Your e-ticket is sent via email and WhatsApp immediately after confirmation. You can also download the PDF ticket from the confirmation page or from My Bookings anytime. No need to print it — just show the ticket on your phone at boarding.' },
  { question: 'How do GoSafe Points and member tiers work?', answer: 'Every member earns 1 GoSafe Point per ₹10 spent. As you travel more, you move up from Explorer to Silver, Gold, and Platinum tiers — unlocking priority refunds, special fares, and exclusive seasonal offers.' },
  { question: 'What payment methods do you accept?', answer: 'We accept UPI, credit/debit cards, and netbanking through our secure Stripe gateway. Payments are PCI-DSS compliant, and offers like GOFIRST20 (20% off first trip) can be applied at checkout.' },
  { question: 'Is GoSafe available as a mobile app?', answer: 'Not yet — but the website is fully optimised for mobile and works like an app. Add it to your home screen for one-tap access, and the native Android and iOS apps are coming soon.' },
  { question: 'How do I contact support if I have a problem?', answer: 'Our support team is available 24×7 over call at 1800-800-1234 and on WhatsApp. For quick self-help, visit the Help Centre at Help page, or reach us from the contact page.' },
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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3 leading-tight whitespace-nowrap">
              Book{' '}
              <span className="font-[Aquire] font-normal italic tracking-wider">
                <TypewriterText words={['Bus Tickets', 'Bus Booking', 'Travel Safe']} typeSpeed={150} deleteSpeed={80} />
              </span>{' '}
              Across India
            </h1>
            <p className="text-blue-200 text-sm sm:text-base max-w-lg mx-auto">
              Safe, reliable & affordable bus travel for every route in India — AC Sleeper, Volvo, Non-AC.
              Instant e-tickets, free cancellation, 24/7 support.
            </p>
          </div>

          {/* Search card */}
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-2xl ring-1 ring-black/5">
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
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Popular Bus Routes</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Most searched routes by travellers</p>
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
              className="group relative gosafe-card p-3.5 hover:border-blue-200 dark:bg-gray-900 dark:border-gray-800 transition-all hover:-translate-y-0.5"
              aria-label={`Bus from ${route.from} to ${route.to}`}
            >
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800 dark:text-gray-300">
                <span>{route.from}</span>
                <ArrowRight className="w-3 h-3 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                <span>{route.to}</span>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {route.duration}
                </span>
                <span className="font-semibold text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-md text-[11px]">
                  {route.fare}
                </span>
              </div>
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5 pointer-events-none" />
            </Link>
          ))}
        </div>
      </section>

      {/* ============ LIVE BUS TRACKING ============ */}
      <section className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="gosafe-container py-10 sm:py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left copy */}
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold px-3 py-1 rounded-full mb-3">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Live Bus Tracking
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                Know exactly where your bus is
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                Track your bus in real time on the map, see live location, estimated arrival,
                and how many seats are left before you board.
              </p>
              <ul className="mt-5 space-y-3">
                {[
                  { t: 'Live location updates every 30 seconds', d: 'No more waiting at the stop unsure' },
                  { t: 'Arrival ETA alerts to your phone', d: 'WhatsApp & push notifications before pickup' },
                  { t: 'Seat availability in real time', d: 'Last-minute seats booked instantly' },
                ].map(f => (
                  <li key={f.t} className="flex gap-3">
                    <span className="w-6 h-6 mt-0.5 shrink-0 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{f.t}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{f.d}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                href="/search"
                className="mt-6 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                Track my bus <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right — animated route card */}
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                    <Bus className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100">GoSafe Live 4567</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" /> On time · Delhi → Varanasi
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-md">45% seats left</span>
              </div>

              {/* Route line */}
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  {[
                    { label: 'Delhi', time: '10:30 PM', done: true },
                    { label: 'Agra', time: '1:15 AM', done: true },
                    { label: 'Kanpur', time: '4:40 AM', done: false },
                    { label: 'Varanasi', time: '8:10 AM', done: false },
                  ].map(pt => (
                    <div key={pt.label} className="flex flex-col items-center gap-1 z-10">
                      <div className={`w-2.5 h-2.5 rounded-full ${pt.done ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                      <span className={`text-[10px] font-medium ${pt.done ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>{pt.label}</span>
                      <span className="text-[9px] text-gray-400 dark:text-gray-600">{pt.time}</span>
                    </div>
                  ))}
                </div>
                {/* Progress track + moving bus */}
                <div className="relative h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-visible">
                  <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                  <div className="absolute top-1/2 -translate-y-1/2 animate-bus-move">
                    <div className="w-9 h-9 -ml-4 rounded-full bg-white dark:bg-gray-900 shadow-lg border-2 border-emerald-500 flex items-center justify-center">
                      <Bus className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { v: '2h 45m', l: 'Arriving in' },
                  { v: '412 km', l: 'Distance left' },
                  { v: '36 km/h', l: 'Avg speed' },
                ].map(s => (
                  <div key={s.l} className="text-center bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 px-2 py-3">
                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{s.v}</div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ OFFERS & COUPONS ============ */}
      <OffersSection />

      {/* ============ HOW IT WORKS ============ */}
      <section className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="gosafe-container py-10">
          <div className="text-center mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">How GoSafe Works</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Book your bus ticket in 4 simple steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {howItWorks.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={i} className="text-center relative">
                  {i < howItWorks.length - 1 && (
                    <div className="hidden sm:block absolute top-8 left-[60%] w-[80%] h-0.5 border-t-2 border-dashed border-gray-200 dark:border-gray-700" />
                  )}
                  <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mx-auto mb-3 relative">
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </div>
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="bg-gray-50 dark:bg-gray-900/60 border-t border-gray-100 dark:border-gray-800">
        <div className="gosafe-container py-10">
          <div className="text-center mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Why Choose GoSafe?</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Everything you need for a safe, comfortable journey</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:border-blue-100 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="gosafe-container py-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-semibold px-3 py-1 rounded-full mb-3">
              <Star className="w-3 h-3 fill-current" /> Loved by travellers
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">What travellers say</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Real reviews from real journeys</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: 'Priya Sharma',
                route: 'Delhi → Varanasi',
                stars: 5,
                text: 'Booked at 11 PM, got my ticket on WhatsApp in 2 minutes. The live tracking feature saved me — knew exactly when the bus was near.',
              },
              {
                name: 'Rahul Verma',
                route: 'Mumbai → Pune',
                stars: 5,
                text: 'Clean sleeper, on-time, and the seat I picked stayed locked while I paid. Cancellation refund hit my bank same day.',
              },
              {
                name: 'Anjali Nair',
                route: 'Bangalore → Chennai',
                stars: 4,
                text: 'Great prices and the support team is genuinely helpful at 2 AM. Added insurance for ₹19 and travelled worry-free.',
              },
              {
                name: 'Vikram Singh',
                route: 'Delhi → Jaipur',
                stars: 5,
                text: 'My first trip on GoSafe and the GOFIRST20 code actually worked. Driver shared live location — very professional.',
              },
              {
                name: 'Sneha Gupta',
                route: 'Delhi → Lucknow',
                stars: 5,
                text: 'The seat map is so easy to use. Picked my window seat, paid via UPI, instant e-ticket. This is how booking should be.',
              },
              {
                name: 'Arjun Mehta',
                route: 'Pune → Mumbai',
                stars: 4,
                text: 'Free cancellation saved me when plans changed. Refund was processed automatically — no emails, no calls, no hassle.',
              },
            ].map(t => (
              <div key={t.name} className="gosafe-card bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < t.stars ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-700'}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">“{t.text}”</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 dark:border-gray-700">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">{t.name}</div>
                      <div className="text-[10px] text-gray-400 dark:text-gray-500">{t.route}</div>
                    </div>
                  </div>
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            ))}
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
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* LEFT — FAQ questions */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-semibold px-3 py-1 rounded-full mb-3">
                <HeadphonesIcon className="w-3 h-3" /> FAQs
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Frequently Asked Questions</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Everything you need to know about bus booking on GoSafe</p>
            </div>
            <div className="space-y-2.5">
              {faqData.map((faq, i) => (
                <details key={i} className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 open:border-blue-200 dark:open:border-blue-500/40 open:shadow-sm transition-all">
                  <summary className="font-medium text-sm text-gray-900 dark:text-gray-100 cursor-pointer list-none flex items-center justify-between gap-4">
                    {faq.question}
                    <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-open:rotate-90 transition-transform shrink-0" />
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>

            {/* Support CTA */}
            <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-100 dark:border-blue-500/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-600 flex items-center justify-center">
                  <HeadphonesIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Still have questions?</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Our team is here 24×7 to help you with anything.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href="tel:+918000123456" className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 rounded-lg px-3.5 py-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
                  <HeadphonesIcon className="w-3.5 h-3.5" /> Call 1800-800-1234
                </a>
                <Link href="/help" className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg px-3.5 py-2 hover:bg-blue-700 transition-colors">
                  Visit Help Centre <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT — exciting bus facts & travel tips */}
          <div className="lg:col-span-2 space-y-5 lg:sticky lg:top-24">
            {/* Did you know? */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
              <div className="p-5">
                <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold mb-3">
                  <Sparkles className="w-4 h-4" /> Did you know?
                </div>
                <div className="space-y-4">
                  {[
                    { t: 'Buses save the planet', d: 'One full bus takes ~40 cars off the road and cuts carbon emissions by up to 80% per passenger.' },
                    { t: 'Sleepers are built for night runs', d: 'A horizontal berth lets you sleep 6–7 hours — wake up refreshed at your destination.' },
                    { t: 'Our fastest corridor', d: 'Mumbai → Pune averages just 3h 30m, with 4 buses departing every hour.' },
                  ].map(f => (
                    <div key={f.t} className="flex gap-3">
                      <div className="w-7 h-7 shrink-0 rounded-lg bg-white/15 flex items-center justify-center">
                        <Lightbulb className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold leading-snug">{f.t}</div>
                        <div className="text-[11px] text-blue-100 mt-0.5 leading-relaxed">{f.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Travel tips */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">
                <Backpack className="w-4 h-4 text-emerald-500" /> Smart travel tips
              </div>
              <ul className="space-y-3">
                {[
                  { t: 'Book window seats first', d: 'Rows 2–4 on the seater deck give the smoothest ride.' },
                  { t: 'Board 15 minutes early', d: 'Buses leave on time — track your bus live before you head out.' },
                  { t: 'Apply a coupon at checkout', d: 'GOFIRST20 gives new travellers 20% off their first trip.' },
                  { t: 'Use insurance for just ₹19', d: 'Covers baggage loss, medicals & trip cancellation.' },
                ].map(tip => (
                  <li key={tip.t} className="flex gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{tip.t}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{tip.d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: '2M+', l: 'Travellers monthly' },
                { v: '500+', l: 'Cities connected' },
                { v: '10 min', l: 'Free seat hold' },
                { v: '4.6★', l: 'Traveller rating' },
              ].map(s => (
                <div key={s.l} className="bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700 p-4 text-center">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{s.v}</div>
                  <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
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
