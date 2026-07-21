'use client'

import { ShieldCheck, ShieldAlert } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface InsuranceSelectorProps {
  opted: boolean
  premium: number
  coverage: number
  onToggle: (opted: boolean) => void
}

export default function InsuranceSelector({ opted, premium, coverage, onToggle }: InsuranceSelectorProps) {
  return (
    <div
      onClick={() => onToggle(!opted)}
      className={`gosafe-card p-4 cursor-pointer transition-all ${
        opted ? 'border-blue-400 ring-2 ring-blue-100' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg shrink-0 ${opted ? 'bg-blue-100' : 'bg-gray-100'}`}>
          {opted ? (
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm text-gray-900">Bus Travel Insurance</h4>
            <span className={`text-sm font-bold ${opted ? 'text-blue-600' : 'text-gray-500'}`}>
              {formatCurrency(premium)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Get covered up to {formatCurrency(coverage)} for accident, journey interruption & baggage loss.
          </p>
          <ul className="mt-2 space-y-1">
            {[
              'Accidental death cover',
              'Medical expense cover',
              'Baggage loss/damage',
              'Journey cancellation',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                <div className={`w-1.5 h-1.5 rounded-full ${opted ? 'bg-blue-500' : 'bg-gray-300'}`} />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${opted ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${opted ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
            <span className="ml-2 text-xs font-medium text-gray-700">
              {opted ? 'Insurance added' : 'Add for your safety'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
