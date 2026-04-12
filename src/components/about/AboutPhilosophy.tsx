"use client";

import { motion } from "framer-motion";

const pillars = [
  {
    title: "Hybrid Harmony",
    description:
      "We combine high-performance actives with calming botanicals. Every formula is designed so efficacy and gentleness coexist — never compromise one for the other.",
  },
  {
    title: "Skin Intelligence",
    description:
      "We formulate with purpose. Every ingredient earns its place in our products — no fillers, no trend-chasing, just ingredients backed by dermatological research.",
  },
  {
    title: "Glazed Philosophy",
    description:
      "We believe great skin looks like glass — luminous, healthy, and effortless. Our goal is not to mask your skin but to reveal its best version.",
  },
];

export default function AboutPhilosophy() {
  return (
    <section className="w-full px-4 py-20 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-[#1A237E] opacity-40 mb-2">
            Our Philosophy
          </p>
          <h2 className="text-3xl font-semibold text-[#1A237E]">
            Built on Three Beliefs
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col gap-3 p-6 rounded-2xl bg-[#DCEFFF] border border-[#DCD9F8]"
            >
              <div className="w-8 h-1 rounded-full bg-[#1A237E] opacity-40" />
              <h3 className="text-lg font-semibold text-[#1A237E]">
                {pillar.title}
              </h3>
              <p className="text-base text-gray-500 leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
