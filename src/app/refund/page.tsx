import type { Metadata } from 'next'
import NavHeader from '@/components/NavHeader'
import Footer from '@/components/Footer'
import { RotateCcw, Smartphone, CreditCard, Building2, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Refund Policy | GoSafe Bus Ticket Refunds',
  description: 'GoSafe refund policy. Refunds processed within 5-7 business days. UPI: 24 hours, Card: 3-5 days, Netbanking: 5-7 days.',
  openGraph: {
    title: 'Refund Policy - GoSafe',
    description: 'Instant refund processing. UPI refunds in 24 hours. Track your refund status online.',
  },
  keywords: ['bus refund', 'refund policy', 'GoSafe refund', 'cancel bus ticket refund'],
}

const modes = [
  { icon: Smartphone, title: 'UPI', timeline: '24 hours', desc: 'Refunded to your UPI ID instantly' },
  { icon: CreditCard, title: 'Credit / Debit Card', timeline: '3-5 business days', desc: 'Refunded to the original card used for payment' },
  { icon: Building2, title: 'Net Banking', timeline: '5-7 business days', desc: 'Refunded to the original bank account' },
  { icon: RotateCcw, title: 'Wallet', timeline: '24 hours', desc: 'GoSafe wallet or payment gateway wallet (e.g. Paytm)' },
]

export default function RefundPage() {
  return (
    <>
      <NavHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
        <div className="gosafe-container py-14 sm:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Refund Policy
            </h1>
            <p className="text-blue-200 text-sm max-w-lg mx-auto">
              We process refunds as soon as you cancel. Timelines vary by payment mode.
              Track your refund status anytime from your account.
            </p>
          </div>
        </div>
      </section>

      {/* Refund Timeline */}
      <section className="gosafe-container py-10">
        <h2 className="text-lg font-bold text-gray-900 text-center mb-6">Refund Timelines by Payment Mode</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {modes.map(m => {
            const Icon = m.icon
            return (
              <div key={m.title} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all text-center">
                <Icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 text-sm">{m.title}</h3>
                <div className="inline-block bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1.5 mb-2">
                  {m.timeline}
                </div>
                <p className="text-[10px] text-gray-500">{m.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Process */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="gosafe-container py-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Refund Process</h2>
            <div className="space-y-3">
              {[
                { step: '01', title: 'Cancel Your Booking', desc: 'Go to My Bookings, select the ticket, and click Cancel. Review charges and confirm.' },
                { step: '02', title: 'Instant Refund Initiation', desc: 'Once cancelled, your refund is automatically initiated. No manual approval needed.' },
                { step: '03', title: 'Payment Mode Timeline', desc: 'Refund reaches your account based on the payment mode timelines mentioned above.' },
                { step: '04', title: 'Track Refund Status', desc: 'Check refund status anytime from the My Bookings section or the Refund History page.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start bg-white rounded-xl p-4 border border-gray-100">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md shrink-0">{item.step}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Points */}
      <section className="gosafe-container py-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-gray-900">Important Points</h2>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span>Refunds are always processed to the original payment method used at the time of booking.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span>Convenience fee, GST, and insurance charges are non-refundable in all cases.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span>If you do not receive the refund within the stated timeline, please contact support with your booking ID.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span>In case of bank holidays, refund timelines may be extended by 1-2 business days.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span>Partial refunds (e.g. cancelling only some passengers) are processed at the same timelines.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="gosafe-container py-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Didn&apos;t receive your refund?</h2>
            <p className="text-sm text-gray-500 mb-5">Contact our support team and we&apos;ll resolve it within 24 hours</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="mailto:refunds@gosafe.in" className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors">
                refunds@gosafe.in
              </a>
              <a href="/contact" className="inline-flex items-center gap-2 bg-white text-gray-700 font-medium px-5 py-2.5 rounded-xl text-sm border border-gray-200 hover:border-blue-200 transition-colors">
                Contact Support <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
