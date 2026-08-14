'use client'

import { useState, useMemo, useRef } from 'react'
import {
  Search, Ticket, CreditCard, XCircle, RotateCcw, Wrench, ChevronRight,
  MessageCircle, Phone, Mail, X, Sparkles,
} from 'lucide-react'
import { articles } from '@/lib/knowledge'
import { ChatPanel } from '@/components/AIWidget'

export default function HelpCentre() {
  const [query, setQuery] = useState('')
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set())
  const resultsRef = useRef<HTMLDivElement>(null)

  const trimmed = query.trim().toLowerCase()
  const DEFAULT_ANSWERS = 8

  const results = useMemo(() => {
    if (!trimmed) return []
    return articles.filter(a =>
      a.question.toLowerCase().includes(trimmed) ||
      a.answer.toLowerCase().includes(trimmed) ||
      a.category.toLowerCase().includes(trimmed)
    )
  }, [trimmed])

  const displayedArticles = useMemo(() => {
    if (trimmed) {
      return results.length > 0 ? results : []
    }
    const base = articles.slice(0, DEFAULT_ANSWERS)
    const pinned = articles.filter(a => pinnedIds.has(a.id) && !base.some(b => b.id === a.id))
    return [...base, ...pinned]
  }, [trimmed, results, pinnedIds])

  function highlight(text: string) {
    if (!trimmed) return text
    const idx = text.toLowerCase().indexOf(trimmed)
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-amber-100 dark:bg-amber-500/30 text-inherit rounded px-0.5">{text.slice(idx, idx + trimmed.length)}</mark>
        {text.slice(idx + trimmed.length)}
      </>
    )
  }

  function openArticle(id: string) {
    setPinnedIds(prev => new Set(prev).add(id))
    setOpenIds(prev => new Set(prev).add(id))
    setQuery('')
    requestAnimationFrame(() => {
      document.getElementById(`article-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function toggleArticle(id: string) {
    setOpenIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
        <div className="gosafe-container py-14 sm:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">Help Centre</h1>
            <p className="text-blue-200 text-sm mb-6">Find answers to your questions or reach out to our support team</p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for help topics..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border-0 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 bg-white"
                aria-label="Search help topics"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live search results */}
            {trimmed && (
              <div ref={resultsRef} className="max-w-md mx-auto mt-3 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 text-left overflow-hidden animate-fade-in">
                {results.length > 0 ? (
                  <ul className="max-h-72 overflow-y-auto no-scrollbar divide-y divide-gray-50 dark:divide-gray-800">
                    {results.map(r => (
                      <li key={r.id}>
                        <button
                          onClick={() => { openArticle(r.id); setQuery('') }}
                          className="w-full flex items-start gap-2.5 px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{highlight(r.question)}</div>
                            <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{r.category}</div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">No answers found</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Try a different keyword, or reach us on WhatsApp 24×7.</p>
                    <a
                      href="https://wa.me/918000123456"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-500 text-white rounded-lg px-3.5 py-2 hover:bg-emerald-600 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Chat on WhatsApp
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories with working article links */}
      <section className="gosafe-container py-10">
        {!trimmed ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => {
              const Icon = cat.icon
              const catArticles = articles.filter(a => a.category === cat.title)
              return (
                <div key={cat.title} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 hover:border-blue-100 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{cat.title}</h2>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">{cat.desc}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {catArticles.map(article => (
                      <li key={article.id}>
                        <button
                          onClick={() => openArticle(article.id)}
                          className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                        >
                          <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-600 shrink-0" />
                          {article.question}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
            Showing {results.length} answer{results.length === 1 ? '' : 's'} for “{query}” — click a result above to open it.
          </div>
        )}
      </section>

      {/* All answers (accordions, anchored per article) */}
      <section id="faqs" className="bg-gray-50 dark:bg-gray-900/60 border-y border-gray-100 dark:border-gray-800">
        <div className="gosafe-container py-10">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {trimmed ? 'Matching answers' : 'Popular answers'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {trimmed
                ? `${displayedArticles.length} result${displayedArticles.length === 1 ? '' : 's'} for “${query}”`
                : `Showing ${displayedArticles.length} of ${articles.length} answers — search above to find more`}
            </p>
          </div>
          {trimmed && displayedArticles.length === 0 ? (
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 text-center">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">No matching answers</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Try a different keyword, or reach us on WhatsApp 24×7.</p>
              <a
                href="https://wa.me/918000123456"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-500 text-white rounded-lg px-3.5 py-2 hover:bg-emerald-600 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Chat on WhatsApp
              </a>
            </div>
          ) : (
          <div className="max-w-2xl mx-auto space-y-2.5">
            {displayedArticles.map(a => (
              <details
                key={a.id}
                id={`article-${a.id}`}
                open={openIds.has(a.id)}
                className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 open:border-blue-200 dark:open:border-blue-500/40 open:shadow-sm transition-all scroll-mt-28"
              >
                <summary
                  onClick={e => { e.preventDefault(); toggleArticle(a.id) }}
                  className="font-medium text-sm text-gray-900 dark:text-gray-100 cursor-pointer list-none flex items-center justify-between gap-4"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded px-1.5 py-0.5 shrink-0">{a.category}</span>
                    {a.question}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-gray-400 dark:text-gray-500 group-open:rotate-90 transition-transform shrink-0`} />
                </summary>
                <p className="mt-2 pl-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{a.answer}</p>
              </details>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Assistant */}
      <section className="gosafe-container py-10">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Ask GoSafe Assistant</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Get instant answers about bookings, refunds, cancellations and tickets — 24×7.
          </p>
        </div>
        <div className="max-w-xl mx-auto h-[34rem] flex flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl">
          <ChatPanel />
        </div>
      </section>

      {/* Contact */}
      <section className="gosafe-container py-10 text-center">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Still need help?</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Our support team is available 24/7</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="tel:+918000123456" className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors">
            <Phone className="w-4 h-4" /> +91 8000 123 456
          </a>
          <a href="mailto:support@gosafe.in" className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-medium px-5 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-800 hover:border-blue-200 transition-colors">
            <Mail className="w-4 h-4" /> support@gosafe.in
          </a>
          <a href="https://wa.me/918000123456" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-medium px-5 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-800 hover:border-blue-200 transition-colors">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        </div>
      </section>
    </>
  )
}

const categories = [
  { icon: Ticket, title: 'Booking', desc: 'How to book, modify tickets, select seats, add insurance, and receive e-tickets.' },
  { icon: CreditCard, title: 'Payments', desc: 'Payment methods, failed transactions, UPI issues, and receipt downloads.' },
  { icon: XCircle, title: 'Cancellation', desc: 'Cancel tickets, understand cancellation charges, and timelines.' },
  { icon: RotateCcw, title: 'Refunds', desc: 'Refund timelines, modes, tracking status, and partial refunds.' },
  { icon: Wrench, title: 'Technical Support', desc: 'App issues, website problems, login help, and error messages.' },
]
