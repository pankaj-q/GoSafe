import type { Metadata } from 'next'
import { Suspense } from 'react'
import BookingClient from './booking-client'

export const metadata: Metadata = {
  title: 'Complete Your Booking',
  description: 'Select seats, enter passenger details, and pay securely for your bus ticket.',
  robots: { index: false, follow: false },
}

export default async function BookingPage({ params }: { params: Promise<{ scheduleId: string }> }) {
  const { scheduleId } = await params
  return (
    <Suspense>
      <BookingClient scheduleId={Number(scheduleId)} />
    </Suspense>
  )
}
