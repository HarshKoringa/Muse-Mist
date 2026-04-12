"use client";

import { motion } from "framer-motion";

export default function RoutineHero() {
  return (
    <section className="relative w-full px-6 pt-20 pb-16 overflow-hidden bg-[#DCD9F8]">
      <div
        className="absolute -right-32 -top-24 w-[480px] h-[480px] blur-3xl opacity-30 rounded-full"
        style={{ background: "radial-gradient(circle, #DCEFFF 0%, transparent 70%)" }}
      />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold tracking-widest uppercase text-[#1A237E] opacity-50 mb-4"
        >
          The Muse &amp; Mist Method
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="text-4xl md:text-6xl font-serif font-extrabold text-[#1A237E] leading-tight tracking-wide uppercase mb-6"
        >
          Your Skin.<br />Your Ritual.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="text-lg text-[#1A237E]/70 max-w-xl mx-auto leading-relaxed"
        >
          A simple, science-backed routine designed for real life — not a 12-step
          shelf. Every product earns its place.
        </motion.p>
      </div>
    </section>
  );
}
