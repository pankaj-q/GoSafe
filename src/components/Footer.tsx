import Link from 'next/link'
import { Bus, Mail, Phone, MapPin, Globe, MessageCircle, Video, ArrowUpRight } from 'lucide-react'

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Press', href: '/press' },
  ],
  support: [
    { label: 'Help Centre', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Cancellation Policy', href: '/cancellation' },
    { label: 'Refund Policy', href: '/refund' },
    { label: 'Safety Guidelines', href: '/safety' },
  ],
  routes: [
    { label: 'Delhi to Varanasi', href: '/search?source=Delhi&destination=Varanasi' },
    { label: 'Delhi to Mumbai', href: '/search?source=Delhi&destination=Mumbai' },
    { label: 'Mumbai to Pune', href: '/search?source=Mumbai&destination=Pune' },
    { label: 'Bangalore to Chennai', href: '/search?source=Bangalore&destination=Chennai' },
    { label: 'Delhi to Jaipur', href: '/search?source=Delhi&destination=Jaipur' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Grievance Redressal', href: '/grievance' },
  ],
}

const paymentMethods = [
  'Visa', 'Mastercard', 'UPI', 'NetBanking', 'Paytm', 'Google Pay', 'PhonePe', 'Razorpay',
]

const socialLinks = [
  { icon: Globe, href: '#', label: 'Facebook' },
  { icon: MessageCircle, href: '#', label: 'Twitter' },
  { icon: Globe, href: '#', label: 'Instagram' },
  { icon: Video, href: '#', label: 'Youtube' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Main Footer */}
      <div className="gosafe-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Bus className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">GoSafe</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              India&apos;s fastest growing bus booking platform. Safe, reliable & affordable bus travel across 80+ cities with real-time tracking, instant e-tickets & 24/7 support.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <a href="mailto:support@gosafe.in" className="hover:text-white transition-colors">support@gosafe.in</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <a href="tel:+918000123456" className="hover:text-white transition-colors">+91 8000 123 456</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors flex items-center gap-1 group">
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Support</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors flex items-center gap-1 group">
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Popular Routes</h3>
            <ul className="space-y-2.5">
              {footerLinks.routes.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors flex items-center gap-1 group">
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Methods & Social */}
        <div className="mt-10 pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">We Accept</h4>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map(m => (
                  <span key={m} className="text-xs px-3 py-1.5 rounded-md bg-gray-800 text-gray-300 border border-gray-700">
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.map(s => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="gosafe-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span>© {new Date().getFullYear()} GoSafe. All rights reserved.</span>
          <span className="text-gray-600">Made in India 🇮🇳</span>
        </div>
      </div>
    </footer>
  )
}
