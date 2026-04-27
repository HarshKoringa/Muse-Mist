'use client'

import { motion } from 'framer-motion'

const pillars = [
  {
    number: '01',
    title: 'Less Is More',
    body: 'A short routine done consistently beats a complicated one abandoned after a week. We built 5 products. Not 50.',
  },
  {
    number: '02',
    title: 'Actives With Intent',
    body: 'Every active in our lineup has clinical evidence. Vitamin C at 15%. Niacinamide at 10%. Not because they trend — because they work.',
  },
  {
    number: '03',
    title: 'Barrier First',
    body: 'Healthy skin starts with a healthy barrier. We build every routine around ceramides and hydration before layering actives.',
  },
]

export default function RoutinePillars() {
  return (
    <section className="w-full px-6 sm:px-12 py-24 bg-[#DCEFFF]">
      <div className="max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.35em] uppercase text-[#1A237E]/40 mb-4 font-medium" style={{ fontFamily: 'var(--font-body)' }}>
            Our Approach
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-[52px] sm:text-[64px] font-light text-[#1A237E] leading-tight">
            Three beliefs.<br />
            <em className="text-[#1A237E]/40">One ritual.</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="bg-white rounded-3xl p-8 border border-white/80 hover:shadow-lg hover:shadow-[#1A237E]/5 transition-all duration-300 hover:-translate-y-1"
            >
              <span style={{ fontFamily: 'var(--font-display)' }} className="text-[64px] font-light text-[#1A237E]/10 leading-none block mb-4">
                {pillar.number}
              </span>
              <h3 style={{ fontFamily: 'var(--font-body)' }} className="text-lg font-semibold text-[#1A237E] mb-3">
                {pillar.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)' }} className="text-sm text-gray-500 leading-relaxed font-light">
                {pillar.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
