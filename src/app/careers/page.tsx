import type { Metadata } from 'next'
import NavHeader from '@/components/NavHeader'
import Footer from '@/components/Footer'
import { Briefcase, MapPin, Clock, DollarSign, Sparkles, Users, Laptop, HeartHandshake } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Careers at GoSafe | Join India\'s Fastest Growing Bus Platform',
  description: 'Explore career opportunities at GoSafe. Remote-first culture, competitive pay, and a chance to transform bus travel in India. Openings in engineering, operations, and support.',
  openGraph: {
    title: 'Careers at GoSafe - Join Our Team',
    description: 'Build the future of bus travel in India. Remote-first roles in engineering, operations & customer support.',
  },
  keywords: ['GoSafe careers', 'bus booking jobs', 'remote jobs India', 'travel tech careers'],
}

const perks = [
  { icon: Laptop, title: 'Remote-First', desc: 'Work from anywhere in India. Flexible hours, no commute.' },
  { icon: DollarSign, title: 'Competitive Pay', desc: 'Industry-leading salaries, equity options, and performance bonuses.' },
  { icon: Users, title: 'Great Team', desc: 'Collaborate with passionate folks who love building for India.' },
  { icon: HeartHandshake, title: 'Wellness', desc: 'Health insurance, mental health support, gym memberships.' },
]

const openings = [
  {
    title: 'Senior Software Engineer',
    dept: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    desc: 'Build and scale our booking platform, real-time tracking system, and payment infrastructure. 4+ years experience with React, Node.js, and cloud services preferred.',
  },
  {
    title: 'Operations Manager',
    dept: 'Operations',
    location: 'Delhi / Remote',
    type: 'Full-time',
    desc: 'Manage bus operator partnerships, route planning, and on-ground quality. 3+ years in travel or logistics operations required.',
  },
  {
    title: 'Customer Support Lead',
    dept: 'Support',
    location: 'Remote',
    type: 'Full-time',
    desc: 'Lead our support team across Hindi and English channels. Build processes, set quality standards, and ensure 24/7 coverage. 2+ years in customer service management.',
  },
  {
    title: 'Product Designer',
    dept: 'Design',
    location: 'Remote',
    type: 'Full-time',
    desc: 'Design intuitive booking flows, mobile experiences, and operator dashboards. Proficiency in Figma and a portfolio showcasing B2C products required.',
  },
  {
    title: 'Data Analyst',
    dept: 'Data',
    location: 'Remote',
    type: 'Full-time',
    desc: 'Analyze booking patterns, pricing optimization, and customer behaviour. SQL, Python, and experience with BI tools required.',
  },
  {
    title: 'Marketing Associate',
    dept: 'Marketing',
    location: 'Delhi',
    type: 'Full-time',
    desc: 'Drive user acquisition through digital campaigns, content marketing, and partnerships. 1+ year in growth marketing for consumer tech.',
  },
]

export default function CareersPage() {
  return (
    <>
      <NavHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
        <div className="gosafe-container py-14 sm:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/30 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-4">
              <Sparkles className="w-3 h-3" /> Join the team
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
              Shape the Future of Bus Travel
            </h1>
            <p className="text-blue-200 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              We&apos;re building India&apos;s most trusted bus booking platform — and we need talented people
              who care about solving real problems for millions of travellers.
            </p>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="bg-white border-b border-gray-100">
        <div className="gosafe-container py-10">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-6">Why Join GoSafe?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {perks.map(p => {
              const Icon = p.icon
              return (
                <div key={p.title} className="text-center">
                  <Icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{p.title}</h3>
                  <p className="text-xs text-gray-500">{p.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="gosafe-container py-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Our Culture</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>
              At GoSafe, we believe great work happens when people have autonomy, trust, and purpose.
              We are a remote-first team spread across India — from Delhi to Bangalore, Jaipur to Pune.
              We communicate async, document everything, and meet up twice a year for team retreats.
            </p>
            <p>
              We value ownership over hours spent. Every team member has the freedom to propose ideas,
              experiment, and take decisions that impact thousands of travellers. We celebrate diversity
              and actively work to build a team that reflects the India we serve.
            </p>
            <p>
              If you care about building something meaningful, enjoy solving hard problems, and want to
              work with people who push you to be better — you&apos;ll fit right in.
            </p>
          </div>
        </div>
      </section>

      {/* Openings */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="gosafe-container py-10">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-6">Open Positions</h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {openings.map((job, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Briefcase className="w-3 h-3" /> {job.dept}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" /> {job.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{job.desc}</p>
                  </div>
                  <button className="shrink-0 bg-blue-600 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gosafe-container py-10 text-center">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Don&apos;t see the right role?</h2>
        <p className="text-sm text-gray-500 mb-4">We&apos;re always looking for great people. Send us your resume.</p>
        <a
          href="mailto:careers@gosafe.in"
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors"
        >
          careers@gosafe.in
        </a>
      </section>

      <Footer />
    </>
  )
}
