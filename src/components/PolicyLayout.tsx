'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ReactNode } from 'react'

type Props = {
  title: string
  subtitle: string
  lastUpdated: string
  children: ReactNode
}

export default function PolicyLayout({ title, subtitle, lastUpdated, children }: Props) {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="w-full bg-[#0D1117] px-6 sm:px-12 pt-32 pb-16">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors w-fit mb-8">
            <ArrowLeft size={16} />
            <span className="text-sm" style={{ fontFamily: 'var(--font-body)' }}>Back</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.35em] uppercase text-white/30 mb-4 font-medium" style={{ fontFamily: 'var(--font-body)' }}>
              Legal · HRK Wellness LLP
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-[52px] sm:text-[64px] font-light text-white leading-tight mb-4">
              {title}
            </h1>
            <p style={{ fontFamily: 'var(--font-body)' }} className="text-base text-white/40 font-light">
              {subtitle}
            </p>
            <p style={{ fontFamily: 'var(--font-body)' }} className="text-xs text-white/20 mt-3">
              Last updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="w-full px-6 sm:px-12 py-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col gap-12"
          >
            {children}
          </motion.div>

          {/* Contact CTA */}
          <div className="mt-16 p-8 rounded-3xl bg-[#DCEFFF] border border-[#DCD9F8]">
            <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-light text-[#1A237E] mb-2">
              Still have questions?
            </h3>
            <p style={{ fontFamily: 'var(--font-body)' }} className="text-base text-[#1A237E]/60 font-light mb-4">
              Our team typically responds within 24 hours.
            </p>
            <a
              href="mailto:support@museandmist.com"
              style={{ fontFamily: 'var(--font-body)' }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A237E] text-white text-base font-medium hover:opacity-90 transition-opacity"
            >
              support@museandmist.com
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-light text-[#1A237E] pb-3 border-b border-gray-100">
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-base text-gray-600 leading-relaxed font-light" style={{ fontFamily: 'var(--font-body)' }}>
        {children}
      </div>
    </div>
  )
}

export function PolicyList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3 mt-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-base text-gray-600 font-light" style={{ fontFamily: 'var(--font-body)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#1A237E]/30 flex-shrink-0 mt-2.5" />
          {item}
        </li>
      ))}
    </ul>
  )
}
