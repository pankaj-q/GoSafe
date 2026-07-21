import type { Metadata } from 'next'
import NavHeader from '@/components/NavHeader'
import Footer from '@/components/Footer'
import { Shield, AlertTriangle, ArrowRight, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Grievance Redressal | GoSafe Bus Booking',
  description: 'GoSafe grievance redressal policy. Nodal officer details, complaint process, escalation matrix. File a complaint online.',
  openGraph: {
    title: 'Grievance Redressal - GoSafe',
    description: 'File a complaint with GoSafe. Nodal officer details, escalation process, and complaint tracking.',
  },
  keywords: ['grievance redressal', 'complaint', 'nodal officer', 'GoSafe complaint', 'escalation matrix'],
}

const escalationLevels = [
  {
    level: 'Level 1',
    title: 'Customer Support',
    desc: 'Submit your complaint through our help centre, email, or phone. Our support team will respond within 24 hours.',
    details: ['Email: support@gosafe.in', 'Phone: +91 8000 123 456', 'Response time: 24 hours'],
  },
  {
    level: 'Level 2',
    title: 'Grievance Officer',
    desc: 'If unresolved at Level 1, escalate to the Grievance Officer. Complaint is reviewed within 48 hours.',
    details: ['Email: grievance@gosafe.in', 'Response time: 48 hours'],
  },
  {
    level: 'Level 3',
    title: 'Nodal Officer',
    desc: 'If still unresolved, escalate to the Nodal Officer for final resolution within 7 business days.',
    details: ['Email: nodal@gosafe.in', 'Response time: 7 business days'],
  },
]

export default function GrievancePage() {
  return (
    <>
      <NavHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
        <div className="gosafe-container py-14 sm:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/30 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-4">
              <Shield className="w-3 h-3" /> Grievance Redressal
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Grievance Redressal
            </h1>
            <p className="text-blue-200 text-sm max-w-lg mx-auto">
              We are committed to addressing your concerns promptly and fairly.
              Please follow the escalation matrix below for the fastest resolution.
            </p>
          </div>
        </div>
      </section>

      {/* Nodal Officer */}
      <section className="gosafe-container py-10 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-gray-900">Nodal Officer Details</h2>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="text-sm font-semibold text-gray-900">Mr. Ankit Verma</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Designation</p>
                <p className="text-sm font-semibold text-gray-900">Nodal Officer — Grievance Redressal</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <a href="mailto:nodal@gosafe.in" className="text-sm font-semibold text-blue-600 hover:text-blue-700">nodal@gosafe.in</a>
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <a href="tel:+918000123457" className="text-sm font-semibold text-blue-600 hover:text-blue-700">+91 8000 123 457</a>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Address</p>
              <p className="text-sm text-gray-900">
                GoSafe Technologies Pvt. Ltd., B-121, Sector 2, Noida, Uttar Pradesh 201301, India
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Escalation Matrix */}
      <section className="gosafe-container py-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-base font-bold text-gray-900 mb-6">Escalation Matrix</h2>
          <div className="space-y-4">
            {escalationLevels.map((e, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-blue-100 transition-all">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{e.level}</span>
                      <h3 className="font-semibold text-gray-900 text-sm">{e.title}</h3>
                    </div>
                    <p className="text-xs text-gray-500">{e.desc}</p>
                  </div>
                  {i < escalationLevels.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-300 shrink-0 mt-1 hidden sm:block" />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {e.details.map((d, j) => (
                    <span key={j} className="text-[10px] bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md border border-gray-100">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to file */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="gosafe-container py-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-gray-900">How to File a Complaint</h2>
            </div>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Submit your complaint via email to support@gosafe.in with your booking ID and detailed description.' },
                { step: '2', text: 'Alternatively, call our helpline at +91 8000 123 456 or file a complaint through the Help Centre.' },
                { step: '3', text: 'You will receive an acknowledgment within 24 hours with a unique complaint reference number.' },
                { step: '4', text: 'If not satisfied with the resolution, escalate to the Grievance Officer at grievance@gosafe.in.' },
                { step: '5', text: 'Final escalation to the Nodal Officer at nodal@gosafe.in for resolution within 7 business days.' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {item.step}
                  </div>
                  <p className="text-sm text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Response Times */}
      <section className="gosafe-container py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-base font-bold text-gray-900 mb-4">Expected Response Times</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { level: 'Level 1', time: '24 hours', via: 'Email / Phone' },
              { level: 'Level 2', time: '48 hours', via: 'Grievance Officer' },
              { level: 'Level 3', time: '7 business days', via: 'Nodal Officer' },
            ].map((r, i) => (
              <div key={i} className="text-center bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500">{r.level}</p>
                <p className="text-lg font-bold text-gray-900 my-1">{r.time}</p>
                <p className="text-[10px] text-gray-400">{r.via}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
