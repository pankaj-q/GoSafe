'use client'

interface AdSlotProps {
  format?: 'banner' | 'rectangle' | 'leaderboard'
  className?: string
}

export default function AdSlot({ format = 'banner', className = '' }: AdSlotProps) {
  const sizes = {
    banner: 'h-20 sm:h-24',
    rectangle: 'h-64 sm:h-72',
    leaderboard: 'h-24 sm:h-28',
  }

  return (
    <div
      className={`${sizes[format]} ${className} bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center select-none`}
      aria-hidden="true"
    >
      <div className="text-center">
        <div className="text-[10px] uppercase tracking-widest text-gray-300 font-medium">Advertisement</div>
        <div className="text-[11px] text-gray-200 mt-0.5">Your Ad Here</div>
      </div>
    </div>
  )
}
