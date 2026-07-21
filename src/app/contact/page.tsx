import type { Metadata } from 'next'
import NavHeader from '@/components/NavHeader'
import Footer from '@/components/Footer'
import { Mail, Phone, MapPin, MessageCircle, Clock, Send } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | GoSafe Bus Booking Support',
  description: 'Get in touch with GoSafe. Call, email, or visit our office in New Delhi. 24/7 customer support for bus booking inquiries.',
  openGraph: {
    title: 'Contact GoSafe - Bus Booking Support',
    description: 'Contact GoSafe support team. Phone, email, WhatsApp, and office address in New Delhi.',
  },
  keywords: ['contact GoSafe', 'GoSafe support', 'bus booking helpline', 'GoSafe office Delhi'],
}

const contactMethods = [
  {
    icon: Phone,
    title: 'Phone',
    details: '+91 8000 123 456',
    sub: '24/7 helpline — Hindi & English',
    href: 'tel:+918000123456',
  },
  {
    icon: Mail,
    title: 'Email',
    details: 'support@gosafe.in',
    sub: 'We respond within 2 hours',
    href: 'mailto:support@gosafe.in',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    details: '+91 8000 123 456',
    sub: 'Chat with us on WhatsApp',
    href: '#',
  },
  {
    icon: MapPin,
    title: 'Office',
    details: 'New Delhi, India',
    sub: 'Mon-Fri, 10:00 AM - 6:00 PM',
    href: '#',
  },
]

export default function ContactPage() {
  return (
    <>
      <NavHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
        <div className="gosafe-container py-14 sm:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Contact Us
            </h1>
            <p className="text-blue-200 text-sm max-w-lg mx-auto">
              Have a question, feedback, or need assistance? We&apos;re here to help.
              Reach out to us anytime — we&apos;re available 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="gosafe-container py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactMethods.map(m => {
            const Icon = m.icon
            return (
              <a
                key={m.title}
                href={m.href}
                className="bg-white rounded-xl p-5 border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all text-center"
              >
                <Icon className="w-6 h-6 text-blue-600 mx-auto mb-2.5" />
                <h3 className="font-semibold text-gray-900 text-sm">{m.title}</h3>
                <p className="text-xs text-gray-900 mt-0.5 font-medium">{m.details}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{m.sub}</p>
              </a>
            )
          })}
        </div>
      </section>

      {/* Form & Map */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="gosafe-container py-10">
          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Contact Form */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Send us a message</h2>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-xs font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    id="subject"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option>Booking Issue</option>
                    <option>Payment Problem</option>
                    <option>Cancellation & Refund</option>
                    <option>Technical Support</option>
                    <option>Feedback & Suggestions</option>
                    <option>Business Inquiry</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Describe your issue or question..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            </div>

            {/* Office Info */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Visit our office</h2>
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">GoSafe Technologies Pvt. Ltd.</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      B-121, Sector 2, Noida<br />
                      Uttar Pradesh 201301<br />
                      New Delhi NCR, India
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Business Hours</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Monday - Friday: 10:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Customer Support</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      24/7 helpline: +91 8000 123 456<br />
                      Email: support@gosafe.in
                    </p>
                  </div>
                </div>
              </div>
              {/* Map placeholder */}
              <div className="mt-4 bg-gray-200 rounded-xl h-48 flex items-center justify-center text-xs text-gray-500 border border-gray-100">
                <MapPin className="w-5 h-5 text-gray-400 mr-1" /> Map loading...
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gosafe-container py-10 text-center">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Prefer self-service?</h2>
        <p className="text-sm text-gray-500 mb-4">Visit our Help Centre for instant answers</p>
        <a
          href="/help"
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-6 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors"
        >
          Go to Help Centre
        </a>
      </section>

      <Footer />
    </>
  )
}
