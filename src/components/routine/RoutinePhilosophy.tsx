"use client";

import { motion } from "framer-motion";

const pillars = [
  {
    number: "01",
    heading: "Less Is More",
    body: "We believe in a focused edit of high-impact products. A short routine done consistently beats a complicated one abandoned after a week.",
  },
  {
    number: "02",
    heading: "Actives With Intent",
    body: "Every active ingredient in our lineup is chosen because it has clinical evidence behind it — not because it's trending.",
  },
  {
    number: "03",
    heading: "Barrier First",
    body: "Healthy skin starts with a healthy barrier. We build every routine around ceramides, hydration, and gentle formulations before layering actives.",
  },
];

export default function RoutinePhilosophy() {
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
            Our Approach
          </p>
          <h2 className="text-3xl font-semibold text-[#1A237E]">
            The Three Pillars
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {pillars.map((p, i) => (
            <motion.div
              key={p.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col gap-3 p-6 rounded-2xl border border-[#DCD9F8]/60 bg-[#F9F8FF]"
            >
              <span className="text-3xl font-serif font-extrabold text-[#DCD9F8]">
                {p.number}
              </span>
              <h3 className="text-base font-semibold text-[#1A237E]">
                {p.heading}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
