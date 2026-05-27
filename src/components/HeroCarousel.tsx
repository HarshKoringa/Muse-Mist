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

const HERO_IMAGES: Record<string, string> = {
  "cleanse-clear-calm":
    "https://jqetgwopumqhrhotoitf.supabase.co/storage/v1/object/public/product-images/hero-foam-facewash.png",
  "invisible-glow-shield":
    "https://jqetgwopumqhrhotoitf.supabase.co/storage/v1/object/public/product-images/hero-sunscreen.png",
  "smooth-and-spotless":
    "https://jqetgwopumqhrhotoitf.supabase.co/storage/v1/object/public/product-images/hero-niacinamied.png",
  "barrier-repair":
    "https://jqetgwopumqhrhotoitf.supabase.co/storage/v1/object/public/product-images/hero-moisturizer.png",
  "reset-to-radiance":
    "https://jqetgwopumqhrhotoitf.supabase.co/storage/v1/object/public/product-images/hero-vitaminC.png",
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
  "https://jqetgwopumqhrhotoitf.supabase.co/storage/v1/object/public/product-images/hero-bg-desktop-v4.png";
const BG_MOBILE =
  "https://jqetgwopumqhrhotoitf.supabase.co/storage/v1/object/public/product-images/hero-bg-mobile-v4.png";

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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.6, ease: EASE_OUT_QUAD }}
                style={{
                  maxWidth: "320px",
                  maxHeight: "300px",
                }}
                className="lg:max-w-137.5 lg:max-h-125"
              >
                <Image
                  src={HERO_IMAGES[activeProduct.slug] ?? activeProduct.image_url ?? ""}
                  alt={activeProduct.name}
                  width={550}
                  height={500}
                  className="w-full h-full object-contain block"
                  priority
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Thumbnail row ── */}
      <div className="shrink-0 flex items-center justify-center gap-3 lg:gap-4 pb-4 lg:pb-6 pt-1 relative z-10">
        {displayProducts.map((product, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={product.id}
              onClick={() => handleThumbnailClick(i)}
              aria-label={`View ${product.name}`}
              className="shrink-0 w-20 h-20 lg:w-30 lg:h-30"
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                opacity: isActive ? 1 : 0.5,
                transform: isActive ? "scale(1.1)" : "scale(1)",
                filter: isActive
                  ? "drop-shadow(0 4px 12px rgba(26,35,126,0.25))"
                  : "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "0.75";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "0.5";
                }
              }}
            >
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={120}
                  height={120}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div
                  className={`w-full h-full rounded-xl bg-linear-to-br ${GRADIENT_MAP[product.category] ?? "from-[#DCD9F8] to-[#DCEFFF]"}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
