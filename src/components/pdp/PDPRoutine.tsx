'use client'

import { Product } from '@/types/product'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const routineStepMap: Record<string, { step: string; label: string; context: string }> = {
  'cleanse-clear-calm': {
    step: 'Step 01',
    label: 'Cleanse',
    context: 'This is where every routine begins. Start with a clean canvas before applying any actives or moisturisers.',
  },
  'reset-to-radiance': {
    step: 'Step 02',
    label: 'Treat — Brighten',
    context: 'Applied after cleansing on dry skin. This serum is your brightening and antioxidant layer before heavier products.',
  },
  'smooth-and-spotless': {
    step: 'Step 03',
    label: 'Treat — Clarify',
    context: 'Layer this after your Vitamin C serum. Niacinamide and Alpha Arbutin work together to fade spots over time.',
  },
  'barrier-repair': {
    step: 'Step 04',
    label: 'Moisturise',
    context: 'Applied after serums to seal in all active ingredients and maintain the skin barrier through the day or night.',
  },
  'invisible-glow-shield': {
    step: 'Step 05',
    label: 'Protect',
    context: 'Always the final step of your morning routine. Apply generously and reapply every 2-3 hours when outdoors.',
  },
}

type Props = { product: Product }

export default function PDPRoutine({ product }: Props) {
  const step = routineStepMap[product.slug]
  if (!step) return null

  return (
    <section className="w-full px-4 py-16 bg-white">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-gradient-to-br
                     from-[#1A237E] to-[#3949AB]
                     flex flex-col gap-6"
        >
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase
                          text-white opacity-30 mb-2">
              In the Routine
            </p>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full
                               bg-white/10 text-white">
                {step.step}
              </span>
              <h2 className="text-xl font-semibold text-white">
                {step.label}
              </h2>
            </div>
            <p className="text-base text-white/60 leading-relaxed">
              {step.context}
            </p>
          </div>

          <Link
            href="/routine"
            className="flex items-center justify-between
                       p-4 rounded-2xl bg-white/10
                       hover:bg-white/20 transition-colors group"
          >
            <div>
              <p className="text-base font-semibold text-white">
                See the Full Routine
              </p>
              <p className="text-xs text-white/50 mt-0.5">
                5 steps · Balanced Skin Ritual
              </p>
            </div>
            <ArrowRight
              size={20}
              className="text-white/50 group-hover:text-white
                         group-hover:translate-x-1 transition-all"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
