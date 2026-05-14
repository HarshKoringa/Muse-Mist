"use client";

import { Product } from "@/types/product";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import AddedToast from "./AddedToast";

type Props = {
  product: Product;
  onQuickView: () => void;
};

const gradientMap: Record<string, string> = {
  Sunscreen: "from-[#DCEFFF] via-[#DCD9F8] to-white",
  Moisturiser: "from-[#DCD9F8] via-[#DCEFFF] to-white",
  Serum: "from-[#1A237E] via-[#3949AB] to-[#DCD9F8]",
  "Face Wash": "from-[#DCEFFF] via-white to-[#DCD9F8]",
};

const subtitleMap: Record<string, string> = {
  "invisible-glow-shield": "SPF 50+ PA+++ · Vitamin C · Fermented Rice Water",
  "barrier-repair": "Ceramides · Hyaluronic Acid · Cica",
  "reset-to-radiance": "15% Vitamin C · Amla · Orange Peel",
  "smooth-and-spotless": "10% Niacinamide · 1% Alpha Arbutin · Cica",
  "cleanse-clear-calm": "Salicylic Acid · Niacinamide · Zinc PCA",
};

function StockBadge({ count }: { count: number }) {
  if (count === 0)
    return (
      <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-500">
        Out of Stock
      </span>
    );
  if (count <= 10)
    return (
      <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-600">
        Only {count} left
      </span>
    );
  return (
    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-600">
      In Stock
    </span>
  );
}

export default function ProductCard({ product, onQuickView }: Props) {
  const gradient = gradientMap[product.category] ?? "from-[#DCD9F8] to-[#DCEFFF]";
  const subtitle = subtitleMap[product.slug] ?? product.category;
  const addItem = useCartStore((state) => state.addItem);
  const [showToast, setShowToast] = useState(false);
  const outOfStock = product.stock_count === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white/8 backdrop-blur-sm rounded-3xl overflow-hidden flex flex-col group cursor-pointer border border-white/10 hover:border-white/25 transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1"
      onClick={onQuickView}
    >
      {/* Image or Gradient Placeholder */}
      {product.image_url ? (
        <div className="w-full h-64 relative overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute top-3 right-3">
            <StockBadge count={product.stock_count} />
          </div>
        </div>
      ) : (
        <div className={`w-full h-64 bg-gradient-to-br ${gradient} relative flex flex-col justify-between p-4`}>
          <div className="flex justify-end">
            <StockBadge count={product.stock_count} />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#1A237E] opacity-30">
              Muse &amp; Mist
            </p>
            <p className="text-sm font-medium text-[#1A237E] opacity-60 mt-0.5">
              {product.name}
            </p>
          </div>
        </div>
      )}

      {/* Card Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)' }}
              className="text-xl font-light text-white leading-tight mb-1">
            {product.category}
          </h3>
          <p style={{ fontFamily: 'var(--font-body)' }}
             className="text-sm text-white/70 font-medium tracking-wide">
            {product.name}
          </p>
          <p className="text-xs text-[#DCD9F8]/60 mt-0.5 font-medium">
            {subtitle}
          </p>
          <p className="text-sm text-white/40 mt-2 line-clamp-2 font-light">
            {product.description}
          </p>
          <Link
            href={`/products/${product.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-medium text-white/25 hover:text-white/50 transition-colors underline underline-offset-2 w-fit"
          >
            View full details →
          </Link>
        </div>

        <div className="flex flex-col gap-1 mt-auto pt-3 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
          {/* Price row */}
          <div className="flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-white/40"
                      style={{ fontFamily: 'var(--font-body)' }}>₹</span>
                <span className="text-2xl font-semibold text-white"
                      style={{ fontFamily: 'var(--font-body)' }}>
                  {product.price.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[10px] text-white/30 mt-0.5"
                 style={{ fontFamily: 'var(--font-body)' }}>
                Incl. of all taxes
              </p>
            </div>
            {/* Prepaid offer badge */}
            <span className="text-[10px] font-semibold px-2 py-1
                             rounded-full bg-green-500/15 text-green-400
                             border border-green-500/20">
              5% off prepaid
            </span>
          </div>

          {/* Add to Cart button */}
          <button
            disabled={outOfStock}
            onClick={(e) => {
              e.stopPropagation();
              if (outOfStock) return;
              addItem({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                category: product.category,
                stock_count: product.stock_count,
                image_url: product.image_url,
              });
              setShowToast(true);
              setTimeout(() => setShowToast(false), 2000);
            }}
            style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-base font-semibold transition-all cursor-pointer mt-2 ${outOfStock ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-[#DCD9F8] text-[#1A237E] hover:bg-white hover:opacity-90'}`}
          >
            <ShoppingBag size={16} />
            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
      <AddedToast visible={showToast} productName={product.name} />
    </motion.div>
  );
}
