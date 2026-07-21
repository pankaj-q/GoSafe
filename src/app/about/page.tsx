import type { Metadata } from 'next'
import NavHeader from '@/components/NavHeader'
import Footer from '@/components/Footer'
import { ShieldCheck, Users, Bus, MapPin, Award, Target, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | GoSafe - India\'s Trusted Bus Booking Platform',
  description: 'Learn about GoSafe — India\'s fastest growing bus booking platform launched in 2024. We connect 80+ cities with safe, reliable and affordable bus travel.',
  openGraph: {
    title: 'About GoSafe - Bus Booking India',
    description: 'India\'s fastest growing bus booking platform. Safe, reliable & affordable bus travel across 80+ cities.',
  },
  keywords: ['about GoSafe', 'bus booking company', 'Indian bus platform', 'GoSafe team'],
}

const stats = [
  { icon: Bus, value: '80+', label: 'Cities' },
  { icon: Users, value: '50K+', label: 'Happy Travellers' },
  { icon: MapPin, value: '200+', label: 'Bus Partners' },
  { icon: Award, value: '4.3', label: 'Rating' },
]

const values = [
  {
    icon: ShieldCheck,
    title: 'Safety First',
    desc: 'We partner only with verified operators. Every bus has GPS tracking, CCTV, and emergency contacts for passenger safety.',
  },
  {
    icon: Target,
    title: 'Reliability',
    desc: 'Real-time tracking, instant e-tickets, and 24/7 support ensure a stress-free travel experience every time.',
  },
  {
    icon: Heart,
    title: 'Customer Focus',
    desc: 'Our support team is available in Hindi & English. Free cancellation, easy refunds, and transparent pricing always.',
  },
]

const timeline = [
  { year: '2024 Q1', event: 'GoSafe launched in Delhi-NCR with 10 bus operators and 25 routes' },
  { year: '2024 Q2', event: 'Expanded to 40 cities; crossed 10,000 passengers milestone' },
  { year: '2024 Q3', event: 'Launched mobile app; introduced real-time GPS tracking & insurance' },
  { year: '2024 Q4', event: '50,000+ passengers, 80+ cities, 200+ operator partnerships across India' },
  { year: '2025 Q1', event: 'Awarded "Emerging Travel Platform of the Year" at India Travel Awards' },
]

export default function AboutPage() {
  return (
    <>
      <NavHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
        <div className="gosafe-container py-14 sm:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
              About GoSafe
            </h1>
            <p className="text-blue-200 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Making bus travel in India safe, reliable and affordable since 2024.
              We believe every journey deserves comfort, transparency, and peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="gosafe-container py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map(s => {
              const Icon = s.icon
              return (
                <div key={s.label} className="text-center">
                  <Icon className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
                  <div className="text-xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="gosafe-container py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Our Story</h2>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              GoSafe was founded in early 2024 with a simple mission — transform the way India travels by bus.
              We noticed that while train and flight booking had become seamless, bus booking still suffered from
              unreliable operators, hidden charges, and poor customer support. Millions of Indians travel by bus every day,
              and they deserved better.
            </p>
            <p>
              Starting with just 10 bus operators in Delhi-NCR, we quickly grew by focusing on what matters most:
              safety, transparency, and customer experience. Every bus on our platform is verified, every price is
              transparent, and every passenger gets 24/7 support in Hindi and English.
            </p>
            <p>
              In less than a year, we expanded to 80+ cities, partnered with 200+ bus operators, and served over
              50,000 happy passengers. Our real-time GPS tracking, free cancellation policy, and instant e-ticket
              delivery have set a new standard for bus booking in India.
            </p>
            <p>
              Today, GoSafe is one of India&apos;s fastest growing bus booking platforms. But we&apos;re just getting started.
              Our vision is to connect every town and city in India with safe, reliable bus travel.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="gosafe-container py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Our Journey</h2>
            <div className="space-y-4">
              {timeline.map((t, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-600 mt-1.5" />
                    {i < timeline.length - 1 && <div className="w-0.5 h-full bg-blue-200" />}
                  </div>
                  <div className="pb-4">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{t.year}</span>
                    <p className="text-sm text-gray-600 mt-1">{t.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="gosafe-container py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Our Values</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {values.map(v => {
              const Icon = v.icon
              return (
                <div key={v.title} className="bg-white rounded-xl p-5 border border-gray-100 text-center">
                  <Icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{v.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="gosafe-container py-10 text-center">
          <h2 className="text-lg font-bold text-white mb-2">Ready to travel with GoSafe?</h2>
          <p className="text-blue-200 text-sm mb-5">Join 50,000+ happy travellers across India</p>
          <a
            href="/search"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors"
          >
            Book a Bus Now
          </a>
        </div>
      </section>

      <Footer />
    </>
  )
}
