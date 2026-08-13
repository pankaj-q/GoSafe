'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import NavHeader from '@/components/NavHeader'
import { Bus, Loader2, Eye, EyeOff } from 'lucide-react'

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
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
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

            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-blue-600 font-medium hover:text-blue-700">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
