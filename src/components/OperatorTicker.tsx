import { Sparkles, TrendingUp } from 'lucide-react'

const operators = [
  'IntrCity SmartBus',
  'Orange Tours & Travels',
  'zingbus',
  'VRL Travels',
  'Neeta Tours & Travels',
  'Sharma Transports',
  'SRS Travels',
  'Parveen Travels',
  'Jai Bajrang Tours',
  'Abhishek Travels',
  'Chartered Bus',
  'Greenline Travels',
  'Laxmi Holidays',
  'Anand Travels',
  'Varanasi Express',
  'Hans Travels',
]

const highlights = [
  'TOP RATED',
  '4.6★',
  '2M+ RIDES',
  'GPS TRACKED',
]

export default function OperatorTicker() {
  const items = [...operators, ...highlights]
  const doubled = [...items, ...items]

  return (
    <div className="bg-gray-950 dark:bg-black border-b border-gray-800 dark:border-gray-800 text-gray-300 overflow-hidden relative">
      <div className="flex items-center max-w-7xl mx-auto">
        {/* Fixed label */}
        <div className="shrink-0 z-10 flex items-center gap-1.5 bg-gray-900 dark:bg-black border-r border-gray-800 px-3 sm:px-4 py-2">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.15em] text-white whitespace-nowrap">
            Trending Operators
          </span>
        </div>

        {/* Marquee */}
        <div className="relative flex-1 overflow-hidden py-2">
          <div className="flex whitespace-nowrap animate-marquee will-change-transform">
            {doubled.map((item, i) => {
              const isHighlight = highlights.includes(item)
              return (
                <span key={`${item}-${i}`} className="flex items-center">
                  {isHighlight ? (
                    <span className="mx-4 inline-flex items-center gap-1.5 text-[11px] font-black tracking-wide text-gray-400 dark:text-gray-500 uppercase">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      {item}
                    </span>
                  ) : (
                    <span className="mx-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-gray-100 dark:text-gray-200">
                      {item}
                      <span className="text-gray-600 dark:text-gray-500 text-[9px] font-semibold tracking-widest">BUS</span>
                    </span>
                  )}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
