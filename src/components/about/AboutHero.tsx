'use client'

import { motion } from 'framer-motion'

export default function AboutHero() {
  return (
    <section
      className="relative w-full min-h-[75vh] overflow-hidden flex flex-col justify-end px-6 sm:px-12 pb-16 pt-32"
      style={{ background: 'linear-gradient(135deg, #DCD9F8 0%, #DCEFFF 100%)' }}
    >

      {/* Ambient orbs */}
      <div className="absolute top-[-5%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
           style={{ background: 'radial-gradient(circle, #FFFFFF, transparent)' }} />
      <div className="absolute bottom-0 left-[20%] w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
           style={{ background: 'radial-gradient(circle, #1A237E, transparent)' }} />

      {/* Content */}
      <div className="relative z-10 max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xs tracking-[0.35em] uppercase text-[#1A237E]/60 mb-6 font-medium"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Our Story
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          style={{ fontFamily: 'var(--font-display)' }}
          className="text-[64px] sm:text-[96px] font-light text-[#0D1117] leading-[0.92] tracking-tight mb-8"
        >
          Where science<br />
          <em className="text-[#1A237E]/50">meets serenity.</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ fontFamily: 'var(--font-body)' }}
          className="text-base sm:text-lg text-[#374151] font-light max-w-lg leading-relaxed"
        >
          Muse &amp; Mist was born from a simple belief — that
          high-performance skincare should feel like a ritual,
          not a routine.
        </motion.p>
      </div>
    </section>
  )
}
