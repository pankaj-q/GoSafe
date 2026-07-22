import { scryptSync, randomBytes, timingSafeEqual } from 'crypto'

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function comparePassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  const hashBuffer = scryptSync(password, salt, 64)
  const storedBuffer = Buffer.from(hash, 'hex')
  return timingSafeEqual(hashBuffer, storedBuffer)
}
