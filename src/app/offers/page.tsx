import type { Metadata } from 'next'
import NavHeader from '@/components/NavHeader'
import Footer from '@/components/Footer'
import OffersSection from '@/components/OffersSection'
import AdSlot from '@/components/AdSlot'
import Link from 'next/link'
import { BadgePercent, Sparkles, Ticket, Zap, ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Offers & Coupon Codes',
  description: 'GoSafe bus booking offers, promo codes and deals. Save up to 20% on your next bus trip with GOFIRST20, MONSOON10 and more.',
}

const howToUse = [
  { title: 'Search your trip', desc: 'Enter source, destination and journey date in the search box.' },
  { title: 'Pick seats & passengers', desc: 'Choose your bus, select seats and add traveller details.' },
  { title: 'Apply the code', desc: 'Enter the coupon at checkout — the discount is applied instantly.' },
]

export default function OffersPage() {
  return (
    <>
      <NavHeader />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
          <div className="gosafe-container py-10 sm:py-12 text-center">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold px-3 py-1 rounded-full mb-3">
              <BadgePercent className="w-3 h-3" /> Offers & Coupons
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Deals that make travel cheaper</h1>
            <p className="text-blue-200/80 text-sm mt-2 max-w-lg mx-auto">
              Copy a promo code below, apply it at checkout and save on every bus trip across India.
            </p>
          </div>
        </section>

        <div className="gosafe-container py-8">
          {/* Reuse the coupon cards */}
          <OffersSection />

          {/* How to use */}
          <section className="mt-5">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">How to use a coupon</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {howToUse.map((s, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 flex gap-3">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{s.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Trending offers strip */}
          <section className="mt-8 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Ticket, v: 'Up to ₹300 off', l: 'First trip discount with GOFIRST20' },
                { icon: Zap, v: 'Flat 10% off', l: 'Every intercity route with MONSOON10' },
                { icon: CheckCircle, v: '₹10 instant', l: 'Discount when you add insurance' },
              ].map((t, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 flex items-center gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <t.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{t.v}</div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{t.l}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-1">
            <div className="bg-white/95 dark:bg-slate-900/95 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Ready to save on your next trip?</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Search buses now and apply your coupon at checkout.</p>
              </div>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl px-5 py-3 transition-colors shrink-0"
              >
                Book a bus <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          <div className="py-8">
            <AdSlot format="leaderboard" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}