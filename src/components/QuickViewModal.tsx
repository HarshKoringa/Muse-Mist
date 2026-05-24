"use client";

import { Product } from "@/types/product";
import { X, Sparkles, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useCartUIStore } from "@/store/cartUIStore";
import AddedToast from "@/components/AddedToast";

type Props = {
  product: Product;
  onClose: () => void;
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

export default function QuickViewModal({ product, onClose }: Props) {
  const gradient =
    gradientMap[product.category] ?? "from-[#DCD9F8] to-[#DCEFFF]";
  const subtitle = subtitleMap[product.slug] ?? "";
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartUIStore((state) => state.openCart);
  const [showToast, setShowToast] = useState(false);
  const outOfStock = product.stock_count === 0;

  return (
    <>
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image or Gradient Header */}
          {product.image_url ? (
            <div className="w-full h-44 relative overflow-hidden">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 448px"
              />
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition cursor-pointer"
              >
                <X size={16} className="text-[#1A237E]" />
              </button>
            </div>
          ) : (
            <div
              className={`w-full h-44 bg-gradient-to-br ${gradient} relative flex flex-col justify-between p-4`}
            >
              <button
                onClick={onClose}
                className="self-end w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition cursor-pointer"
              >
                <X size={16} className="text-[#1A237E]" />
              </button>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-[#1A237E] opacity-30">
                  Muse &amp; Mist
                </p>
                <p className="text-sm font-medium text-[#1A237E] opacity-60">
                  {product.name}
                </p>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 flex flex-col gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <h2 style={{ fontFamily: 'var(--font-display)' }}
                      className="text-2xl font-light text-[#1A237E] leading-tight mb-1">
                    {product.category}
                  </h2>
                  {product.size && (
                    <span className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">
                      {product.size}
                    </span>
                  )}
                </div>
                {product.stock_count > 0 && product.stock_count <= 10 && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-600">
                    Only {product.stock_count} left
                  </span>
                )}
                {product.stock_count === 0 && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-500">
                    Out of Stock
                  </span>
                )}
              </div>

              <p style={{ fontFamily: 'var(--font-body)' }}
                 className="text-sm text-[#1A237E]/60 font-medium tracking-wide">
                {product.name}
              </p>

              {subtitle && (
                <div className="flex items-center gap-1 mt-1">
                  <Sparkles size={12} className="text-[#1A237E] opacity-50" />
                  <p className="text-xs text-[#1A237E] opacity-50 font-medium">
                    {subtitle}
                  </p>
                </div>
              )}

              <p className="text-base text-gray-500 mt-3 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
              {/* Discount badge */}
              {product.discount_active && product.discount_percent && (
                <span className="inline-flex items-center text-xs font-bold
                                 px-3 py-1 rounded-full bg-red-500 text-white
                                 uppercase tracking-wide w-fit">
                  {product.discount_label ?? 'Sale'} · {product.discount_percent}% OFF
                </span>
              )}

              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-baseline gap-2">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-lg text-[#1A237E]/50">₹</span>
                      <span className="text-4xl font-bold text-[#1A237E]"
                            style={{ fontFamily: 'var(--font-body)' }}>
                        {Number(product.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                    {product.discount_active && product.mrp && (
                      <span className="text-xl text-gray-400 line-through">
                        ₹{Number(product.mrp).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">Incl. of all taxes</p>
                </div>

                <button
                  disabled={outOfStock}
                  onClick={() => {
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
                    onClose();
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 2000);
                  }}
                  style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-base font-semibold transition-all ${outOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#1A237E] text-white hover:opacity-90 cursor-pointer'}`}
                >
                  <ShoppingBag size={18} />
                  {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
    <AddedToast visible={showToast} productName={product.name} />
    </>
  );
}
