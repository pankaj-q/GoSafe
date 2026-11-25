# Deploying GoSafe

GoSafe is a Next.js 16 app with a Prisma + libSQL (Turso) database. Below are two supported ways to deploy.

## Option 1 — Vercel + Turso (recommended)

### 1. Provision a Turso database
```bash
# install turso cli (once)
curl -sSfL https://get.tur.so/install.sh | bash
turso auth login
turso db create gosafe
turso db show gosafe --url        # -> TURSO_DATABASE_URL
turso db tokens create gosafe     # -> TURSO_AUTH_TOKEN
```

### 2. Apply the schema + seed data
```bash
export TURSO_DATABASE_URL="libsql://gosafe-<org>.turso.io"
export TURSO_AUTH_TOKEN="<token>"
# apply the existing migration SQL
turso db shell gosafe < prisma/migrations/20260814031626_init_schema/migration.sql
# seed demo data (cities, routes, buses, schedules)
npm run db:seed
```

### 3. Push code to GitHub
```bash
git push origin main
```

### 4. Import on Vercel
- Go to https://vercel.com/new and import `pankaj-q/GoSafe`.
- Framework preset: Next.js (auto-detected).
- Build command: `npm run build` (runs `prisma generate && next build`).
- Set all environment variables from `.env.example`:
  - `DATABASE_URL` (or `TURSO_DATABASE_URL`) = your Turso URL
  - `TURSO_AUTH_TOKEN`
  - `NEXTAUTH_SECRET` (>=32 chars), `NEXTAUTH_URL` = `https://your-domain.com`
  - `GEMINI_API_KEY` (required in production)
  - Payment keys (`RAZORPAY_*`, `STRIPE_*`), `RESEND_*`, `TWILIO_*`
  - Optional: `REDIS_URL`, `SENTRY_DSN`, PostHog keys
- Deploy.

### 5. Configure webhooks (after deploy)
- Razorpay: `https://your-domain.com/api/webhooks/razorpay` (events: payment.captured, payment.failed)
- Stripe: `https://your-domain.com/api/webhooks/stripe`

### 6. Custom domain
Add your domain in Vercel project settings and update `NEXTAUTH_URL` accordingly.

## Option 2 — VPS / Docker (persistent SQLite, no Turso)

Build and run with Node directly:
```bash
npm ci
npm run build
DATABASE_URL="file:./prisma/prod.db" npm run db:migrate   # if using migrate deploy
npm run seed
npm start
```
Use a process manager (pm2/systemd) and put nginx/caddy in front for HTTPS.

## Notes
- `src/generated/prisma` is gitignored; Vercel regenerates it via `postinstall`/`build`.
- Redis is optional; the app falls back to in-memory cache.
- Sentry/PostHog are optional.
- Google OAuth is optional (enable by setting `GOOGLE_CLIENT_ID`/`SECRET`).
