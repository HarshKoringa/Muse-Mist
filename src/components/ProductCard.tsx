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
  variant?: "compact" | "full";
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

export default function ProductCard({ product, variant = "full" }: Props) {
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
      image_url: product.image_url,
      size: product.size ?? null,
    });
    openCart();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  if (variant === "compact") {
    return (
      <>
        <Link
          href={`/products/${product.slug}`}
          className="flex flex-col bg-white rounded-2xl overflow-hidden group"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
        >
          {/* 3:4 image */}
          <div className="w-full relative overflow-hidden bg-[#F9FAFB]" style={{ aspectRatio: "3/4" }}>
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                sizes="65vw"
              />
            ) : (
              <div className={`w-full h-full bg-linear-to-br ${gradient}`} />
            )}
          </div>

          {/* Text area */}
          <div className="px-3 pt-2.5 pb-3 flex flex-col">
            <p
              style={{ fontFamily: "var(--font-body)", fontSize: "10px" }}
              className="text-[#6B7280] leading-tight truncate mb-0.5"
            >
              {product.category}
              {product.size ? ` · ${product.size}` : ""}
            </p>
            <p
              style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 600, lineHeight: 1.3 }}
              className="text-[#0D1117] line-clamp-2 mb-1.5"
            >
              {product.name}
            </p>

            {/* Discount badge */}
            {product.discount_active && product.discount_percent && (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "9px",
                  letterSpacing: "0.5px",
                }}
                className="inline-block font-bold uppercase px-2 py-0.5 rounded bg-red-600 text-white w-fit mb-1.5"
              >
                {product.discount_label ?? "Launch"} {product.discount_percent}% OFF
              </span>
            )}

            {/* Price row */}
            <div className="flex items-baseline gap-1.5 mb-2">
              <span
                style={{ fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: 700 }}
                className="text-[#0D1117]"
              >
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span
                  style={{ fontFamily: "var(--font-body)", fontSize: "12px" }}
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
              style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 600 }}
              className={`w-full py-2 rounded-[10px] transition-colors cursor-pointer ${
                outOfStock
                  ? "bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed"
                  : "bg-[#1A237E] text-white hover:bg-[#151c6b]"
              }`}
            >
              {outOfStock ? "Sold Out" : "Add to Cart"}
            </button>
          </div>
        </Link>
        <AddedToast visible={showToast} productName={product.name} />
      </>
    );
  }

  // Full variant (desktop)
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-col bg-white rounded-3xl overflow-hidden group border border-[#DCD9F8] hover:border-[#1A237E]/20 transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1"
      >
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

        <div className="p-5 flex flex-col gap-3 flex-1">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="text-xl font-light text-[#0D1117] leading-tight"
              >
                {product.category}
              </h3>
              {product.size && (
                <span className="text-[10px] text-[#6B7280] border border-[#DCD9F8] px-1.5 py-0.5 rounded-full">
                  {product.size}
                </span>
              )}
            </div>
            <p
              style={{ fontFamily: "var(--font-body)" }}
              className="text-sm text-[#0D1117] font-medium tracking-wide"
            >
              {product.name}
            </p>
            <p className="text-xs text-[#1A237E]/60 mt-0.5 font-medium">{subtitle}</p>
            <p className="text-sm text-[#4B5563] mt-2 line-clamp-2 font-light">
              {product.description}
            </p>
          </div>

          <div
            className="flex flex-col gap-1 mt-auto pt-3 border-t border-[#DCD9F8]"
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
                <span className="text-xs text-[#0D1117]/60">₹</span>
                <span
                  className="text-2xl font-semibold text-[#0D1117]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {Number(product.price).toLocaleString("en-IN")}
                </span>
              </div>
              {product.discount_active && product.mrp && (
                <span className="text-sm text-[#9CA3AF] line-through">
                  ₹{Number(product.mrp).toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <p
              className="text-[10px] text-[#6B7280]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Incl. of all taxes
            </p>

            <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-green-500/15 text-green-700 border border-green-500/20 w-fit mt-1">
              Extra 5% off prepaid
            </span>

            <button
              disabled={outOfStock}
              onClick={handleAddToCart}
              style={{ fontFamily: "var(--font-body)", fontSize: "16px" }}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-base font-semibold transition-all cursor-pointer mt-2 ${
                outOfStock
                  ? "bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed"
                  : "bg-[#1A237E] text-white hover:bg-[#151c6b]"
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
