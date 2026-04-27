'use client'

import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

const morning = [
  { step: '01', label: 'Cleanse', sub: 'Cleanse, Clear & Calm' },
  { step: '02', label: 'Brighten', sub: 'Reset to Radiance' },
  { step: '03', label: 'Clarify', sub: 'Smooth & Spotless' },
  { step: '04', label: 'Moisturise', sub: 'Barrier Repair' },
  { step: '05', label: 'Protect', sub: 'Invisible Glow Shield' },
]

const night = [
  { step: '01', label: 'Cleanse', sub: 'Cleanse, Clear & Calm' },
  { step: '02', label: 'Clarify', sub: 'Smooth & Spotless' },
  { step: '03', label: 'Moisturise', sub: 'Barrier Repair' },
]

function RoutineCol({ items, dark }: { items: typeof morning; dark: boolean }) {
  return (
    <div className="flex flex-col gap-3 mt-8">
      {items.map((item, i) => (
        <motion.div
          key={item.step}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07 }}
          className={`flex items-center gap-4 px-5 py-4 rounded-2xl ${dark ? 'bg-white/5 border border-white/10' : 'bg-[#1A237E]/5 border border-[#1A237E]/10'}`}
        >
          <span style={{ fontFamily: 'var(--font-display)' }} className={`text-2xl font-light w-8 flex-shrink-0 ${dark ? 'text-white/20' : 'text-[#1A237E]/20'}`}>
            {item.step}
          </span>
          <div>
            <p style={{ fontFamily: 'var(--font-body)' }} className={`text-base font-semibold ${dark ? 'text-white' : 'text-[#1A237E]'}`}>
              {item.label}
            </p>
            <p style={{ fontFamily: 'var(--font-body)' }} className={`text-xs font-light ${dark ? 'text-white/40' : 'text-[#1A237E]/40'}`}>
              {item.sub}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default function RoutineSplit() {
  return (
    <section className="w-full px-6 sm:px-12 py-24 bg-[#0D1117]">
      <div className="max-w-4xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.35em] uppercase text-white/30 mb-4 font-medium" style={{ fontFamily: 'var(--font-body)' }}>
            Morning vs Night
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-[52px] font-light text-white leading-tight">
            AM &amp; PM.<br />
            <em className="text-white/30">Know the difference.</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Morning */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 rounded-3xl p-8 border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 flex items-center justify-center">
                <Sun size={18} className="text-amber-400" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-body)' }} className="text-base font-semibold text-white">Morning</h3>
                <p style={{ fontFamily: 'var(--font-body)' }} className="text-xs text-white/30">5 steps · ~4 min</p>
              </div>
            </div>
            <RoutineCol items={morning} dark={true} />
          </motion.div>

          {/* Night */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#DCD9F8]/5 rounded-3xl p-8 border border-[#DCD9F8]/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#DCD9F8]/10 flex items-center justify-center">
                <Moon size={18} className="text-[#DCD9F8]" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-body)' }} className="text-base font-semibold text-white">Night</h3>
                <p style={{ fontFamily: 'var(--font-body)' }} className="text-xs text-white/30">3 steps · ~3 min</p>
              </div>
            </div>
            <RoutineCol items={night} dark={true} />
            <p style={{ fontFamily: 'var(--font-body)' }} className="text-xs text-white/20 mt-6 leading-relaxed font-light">
              No SPF at night — save it for the morning when UV exposure actually happens.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
