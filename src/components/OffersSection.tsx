'use client'

import { useState } from 'react'
import { BadgePercent, Check, Copy, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const offers = [
  {
    code: 'GOFIRST20',
    title: '20% OFF on your first trip',
    detail: 'New travellers only · Up to ₹300 off',
    bg: 'from-emerald-500 to-teal-600',
    ring: 'ring-emerald-200 dark:ring-emerald-500/30',
  },
  {
    code: 'MONSOON10',
    title: 'Flat 10% OFF on all trips',
    detail: 'All intercity routes · No minimum',
    bg: 'from-blue-500 to-indigo-600',
    ring: 'ring-blue-200 dark:ring-blue-500/30',
  },
  {
    code: 'WEEKEND5',
    title: 'Extra 5% off weekend rides',
    detail: 'Valid Fri–Sun journeys',
    bg: 'from-violet-500 to-purple-600',
    ring: 'ring-violet-200 dark:ring-violet-500/30',
  },
  {
    code: 'SAFE10',
    title: '₹10 off with insurance',
    detail: 'Add travel insurance & save ₹10',
    bg: 'from-amber-500 to-orange-600',
    ring: 'ring-amber-200 dark:ring-amber-500/30',
  },
]

export default function OffersSection() {
  const [copied, setCopied] = useState<string | null>(null)

  function copy(code: string) {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 1800)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute -top-10 left-1/4 w-72 h-72 rounded-full bg-blue-400 blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-emerald-400 blur-3xl" />
      </div>
      <div className="relative gosafe-container py-10 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold px-3 py-1 rounded-full mb-2">
              <BadgePercent className="w-3 h-3" /> Deals & Offers
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Save more on every trip</h2>
            <p className="text-xs text-blue-200/70 mt-1">Tap a code to copy — apply it at checkout</p>
          </div>
          <Link href="/search" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-300 hover:text-emerald-200">
            See all offers <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {offers.map(o => (
            <div
              key={o.code}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${o.bg} p-[1px] ring-1 ${o.ring} shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all`}
            >
              <div className="bg-white/95 dark:bg-slate-900/95 rounded-2xl p-4 h-full flex flex-col">
                <span className={`inline-flex self-start items-center gap-1 text-[10px] font-bold tracking-wider text-white bg-gradient-to-r ${o.bg} px-2 py-0.5 rounded-md`}>
                  {o.code}
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mt-2.5">{o.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex-1">{o.detail}</p>
                <button
                  onClick={() => copy(o.code)}
                  className={`mt-3 w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-2 transition-all ${
                    copied === o.code
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-900 text-white hover:bg-blue-600'
                  }`}
                >
                  {copied === o.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy code
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
