'use client'

import { Mail } from 'lucide-react'

export default function NewsletterSignup() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="gosafe-container py-8">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-base font-bold text-gray-900 mb-1">Stay Updated</h2>
          <p className="text-xs text-gray-500 mb-4">Get the best bus deals, new routes & travel tips in your inbox.</p>
          <form className="flex gap-2 max-w-sm mx-auto" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              required
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shrink-0"
            >
              Subscribe
            </button>
          </form>
          <p className="text-[10px] text-gray-400 mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  )
}
