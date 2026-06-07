'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function PhilosophySection() {
  return (
    <section className="w-full bg-[#DCD9F8] py-24 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — Philosophy text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-[#1A237E] opacity-40 mb-4 font-medium" style={{ fontFamily: 'var(--font-body)' }}>
              Our Philosophy
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-[52px] sm:text-[64px] font-light leading-[1.05] tracking-tight text-[#1A237E] mb-8">
              Science that<br />
              feels like<br />
              <em className="text-[#1A237E]/40">self-care.</em>
            </h2>
            <p style={{ fontFamily: 'var(--font-body)' }} className="text-base text-gray-500 leading-relaxed max-w-sm mb-8 font-light">
              Every formula is the result of Hitali&apos;s MSc chemistry
              expertise meeting Harsh&apos;s obsession with skin that
              actually glows. No compromises. No fillers.
            </p>
            <Link href="/routine" style={{ fontFamily: 'var(--font-body)' }} className="inline-flex items-center gap-3 text-base font-medium text-[#1A237E] group">
              <span className="w-10 h-px bg-[#1A237E] group-hover:w-16 transition-all duration-300" />
              Meet the Routine
            </Link>
          </motion.div>

          {/* Right — 3 pillars */}
          <div className="flex flex-col gap-4">
            {[
              {
                number: '01',
                title: 'High-Performance Actives',
                body: 'Clinically proven ingredients at concentrations that actually work — Vitamin C at 15%, Niacinamide at 10%.',
                delay: 0.1,
              },
              {
                number: '02',
                title: 'Calming Botanicals',
                body: 'Cica, Palash, and Amla keep your skin barrier calm while actives do their work. Balance, not battle.',
                delay: 0.2,
              },
              {
                number: '03',
                title: "Textures You'll Love",
                body: 'Ultra-lightweight formulas designed for Indian humidity. No white cast. No grease. Just skin.',
                delay: 0.3,
              },
            ].map((pillar) => (
              <motion.div
                key={pillar.number}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: pillar.delay, duration: 0.6 }}
                className="flex gap-6 p-6 rounded-2xl hover:bg-white transition-colors group cursor-default"
              >
                <span style={{ fontFamily: 'var(--font-display)' }} className="text-4xl font-light text-[#1A237E]/20 flex-shrink-0 leading-none mt-1 group-hover:text-[#1A237E]/40 transition-colors">
                  {pillar.number}
                </span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-body)' }} className="text-base font-semibold text-[#1A237E] mb-2">
                    {pillar.title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)' }} className="text-sm text-gray-500 leading-relaxed font-light">
                    {pillar.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
