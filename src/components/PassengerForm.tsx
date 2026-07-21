'use client'

import { Plus, Trash2, User } from 'lucide-react'
import type { PassengerData } from '@/lib/validations'

interface PassengerFormProps {
  count: number
  passengers: PassengerData[]
  onChange: (passengers: PassengerData[]) => void
}

export default function PassengerForm({ count, passengers, onChange }: PassengerFormProps) {
  function updatePassenger(index: number, field: keyof PassengerData, value: string | number) {
    const updated = [...passengers]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  function addPassenger() {
    if (passengers.length >= count) return
    onChange([...passengers, { name: '', age: 18, gender: 'MALE' }])
  }

  function removePassenger(index: number) {
    onChange(passengers.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Passenger Details</h3>
        <span className="text-xs text-gray-500">{passengers.length} of {count} added</span>
      </div>

      {passengers.map((p, i) => (
        <div key={i} className="gosafe-card p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span className="font-medium text-sm text-gray-800">Passenger {i + 1}</span>
            </div>
            {passengers.length > 1 && (
              <button
                type="button"
                onClick={() => removePassenger(i)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="gosafe-label">Full Name</label>
              <input
                type="text"
                value={p.name}
                onChange={e => updatePassenger(i, 'name', e.target.value)}
                placeholder="Enter passenger name"
                className="gosafe-input"
                required
              />
            </div>
            <div>
              <label className="gosafe-label">Age</label>
              <input
                type="number"
                value={p.age}
                onChange={e => updatePassenger(i, 'age', Math.max(1, Math.min(120, parseInt(e.target.value) || 0)))}
                min={1}
                max={120}
                className="gosafe-input"
                required
              />
            </div>
            <div>
              <label className="gosafe-label">Gender</label>
              <select
                value={p.gender}
                onChange={e => updatePassenger(i, 'gender', e.target.value)}
                className="gosafe-input"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </div>
      ))}

      {passengers.length < count && (
        <button
          type="button"
          onClick={addPassenger}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Passenger {passengers.length + 1}
        </button>
      )}
    </div>
  )
}
