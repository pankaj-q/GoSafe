import type { Metadata } from 'next'
import NavHeader from '@/components/NavHeader'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'GoSafe Blog - Bus Travel Tips, Routes & Safety Guides',
  description: 'Read the latest articles about bus travel in India. Route guides, safety tips, travel hacks, and updates from the GoSafe team.',
  openGraph: {
    title: 'GoSafe Blog - Bus Travel Tips & Guides',
    description: 'Expert tips for bus travel across India. Route guides, safety advice, booking hacks, and more.',
  },
  keywords: ['bus travel blog', 'India bus routes', 'travel tips', 'bus safety', 'GoSafe blog'],
}

const articles = [
  {
    title: 'Top 10 Bus Routes in India for a Weekend Getaway',
    excerpt: 'Discover the most scenic and convenient bus routes for your next weekend trip — from Delhi to Jaipur, Mumbai to Goa, and more.',
    author: 'Priya Sharma',
    date: 'Jul 15, 2026',
    readTime: '5 min read',
    category: 'Travel Tips',
  },
  {
    title: 'Complete Guide to Booking AC Sleeper Buses Online',
    excerpt: 'Everything you need to know about booking AC Sleeper buses in India — amenities, pricing, what to expect, and how to get the best deals.',
    author: 'Rahul Verma',
    date: 'Jul 10, 2026',
    readTime: '7 min read',
    category: 'Guides',
  },
  {
    title: 'Bus Travel Safety: What to Look for Before Booking',
    excerpt: 'From GPS tracking to CCTV cameras — learn about the safety features that matter and how GoSafe ensures every journey is secure.',
    author: 'Ananya Patel',
    date: 'Jul 5, 2026',
    readTime: '4 min read',
    category: 'Safety',
  },
  {
    title: 'Delhi to Varanasi Bus Guide: Routes, Timings & Fare',
    excerpt: 'Comprehensive guide to bus travel from Delhi to Varanasi. Compare AC, Non-AC, Sleeper, and Seater options with fares and boarding points.',
    author: 'GoSafe Team',
    date: 'Jun 28, 2026',
    readTime: '6 min read',
    category: 'Routes',
  },
  {
    title: 'How to Get a Full Refund on Your Bus Ticket',
    excerpt: 'Step-by-step guide to cancelling your bus ticket and getting a refund. Free cancellation policy explained with timelines and payment modes.',
    author: 'Vikas Gupta',
    date: 'Jun 20, 2026',
    readTime: '3 min read',
    category: 'Booking',
  },
  {
    title: 'Bus Travel During Monsoon: Tips for a Safe Journey',
    excerpt: 'Essential tips for travelling by bus during the Indian monsoon season — packing, booking, safety precautions, and what to expect on the road.',
    author: 'Priya Sharma',
    date: 'Jun 15, 2026',
    readTime: '4 min read',
    category: 'Travel Tips',
  },
  {
    title: 'Mumbai to Pune Bus: Best Options for Daily Commuters',
    excerpt: 'A detailed comparison of bus services between Mumbai and Pune for daily commuters — timing, frequency, fares, and amenities.',
    author: 'Rahul Verma',
    date: 'Jun 8, 2026',
    readTime: '5 min read',
    category: 'Routes',
  },
  {
    title: 'Understanding Bus Travel Insurance: Is It Worth It?',
    excerpt: 'What does bus travel insurance cover? Accidental death, baggage loss, medical expenses — we break down the coverage for just ₹19 per seat.',
    author: 'Ananya Patel',
    date: 'Jun 1, 2026',
    readTime: '4 min read',
    category: 'Guides',
  },
  {
    title: 'GoSafe App Features: Real-Time Tracking, E-Tickets & More',
    excerpt: 'Explore all the features of the GoSafe mobile app — live bus tracking, WhatsApp tickets, easy cancellations, and exclusive app-only offers.',
    author: 'GoSafe Team',
    date: 'May 25, 2026',
    readTime: '3 min read',
    category: 'Product',
  },
]

const categories = ['All', 'Travel Tips', 'Routes', 'Guides', 'Safety', 'Booking', 'Product']

export default function BlogPage() {
  return (
    <>
      <NavHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
        <div className="gosafe-container py-14 sm:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
              GoSafe Blog
            </h1>
            <p className="text-blue-200 text-sm sm:text-base max-w-lg mx-auto">
              Bus travel tips, route guides, safety advice, and updates from the GoSafe team.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b border-gray-100">
        <div className="gosafe-container py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(c => (
              <button
                key={c}
                className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors ${
                  c === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="gosafe-container py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article, i) => (
            <Link
              key={i}
              href={`/blog/${article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
              className="group bg-white rounded-xl border border-gray-100 p-5 hover:border-blue-100 hover:shadow-sm transition-all"
            >
              <span className="inline-block text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-3">
                {article.category}
              </span>
              <h2 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-blue-600 transition-colors leading-snug">
                {article.title}
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {article.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {article.date}
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {article.readTime}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Load More */}
      <section className="gosafe-container pb-12 text-center">
        <button className="text-sm font-medium text-blue-600 bg-blue-50 px-6 py-2.5 rounded-xl hover:bg-blue-100 transition-colors inline-flex items-center gap-1.5">
          Load More Articles <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      <Footer />
    </>
  )
}
