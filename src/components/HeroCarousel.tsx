"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Product } from "@/types/product";

const ROTATION_INTERVAL = 3500;

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
    // Restart auto-rotation after one full interval
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
        style={{ background: "linear-gradient(135deg, #DCD9F8 0%, #DCEFFF 50%, #F0EAFF 100%)" }}
      />
    );
  }

  return (
    <section
      className="w-full relative flex flex-col overflow-hidden h-[66vh] lg:h-[85vh]"
      style={{
        paddingTop: "65px",
        background: "linear-gradient(135deg, #DCD9F8 0%, #DCEFFF 50%, #F0EAFF 100%)",
      }}
    >
      {/* Main content: brand text + large hero image */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 px-6 sm:px-12 max-w-7xl mx-auto w-full">

        {/* Brand text */}
        <div className="flex-shrink-0 lg:w-2/5 flex flex-col justify-center py-2 lg:py-10 lg:pr-8">
          <p
            style={{ fontFamily: "var(--font-display)", fontSize: "12px", letterSpacing: "4px" }}
            className="uppercase text-[#1A237E]/50 mb-1"
          >
            Muse &amp; Mist
          </p>
          <p
            style={{ fontFamily: "var(--font-display)", fontSize: "14px" }}
            className="italic text-[#6B7280] mb-2 lg:mb-3 hidden sm:block"
          >
            Where Science Meets Soul
          </p>

          {/* Dynamic headline crossfades with product */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`headline-${activeIndex}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              style={{ fontFamily: "var(--font-display)" }}
              className="text-[22px] lg:text-[38px] font-bold text-[#0D1117] leading-tight mb-3 lg:mb-6"
            >
              {headline}
            </motion.p>
          </AnimatePresence>

          <button
            onClick={handleScrollToProducts}
            style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 600 }}
            className="w-fit px-7 py-2.5 lg:py-3 rounded-full bg-[#1A237E] text-white hover:bg-[#151c6b] transition-colors cursor-pointer"
          >
            Shop Now →
          </button>
        </div>

        {/* Large hero image — crossfades between products */}
        <div
          className="flex-1 relative min-h-0 cursor-pointer"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={handleScrollToProducts}
          title="Browse products"
        >
          <AnimatePresence>
            {activeProduct && (
              <motion.div
                key={`hero-img-${activeIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
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
                        transform: "rotate(3deg)",
                        filter: "drop-shadow(0 20px 40px rgba(26, 35, 126, 0.12))",
                      }}
                      sizes="(max-width: 1024px) 80vw, 55vw"
                      priority
                    />
                  </div>
                ) : (
                  <div
                    className={`w-32 h-48 lg:w-48 lg:h-64 rounded-2xl bg-linear-to-br ${GRADIENT_MAP[activeProduct.category] ?? "from-[#DCD9F8] to-[#DCEFFF]"}`}
                    style={{ transform: "rotate(3deg)" }}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Thumbnail row */}
      <div className="flex-shrink-0 flex items-center justify-center gap-2 lg:gap-3 py-2.5 lg:py-3">
        {displayProducts.map((product, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={product.id}
              onClick={() => handleThumbnailClick(i)}
              aria-label={`View ${product.name}`}
              className="flex-shrink-0 rounded-xl overflow-hidden cursor-pointer bg-white transition-all duration-300"
              style={{
                width: "44px",
                height: "44px",
                border: isActive ? "2px solid #1A237E" : "2px solid transparent",
                opacity: isActive ? 1 : 0.55,
                transform: isActive ? "scale(1.1)" : "scale(1)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full bg-linear-to-br ${GRADIENT_MAP[product.category] ?? "from-[#DCD9F8] to-[#DCEFFF]"}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
