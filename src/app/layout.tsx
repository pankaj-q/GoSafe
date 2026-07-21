import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { jsonLdOrganisation, jsonLdWebsite } from '@/lib/seo'
import PWARegister from '@/components/PWARegister'
import BookingProvider from '@/components/BookingProvider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const SITE_NAME = 'GoSafe - Bus Booking India'
const SITE_DESCRIPTION = 'Book bus tickets online for routes across India. Compare AC Sleeper, Volvo, Seater buses. Best prices, safe travel, instant confirmation.'
const BASE_URL = 'https://gosafe.in'

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | GoSafe`,
  },
  description: SITE_DESCRIPTION,
  manifest: '/manifest.json',
  keywords: [
    'bus booking', 'bus ticket booking', 'online bus booking', 'book bus online',
    'AC bus booking', 'sleeper bus booking', 'volvo bus booking',
    'Delhi to Varanasi bus', 'Delhi to Mumbai bus', 'Delhi to Hyderabad bus',
    'bus booking India', 'intercity bus', 'long route bus', 'travel booking India',
    'GoSafe bus', 'cheap bus tickets', 'bus reservation',
  ],
  authors: [{ name: 'GoSafe' }],
  creator: 'GoSafe',
  publisher: 'GoSafe',
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'GoSafe Bus Booking India' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  verification: {
    google: '', // add your Google Search Console verification code
  },
  category: 'travel',
  classification: 'Bus Booking Platform',
  other: {
    'google-site-verification': '',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1a56db' },
    { media: '(prefers-color-scheme: dark)', color: '#1a56db' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdOrganisation()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdWebsite()),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}>
        <BookingProvider>
          {children}
          <PWARegister />
        </BookingProvider>
      </body>
    </html>
  )
}
