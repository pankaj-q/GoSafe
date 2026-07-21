import type { Metadata } from 'next'
import NavHeader from '@/components/NavHeader'
import Footer from '@/components/Footer'
import { XCircle, RotateCcw, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cancellation Policy | GoSafe Bus Booking',
  description: 'GoSafe cancellation policy. Free cancellation up to 6 hours before departure. 50% refund up to 2 hours before. Instant processing.',
  openGraph: {
    title: 'Cancellation Policy - GoSafe',
    description: 'Free cancellation up to 6 hours before departure. Easy online cancellation with instant refund processing.',
  },
  keywords: ['cancel bus ticket', 'bus cancellation policy', 'GoSafe cancellation', 'free cancellation bus'],
}

const slabs = [
  {
    icon: CheckCircle,
    title: 'Free Cancellation',
    window: 'Up to 6 hours before departure',
    refund: '90% of ticket fare',
    charge: 'Only convenience fee deducted',
    color: 'text-green-600 bg-green-50 border-green-100',
    iconColor: 'text-green-600',
  },
  {
    icon: RotateCcw,
    title: 'Standard Cancellation',
    window: '2 to 6 hours before departure',
    refund: '50% of ticket fare',
    charge: '50% of base fare + convenience fee',
    color: 'text-amber-600 bg-amber-50 border-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    icon: XCircle,
    title: 'Late Cancellation',
    window: 'Less than 2 hours before departure',
    refund: 'No refund',
    charge: '100% of ticket fare',
    color: 'text-red-600 bg-red-50 border-red-100',
    iconColor: 'text-red-600',
  },
]

export default function CancellationPage() {
  return (
    <>
      <NavHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
        <div className="gosafe-container py-14 sm:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Cancellation Policy
            </h1>
            <p className="text-blue-200 text-sm max-w-lg mx-auto">
              We offer flexible cancellation options. Cancel online in just one click.
              Refunds are processed instantly based on the time of cancellation.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Slabs */}
      <section className="gosafe-container py-10">
        <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {slabs.map(slab => {
            const Icon = slab.icon
            return (
              <div key={slab.title} className={`rounded-xl p-5 border ${slab.color}`}>
                <Icon className={`w-7 h-7 ${slab.iconColor} mb-3`} />
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{slab.title}</h3>
                <p className="text-xs text-gray-600 mb-3 font-medium">{slab.window}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Refund</span>
                    <span className="font-semibold text-gray-900">{slab.refund}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Deduction</span>
                    <span className="text-gray-600">{slab.charge}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Important Notes */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="gosafe-container py-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-gray-900">Important Notes</h2>
            </div>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                <span>Cancellation can only be done through the GoSafe website or mobile app. We do not process cancellations over phone or email.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                <span>Refund is calculated on the base ticket fare. Convenience fee, GST, and insurance charges are non-refundable.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                <span>Partial cancellation (cancelling some passengers from a group booking) is allowed only if done more than 6 hours before departure.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                <span>If a bus is delayed by more than 2 hours from the scheduled departure, you are eligible for a full refund regardless of cancellation time.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                <span>In case of bus breakdown or cancellation by the operator, you will receive a 100% refund of the ticket fare.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                <span>The cancellation window is calculated from the scheduled departure time of the boarding point, not the dropping point.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How to Cancel */}
      <section className="gosafe-container py-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-4">How to Cancel</h2>
          <div className="space-y-3">
            {[
              { step: '1', text: 'Log in to your GoSafe account and go to My Bookings' },
              { step: '2', text: 'Find the booking you wish to cancel and click Cancel' },
              { step: '3', text: 'Select the passengers you want to cancel for' },
              { step: '4', text: 'Review the cancellation charges and refund amount' },
              { step: '5', text: 'Confirm cancellation — your refund will be initiated immediately' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <p className="text-sm text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600">
        <div className="gosafe-container py-8 text-center">
          <a
            href="/search"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors"
          >
            Book a Bus <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </>
  )
}
