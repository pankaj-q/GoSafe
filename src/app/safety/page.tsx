import type { Metadata } from 'next'
import NavHeader from '@/components/NavHeader'
import Footer from '@/components/Footer'
import { ShieldCheck, Video, MapPin, Phone, Droplets, ClipboardCheck, Users, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Safety Guidelines | GoSafe Bus Travel',
  description: 'GoSafe safety guidelines for bus travel. COVID precautions, bus sanitization, CCTV, GPS tracking, emergency contacts. Travel safe with GoSafe.',
  openGraph: {
    title: 'Safety Guidelines - GoSafe Bus Travel',
    description: 'Your safety is our priority. Learn about our COVID protocols, GPS tracking, CCTV monitoring, and emergency support.',
  },
  keywords: ['bus travel safety', 'COVID precautions bus', 'safe bus travel', 'GoSafe safety', 'bus sanitization'],
}

const guidelines = [
  {
    icon: Droplets,
    title: 'Sanitization',
    desc: 'Every bus is thoroughly sanitized before departure. High-touch surfaces including handrails, seats, and restrooms are disinfected with hospital-grade chemicals.',
  },
  {
    icon: Video,
    title: 'CCTV Monitoring',
    desc: 'All partner buses are equipped with CCTV cameras at entry and driver cabin. Recordings are monitored and retained for passenger safety.',
  },
  {
    icon: MapPin,
    title: 'GPS Tracking',
    desc: 'Real-time GPS tracking on every bus. Share your live location with family and friends through the GoSafe app. Track bus location from the boarding point.',
  },
  {
    icon: Phone,
    title: 'Emergency Helpline',
    desc: '24/7 emergency helpline: +91 8000 123 456. Dedicated safety team available for any assistance during your journey.',
  },
  {
    icon: Users,
    title: 'Verified Drivers',
    desc: 'All bus drivers undergo police verification, medical fitness checks, and regular training on safe driving practices and customer behavior.',
  },
  {
    icon: ClipboardCheck,
    title: 'Operator Audit',
    desc: 'We conduct regular audits of all partner bus operators. Compliance with safety standards, vehicle fitness, and driver credentials is verified monthly.',
  },
  {
    icon: ShieldCheck,
    title: 'Travel Insurance',
    desc: 'Optional travel insurance available for just ₹19 per seat. Covers accidental death, medical expenses, baggage loss, and journey cancellation.',
  },
  {
    icon: AlertTriangle,
    title: 'Emergency Kits',
    desc: 'Every bus carries first-aid kits, fire extinguishers, emergency exit hammers, and reflective triangles. Crew is trained in basic first response.',
  },
]

const covidMeasures = [
  'Regular sanitization of buses before every trip',
  'Drivers and crew wear masks during the journey',
  'Hand sanitizers available at boarding points and inside buses',
  'Contactless ticket verification via mobile e-tickets',
  'Seat spacing maintained where possible',
  'Air conditioning systems serviced with fresh air intake',
]

export default function SafetyPage() {
  return (
    <>
      <NavHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
        <div className="gosafe-container py-14 sm:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/30 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-4">
              <ShieldCheck className="w-3 h-3" /> Your Safety Matters
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Safety Guidelines
            </h1>
            <p className="text-blue-200 text-sm max-w-lg mx-auto">
              At GoSafe, your safety is our top priority. From sanitized buses to real-time tracking,
              we take every measure to ensure a secure and comfortable journey.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Measures */}
      <section className="gosafe-container py-10">
        <h2 className="text-lg font-bold text-gray-900 text-center mb-6">Our Safety Measures</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {guidelines.map(g => {
            const Icon = g.icon
            return (
              <div key={g.title} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all">
                <Icon className="w-6 h-6 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{g.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{g.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* COVID */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="gosafe-container py-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">COVID-19 Precautions</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              We continue to follow all government-mandated health protocols to ensure safe travel for every passenger.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {covidMeasures.map((m, i) => (
                <div key={i} className="flex items-start gap-2 bg-white rounded-xl p-3.5 border border-gray-100">
                  <ShieldCheck className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-xs text-gray-700">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="gosafe-container py-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Emergency Contacts</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-red-50 border border-red-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-2">GoSafe Emergency Helpline</h3>
              <a href="tel:+918000123456" className="text-lg font-bold text-red-600 hover:text-red-700">+91 8000 123 456</a>
              <p className="text-xs text-gray-500 mt-1">Available 24/7 for all emergencies during your journey</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-2">National Helpline Numbers</h3>
              <ul className="space-y-1 text-xs text-gray-700">
                <li><strong>Police:</strong> 100</li>
                <li><strong>Ambulance:</strong> 108</li>
                <li><strong>Fire:</strong> 101</li>
                <li><strong>Women Helpline:</strong> 1091</li>
                <li><strong>Road Transport Helpline:</strong> 1073</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600">
        <div className="gosafe-container py-8 text-center">
          <p className="text-blue-200 text-sm mb-4">Travel with confidence. Book your next bus with GoSafe.</p>
          <a
            href="/search"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors"
          >
            Book a Safe Bus
          </a>
        </div>
      </section>

      <Footer />
    </>
  )
}
