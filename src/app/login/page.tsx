'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import NavHeader from '@/components/NavHeader'
import AdSlot from '@/components/AdSlot'
import {
  Bus, Loader2, Eye, EyeOff, ShieldCheck, Wallet, Star, Headphones, Gift,
  KeyRound, Ticket, Timer,
} from 'lucide-react'

const perks = [
  { icon: Ticket, title: 'View & manage bookings', detail: 'Download tickets, track buses and pick seats' },
  { icon: Wallet, title: 'Instant refunds', detail: 'Cancellation money back to your wallet in minutes' },
  { icon: ShieldCheck, title: 'Verified operators', detail: 'Every operator is safety-vetted & GPS tracked' },
  { icon: Headphones, title: '24×7 support', detail: 'Call 1800-800-1234 any time, any day' },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
      })
      if (result?.error) {
        setError('Invalid credentials. Please try again.')
      } else {
        router.push('/my-bookings')
        router.refresh()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <NavHeader />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-8 items-start">
          {/* LEFT — Sign in form */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
              <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4">
                  <Bus className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome back</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to view your bookings</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="gosafe-label">Email or Phone</label>
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@example.com or phone number"
                    className="gosafe-input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="gosafe-label">Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="gosafe-input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="gosafe-btn gosafe-btn-primary w-full py-3 text-base"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-4 text-right">
                <Link href="/help#faqs" className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-end gap-1">
                  <KeyRound className="w-3 h-3" />
                  Forgot password?
                </Link>
              </div>

              <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-blue-600 font-medium hover:text-blue-700">
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* RIGHT — GoSafe value props, deals & ads */}
          <div className="space-y-6">
            {/* Welcome banner */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 text-blue-100 text-xs font-semibold mb-2">
                <Gift className="w-4 h-4" />
                Ready to roll?
              </div>
              <h2 className="text-2xl font-bold leading-tight">Your next trip is one tap away</h2>
              <p className="text-blue-100 text-sm mt-1">Pick seats, lock fares and get instant tickets</p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div>
                  <div className="text-lg font-bold leading-none">500+</div>
                  <div className="text-[11px] text-blue-200 mt-1 leading-tight">Routes covered</div>
                </div>
                <div>
                  <div className="text-lg font-bold leading-none">4.6★</div>
                  <div className="text-[11px] text-blue-200 mt-1 leading-tight">Average rating</div>
                </div>
                <div>
                  <div className="text-lg font-bold leading-none">2M+</div>
                  <div className="text-[11px] text-blue-200 mt-1 leading-tight">Happy travellers</div>
                </div>
                <div>
                  <div className="text-lg font-bold leading-none">24×7</div>
                  <div className="text-[11px] text-blue-200 mt-1 leading-tight">Customer care</div>
                </div>
              </div>
            </div>

            {/* Member benefits */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-amber-500" />
                Member benefits
              </h3>
              <div className="space-y-4">
                {perks.map(p => (
                  <div key={p.title} className="flex gap-3">
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                      <p.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{p.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{p.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deals strip */}
            <div className="rounded-2xl border border-dashed border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 p-4 flex items-center gap-3">
              <Timer className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <strong>Pro tip:</strong> weekend fares go live on Monday. Sign in to save your favourite routes and get notified.
              </p>
            </div>

            {/* Ads */}
            <AdSlot format="rectangle" className="w-full" />
          </div>
        </div>
      </main>
    </>
  )
}
