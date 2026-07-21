import { expect, test, describe } from 'vitest'
import { formatCurrency, formatDate, generateReference } from '@/lib/utils'

describe('formatCurrency', () => {
  test('formats number to INR with ₹ symbol', () => {
    const result = formatCurrency(1299)
    expect(result).toContain('₹')
    expect(result).toContain('1,299')
  })

  test('handles zero', () => {
    expect(formatCurrency(0)).toContain('₹')
  })
})

describe('generateReference', () => {
  test('returns alphanumeric string', () => {
    const ref = generateReference()
    expect(ref.length).toBeGreaterThanOrEqual(6)
    expect(ref).toMatch(/^[A-Z0-9]+$/)
  })

  test('generates unique values', () => {
    const refs = new Set(Array.from({ length: 100 }, () => generateReference()))
    expect(refs.size).toBe(100)
  })
})

describe('formatDate', () => {
  test('formats ISO string to readable date', () => {
    const result = formatDate('2026-07-22')
    expect(result).toContain('Jul')
    expect(result).toContain('2026')
  })
})
