"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Product } from "@/types/product";

const ROTATION_INTERVAL = 3500;
const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as const;

// Per-product tilt angles for the photo-frame effect
const FRAME_ROTATIONS = [2, -1.5, 3, -2, 1];

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

const BG_DESKTOP =
  "https://jqetgwopumqhrhotoitf.supabase.co/storage/v1/object/public/product-images/hero-bg-desktop-v2.jpg";
const BG_MOBILE =
  "https://jqetgwopumqhrhotoitf.supabase.co/storage/v1/object/public/product-images/hero-bg-mobile-v2.jpg";

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

  const frameRotation = FRAME_ROTATIONS[activeIndex % FRAME_ROTATIONS.length];

  return (
    <section
      className="w-full relative flex flex-col overflow-hidden h-[66vh] lg:h-[85vh]"
      style={{ paddingTop: "65px" }}
    >
      {/* ── Background images ── */}
      <div className="absolute inset-0">
        <Image
          src={BG_DESKTOP}
          alt=""
          fill
          className="object-cover hidden lg:block"
          priority
        />
        <Image
          src={BG_MOBILE}
          alt=""
          fill
          className="object-cover lg:hidden"
          priority
        />
        {/* Left-to-right overlay for text readability */}
        <div
          className="absolute inset-0 z-1"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Main content: brand text + photo-framed image ── */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 px-6 sm:px-12 max-w-7xl mx-auto w-full relative z-10">

        {/* Brand text column */}
        <div className="shrink-0 lg:w-2/5 flex flex-col justify-center py-3 lg:py-10 lg:pr-8">
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

        {/* Photo-frame image column */}
        <div
          className="flex-1 relative min-h-0 flex items-center justify-center cursor-pointer"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={handleScrollToProducts}
        >
          <AnimatePresence mode="wait">
            {activeProduct && (
              <motion.div
                key={`hero-img-${activeIndex}`}
                initial={{ opacity: 0, scale: 0.95, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: frameRotation }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.6, ease: EASE_OUT_QUAD }}
                style={{
                  background: "white",
                  padding: "12px",
                  borderRadius: "4px",
                  boxShadow:
                    "0 4px 6px rgba(0,0,0,0.05), 0 10px 30px rgba(0,0,0,0.10), 0 20px 60px rgba(0,0,0,0.05)",
                  width: "clamp(200px, 55vw, 320px)",
                }}
                className="lg:w-112.5"
              >
                {activeProduct.image_url ? (
                  <Image
                    src={activeProduct.image_url}
                    alt={activeProduct.name}
                    width={500}
                    height={500}
                    className="w-full h-auto rounded-sm block"
                    priority
                  />
                ) : (
                  <div
                    className={`w-full aspect-square rounded-sm bg-linear-to-br ${GRADIENT_MAP[activeProduct.category] ?? "from-[#DCD9F8] to-[#DCEFFF]"}`}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Thumbnail row ── */}
      <div className="shrink-0 flex items-center justify-center gap-2.5 lg:gap-4 pb-4 lg:pb-6 pt-1 relative z-10">
        {displayProducts.map((product, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={product.id}
              onClick={() => handleThumbnailClick(i)}
              aria-label={`View ${product.name}`}
              className="shrink-0 cursor-pointer rounded-2xl overflow-hidden"
              style={{
                width: "56px",
                height: "56px",
                padding: "4px",
                borderRadius: "12px",
                background: isActive
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.6)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                boxShadow: isActive
                  ? "0 0 0 2px rgba(26,35,126,0.3), 0 4px 20px rgba(26,35,126,0.15)"
                  : "0 2px 12px rgba(0,0,0,0.06)",
                opacity: isActive ? 1 : 0.65,
                transform: isActive ? "translateY(-3px) scale(1.05)" : "scale(1)",
                transition: "all 0.3s ease",
              }}
            >
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-contain rounded-lg"
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
    </section>
  );
}
