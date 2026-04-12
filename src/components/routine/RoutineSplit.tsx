"use client";

import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

const amSteps = [
  { order: 1, label: "Gentle Cleanser" },
  { order: 2, label: "Vitamin C Serum" },
  { order: 3, label: "Hyaluronic Acid" },
  { order: 4, label: "Ceramide Moisturiser" },
  { order: 5, label: "SPF 50+ Sunscreen" },
];

const pmSteps = [
  { order: 1, label: "Gentle Cleanser" },
  { order: 2, label: "Niacinamide or Alpha Arbutin Serum" },
  { order: 3, label: "Cica + Hyaluronic Acid" },
  { order: 4, label: "Ceramide Moisturiser (richer layer)" },
];

export default function RoutineSplit() {
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
            Morning vs Night
          </p>
          <h2 className="text-3xl font-semibold text-[#1A237E]">
            AM / PM at a Glance
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* AM */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="rounded-3xl border border-[#DCEFFF] bg-[#F5FAFF] p-8 flex flex-col gap-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#DCEFFF] flex items-center justify-center">
                <Sun size={18} className="text-[#1A237E]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A237E]">Morning</h3>
            </div>
            <ol className="flex flex-col gap-3">
              {amSteps.map((s) => (
                <li key={s.order} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#DCEFFF] text-[#1A237E] text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {s.order}
                  </span>
                  <span className="text-sm text-gray-600">{s.label}</span>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* PM */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="rounded-3xl border border-[#DCD9F8] bg-[#F9F8FF] p-8 flex flex-col gap-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#DCD9F8] flex items-center justify-center">
                <Moon size={18} className="text-[#1A237E]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A237E]">Night</h3>
            </div>
            <ol className="flex flex-col gap-3">
              {pmSteps.map((s) => (
                <li key={s.order} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#DCD9F8] text-[#1A237E] text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {s.order}
                  </span>
                  <span className="text-sm text-gray-600">{s.label}</span>
                </li>
              ))}
            </ol>
            <p className="text-xs text-gray-400 mt-2">
              No SPF at night — save it for the morning when UV exposure actually happens.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
