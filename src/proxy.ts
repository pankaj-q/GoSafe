import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Route-aware rate limits.
 *  - webhooks: exempt (signature-verified; must never be throttled by IP)
 *  - auth:     10 req/min  (brute-force protection, tightened)
 *  - reads:    120 req/min (search, seats, tracking, tickets, bookings view)
 *  - writes:   30 req/min  (booking creation, holds, payments, confirm)
 */
type LimitGroup = 'auth' | 'read' | 'write' | 'webhook'

function groupFor(pathname: string, method: string): LimitGroup {
  if (pathname.startsWith('/api/webhooks')) return 'webhook'
  if (pathname.startsWith('/api/auth')) return 'auth'
  const write = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])
  if (write.has(method)) return 'write'
  return 'read'
}

const LIMITS: Record<LimitGroup, number> = {
  webhook: Infinity,
  auth: 10,
  read: 120,
  write: 30,
}

const WINDOW_MS = 60_000
const CLEANUP_INTERVAL_MS = 300_000

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)

const CORS_METHODS = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
const CORS_HEADERS = 'Content-Type, Authorization, X-Requested-With'

let lastCleanup = Date.now()

interface Bucket { count: number; resetAt: number }
const rateLimitMap = new Map<string, Bucket>()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(key)
  }
}

function addCorsHeaders(response: NextResponse, origin: string | null) {
  if (origin && (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin))) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Vary', 'Origin')
  }
  response.headers.set('Access-Control-Allow-Methods', CORS_METHODS)
  response.headers.set('Access-Control-Allow-Headers', CORS_HEADERS)
  return response
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const origin = request.headers.get('origin')

  if (pathname.startsWith('/api/')) {
    if (request.method === 'OPTIONS') {
      return addCorsHeaders(new NextResponse(null, { status: 204 }), origin)
    }

    cleanup()

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'anonymous'

    const group = groupFor(pathname, request.method)
    const limit = LIMITS[group]

    if (limit !== Infinity) {
      const key = `${group}:${ip}`
      const now = Date.now()
      const entry = rateLimitMap.get(key)

      if (!entry || now > entry.resetAt) {
        rateLimitMap.set(key, { count: 1, resetAt: now + WINDOW_MS })
      } else {
        entry.count++
        if (entry.count > limit) {
          return addCorsHeaders(
            NextResponse.json(
              { error: 'Too many requests. Please try again later.', group },
              { status: 429, headers: { 'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)) } }
            ),
            origin
          )
        }
      }

      const response = addCorsHeaders(NextResponse.next(), origin)
      response.headers.set('X-RateLimit-Limit', String(limit))
      response.headers.set('X-RateLimit-Group', group)
      response.headers.set('X-RateLimit-Remaining', String(Math.max(0, limit - (rateLimitMap.get(key)?.count || 1))))
      return response
    }

    return addCorsHeaders(NextResponse.next(), origin)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}