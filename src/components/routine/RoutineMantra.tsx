"use client";

import { motion } from "framer-motion";

export default function RoutineMantra() {
  return (
    <section className="w-full px-4 py-24 bg-[#1A237E]">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-white opacity-30 mb-6">
            The Muse &amp; Mist Mantra
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-white leading-tight tracking-wide uppercase mb-8">
            Consistency<br />
            <span className="text-[#DCD9F8]">&gt; Complexity</span>
          </h2>
          <p className="text-base text-white/60 leading-relaxed max-w-lg mx-auto">
            The best skincare routine is the one you actually do. A clean, moisturised, SPF-protected face beats an abandoned 10-step regimen every single time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
