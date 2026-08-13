'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import NavHeader from '@/components/NavHeader'
import AdSlot from '@/components/AdSlot'
import {
  Bus, Loader2, Eye, EyeOff, ShieldCheck, Wallet, Star, BadgePercent, Route,
  Hotel, UtensilsCrossed, Camera, CheckCircle2, Headphones, Gift, Timer, MapPin,
} from 'lucide-react'

const perks = [
  { icon: ShieldCheck, title: 'Verified operators', detail: 'Every bus operator is safety-vetted & GPS tracked' },
  { icon: Timer, title: 'Holds seats for 10 mins', detail: 'Lock your pick while you finish paying' },
  { icon: Wallet, title: 'Best fares & instant refunds', detail: 'Price-match promise on popular routes' },
  { icon: Headphones, title: '24×7 support', detail: 'Call 1800-800-1234 any time, any day' },
]

const stats = [
  { value: '2M+', label: 'Happy travellers' },
  { value: '500+', label: 'Routes covered' },
  { value: '4.6★', label: 'Average rating' },
  { value: '24×7', label: 'Customer care' },
]

const destinations = [
  { icon: Route, label: 'Varanasi', detail: 'From ₹499' },
  { icon: Hotel, label: 'Jaipur', detail: 'From ₹649' },
  { icon: UtensilsCrossed, label: 'Goa', detail: 'From ₹899' },
  { icon: Camera, label: 'Manali', detail: 'From ₹799' },
]

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!name.trim() || !phone.trim() || !password) {
      setError('Name, phone, and password are required')
      return
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Enter a valid 10-digit phone number')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() || undefined, phone, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create account')
        return
      }

      await signIn('credentials', { email: phone, password, redirect: false })
      router.push('/my-bookings')
      router.refresh()
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
          {/* LEFT — Sign up form */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
              <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4">
                  <Bus className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create account</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Save & track your bus bookings</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="gosafe-label">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="gosafe-input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="gosafe-label">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile number"
                    className="gosafe-input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="gosafe-label">Email (optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="gosafe-input dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="gosafe-label">Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
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
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <div className="mt-5 flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                By continuing you agree to our{' '}
                <Link href="/terms" className="underline hover:text-gray-600 dark:hover:text-gray-300">Terms</Link>
                <span>&amp;</span>
                <Link href="/privacy" className="underline hover:text-gray-600 dark:hover:text-gray-300">Privacy Policy</Link>
              </div>

              <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 font-medium hover:text-blue-700">
                  Sign in
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
                Welcome offer
              </div>
              <h2 className="text-2xl font-bold leading-tight">First trip? Get 20% OFF</h2>
              <p className="text-blue-100 text-sm mt-1">Apply code <span className="inline-block bg-white/20 rounded px-1.5 py-0.5 font-semibold">GOFIRST20</span> at checkout</p>
              <div className="grid grid-cols-4 gap-3 mt-6">
                {stats.map(s => (
                  <div key={s.label}>
                    <div className="text-lg font-bold leading-none">{s.value}</div>
                    <div className="text-[11px] text-blue-200 mt-1 leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why GoSafe */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-amber-500" />
                Why book with GoSafe
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

            {/* Popular destinations */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Trending destinations
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {destinations.map(d => (
                  <div key={d.label} className="rounded-xl border border-gray-100 dark:border-gray-700 p-3 hover:border-blue-200 dark:hover:border-blue-500/40 hover:shadow-sm transition-all">
                    <d.icon className="w-4 h-4 text-gray-400 dark:text-gray-500 mb-2" />
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{d.label}</div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">{d.detail}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">Deals update daily. Sign up to unlock member-only fares.</p>
            </div>

            {/* Deals strip */}
            <div className="rounded-2xl border border-dashed border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 p-4 flex items-center gap-3">
              <BadgePercent className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <strong>Member perks:</strong> earn 1 GoSafe point per ₹10 spent, priority refunds and seasonal offers.
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
