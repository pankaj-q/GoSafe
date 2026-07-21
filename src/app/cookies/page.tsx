import type { Metadata } from 'next'
import NavHeader from '@/components/NavHeader'
import Footer from '@/components/Footer'
import { Cookie, Shield, BarChart3, Megaphone, Settings, CheckCircle, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cookie Policy | GoSafe Bus Booking',
  description: 'GoSafe cookie policy. Learn about the cookies we use, their purpose, and how to manage your cookie preferences.',
  openGraph: {
    title: 'Cookie Policy - GoSafe',
    description: 'How GoSafe uses cookies. Essential, analytics, and marketing cookies explained.',
  },
  keywords: ['cookie policy', 'cookies', 'browser cookies', 'GoSafe cookies', 'cookie preferences'],
}

const cookieTypes = [
  {
    icon: Shield,
    title: 'Essential Cookies',
    purpose: 'Required for the platform to function properly',
    examples: ['Authentication tokens', 'Session management', 'Security tokens', 'CSRF protection'],
    duration: 'Session / Persistent',
    canDisable: false,
  },
  {
    icon: BarChart3,
    title: 'Analytics Cookies',
    purpose: 'Help us understand how users interact with our platform',
    examples: ['Page visit tracking', 'User flow analysis', 'Feature usage metrics', 'Error tracking'],
    duration: 'Up to 2 years',
    canDisable: true,
  },
  {
    icon: Megaphone,
    title: 'Marketing Cookies',
    purpose: 'Deliver relevant advertisements and measure campaign effectiveness',
    examples: ['Ad tracking pixels', 'Retargeting tags', 'Conversion tracking', 'Social media pixels'],
    duration: 'Up to 90 days',
    canDisable: true,
  },
  {
    icon: Settings,
    title: 'Functional Cookies',
    purpose: 'Remember your preferences and enhance your experience',
    examples: ['Language preferences', 'Currency selection', 'Recent searches', 'Seat preferences'],
    duration: 'Up to 1 year',
    canDisable: true,
  },
]

export default function CookiesPage() {
  return (
    <>
      <NavHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
        <div className="gosafe-container py-14 sm:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/30 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-4">
              <Cookie className="w-3 h-3" /> Cookie Notice
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Cookie Policy
            </h1>
            <p className="text-blue-200 text-sm max-w-lg mx-auto">
              Last updated: July 1, 2026. This policy explains what cookies are, how we use them,
              and how you can manage your preferences.
            </p>
          </div>
        </div>
      </section>

      {/* What are cookies */}
      <section className="gosafe-container py-8 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-gray-900">What Are Cookies?</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website.
            They help the website remember your actions and preferences over time, so you do not have to re-enter
            them every time you return. Cookies also help us improve your browsing experience and understand how
            our platform is used.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mt-3">
            We also use similar technologies such as web beacons, pixel tags, and local storage for the same purposes.
            References to &ldquo;cookies&rdquo; in this policy include these similar technologies.
          </p>
        </div>
      </section>

      {/* Types of cookies */}
      <section className="gosafe-container py-10">
        <h2 className="text-base font-bold text-gray-900 mb-6">Types of Cookies We Use</h2>
        <div className="space-y-4 max-w-3xl">
          {cookieTypes.map(ct => {
            const Icon = ct.icon
            return (
              <div key={ct.title} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900 text-sm">{ct.title}</h3>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${ct.canDisable ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                    {ct.canDisable ? 'Optional' : 'Required'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{ct.purpose}</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {ct.examples.map((ex, i) => (
                    <span key={i} className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded border border-gray-100">
                      {ex}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400">Duration: {ct.duration}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Manage preferences */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="gosafe-container py-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-gray-900">Managing Your Cookie Preferences</h2>
            </div>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>
                You can manage your cookie preferences at any time through our cookie consent banner
                (accessible via the &ldquo;Cookie Settings&rdquo; link in the website footer).
              </p>
              <p>
                Most web browsers also allow you to control cookies through their settings. You can:
              </p>
              <ul className="space-y-1.5 pl-4">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span>Delete all cookies from your browser</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span>Block third-party cookies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span>Set your browser to reject all cookies (essential cookies may still be required)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span>Enable &ldquo;Do Not Track&rdquo; signals in your browser</span>
                </li>
              </ul>
              <p className="mt-3">
                Please note that disabling certain cookies may affect the functionality of our platform.
                Essential cookies cannot be disabled as they are necessary for the platform to operate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Third-party cookies */}
      <section className="gosafe-container py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-base font-bold text-gray-900 mb-3">Third-Party Cookies</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We use third-party services such as Google Analytics, Razorpay, and social media platforms
            that may set their own cookies on our platform. These third-party cookies are governed by
            the respective privacy policies of these services. We recommend reviewing their policies
            for detailed information about their data collection and usage practices.
          </p>
        </div>
      </section>

      <Footer />
    </>
  )
}
