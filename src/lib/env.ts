const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const REQUIRED = ['DATABASE_URL', 'NEXTAUTH_SECRET']
const RAZORPAY_REQUIRED = ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_WEBHOOK_SECRET']

export function getMissingEnvVars(): string[] {
  const missing: string[] = []

  for (const key of REQUIRED) {
    if (!process.env[key]) missing.push(key)
  }

  const hasRazorpay = RAZORPAY_REQUIRED.some(k => process.env[k])
  if (hasRazorpay) {
    for (const key of RAZORPAY_REQUIRED) {
      if (!process.env[key]) missing.push(key)
    }
  }

  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    missing.push('NEXTAUTH_SECRET (must be at least 32 characters)')
  }

  return missing
}

export function validateEnv(): boolean {
  const missing = getMissingEnvVars()

  if (missing.length === 0) return true

  if (IS_PRODUCTION) {
    throw new Error(`Missing or invalid environment variables: ${missing.join(', ')}`)
  }

  for (const key of missing) {
    console.warn(`[env] Missing: ${key}`)
  }
  return false
}