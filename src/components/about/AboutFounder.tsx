"use client";

import { motion } from "framer-motion";
import { FlaskConical } from "lucide-react";

const founders = [
  {
    name: "Harsh Koringa",
    title: "Co-Founder & CEO",
    gradient: "from-[#1A237E] to-[#DCEFFF]",
    icon: null,
    bio1: "Muse & Mist started as a personal obsession. Frustrated by skincare that either worked but felt harsh, or felt luxurious but did nothing — Harsh decided to build the brand he always wanted to buy from.",
    bio2: "Every product decision is driven by the same question: would I use this every single day? If the answer is not an immediate yes — we go back to the drawing board.",
    tag: "Brand & Vision",
    reverse: false,
  },
  {
    name: "Hitali Koringa",
    title: "Co-Founder & Head of R&D",
    gradient: "from-[#DCD9F8] to-[#1A237E]",
    icon: "flask",
    bio1: "With an MSc in Chemistry, Hitali is the scientific backbone of Muse & Mist. Every formula that reaches your skin has passed through her rigorous research and testing process.",
    bio2: "Her philosophy is simple — actives must perform, botanicals must soothe, and nothing enters a formula without a reason. No fillers. No compromises. Just chemistry that works.",
    tag: "Science & Formulation",
    reverse: true,
  },
];

export default function AboutFounder() {
  return (
    <section className="w-full px-4 py-20 bg-[#DCD9F8]">
      <div className="max-w-4xl mx-auto flex flex-col gap-16">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-[#1A237E] opacity-40 mb-2">
            The Team
          </p>
          <h2 className="text-3xl font-semibold text-[#1A237E]">
            The Minds Behind the Mist
          </h2>
        </motion.div>

        {/* Founder cards — stacked */}
        {founders.map((founder, index) => (
          <motion.div
            key={founder.name}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            className={`flex flex-col ${
              founder.reverse ? "sm:flex-row-reverse" : "sm:flex-row"
            } gap-10 items-center bg-white rounded-3xl p-8 shadow-sm border border-white`}
          >
            {/* Avatar placeholder */}
            <div
              className={`w-40 h-40 rounded-full flex-shrink-0 bg-gradient-to-br ${founder.gradient} flex flex-col items-center justify-end pb-4 shadow-md relative`}
            >
              {founder.icon === "flask" && (
                <FlaskConical
                  size={28}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-30"
                />
              )}
              <span className="text-[9px] font-bold tracking-widest uppercase text-white opacity-30 text-center px-2 leading-tight">
                {founder.tag}
              </span>
            </div>

            {/* Text content */}
            <div className="flex flex-col gap-3 flex-1 text-center sm:text-left">
              {/* Title badge */}
              <span className="inline-block self-center sm:self-start text-xs px-3 py-1 rounded-full bg-[#DCEFFF] text-[#1A237E] font-semibold tracking-wide">
                {founder.title}
              </span>

              <h3 className="text-2xl font-semibold text-[#1A237E]">
                {founder.name}
              </h3>

              <p className="text-base text-gray-500 leading-relaxed">
                {founder.bio1}
              </p>

              <p className="text-base text-gray-500 leading-relaxed">
                {founder.bio2}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
