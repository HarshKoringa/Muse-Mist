"use client";

import { useCartStore } from "@/store/cartStore";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const gradientMap: Record<string, string> = {
  Sunscreen: "from-[#DCEFFF] via-[#DCD9F8] to-white",
  Moisturiser: "from-[#DCD9F8] via-[#DCEFFF] to-white",
  Serum: "from-[#1A237E] via-[#3949AB] to-[#DCD9F8]",
  "Face Wash": "from-[#DCEFFF] via-white to-[#DCD9F8]",
};

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <main className="min-h-screen bg-[#DCEFFF] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/home-v1">
            <ArrowLeft
              size={22}
              className="text-[#1A237E] cursor-pointer hover:opacity-70 transition-opacity"
            />
          </Link>
          <h1 className="text-2xl font-semibold text-[#1A237E]">Your Cart</h1>
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-4 py-24 text-center"
          >
            <ShoppingBag size={56} className="text-[#1A237E] opacity-20" />
            <p className="text-lg font-medium text-[#1A237E] opacity-50">
              Your cart is empty
            </p>
            <Link
              href="/home-v1#products"
              className="mt-2 px-6 py-3 rounded-xl bg-[#1A237E] text-white text-base font-medium hover:opacity-90 transition-opacity"
            >
              Shop The Edit
            </Link>
          </motion.div>
        )}

        {/* Cart Items */}
        <AnimatePresence>
          {items.map((item) => {
            const gradient =
              gradientMap[item.category] ?? "from-[#DCD9F8] to-[#DCEFFF]";
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 mb-4 items-center"
              >
                {/* Gradient Thumbnail */}
                <div
                  className={`w-20 h-20 rounded-xl bg-gradient-to-br ${gradient} flex-shrink-0 flex items-end p-2`}
                >
                  <span className="text-[8px] font-bold tracking-widest uppercase text-[#1A237E] opacity-30">
                    M&amp;M
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
                    {item.category}
                  </p>
                  <h3 className="text-base font-semibold text-[#1A237E] truncate">
                    {item.name}
                  </h3>
                  <p className="text-base font-bold text-[#1A237E] mt-1">
                    ₹{item.price * item.quantity}
                  </p>
                </div>

                {/* Quantity + Remove */}
                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#1A237E] hover:text-[#1A237E] transition-colors cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-base font-semibold text-[#1A237E] w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      disabled={item.quantity >= item.stock_count}
                      className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors ${
                        item.quantity >= item.stock_count
                          ? "border-gray-100 text-gray-300 cursor-not-allowed"
                          : "border-gray-200 hover:border-[#1A237E] hover:text-[#1A237E] cursor-pointer"
                      }`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Order Summary */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4"
          >
            <h2 className="text-lg font-semibold text-[#1A237E] mb-4">
              Order Summary
            </h2>

            <div className="flex justify-between text-base text-gray-500 mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-base text-gray-500 mb-4">
              <span>Shipping</span>
              <span className="text-green-500 font-medium">
                Calculated at checkout
              </span>
            </div>

            <div className="flex justify-between text-lg font-bold text-[#1A237E] pt-4 border-t border-gray-100">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>

            <button
              className="w-full mt-6 py-4 rounded-xl bg-[#1A237E] text-white text-base font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              onClick={() => {
                // Shiprocket Magic Checkout — Phase 4
              }}
            >
              Proceed to Checkout
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              Secure checkout powered by Shiprocket
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
