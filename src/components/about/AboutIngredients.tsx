"use client";

import { motion } from "framer-motion";

const ingredients = [
  {
    name: "Ceramides",
    role: "Barrier Repair",
    description:
      "Lipid molecules that restore and reinforce the skin barrier, locking in moisture and keeping irritants out.",
  },
  {
    name: "Niacinamide",
    role: "Brightening + Pore Control",
    description:
      "A multitasking vitamin B3 that fades dark spots, minimises pores, controls oil, and strengthens the skin barrier.",
  },
  {
    name: "Vitamin C (15%)",
    role: "Antioxidant + Radiance",
    description:
      "A potent antioxidant that neutralises free radicals, boosts collagen synthesis, and delivers visible brightening.",
  },
  {
    name: "Cica (Centella)",
    role: "Soothing + Healing",
    description:
      "A botanical powerhouse that calms inflammation, accelerates skin healing, and strengthens the moisture barrier.",
  },
  {
    name: "Hyaluronic Acid",
    role: "Deep Hydration",
    description:
      "Draws water into the skin from the environment, delivering multi-layer hydration for a plump, dewy finish.",
  },
  {
    name: "Alpha Arbutin (1%)",
    role: "Dark Spot Fading",
    description:
      "A gentle skin-brightening agent that inhibits melanin production to visibly fade hyperpigmentation over time.",
  },
];

export default function AboutIngredients() {
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
            Transparency First
          </p>
          <h2 className="text-3xl font-semibold text-[#1A237E]">
            Ingredients We Swear By
          </h2>
          <p className="text-base text-gray-400 mt-3 max-w-md mx-auto">
            No proprietary blends. No mystery. Every key ingredient explained in
            plain language.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {ingredients.map((ing, i) => (
            <motion.div
              key={ing.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex gap-4 p-5 rounded-2xl border border-gray-100 hover:border-[#DCD9F8] transition-colors"
            >
              <div className="w-1 rounded-full bg-gradient-to-b from-[#1A237E] to-[#DCD9F8] flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-[#1A237E]">
                    {ing.name}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#DCEFFF] text-[#1A237E] font-medium">
                    {ing.role}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {ing.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
