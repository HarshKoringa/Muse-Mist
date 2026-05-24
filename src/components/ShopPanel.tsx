"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Check, Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useCartStore } from "@/store/cartStore";
import { useCartUIStore } from "@/store/cartUIStore";
import { Product } from "@/types/product";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const gradientMap: Record<string, string> = {
  Sunscreen: "from-[#DCEFFF] via-[#DCD9F8] to-white",
  Moisturiser: "from-[#DCD9F8] via-[#DCEFFF] to-white",
  Serum: "from-[#1A237E] via-[#3949AB] to-[#DCD9F8]",
  "Face Wash": "from-[#DCEFFF] via-white to-[#DCD9F8]",
};

export default function ShopPanel({ isOpen, onClose }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const fetchedRef = useRef(false);

  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const increaseQty = useCartStore((state) => state.increaseQty);
  const openCart = useCartUIStore((state) => state.openCart);

  // Fetch products once on first open
  useEffect(() => {
    if (!isOpen || fetchedRef.current) return;
    fetchedRef.current = true;
    const supabase = createClient();
    supabase
      .from("products")
      .select(
        "id, name, slug, price, mrp, description, category, stock_count, is_active, image_url, discount_percent, discount_label, discount_active, size"
      )
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setProducts(data as Product[]);
      });
  }, [isOpen]);

  const handleAdd = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      mrp: product.mrp ?? null,
      category: product.category,
      stock_count: product.stock_count,
      image_url: product.image_url ?? null,
      size: product.size ?? null,
    });
    // Show "Added" feedback briefly, then open cart and close panel
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      openCart();
      onClose();
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 600);
  };

  const handleInCartTap = (productId: string) => {
    increaseQty(productId);
    openCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Panel — sits above the bottom nav bar */}
          <motion.div
            className="fixed left-0 right-0 z-40 lg:hidden bg-white rounded-t-2xl flex flex-col"
            style={{
              bottom: "calc(4rem + env(safe-area-inset-bottom))",
              maxHeight: "75vh",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-9 h-1 rounded-full bg-[#D1D5DB]" />
            </div>

            {/* Title row */}
            <div className="px-4 py-3 border-b border-[#F3F4F6] flex-shrink-0">
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="text-lg font-semibold text-[#1A237E]"
              >
                The Edit
              </h3>
              {products.length > 0 && (
                <p
                  style={{ fontFamily: "var(--font-body)", fontSize: "12px" }}
                  className="text-[#9CA3AF] mt-0.5"
                >
                  {products.length} products
                </p>
              )}
            </div>

            {/* Scrollable product list */}
            <div className="overflow-y-auto flex-1">
              {products.length === 0 ? (
                <div className="flex items-center justify-center py-16">
                  <p
                    style={{ fontFamily: "var(--font-body)", fontSize: "14px" }}
                    className="text-[#9CA3AF]"
                  >
                    Loading...
                  </p>
                </div>
              ) : (
                products.map((product, i) => {
                  const inCart = cartItems.some((ci) => ci.id === product.id);
                  const justAdded = addedIds.has(product.id);
                  const outOfStock = product.stock_count === 0;
                  const gradient =
                    gradientMap[product.category] ??
                    "from-[#DCD9F8] to-[#DCEFFF]";

                  return (
                    <div
                      key={product.id}
                      className={`flex items-center gap-3 px-4 py-3 ${
                        i < products.length - 1
                          ? "border-b border-[#F3F4F6]"
                          : ""
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#DCEFFF]">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className={`w-full h-full bg-gradient-to-br ${gradient}`}
                          />
                        )}
                      </div>

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <p
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "15px",
                          }}
                          className="font-medium text-[#0D1117] leading-tight truncate"
                        >
                          {product.name}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "12px",
                          }}
                          className="text-[#6B7280] mt-0.5"
                        >
                          {product.category}
                          {product.size ? ` · ${product.size}` : ""}
                        </p>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "15px",
                            }}
                            className="font-semibold text-[#1A237E]"
                          >
                            ₹{Number(product.price).toLocaleString("en-IN")}
                          </span>
                          {product.mrp && product.mrp > product.price && (
                            <span
                              style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "12px",
                              }}
                              className="text-[#9CA3AF] line-through"
                            >
                              ₹{Number(product.mrp).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action button */}
                      {outOfStock ? (
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "12px",
                            minWidth: "44px",
                            minHeight: "44px",
                          }}
                          className="flex items-center px-3 rounded-full border border-[#E5E7EB] text-[#9CA3AF] flex-shrink-0"
                        >
                          Sold Out
                        </span>
                      ) : inCart && !justAdded ? (
                        <button
                          onClick={() => handleInCartTap(product.id)}
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "13px",
                            minWidth: "44px",
                            minHeight: "44px",
                          }}
                          className="flex items-center gap-1 px-3 py-2 rounded-full bg-[#1A237E] text-white flex-shrink-0 cursor-pointer"
                        >
                          <Plus size={13} />
                          In Cart
                        </button>
                      ) : (
                        <button
                          onClick={() => !justAdded && handleAdd(product)}
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "13px",
                            minWidth: "44px",
                            minHeight: "44px",
                          }}
                          className={`flex items-center gap-1 px-4 py-2 rounded-full border flex-shrink-0 transition-all cursor-pointer ${
                            justAdded
                              ? "bg-[#1A237E] text-white border-[#1A237E]"
                              : "border-[#1A237E] text-[#1A237E] hover:bg-[#1A237E] hover:text-white"
                          }`}
                        >
                          {justAdded ? (
                            <>
                              <Check size={13} />
                              Added
                            </>
                          ) : (
                            "Add"
                          )}
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
