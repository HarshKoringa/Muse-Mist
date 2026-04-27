"use client";

import { motion } from "framer-motion";
import {
  Droplets,
  Sparkles,
  FlaskConical,
  Layers,
  ShieldCheck,
} from "lucide-react";

const steps = [
  {
    number: "01",
    phase: "AM + PM",
    title: "Cleanse",
    headline: "Start with a clean canvas.",
    body: "Remove impurities and excess oil without stripping. A pH-balanced cleanser sets the foundation for everything that follows.",
    product: "Cleanse, Clear & Calm",
    productSub: "Deep Detox Foam Face Wash",
    icon: Droplets,
    accentColor: "#DCEFFF",
    textColor: "#1A237E",
    dark: false,
  },
  {
    number: "02",
    phase: "AM + PM",
    title: "Brighten",
    headline: "Antioxidant shield, morning glow.",
    body: "Vitamin C at 15% neutralises free radicals, fades dark spots, and gives you that lit-from-within glow. Always in the morning.",
    product: "Reset to Radiance",
    productSub: "15% Vitamin C Face Serum",
    icon: Sparkles,
    accentColor: "#1A237E",
    textColor: "#FFFFFF",
    dark: true,
  },
  {
    number: "03",
    phase: "AM + PM",
    title: "Clarify",
    headline: "Fade spots. Refine pores.",
    body: "Niacinamide at 10% and Alpha Arbutin work as a team — one minimises pores and controls oil, the other fades hyperpigmentation.",
    product: "Smooth & Spotless",
    productSub: "10% Niacinamide + 1% Alpha Arbutin",
    icon: FlaskConical,
    accentColor: "#DCD9F8",
    textColor: "#1A237E",
    dark: false,
  },
  {
    number: "04",
    phase: "AM + PM",
    title: "Moisturise",
    headline: "Seal, hydrate, strengthen.",
    body: "Ceramides rebuild your barrier while Hyaluronic Acid draws moisture in. Lightweight enough for mornings, nourishing enough for nights.",
    product: "Barrier Repair",
    productSub: "Matte Gel Moisturizer",
    icon: Layers,
    accentColor: "#DCEFFF",
    textColor: "#1A237E",
    dark: false,
  },
  {
    number: "05",
    phase: "AM Only",
    title: "Protect",
    headline: "The step you cannot skip.",
    body: "SPF 50+ PA+++ is non-negotiable. Every active you apply is wasted without sun protection. Invisible finish. No white cast.",
    product: "Invisible Glow Shield",
    productSub: "3-in-1 Daily Sunscreen SPF 50+",
    icon: ShieldCheck,
    accentColor: "#1A237E",
    textColor: "#FFFFFF",
    dark: true,
  },
];

export default function RoutineSteps() {
  return (
    <section className="w-full px-6 sm:px-12 py-24 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p
            className="text-xs tracking-[0.35em] uppercase text-[#1A237E]/40 mb-4 font-medium"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Step by Step
          </p>
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-[52px] font-light text-[#1A237E] leading-tight"
          >
            The full ritual.
          </h2>
        </motion.div>

        <div className="flex flex-col gap-5">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                style={{ backgroundColor: step.accentColor }}
                className="rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:scale-[1.01] transition-transform duration-300"
              >
                {/* Left: number + icon */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      color: step.dark
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(26,35,126,0.15)",
                    }}
                    className="text-5xl font-light leading-none w-12"
                  >
                    {step.number}
                  </span>
                  <div
                    style={{
                      backgroundColor: step.dark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(26,35,126,0.08)",
                    }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  >
                    <Icon
                      size={22}
                      style={{
                        color: step.dark ? "rgba(255,255,255,0.6)" : "#1A237E",
                      }}
                    />
                  </div>
                </div>

                {/* Middle: content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        color: step.textColor,
                      }}
                      className="text-2xl font-light"
                    >
                      {step.title}
                    </h3>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        backgroundColor: step.dark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(26,35,126,0.08)",
                        color: step.dark ? "rgba(255,255,255,0.6)" : "#1A237E",
                      }}
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                    >
                      {step.phase}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      color: step.dark ? "rgba(255,255,255,0.9)" : "#1A237E",
                    }}
                    className="text-base font-semibold mb-1"
                  >
                    {step.headline}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      color: step.dark
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(26,35,126,0.5)",
                    }}
                    className="text-sm font-light leading-relaxed"
                  >
                    {step.body}
                  </p>
                </div>

                {/* Right: product tag */}
                <div
                  style={{
                    backgroundColor: step.dark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(26,35,126,0.05)",
                    borderColor: step.dark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(26,35,126,0.1)",
                  }}
                  className="flex-shrink-0 px-5 py-4 rounded-2xl border min-w-[180px] w-full sm:w-auto"
                >
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      color: step.dark
                        ? "rgba(255,255,255,0.3)"
                        : "rgba(26,35,126,0.4)",
                    }}
                    className="text-xs uppercase tracking-widest mb-1"
                  >
                    Product
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      color: step.dark ? "rgba(255,255,255,0.9)" : "#1A237E",
                    }}
                    className="text-sm font-semibold"
                  >
                    {step.product}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      color: step.dark
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(26,35,126,0.4)",
                    }}
                    className="text-xs mt-0.5 font-light"
                  >
                    {step.productSub}
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
