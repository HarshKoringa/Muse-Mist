'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function RoutineCTA() {
  return (
    <section className="w-full px-6 sm:px-12 py-32 bg-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-xl"
      >
        <p className="text-xs tracking-[0.35em] uppercase text-[#1A237E]/40 mb-6 font-medium" style={{ fontFamily: 'var(--font-body)' }}>
          Ready?
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-[52px] font-light text-[#1A237E] leading-tight mb-4">
          Build your ritual.
        </h2>
        <p style={{ fontFamily: 'var(--font-body)' }} className="text-base text-gray-400 leading-relaxed mb-12 font-light">
          Every product in the routine is available now.
          Made in India, for Indian skin.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/#products"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#1A237E] text-white text-base font-semibold hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Shop The Edit
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/about"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-[#1A237E] text-[#1A237E] text-base font-semibold hover:bg-[#1A237E] hover:text-white transition-all"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Meet the Team
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
