"use client";

import { products } from "@/lib/products";
import { Pipette, Leaf, Droplets } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-main font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-brand-surface/80 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-brand-ink">Muse & Mist</div>
          <div className="flex gap-8 items-center">
            <a
              href="#shop"
              className="text-brand-ink hover:text-brand-lilac transition"
            >
              Shop
            </a>
            <a
              href="#about"
              className="text-brand-ink hover:text-brand-lilac transition"
            >
              About
            </a>
            <button className="text-brand-ink hover:text-brand-lilac transition">
              Cart
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h1 className="text-5xl md:text-7xl font-black text-brand-ink leading-tight mb-6 tracking-wider uppercase">
                GLAZED SKIN.
                <br />
                ZERO STICKINESS.
              </h1>
              <p className="text-brand-ink-muted text-lg mb-8 max-w-lg">
                Experience skincare that feels as good as it looks. Premium
                formulations designed for your most radiant self.
              </p>
              <div className="flex gap-4">
                <button className="px-8 py-4 bg-brand-sky text-brand-ink font-semibold rounded-full hover:shadow-lg transition hover:bg-opacity-90">
                  Explore Collection
                </button>
                <button className="px-8 py-4 border-2 border-brand-ink text-brand-ink font-semibold rounded-full hover:bg-brand-ink hover:text-brand-surface transition">
                  MEET THE ROUTINE
                </button>
              </div>
            </div>

            {/* SVG Blob Background */}
            <div className="relative h-96 flex items-center justify-center">
              <svg
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute w-full h-full"
                style={{ animation: "blob 7s infinite" }}
              >
                <path
                  fill="var(--accent-lilac-soft)"
                  d="M45.1,-78.2C57.3,-71.1,66.1,-54.5,71.4,-38.2C76.7,-21.9,78.6,-6.8,76.3,7.5C74,21.8,67.4,35.3,58.2,47.1C49,58.9,37.2,69.1,23.4,75.5C9.6,81.9,-6.7,84.5,-24.5,82C-42.3,79.5,-61.9,71.9,-72.3,57.8C-82.7,43.7,-83.9,23.1,-80.3,5.5C-76.7,-12.1,-68.3,-26.6,-57.5,-38.3C-46.7,-50,-33.5,-58.9,-19.3,-64.6C-5.1,-70.3,10.5,-72.8,45.1,-78.2Z"
                  transform="translate(100 100)"
                />
              </svg>
              <style>{`
                @keyframes blob {
                  0%, 100% { transform: translate(0, 0) scale(1); }
                  33% { transform: translate(30px, -50px) scale(1.1); }
                  66% { transform: translate(-20px, 20px) scale(0.9); }
                }
              `}</style>

              {/* Floating Badge */}
              <div className="absolute top-8 right-8 z-20 bg-brand-surface border-2 border-brand-lilac rounded-full w-32 h-32 flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <p className="text-xs font-bold text-brand-lilac uppercase tracking-widest">
                    Made for
                  </p>
                  <p className="text-sm font-bold text-brand-ink">
                    Indian skin
                  </p>
                  <p className="text-xs font-semibold text-brand-ink-muted">
                    &amp; sun
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Science Section */}
      <section className="py-20 px-6 bg-brand-soft-alt">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-ink mb-16 text-center uppercase tracking-wider">
            Science That Feels Like Self-Care
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-brand-surface rounded-3xl p-8 text-center hover:shadow-lg transition">
              <div className="flex justify-center mb-6">
                <div className="bg-brand-lilac-soft p-4 rounded-full">
                  <Pipette className="text-brand-lilac w-8 h-8" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-brand-ink mb-3 uppercase tracking-widest">
                High-Performance Actives
              </h3>
              <p className="text-brand-ink-muted text-sm">
                Clinically proven ingredients that deliver visible results.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-brand-surface rounded-3xl p-8 text-center hover:shadow-lg transition">
              <div className="flex justify-center mb-6">
                <div className="bg-brand-lilac-soft p-4 rounded-full">
                  <Leaf className="text-brand-lilac w-8 h-8" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-brand-ink mb-3 uppercase tracking-widest">
                Calming Botanicals
              </h3>
              <p className="text-brand-ink-muted text-sm">
                Traditional extracts like Neem for soothing skin.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-brand-surface rounded-3xl p-8 text-center hover:shadow-lg transition">
              <div className="flex justify-center mb-6">
                <div className="bg-brand-lilac-soft p-4 rounded-full">
                  <Droplets className="text-brand-lilac w-8 h-8" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-brand-ink mb-3 uppercase tracking-widest">
                Non-Sticky Textures
              </h3>
              <p className="text-brand-ink-muted text-sm">
                Ultra-lightweight formulas that feel weightless on skin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Grid */}
      <section id="shop" className="py-20 px-6 bg-brand-main">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-brand-ink mb-12 text-center uppercase tracking-wider">
            Build Your Glazed Routine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-brand-border rounded-xl p-6 bg-brand-surface hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-full h-64 bg-brand-soft-alt rounded-lg mb-4 flex items-center justify-center p-4">
                  <span className="text-brand-ink-muted text-sm">
                    Product Image
                  </span>
                </div>
                <h3 className="text-base font-semibold text-brand-ink mb-1">
                  {product.name}
                </h3>
                <p className="text-xs text-brand-ink-muted mb-6 font-medium">
                  {product.category}
                </p>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-black text-brand-lilac">
                    ₹{product.price}
                  </span>
                  <span className="text-xs bg-brand-sky/20 text-brand-ink px-3 py-1.5 rounded-full font-bold uppercase tracking-wide">
                    {product.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredient Receipts Section */}
      <section className="w-full bg-brand-footer">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <p className="text-brand-surface uppercase text-sm font-medium tracking-widest leading-relaxed">
                Niacinamide, Vitamin C, Kakadu Plum
              </p>
            </div>
            <div>
              <p className="text-brand-surface uppercase text-sm font-medium tracking-widest leading-relaxed">
                Zero White Cast, Tested on Humid Indian Summers
              </p>
            </div>
            <div>
              <p className="text-brand-surface uppercase text-sm font-medium tracking-widest leading-relaxed">
                Fragrance-Light, Barrier-Friendly
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
