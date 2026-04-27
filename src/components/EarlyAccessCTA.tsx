'use client'

import { motion } from 'framer-motion'
import EarlyAccessButton from './EarlyAccessButton'

type Props = { count: number }

export default function EarlyAccessCTA({ count }: Props) {
  return (
    <section className="w-full px-6 sm:px-12 py-32 bg-[#DCD9F8]">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs tracking-[0.3em] uppercase text-[#1A237E]/40 mb-4 font-medium" style={{ fontFamily: 'var(--font-body)' }}>
            Early Access
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-[52px] sm:text-[64px] font-light text-[#1A237E] leading-tight mb-6">
            Be first.<br />
            <em>Pay less.</em>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)' }} className="text-base text-[#1A237E]/60 leading-relaxed mb-10 max-w-sm mx-auto font-light">
            Register now and get 30% off your entire first order when we go live. No code needed — it&apos;s automatic.
          </p>
          <div className="flex flex-col items-center gap-4 mt-10">
            <EarlyAccessButton variant="primary" fullWidth={false} />
            <p style={{ fontFamily: 'var(--font-body)' }} className="text-xs text-[#1A237E]/30">
              Join {count ?? 0} muses already on the list
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
