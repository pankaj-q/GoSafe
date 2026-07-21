import type { Metadata } from 'next'
import NavHeader from '@/components/NavHeader'
import Footer from '@/components/Footer'
import { Calendar, ExternalLink, Newspaper, Award, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Press & Media | GoSafe News and Announcements',
  description: 'Read press releases, media coverage, and announcements about GoSafe. Latest news about India\'s fastest growing bus booking platform.',
  openGraph: {
    title: 'GoSafe Press & Media',
    description: 'Press releases, media coverage, and announcements from GoSafe.',
  },
  keywords: ['GoSafe press', 'bus booking news', 'GoSafe media coverage', 'bus platform announcements'],
}

const pressReleases = [
  {
    title: 'GoSafe Raises $5M Seed Round to Expand Bus Booking Across India',
    date: 'Jun 20, 2026',
    excerpt: 'GoSafe announced a $5 million seed funding round led by VentureWave Capital to expand its bus booking platform to 200+ cities and launch AI-powered route recommendations.',
    source: 'TechCrunch India',
  },
  {
    title: 'GoSafe Launches Real-Time GPS Tracking for All Partner Buses',
    date: 'May 12, 2026',
    excerpt: 'GoSafe becomes the first bus booking platform in India to offer real-time GPS tracking on every bus, allowing passengers to share live location with family.',
    source: 'YourStory',
  },
  {
    title: 'GoSafe Partners with 200 Bus Operators Across 80 Cities',
    date: 'Apr 5, 2026',
    excerpt: 'The platform has onboarded 200 bus operators covering 80+ cities, with plans to reach 150 cities by the end of the year.',
    source: 'Business Standard',
  },
  {
    title: 'GoSafe Wins "Emerging Travel Platform of the Year" Award',
    date: 'Mar 15, 2026',
    excerpt: 'GoSafe was recognized at the India Travel Awards 2025 for its innovative approach to bus booking, safety features, and customer experience.',
    source: 'Travel News Today',
  },
  {
    title: 'GoSafe Introduces Free Cancellation & Instant Refund Policy',
    date: 'Feb 20, 2026',
    excerpt: 'Setting a new industry standard, GoSafe announced free cancellation up to 6 hours before departure with instant refunds processed within 24 hours.',
    source: 'Inc42',
  },
  {
    title: 'GoSafe Crosses 50,000 Passengers in Less Than a Year',
    date: 'Jan 10, 2026',
    excerpt: 'The bus booking platform hit the 50,000-passenger milestone in under 12 months, growing 300% quarter-over-quarter.',
    source: 'Economic Times',
  },
]

const mediaMentions = [
  { outlet: 'YourStory', headline: 'How GoSafe is Making Bus Travel Safer in India', url: '#' },
  { outlet: 'The Hindu BusinessLine', headline: 'Bus Booking Gets a Tech Upgrade with GoSafe', url: '#' },
  { outlet: 'Inc42', headline: 'Inside GoSafe\'s Playbook for Bus Booking in Bharat', url: '#' },
  { outlet: 'Business Insider India', headline: 'These 5 Indian Travel Startups Are Disrupting Bus Travel', url: '#' },
  { outlet: 'Outlook Traveller', headline: 'GoSafe: A New Chapter in Indian Bus Travel', url: '#' },
]

export default function PressPage() {
  return (
    <>
      <NavHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
        <div className="gosafe-container py-14 sm:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/30 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-4">
              <Newspaper className="w-3 h-3" /> Press & Media
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Press & Media
            </h1>
            <p className="text-blue-200 text-sm max-w-lg mx-auto">
              Latest news, press releases, and media coverage about GoSafe.
              For press inquiries, contact us at <a href="mailto:press@gosafe.in" className="text-white underline">press@gosafe.in</a>.
            </p>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="gosafe-container py-10">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Press Releases</h2>
        </div>
        <div className="space-y-4 max-w-3xl">
          {pressReleases.map((pr, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{pr.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-2">{pr.excerpt}</p>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {pr.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Newspaper className="w-3 h-3" /> {pr.source}
                    </span>
                  </div>
                </div>
                <a href="#" className="shrink-0 text-blue-600 hover:text-blue-700 p-1" aria-label="Read full article">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Media Mentions */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="gosafe-container py-10">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Media Mentions</h2>
          </div>
          <div className="space-y-3 max-w-3xl">
            {mediaMentions.map((m, i) => (
              <a
                key={i}
                href={m.url}
                className="block bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-blue-600">{m.outlet}</span>
                    <p className="text-sm text-gray-900 mt-0.5">{m.headline}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 shrink-0" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="gosafe-container py-10 text-center">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Media Inquiries</h2>
        <p className="text-sm text-gray-500 mb-4">For press and media related queries</p>
        <a
          href="mailto:press@gosafe.in"
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors"
        >
          press@gosafe.in
        </a>
      </section>

      <Footer />
    </>
  )
}
