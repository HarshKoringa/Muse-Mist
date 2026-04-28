'use client'

import { motion } from 'framer-motion'

const pillars = [
  {
    title: 'Hybrid Harmony',
    description: 'High-performance actives and calming botanicals — designed to coexist. Every formula balances efficacy with gentleness.',
  },
  {
    title: 'Skin Intelligence',
    description: 'Every ingredient earns its place. No fillers, no trend-chasing — just purposeful formulation driven by chemistry and results.',
  },
  {
    title: 'Glazed Philosophy',
    description: "Great skin looks like glass — luminous, healthy, effortless. Our goal is to reveal your skin's best version, not mask it.",
  },
]

export default function AboutPhilosophy() {
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
            Our Philosophy
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-[52px] sm:text-[64px] font-light text-[#1A237E] leading-tight">
            Built on three<br />
            <em className="text-[#1A237E]/40">beliefs.</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-white rounded-3xl p-8 hover:shadow-lg hover:shadow-[#1A237E]/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-8 h-1 rounded-full bg-[#1A237E]/20 mb-6" />
              <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-light text-[#1A237E] mb-3">
                {pillar.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)' }} className="text-sm text-gray-500 leading-relaxed font-light">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
