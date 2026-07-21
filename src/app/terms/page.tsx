import type { Metadata } from 'next'
import NavHeader from '@/components/NavHeader'
import Footer from '@/components/Footer'
import { FileText, Scale, AlertTriangle, Ban, Gavel, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | GoSafe Bus Booking',
  description: 'GoSafe terms of service. User obligations, payment terms, liability limitations, and dispute resolution for bus booking services.',
  openGraph: {
    title: 'Terms of Service - GoSafe',
    description: 'Terms and conditions for using GoSafe bus booking platform. User rights, payment terms, and legal agreements.',
  },
  keywords: ['terms of service', 'terms and conditions', 'GoSafe terms', 'bus booking terms'],
}

const sections = [
  {
    icon: FileText,
    title: 'Acceptance of Terms',
    content: 'By accessing or using the GoSafe website, mobile application, or any services offered by GoSafe Technologies Pvt. Ltd., you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our platform. We reserve the right to update these terms at any time, and continued use of the platform constitutes acceptance of the revised terms.',
  },
  {
    icon: Scale,
    title: 'User Obligations',
    content: 'You agree to provide accurate, current, and complete information during registration and booking. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must not use the platform for any unlawful purpose, attempt to circumvent our booking systems, or engage in any activity that disrupts the platform or its users.',
  },
  {
    icon: Ban,
    title: 'Booking and Payment',
    content: 'All bookings are subject to availability and confirmation. Prices displayed are inclusive of all applicable taxes unless stated otherwise. Payment must be completed at the time of booking. GoSafe acts as an intermediary between passengers and bus operators; the actual bus service is provided by third-party operators. We are not responsible for service deficiencies caused by operators beyond our reasonable control.',
  },
  {
    icon: AlertTriangle,
    title: 'Cancellation and Refunds',
    content: 'Cancellation and refund policies are governed by the specific policy displayed at the time of booking and on our Cancellation and Refund policy pages. Processing fees, convenience fees, and insurance charges are non-refundable. GoSafe reserves the right to modify cancellation policies with prior notice. Refunds are processed based on the timeline applicable to the payment method used.',
  },
  {
    icon: Gavel,
    title: 'Limitation of Liability',
    content: 'GoSafe\'s total liability for any claim arising from the use of our platform shall not exceed the total amount paid by the user for the specific booking giving rise to the claim. We are not liable for indirect, incidental, or consequential damages, including but not limited to loss of business, travel delays, or personal injury caused by third-party bus operators. Users acknowledge that bus travel involves inherent risks.',
  },
  {
    icon: Scale,
    title: 'Dispute Resolution',
    content: 'Any disputes arising from these terms shall first be resolved through good-faith negotiations. If unresolved, disputes shall be submitted to binding arbitration in accordance with the Arbitration and Conciliation Act, 1996. The arbitration shall take place in New Delhi. Users may also approach the Grievance Officer as per our Grievance Redressal Policy for resolution of complaints.',
  },
]

export default function TermsPage() {
  return (
    <>
      <NavHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
        <div className="gosafe-container py-14 sm:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-blue-200 text-sm max-w-lg mx-auto">
              Last updated: July 1, 2026. Please read these terms carefully before using the GoSafe platform.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="gosafe-container py-8 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-sm text-gray-600 leading-relaxed">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the GoSafe website, mobile application,
            and all related services provided by GoSafe Technologies Pvt. Ltd. (&ldquo;GoSafe,&rdquo; &ldquo;we,&rdquo;
            &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By creating an account or making a booking, you enter into a
            legally binding agreement with us.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="gosafe-container py-10">
        <div className="max-w-3xl mx-auto space-y-6">
          {sections.map(s => {
            const Icon = s.icon
            return (
              <div key={s.title} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="font-bold text-gray-900 text-sm">{s.title}</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{s.content}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Governing Law */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="gosafe-container py-8">
          <div className="max-w-3xl mx-auto text-sm text-gray-600 leading-relaxed">
            <h2 className="font-bold text-gray-900 mb-2">Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India.
              Any legal proceedings arising out of or relating to these Terms shall be subject to the
              exclusive jurisdiction of the courts in New Delhi, India.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="gosafe-container py-10 text-center">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Questions about these terms?</h2>
        <p className="text-sm text-gray-500 mb-4">Contact our legal team</p>
        <a
          href="mailto:legal@gosafe.in"
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors"
        >
          <Mail className="w-4 h-4" /> legal@gosafe.in
        </a>
      </section>

      <Footer />
    </>
  )
}
