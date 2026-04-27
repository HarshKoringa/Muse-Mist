'use client'

import { motion } from 'framer-motion'

export default function RoutineMantra() {
  return (
    <section className="w-full px-6 sm:px-12 py-32 bg-[#DCD9F8] flex items-center justify-center">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs tracking-[0.35em] uppercase text-[#1A237E]/40 mb-8 font-medium" style={{ fontFamily: 'var(--font-body)' }}>
            The Muse &amp; Mist Mantra
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-[64px] sm:text-[80px] font-light text-[#1A237E] leading-[0.95] tracking-tight mb-8">
            Consistency<br />
            <em className="text-[#1A237E]/30">over complexity.</em>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)' }} className="text-base text-[#1A237E]/60 leading-relaxed max-w-md mx-auto font-light">
            The best skincare routine is the one you actually do.
            Five minutes in the morning. Three at night.
            Every single day.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
