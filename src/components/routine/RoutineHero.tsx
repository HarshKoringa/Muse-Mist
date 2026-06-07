'use client'

import { motion } from 'framer-motion'

export default function RoutineHero() {
  return (
    <section
      className="relative w-full min-h-[70vh] overflow-hidden flex flex-col justify-between px-6 sm:px-12 pt-40 pb-16"
      style={{ background: 'linear-gradient(135deg, #DCD9F8 0%, #DCEFFF 100%)' }}
    >

      {/* Ambient orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
           style={{ background: 'radial-gradient(circle, #FFFFFF, transparent)' }} />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-15 blur-3xl pointer-events-none"
           style={{ background: 'radial-gradient(circle, #1A237E, transparent)' }} />

      {/* Hero content */}
      <div className="max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xs tracking-[0.35em] uppercase text-[#1A237E]/60 mb-6 font-medium"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          The Muse &amp; Mist Method
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          style={{ fontFamily: 'var(--font-display)' }}
          className="text-[64px] sm:text-[96px] font-light text-[#0D1117] leading-[0.95] tracking-tight mb-8"
        >
          Your skin.<br />
          <em className="text-[#1A237E]">Your ritual.</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{ fontFamily: 'var(--font-body)' }}
          className="text-base sm:text-lg text-[#374151] font-light max-w-lg leading-relaxed"
        >
          A science-backed routine designed for real life —
          not a 12-step shelf. Every product earns its place.
        </motion.p>

        {/* Step indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-2 mt-12"
        >
          {['Cleanse', 'Treat', 'Hydrate', 'Moisturise', 'Protect'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A237E]/40" />
                <span className="text-xs text-[#1A237E] hidden sm:block" style={{ fontFamily: 'var(--font-body)' }}>
                  {step}
                </span>
              </div>
              {i < 4 && <div className="w-6 h-px bg-[#1A237E]/20" />}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
