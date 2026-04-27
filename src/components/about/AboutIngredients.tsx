'use client'

import { motion } from 'framer-motion'

const ingredients = [
  { name: 'Ceramides', role: 'Barrier Repair', description: 'Lipid molecules that restore and reinforce the skin barrier, locking in moisture and keeping irritants out.' },
  { name: 'Niacinamide', role: 'Brightening + Pore Control', description: 'A multitasking vitamin B3 that fades dark spots, minimises pores, controls oil, and strengthens the skin barrier.' },
  { name: 'Vitamin C (15%)', role: 'Antioxidant + Radiance', description: 'A potent antioxidant that neutralises free radicals, boosts collagen synthesis, and delivers visible brightening.' },
  { name: 'Cica (Centella)', role: 'Soothing + Healing', description: 'A botanical powerhouse that calms inflammation, accelerates skin healing, and strengthens the moisture barrier.' },
  { name: 'Hyaluronic Acid', role: 'Deep Hydration', description: 'Draws water into the skin from the environment, delivering multi-layer hydration for a plump, dewy finish.' },
  { name: 'Alpha Arbutin (1%)', role: 'Dark Spot Fading', description: 'A gentle skin-brightening agent that inhibits melanin production to visibly fade hyperpigmentation over time.' },
]

export default function AboutIngredients() {
  return (
    <section className="w-full px-6 sm:px-12 py-24 bg-white">
      <div className="max-w-4xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.35em] uppercase text-[#1A237E]/40 mb-4 font-medium" style={{ fontFamily: 'var(--font-body)' }}>
            Transparency First
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-[52px] font-light text-[#1A237E] leading-tight mb-4">
            Ingredients we<br />
            <em className="text-[#1A237E]/30">swear by.</em>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)' }} className="text-base text-gray-400 font-light max-w-md">
            No proprietary blends. No mystery. Every key ingredient explained in plain language.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ingredients.map((ing, i) => (
            <motion.div
              key={ing.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="p-6 rounded-2xl bg-[#DCEFFF]/40 border border-[#DCD9F8] hover:bg-[#DCEFFF] transition-colors"
            >
              <div className="flex items-start gap-3 mb-3">
                <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-light text-[#1A237E]">
                  {ing.name}
                </h3>
                <span style={{ fontFamily: 'var(--font-body)' }} className="text-xs px-2.5 py-1 rounded-full bg-[#1A237E]/8 text-[#1A237E] font-medium flex-shrink-0 mt-0.5">
                  {ing.role}
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-body)' }} className="text-sm text-gray-500 leading-relaxed font-light">
                {ing.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
