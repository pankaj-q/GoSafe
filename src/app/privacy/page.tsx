import type { Metadata } from 'next'
import NavHeader from '@/components/NavHeader'
import Footer from '@/components/Footer'
import { Shield, Lock, Eye, Cookie, Database, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | GoSafe Bus Booking',
  description: 'GoSafe privacy policy. Learn how we collect, use, and protect your personal data. GDPR compliant. User rights and cookie policy.',
  openGraph: {
    title: 'Privacy Policy - GoSafe',
    description: 'How GoSafe collects, uses, and protects your personal information.',
  },
  keywords: ['privacy policy', 'data protection', 'GoSafe privacy', 'GDPR', 'user data rights'],
}

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: [
      'Personal identification information — name, email address, phone number, and billing address provided during booking.',
      'Travel details — source and destination cities, travel dates, seat preferences, and passenger details.',
      'Payment information — payment method details are processed by our PCI-DSS compliant payment partners. We do not store full card numbers or CVV.',
      'Device and usage data — IP address, browser type, device information, pages visited, and app interactions for improving our service.',
      'Location data — if enabled, we collect real-time location for GPS tracking features during active trips.',
    ],
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: [
      'To process and confirm bus ticket bookings, send e-tickets, and provide customer support.',
      'To send travel updates, cancellation alerts, and refund notifications via email, SMS, and WhatsApp.',
      'To improve our platform, analyze usage patterns, and personalize your booking experience.',
      'To send promotional offers and newsletters — only with your explicit consent. You can opt out anytime.',
      'To comply with legal obligations, prevent fraud, and enforce our terms of service.',
    ],
  },
  {
    icon: Cookie,
    title: 'Cookies and Tracking',
    content: [
      'We use essential cookies for authentication, session management, and secure transactions.',
      'Analytics cookies help us understand how you use our platform to improve your experience.',
      'Marketing cookies are used to show relevant offers and measure campaign effectiveness.',
      'You can manage cookie preferences in your browser settings and through our cookie consent banner.',
      'Third-party services (Google Analytics, Razorpay, etc.) may set their own cookies on our platform.',
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: [
      'All data transmitted between your device and our servers is encrypted using TLS 1.3 protocol.',
      'Payment data is processed by PCI-DSS Level 1 compliant payment gateways. We never store sensitive payment information.',
      'Access to personal data is restricted to authorized personnel only, with strict access controls and audit logs.',
      'We conduct regular security audits, penetration testing, and vulnerability assessments.',
      'In the unlikely event of a data breach, we will notify affected users and relevant authorities within 72 hours.',
    ],
  },
  {
    icon: Shield,
    title: 'Your Rights',
    content: [
      'Right to access — you can request a copy of all personal data we hold about you.',
      'Right to rectification — you can correct inaccurate or incomplete personal data.',
      'Right to erasure — you can request deletion of your account and personal data, subject to legal retention requirements.',
      'Right to restrict processing — you can limit how we use your data in certain circumstances.',
      'Right to data portability — you can receive your data in a structured, machine-readable format.',
      'Right to withdraw consent — you can withdraw consent for marketing communications at any time.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <NavHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
        <div className="gosafe-container py-14 sm:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-blue-200 text-sm max-w-lg mx-auto">
              Last updated: July 1, 2026. At GoSafe, we take your privacy seriously.
              This policy explains how we collect, use, and protect your personal data.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="gosafe-container py-8 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-sm text-gray-600 leading-relaxed">
          <p>
            GoSafe Technologies Pvt. Ltd. (&ldquo;GoSafe,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
            is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you visit our website or use our mobile application.
          </p>
          <p className="mt-3">
            By using the GoSafe platform, you agree to the collection and use of information in accordance with
            this policy. If you do not agree with any part of this policy, please do not use our services.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="gosafe-container py-10">
        <div className="max-w-3xl mx-auto space-y-8">
          {sections.map(s => {
            const Icon = s.icon
            return (
              <div key={s.title}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-base font-bold text-gray-900">{s.title}</h2>
                </div>
                <ul className="space-y-2">
                  {s.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-blue-600 mt-1.5 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="gosafe-container py-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Contact Our Data Protection Officer</h2>
            <p className="text-sm text-gray-500 mb-5">
              If you have any questions about this privacy policy or wish to exercise your data rights, please contact us.
            </p>
            <a
              href="mailto:dpo@gosafe.in"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors"
            >
              <Mail className="w-4 h-4" /> dpo@gosafe.in
            </a>
            <p className="text-xs text-gray-400 mt-3">
              GoSafe Technologies Pvt. Ltd., B-121, Sector 2, Noida, Uttar Pradesh 201301, India
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
