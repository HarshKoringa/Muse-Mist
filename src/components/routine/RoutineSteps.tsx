"use client";

import { motion } from "framer-motion";
import { Droplets, Zap, Shield, Sun, Pipette } from "lucide-react";

const steps = [
  {
    step: 1,
    phase: "Cleanse",
    icon: Droplets,
    headline: "Start Clean",
    description:
      "Use a gentle, pH-balanced cleanser that removes impurities without stripping the skin barrier. Avoid surfactants that leave skin feeling tight.",
    tag: "AM + PM",
    tagColor: "bg-[#DCEFFF] text-[#1A237E]",
  },
  {
    step: 2,
    phase: "Treat",
    icon: Pipette,
    headline: "Layer Your Actives",
    description:
      "Apply your targeted serums — Vitamin C in the morning for antioxidant defence, Niacinamide or Alpha Arbutin at night for brightening and repair.",
    tag: "AM: Vit C · PM: Niacinamide",
    tagColor: "bg-[#DCD9F8] text-[#1A237E]",
  },
  {
    step: 3,
    phase: "Hydrate",
    icon: Zap,
    headline: "Lock in Moisture",
    description:
      "Hyaluronic Acid and Cica work together to replenish water levels and calm the skin. Apply to slightly damp skin for maximum absorption.",
    tag: "AM + PM",
    tagColor: "bg-[#DCEFFF] text-[#1A237E]",
  },
  {
    step: 4,
    phase: "Seal",
    icon: Shield,
    headline: "Barrier Repair",
    description:
      "Finish with a ceramide-rich moisturiser to seal everything in. Ceramides mimic your skin's natural lipids and keep the barrier intact overnight.",
    tag: "AM + PM",
    tagColor: "bg-[#DCD9F8] text-[#1A237E]",
  },
  {
    step: 5,
    phase: "Protect",
    icon: Sun,
    headline: "SPF — Non-Negotiable",
    description:
      "Sunscreen is the single most evidence-backed anti-ageing product you can use. Our SPF formula leaves zero white cast on Indian skin tones.",
    tag: "AM Only",
    tagColor: "bg-[#FFF3DC] text-[#7C5A00]",
  },
];

export default function RoutineSteps() {
  return (
    <section className="w-full px-4 py-20 bg-[#F5F4FF]">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-[#1A237E] opacity-40 mb-2">
            Step by Step
          </p>
          <h2 className="text-3xl font-semibold text-[#1A237E]">
            The Full Routine
          </h2>
          <p className="text-base text-gray-400 mt-3 max-w-md mx-auto">
            Five steps. Every ingredient justified. Nothing extra.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-5 items-start bg-white rounded-2xl p-6 border border-white shadow-sm"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#DCD9F8] flex items-center justify-center">
                  <Icon size={18} className="text-[#1A237E]" />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-bold tracking-widest uppercase text-[#1A237E]/40">
                      Step {s.step} — {s.phase}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.tagColor}`}
                    >
                      {s.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#1A237E]">
                    {s.headline}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
