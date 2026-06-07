'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

type Props = { count: number }

export default function EarlyAccessCTA({ count }: Props) {
  return (
    <section className="w-full px-6 sm:px-12 py-32 bg-[#DCEFFF]">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-[52px] sm:text-[64px] font-light text-[#0D1117] leading-tight mb-6">
            Glazed skin.<br />
            <em>Starts here.</em>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)' }} className="text-base text-[#4B5563] leading-relaxed mb-10 max-w-sm mx-auto font-light">
            High-performance actives meet calming botanicals.
            Skincare designed for real skin, real life.
          </p>
          <div className="flex flex-col items-center gap-4 mt-10">
            <Link
              href="/#products"
              style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#1A237E] text-white text-base font-semibold hover:opacity-90 transition-opacity"
            >
              Shop Now →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
