"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Product } from "@/types/product";

const ROTATION_INTERVAL = 3500;

const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as const;

const HEADLINE_MAP: Record<string, string> = {
  "cleanse-clear-calm": "Deep Detox. Zero Drama.",
  "invisible-glow-shield": "SPF 50+. Zero White Cast.",
  "barrier-repair": "72H Hydration. Zero Stickiness.",
  "smooth-and-spotless": "Dark Spots? Consider Them Gone.",
  "reset-to-radiance": "15% Vitamin C. 24H Glow.",
};

const GRADIENT_MAP: Record<string, string> = {
  Sunscreen: "from-[#DCEFFF] via-[#DCD9F8] to-white",
  Moisturiser: "from-[#DCD9F8] via-[#DCEFFF] to-white",
  Serum: "from-[#1A237E] via-[#3949AB] to-[#DCD9F8]",
  "Face Wash": "from-[#DCEFFF] via-white to-[#DCD9F8]",
};

const ROUTINE_ORDER = [
  "cleanse-clear-calm",
  "smooth-and-spotless",
  "reset-to-radiance",
  "barrier-repair",
  "invisible-glow-shield",
];

// Shimmer dot positions (top%, left%, animation-delay in seconds)
const SHIMMER_DOTS = [
  { top: "15%", left: "8%", delay: 0 },
  { top: "70%", left: "5%", delay: 1.2 },
  { top: "30%", left: "35%", delay: 2.4 },
  { top: "80%", left: "45%", delay: 0.8 },
  { top: "20%", left: "75%", delay: 1.8 },
  { top: "60%", left: "90%", delay: 3 },
  { top: "45%", left: "18%", delay: 2 },
];

type Props = { products: Product[] };

export default function HeroCarousel({ products }: Props) {
  const sorted = ROUTINE_ORDER
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => p !== undefined);
  const displayProducts = sorted.length > 0 ? sorted : products;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeProduct = displayProducts[activeIndex];

  useEffect(() => {
    if (isPaused || displayProducts.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % displayProducts.length);
    }, ROTATION_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, displayProducts.length]);

  const handleScrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), ROTATION_INTERVAL);
  };

  const headline = activeProduct
    ? (HEADLINE_MAP[activeProduct.slug] ?? activeProduct.name)
    : "";

  if (displayProducts.length === 0) {
    return (
      <section
        className="w-full h-[66vh] lg:h-[85vh]"
        style={{ background: "linear-gradient(135deg, #E8E4F8 0%, #DCD9F8 25%, #DCEFFF 60%, #F0EAFF 100%)" }}
      />
    );
  }

  // Thumbnail row height: 64px mobile, 90px desktop + padding
  const thumbRowHeight = { mobile: 64 + 24, desktop: 90 + 32 };
  void thumbRowHeight; // used only for mental model

  return (
    <section
      className="w-full relative flex flex-col overflow-hidden h-[66vh] lg:h-[85vh]"
      style={{
        paddingTop: "65px",
        background: "linear-gradient(135deg, #E8E4F8 0%, #DCD9F8 25%, #DCEFFF 60%, #F0EAFF 100%)",
      }}
    >
      {/* ── Background orbs ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(220,217,248,0.8) 0%, transparent 70%)",
          top: "-100px",
          right: "-100px",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(220,239,255,0.8) 0%, transparent 70%)",
          bottom: "-50px",
          left: "-100px",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,230,240,0.4) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(80px)",
        }}
      />

      {/* ── Shimmer dots ── */}
      {SHIMMER_DOTS.map((dot, i) => (
        <div
          key={i}
          className="absolute pointer-events-none rounded-full"
          style={{
            width: "6px",
            height: "6px",
            background: "rgba(26, 35, 126, 0.15)",
            top: dot.top,
            left: dot.left,
            animation: `heroFloat 6s ease-in-out ${dot.delay}s infinite`,
          }}
        />
      ))}

      {/* ── Main content: brand text + large image ── */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 px-6 sm:px-12 max-w-7xl mx-auto w-full relative z-10">

        {/* Brand text column */}
        <div className="flex-shrink-0 lg:w-2/5 flex flex-col justify-center py-3 lg:py-10 lg:pr-8">
          <p
            style={{ fontFamily: "var(--font-display)", fontSize: "12px", letterSpacing: "4px" }}
            className="uppercase text-[#6B7280] font-medium mb-1 lg:text-[15px] lg:mb-2"
          >
            Muse &amp; Mist
          </p>
          <p
            style={{ fontFamily: "var(--font-display)", fontSize: "14px" }}
            className="italic text-[#9CA3AF] mb-3 lg:text-[17px] lg:mb-4"
          >
            Where Science Meets Soul
          </p>

          {/* Dynamic headline */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`headline-${activeIndex}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                lineHeight: 1.15,
                maxWidth: "300px",
              }}
              className="font-bold text-[#0D1117] mb-4 lg:mb-6 lg:text-[48px] lg:max-w-112.5"
            >
              {headline}
            </motion.h1>
          </AnimatePresence>

          <button
            onClick={handleScrollToProducts}
            style={{ fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600 }}
            className="w-fit px-7 py-2.5 lg:px-9 lg:py-3.5 lg:text-[15px] rounded-full bg-[#1A237E] text-white hover:bg-[#151c6b] transition-colors cursor-pointer"
          >
            Shop Now →
          </button>
        </div>

        {/* Hero image column */}
        <div
          className="flex-1 relative min-h-0 cursor-pointer"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={handleScrollToProducts}
        >
          <AnimatePresence mode="wait">
            {activeProduct && (
              <motion.div
                key={`hero-img-${activeIndex}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.6, ease: EASE_OUT_QUAD }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {activeProduct.image_url ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={activeProduct.image_url}
                      alt={activeProduct.name}
                      fill
                      className="object-contain"
                      style={{
                        transform: "rotate(2deg)",
                        filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.15))",
                      }}
                      sizes="(max-width: 1024px) 80vw, 55vw"
                      priority
                    />
                  </div>
                ) : (
                  <div
                    className={`w-32 h-48 lg:w-52 lg:h-72 rounded-2xl bg-linear-to-br ${GRADIENT_MAP[activeProduct.category] ?? "from-[#DCD9F8] to-[#DCEFFF]"}`}
                    style={{ transform: "rotate(2deg)" }}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Thumbnail row ── */}
      <div className="flex-shrink-0 flex items-center justify-center gap-3 lg:gap-4 pb-4 lg:pb-6 pt-1 relative z-10">
        {displayProducts.map((product, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={product.id}
              onClick={() => handleThumbnailClick(i)}
              aria-label={`View ${product.name}`}
              className="shrink-0 cursor-pointer bg-white w-16 h-16 lg:w-22.5 lg:h-22.5 rounded-xl lg:rounded-2xl overflow-hidden"
              style={{
                padding: "4px",
                border: isActive ? "3px solid #1A237E" : "3px solid transparent",
                opacity: isActive ? 1 : 0.7,
                transform: isActive ? "scale(1.1)" : "scale(1)",
                boxShadow: isActive
                  ? "0 4px 16px rgba(26, 35, 126, 0.3)"
                  : "0 4px 12px rgba(0,0,0,0.10)",
                transition: "all 0.3s ease",
              }}
            >
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div
                  className={`w-full h-full rounded-lg bg-linear-to-br ${GRADIENT_MAP[product.category] ?? "from-[#DCD9F8] to-[#DCEFFF]"}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Float keyframe injected inline */}
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
        }
      `}</style>
    </section>
  );
}
