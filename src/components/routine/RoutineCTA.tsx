"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function RoutineCTA() {
  return (
    <section className="w-full px-4 py-20 bg-[#DCD9F8]">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-[#1A237E] opacity-40 mb-4">
            Ready?
          </p>
          <h2 className="text-3xl font-semibold text-[#1A237E] mb-4">
            Build Your Routine
          </h2>
          <p className="text-base text-[#1A237E]/60 mb-10 max-w-md mx-auto">
            Shop the full edit — every product in the routine, made in India for Indian skin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/home-v1#products"
              className="px-8 py-4 rounded-2xl bg-[#1A237E] text-white text-base font-semibold hover:opacity-90 transition-opacity"
            >
              Shop The Edit
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 rounded-2xl border-2 border-[#1A237E] text-[#1A237E] text-base font-semibold hover:bg-[#1A237E] hover:text-white transition"
            >
              Meet the Team
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
