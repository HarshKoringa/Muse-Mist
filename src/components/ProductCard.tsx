"use client";

import { Product } from "@/types/product";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useCartUIStore } from "@/store/cartUIStore";
import AddedToast from "./AddedToast";

type Props = {
  product: Product;
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

export default function ProductCard({ product }: Props) {
  const gradient = gradientMap[product.category] ?? "from-[#DCD9F8] to-[#DCEFFF]";
  const subtitle = subtitleMap[product.slug] ?? product.category;
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartUIStore((state) => state.openCart);
  const [showToast, setShowToast] = useState(false);
  const outOfStock = product.stock_count === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      mrp: product.mrp ?? null,
      category: product.category,
      stock_count: product.stock_count,
      image_url: product.image_url,
      size: product.size ?? null,
    });
    openCart();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* ── MOBILE CARD (hidden on lg+) ── */}
      <Link
        href={`/products/${product.slug}`}
        className="lg:hidden flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-[#F3F4F6] group"
      >
        {/* Image */}
        <div className="w-full aspect-square relative overflow-hidden bg-[#F9FAFB]">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className={`w-full h-full bg-linear-to-br ${gradient}`} />
          )}
          {/* Discount badge over image */}
          {product.discount_active && product.discount_percent && (
            <span
              style={{ fontFamily: "var(--font-body)", fontSize: "9px" }}
              className="absolute top-2 left-2 font-bold px-1.5 py-0.5 rounded bg-red-600 text-white uppercase tracking-wide"
            >
              {product.discount_percent}% OFF
            </span>
          )}
        </div>

        {/* Text area */}
        <div className="px-2.5 pt-2 pb-2.5 flex flex-col gap-0.5">
          <p
            style={{ fontFamily: "var(--font-body)", fontSize: "10px" }}
            className="text-[#6B7280] leading-tight truncate"
          >
            {product.category}
            {product.size ? ` · ${product.size}` : ""}
          </p>
          <p
            style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 600 }}
            className="text-[#0D1117] leading-snug line-clamp-2"
          >
            {product.name}
          </p>

          {/* Price row */}
          <div className="flex items-baseline gap-1.5 mt-1">
            <span
              style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 700 }}
              className="text-[#0D1117]"
            >
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
            {product.mrp && product.mrp > product.price && (
              <span
                style={{ fontFamily: "var(--font-body)", fontSize: "11px" }}
                className="text-[#9CA3AF] line-through"
              >
                ₹{Number(product.mrp).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <button
            disabled={outOfStock}
            onClick={handleAddToCart}
            style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500 }}
            className={`w-full py-1.5 rounded-lg border mt-1.5 transition-colors cursor-pointer ${
              outOfStock
                ? "border-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                : "border-[#1A237E] text-[#1A237E] hover:bg-[#1A237E] hover:text-white"
            }`}
          >
            {outOfStock ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </Link>

      {/* ── DESKTOP CARD (hidden below lg) ── */}
      <Link
        href={`/products/${product.slug}`}
        className="hidden lg:flex flex-col bg-white/8 backdrop-blur-sm rounded-3xl overflow-hidden group border border-white/10 hover:border-white/25 transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1"
      >
        {/* Image or Gradient Placeholder */}
        {product.image_url ? (
          <div className="w-full h-64 relative overflow-hidden">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              sizes="33vw"
            />
            <div className="absolute top-3 right-3">
              <StockBadge count={product.stock_count} />
            </div>
          </div>
        ) : (
          <div className={`w-full h-64 bg-linear-to-br ${gradient} relative flex flex-col justify-between p-4`}>
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
            <div className="flex items-center gap-2 mb-1">
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="text-xl font-light text-white leading-tight"
              >
                {product.category}
              </h3>
              {product.size && (
                <span className="text-[10px] text-white/30 border border-white/10 px-1.5 py-0.5 rounded-full">
                  {product.size}
                </span>
              )}
            </div>
            <p
              style={{ fontFamily: "var(--font-body)" }}
              className="text-sm text-white/70 font-medium tracking-wide"
            >
              {product.name}
            </p>
            <p className="text-xs text-[#DCD9F8]/60 mt-0.5 font-medium">{subtitle}</p>
            <p className="text-sm text-white/40 mt-2 line-clamp-2 font-light">
              {product.description}
            </p>
          </div>

          <div
            className="flex flex-col gap-1 mt-auto pt-3 border-t border-white/10"
            onClick={(e) => e.preventDefault()}
          >
            {product.discount_active && product.discount_percent && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white uppercase tracking-wide">
                  {product.discount_label ?? "Sale"} · {product.discount_percent}% OFF
                </span>
              </div>
            )}

            <div className="flex items-baseline gap-2">
              <div className="flex items-baseline gap-0.5">
                <span className="text-xs text-white/60">₹</span>
                <span
                  className="text-2xl font-semibold text-white"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {Number(product.price).toLocaleString("en-IN")}
                </span>
              </div>
              {product.discount_active && product.mrp && (
                <span className="text-sm text-white/30 line-through">
                  ₹{Number(product.mrp).toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <p
              className="text-[10px] text-white/30"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Incl. of all taxes
            </p>

            <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/20 w-fit mt-1">
              Extra 5% off prepaid
            </span>

            <button
              disabled={outOfStock}
              onClick={handleAddToCart}
              style={{ fontFamily: "var(--font-body)", fontSize: "16px" }}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-base font-semibold transition-all cursor-pointer mt-2 ${
                outOfStock
                  ? "bg-white/10 text-white/30 cursor-not-allowed"
                  : "bg-[#DCD9F8] text-[#1A237E] hover:bg-white hover:opacity-90"
              }`}
            >
              <ShoppingBag size={16} />
              {outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </Link>

      <AddedToast visible={showToast} productName={product.name} />
    </motion.div>
  );
}
