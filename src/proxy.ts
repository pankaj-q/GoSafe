import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 30
const AUTH_RATE_LIMIT = 10
const RATE_WINDOW_MS = 60_000
const CLEANUP_INTERVAL_MS = 300_000

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)

const CORS_METHODS = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
const CORS_HEADERS = 'Content-Type, Authorization, X-Requested-With'

let lastCleanup = Date.now()

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

    const isAuth = pathname.startsWith('/api/auth/')
    const limit = isAuth ? AUTH_RATE_LIMIT : RATE_LIMIT
    const now = Date.now()
    const entry = rateLimitMap.get(ip)

    if (!entry || now > entry.resetAt) {
      rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    } else {
      entry.count++
      if (entry.count > limit) {
        return addCorsHeaders(
          NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429, headers: { 'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)) } }
          ),
          origin
        )
      }
    }

    const response = addCorsHeaders(NextResponse.next(), origin)
    response.headers.set('X-RateLimit-Limit', String(limit))
    response.headers.set('X-RateLimit-Remaining', String(Math.max(0, limit - (entry?.count || 1))))
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
