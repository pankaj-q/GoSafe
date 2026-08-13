import type { Metadata } from 'next'
import NavHeader from '@/components/NavHeader'
import Footer from '@/components/Footer'
import HelpCentre from '@/components/HelpCentre'

export const metadata: Metadata = {
  title: 'Help Centre | GoSafe Bus Booking Support',
  description: 'Get help with bus booking, payments, cancellations, refunds, and technical issues. GoSafe Help Centre available 24/7.',
  openGraph: {
    title: 'GoSafe Help Centre',
    description: 'Find answers to your bus booking questions. 24/7 support for cancellations, refunds, payments & more.',
  },
  keywords: ['GoSafe help', 'bus booking help', 'cancel bus ticket', 'refund support', 'payment issue bus booking'],
}

export default function HelpPage() {
  return (
    <>
      <NavHeader />
      <HelpCentre />
      <Footer />
    </>
  )
}
