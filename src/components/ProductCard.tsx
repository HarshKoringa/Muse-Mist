"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
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
  const addItem = useCartStore((state) => state.addItem);
  const [showToast, setShowToast] = useState(false);
  const gradient =
    gradientMap[product.category] ?? "from-[#DCD9F8] to-[#DCEFFF]";
  const subtitle = subtitleMap[product.slug] ?? product.category;
  const outOfStock = product.stock_count === 0;

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-shadow"
      onClick={onQuickView}
    >
      {/* Gradient Placeholder */}
      <div
        className={`w-full h-56 bg-gradient-to-br ${gradient} relative flex flex-col justify-between p-4`}
      >
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

      {/* Card Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            {product.category}
          </p>
          <h3 className="text-lg font-semibold text-[#1A237E]">
            {product.name}
          </h3>
          <p className="text-xs text-[#1A237E] opacity-60 mt-0.5 font-medium">
            {subtitle}
          </p>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <span className="text-xl font-bold text-[#1A237E]">
            ₹{product.price}
          </span>
          <button
            disabled={outOfStock}
            onClick={(e) => {
              e.stopPropagation();
              addItem({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                category: product.category,
                stock_count: product.stock_count,
              });
              setShowToast(true);
              setTimeout(() => setShowToast(false), 2000);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-base font-medium transition-opacity ${
              outOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#1A237E] text-white hover:opacity-90 cursor-pointer"
            }`}
          >
            <ShoppingBag size={16} />
            {outOfStock ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </div>
    </motion.div>
    <AddedToast visible={showToast} productName={product.name} />
    </>
  );
}
