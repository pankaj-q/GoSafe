import type { Metadata } from 'next'
import SearchClient from './search-client'

export const metadata: Metadata = {
  title: 'Search Buses - Compare Prices & Book Online',
  description: 'Search and compare bus tickets across India. Find AC Sleeper, Volvo, Non-AC buses with real-time seat availability, boarding points, and best prices. Book bus tickets online for any route.',
  openGraph: {
    title: 'Search Buses - Compare Prices & Book Online | GoSafe',
    description: 'Search bus tickets for any route in India. Compare prices, bus types, amenities, and seat availability. Instant booking with e-ticket delivery.',
  },
  keywords: [
    'search buses', 'bus ticket online', 'book bus ticket', 'compare bus prices',
    'AC sleeper bus', 'volvo bus booking', 'bus seat availability',
  ],
}

export default function SearchPage() {
  return <SearchClient />
}
