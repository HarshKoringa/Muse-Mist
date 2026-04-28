'use client'

import { motion } from 'framer-motion'
import { FlaskConical } from 'lucide-react'
import Image from 'next/image'

const founders = [
  {
    name: 'Harsh Koringa',
    title: 'Co-Founder & CEO',
    tag: 'Brand & Vision',
    image: 'https://jqetgwopumqhrhotoitf.supabase.co/storage/v1/object/public/product-images/founder-harsh.jpeg',
    gradientFrom: '#1A237E',
    gradientTo: '#DCD9F8',
    bio1: 'Muse & Mist started as a personal obsession. Frustrated by skincare that either worked but felt harsh, or felt luxurious but did nothing — Harsh decided to build the brand he always wanted to buy from.',
    bio2: "Every product decision comes back to the same question: would I use this every single day? If the answer isn't an immediate yes — we go back to the drawing board.",
    reverse: false,
    showIcon: false,
  },
  {
    name: 'Hitali Koringa',
    title: 'Co-Founder & Head of R&D',
    tag: 'Science & Formulation',
    image: 'https://jqetgwopumqhrhotoitf.supabase.co/storage/v1/object/public/product-images/founder-hitali.jpeg',
    gradientFrom: '#DCD9F8',
    gradientTo: '#1A237E',
    bio1: 'With an MSc in Chemistry, Hitali is the scientific backbone of Muse & Mist. Every formula that reaches your skin has passed through her rigorous research and testing process.',
    bio2: 'Her philosophy: actives must perform, botanicals must soothe, and nothing enters a formula without a reason. No fillers. No compromises. Just chemistry that works.',
    reverse: true,
    showIcon: true,
  },
]

export default function AboutFounder() {
  return (
    <section className="w-full px-6 sm:px-12 py-24 bg-[#0D1117]">
      <div className="max-w-4xl mx-auto flex flex-col gap-24">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs tracking-[0.35em] uppercase text-white/30 mb-4 font-medium" style={{ fontFamily: 'var(--font-body)' }}>
            The Team
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-[52px] sm:text-[64px] font-light text-white leading-tight">
            The minds<br />
            <em className="text-white/30">behind the mist.</em>
          </h2>
        </motion.div>

        {founders.map((founder, index) => (
          <motion.div
            key={founder.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className={`flex flex-col ${founder.reverse ? 'sm:flex-row-reverse' : 'sm:flex-row'} gap-10 items-center`}
          >
            {/* Avatar */}
            <div className="w-44 h-44 rounded-full overflow-hidden flex-shrink-0 shadow-2xl border-4 border-white/10">
              {founder.image ? (
                <Image
                  src={founder.image}
                  alt={founder.name}
                  width={176}
                  height={176}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-end pb-5"
                  style={{ background: `linear-gradient(135deg, ${founder.gradientFrom}, ${founder.gradientTo})` }}
                >
                  <span className="text-[9px] font-semibold tracking-widest uppercase text-white/30 text-center px-3 leading-tight" style={{ fontFamily: 'var(--font-body)' }}>
                    {founder.tag}
                  </span>
                </div>
              )}
            </div>

            {/* Text */}
            <div className={`flex flex-col gap-4 flex-1 ${founder.reverse ? 'sm:text-right' : ''}`}>
              <div>
                <span className="inline-block text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 font-medium mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                  {founder.title}
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-[40px] font-light text-white leading-tight">
                  {founder.name}
                </h3>
              </div>
              <p style={{ fontFamily: 'var(--font-body)' }} className="text-base text-white/50 leading-relaxed font-light">
                {founder.bio1}
              </p>
              <p style={{ fontFamily: 'var(--font-body)' }} className="text-base text-white/40 leading-relaxed font-light">
                {founder.bio2}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
