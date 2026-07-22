import type { Metadata } from 'next'
import { Suspense } from 'react'
import ConfirmationClient from './confirmation-client'

export const metadata: Metadata = {
  title: 'Booking Confirmed - Download E-Ticket',
  description: 'Your bus ticket is confirmed. Download PDF e-ticket, send to WhatsApp or email. Happy journey with GoSafe!',
  robots: { index: false, follow: false },
}

export default function ConfirmationPage() {
  return (
    <Suspense>
      <ConfirmationClient />
    </Suspense>
  )
}
