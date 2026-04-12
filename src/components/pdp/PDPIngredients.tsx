'use client'

import { Product } from '@/types/product'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

type Props = { product: Product }

export default function PDPIngredients({ product }: Props) {
  if (!product.key_ingredients?.length) return null

  return (
    <section className="w-full px-4 py-16 bg-[#DCEFFF]">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase
                        text-[#1A237E] opacity-40 mb-2">
            What&apos;s Inside
          </p>
          <h2 className="text-2xl font-semibold text-[#1A237E] mb-8">
            Key Ingredients
          </h2>

          <div className="flex flex-col gap-4">
            {product.key_ingredients.map((ing, i) => (
              <motion.div
                key={ing.name}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4 p-5 bg-white rounded-2xl
                           border border-white shadow-sm"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full
                                bg-[#DCD9F8] flex items-center
                                justify-center mt-0.5">
                  <Sparkles size={14} className="text-[#1A237E]" />
                </div>
                <div>
                  <p className="text-base font-semibold text-[#1A237E]">
                    {ing.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                    {ing.benefit}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
