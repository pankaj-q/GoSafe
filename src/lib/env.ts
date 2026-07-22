const REQUIRED = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL']
const RAZORPAY_REQUIRED = ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_WEBHOOK_SECRET']

export function validateEnv() {
  const missing: string[] = []

  for (const key of REQUIRED) {
    if (!process.env[key]) missing.push(key)
  }

  const hasRazorpay = RAZORPAY_REQUIRED.every(k => process.env[k])
  if (hasRazorpay) {
    for (const key of RAZORPAY_REQUIRED) {
      if (!process.env[key]) missing.push(key)
    }
  }

  for (const key of missing) {
    console.warn(`[env] Missing: ${key}`)
  }

  return missing.length === 0
}
