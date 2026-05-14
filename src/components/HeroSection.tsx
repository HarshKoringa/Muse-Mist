'use client'

import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#0D1117] flex flex-col">

      {/* Ambient background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-20 bg-gradient-radial from-[#DCD9F8] to-transparent blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-15 bg-gradient-radial from-[#1A237E] to-transparent blur-3xl" />
        <div className="absolute top-[30%] left-[40%] w-[300px] h-[300px] rounded-full opacity-10 bg-gradient-radial from-[#DCEFFF] to-transparent blur-2xl" />
      </div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col justify-center flex-1 max-w-7xl mx-auto px-6 sm:px-12 pt-28 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[85vh]">

          {/* Left — Editorial text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col gap-8"
          >
            {/* Announcement pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm w-fit mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-sm text-white/80 font-medium" style={{ fontFamily: 'var(--font-body)' }}>
                Now Live — Shop The Edit
              </p>
            </motion.div>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-px bg-[#DCD9F8] opacity-50" />
              <p
                className="text-xs tracking-[0.3em] uppercase text-[#DCD9F8] opacity-60 font-medium"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Hybrid Harmony Skincare
              </p>
            </motion.div>

            {/* Main headline */}
            <div className="flex flex-col gap-2">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                style={{ fontFamily: 'var(--font-display)' }}
                className="text-[72px] sm:text-[96px] font-light leading-[0.9] tracking-tight text-white"
              >
                Glazed
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.8, ease: 'easeOut' }}
                style={{ fontFamily: 'var(--font-display)' }}
                className="text-[72px] sm:text-[96px] font-light leading-[0.9] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#DCD9F8] to-[#DCEFFF]"
              >
                <em>skin.</em>
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                style={{ fontFamily: 'var(--font-display)' }}
                className="text-[72px] sm:text-[96px] font-light leading-[0.9] tracking-tight text-white/30"
              >
                No drama.
              </motion.h1>
            </div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              style={{ fontFamily: 'var(--font-body)' }}
              className="text-base sm:text-lg text-white/50 leading-relaxed max-w-sm font-light"
            >
              High-performance actives meet calming botanicals.
              Skincare designed for real skin, real life.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() =>
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
                }
                style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#DCD9F8] text-[#1A237E] text-base font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Shop The Edit →
              </button>
              <button
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ fontFamily: 'var(--font-body)' }}
                className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors text-base cursor-pointer group"
              >
                View products
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex items-center gap-8 pt-4 border-t border-white/10"
            >
              {[
                { value: '5', label: 'Active formulas' },
                { value: '0%', label: 'Harmful fillers' },
                { value: '100%', label: 'Honest ingredients' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5" style={{ fontFamily: 'var(--font-body)' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Abstract glazed orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }}
            className="relative flex items-center justify-center h-[500px] lg:h-[600px]"
          >
            {/* Main orb */}
            <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px]">
              <div className="absolute inset-[-20%] rounded-full bg-gradient-radial from-[#DCD9F8]/20 to-transparent blur-3xl" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#DCD9F8]/30 via-[#DCEFFF]/10 to-[#1A237E]/40 backdrop-blur-sm border border-white/20 shadow-2xl shadow-[#DCD9F8]/10" />
              <div className="absolute top-[8%] left-[15%] w-[40%] h-[30%] rounded-full bg-gradient-to-br from-white/30 to-transparent blur-xl" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <p
                  className="text-xs tracking-[0.4em] uppercase text-white/30 font-medium"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Muse &amp; Mist
                </p>
                <p
                  className="text-4xl font-light text-white/20 italic tracking-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Glazed
                </p>
              </div>
            </div>

            {/* Floating ingredient pills */}
            {[
              { text: 'Ceramides', pos: 'absolute -left-4 top-16', delay: 1.2 },
              { text: 'Vitamin C 15%', pos: 'absolute -right-4 top-24', delay: 1.4 },
              { text: 'Hyaluronic Acid', pos: 'absolute -left-8 bottom-20', delay: 1.6 },
              { text: 'SPF 50+ PA+++', pos: 'absolute right-0 bottom-16', delay: 1.8 },
              { text: 'Niacinamide', pos: 'absolute left-1/2 -translate-x-1/2 top-0', delay: 2 },
            ].map((pill) => (
              <motion.div
                key={pill.text}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: pill.delay, duration: 0.5 }}
                className={`${pill.pos} px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs text-white/60 whitespace-nowrap`}
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {pill.text}
              </motion.div>
            ))}

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.6 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
              <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
              <p
                className="text-xs text-white/20 tracking-widest uppercase"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Scroll
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

    </section>
  )
}
