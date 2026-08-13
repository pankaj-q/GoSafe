import { createClient } from 'redis'

/**
 * Small TTL cache used by DB-heavy read endpoints (search, tracking).
 * Uses Redis when REDIS_URL is configured, otherwise falls back to an
 * in-process Map (fine for a single-instance deployment, and means local
 * dev needs zero extra infrastructure).
 */

type CacheValue = string | number | boolean | null | Record<string, unknown> | unknown[]

const memory = new Map<string, { value: CacheValue; expiresAt: number }>()
let redisClient: ReturnType<typeof createClient> | null = null
let redisErrorLogged = false

async function getRedis() {
  if (!process.env.REDIS_URL) return null
  if (!redisClient) {
    redisClient = createClient({ url: process.env.REDIS_URL })
    redisClient.on('error', err => {
      if (!redisErrorLogged) {
        console.error('[cache] Redis error, falling back to memory:', err.message)
        redisErrorLogged = true
      }
    })
    await redisClient.connect().catch(() => {
      redisClient = null
    })
  }
  return redisClient
}

export async function cacheGet(key: string): Promise<CacheValue | undefined> {
  const client = await getRedis()
  if (client) {
    try {
      const raw = await client.get(key)
      if (raw == null) return undefined
      return JSON.parse(raw) as CacheValue
    } catch {
      return undefined
    }
  }

  const entry = memory.get(key)
  if (!entry) return undefined
  if (Date.now() > entry.expiresAt) {
    memory.delete(key)
    return undefined
  }
  return entry.value
}

export async function cacheSet(key: string, value: CacheValue, ttlMs: number): Promise<void> {
  const client = await getRedis()
  if (client) {
    try {
      await client.set(key, JSON.stringify(value), { PX: ttlMs })
      return
    } catch {
      // fall through to memory
    }
  }
  memory.set(key, { value, expiresAt: Date.now() + ttlMs })
}

export async function cacheDel(key: string): Promise<void> {
  const client = await getRedis()
  if (client) {
    try { await client.del(key) } catch { /* ignore */ }
  }
  memory.delete(key)
}
