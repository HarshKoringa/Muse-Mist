"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import CheckoutButton from "@/components/CheckoutButton";
import CODCheckoutButton from "@/components/CODCheckoutButton";
import DiscountLoader from "@/components/DiscountLoader";
import { getDiscountInfo } from "@/app/actions/getDiscountInfo";

const gradientMap: Record<string, string> = {
  Sunscreen: "from-[#DCEFFF] via-[#DCD9F8] to-white",
  Moisturiser: "from-[#DCD9F8] via-[#DCEFFF] to-white",
  Serum: "from-[#1A237E] via-[#3949AB] to-[#DCD9F8]",
  "Face Wash": "from-[#DCEFFF] via-white to-[#DCD9F8]",
};

const COD_CHARGE = 50;

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);

  const [selectedMethod, setSelectedMethod] = useState<"prepaid" | "cod">("prepaid");
  const [discountLoading, setDiscountLoading] = useState(true);
  const [prepaidDiscountPercent, setPrepaidDiscountPercent] = useState(5);
  const [earlyAccessPercent, setEarlyAccessPercent] = useState(0);
  const [totalPrepaidPercent, setTotalPrepaidPercent] = useState(5);
  const [codDiscountPercent, setCodDiscountPercent] = useState(0);
  const [isEarlyAccess, setIsEarlyAccess] = useState(false);

  useEffect(() => {
    getDiscountInfo().then((info) => {
      setPrepaidDiscountPercent(info.prepaidDiscountPercent);
      setEarlyAccessPercent(info.earlyAccessPercent);
      setTotalPrepaidPercent(info.totalPrepaidPercent);
      setCodDiscountPercent(info.codDiscountPercent);
      setIsEarlyAccess(info.isEarlyAccess);
      setDiscountLoading(false);
    });
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const launchSaving = items.reduce((sum, item) => {
    if (item.mrp && item.mrp > item.price) {
      return sum + (item.mrp - item.price) * item.quantity;
    }
    return sum;
  }, 0);

  const prepaidDiscount = Math.round(subtotal * (totalPrepaidPercent / 100));
  const prepaidTotal = subtotal - prepaidDiscount;

  const codDiscount = Math.round(subtotal * (codDiscountPercent / 100));
  const codTotal = subtotal - codDiscount + COD_CHARGE;

  const displayTotal = selectedMethod === "prepaid" ? prepaidTotal : codTotal;

  return (
    <main className="min-h-screen bg-[#DCEFFF] px-4 pt-20 pb-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
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
              href="/#products"
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
                {/* Product image or gradient fallback */}
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#DCEFFF]">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${gradient} flex items-end p-1.5`}
                    >
                      <span className="text-[8px] font-bold tracking-widest uppercase text-[#1A237E] opacity-30">
                        M&amp;M
                      </span>
                    </div>
                  )}
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
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                  {item.mrp && item.mrp > item.price && (
                    <p className="text-xs text-gray-400 line-through">
                      ₹{(item.mrp * item.quantity).toLocaleString("en-IN")}
                    </p>
                  )}
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
        {items.length > 0 && discountLoading && <DiscountLoader />}

        {items.length > 0 && !discountLoading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4">
            <h2
              className="text-lg font-semibold text-[#1A237E] mb-6"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Order Summary
            </h2>

            {/* Payment method toggle */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-50 rounded-xl">
              <button
                onClick={() => setSelectedMethod("prepaid")}
                style={{ fontFamily: "var(--font-body)", fontSize: "16px" }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  selectedMethod === "prepaid"
                    ? "bg-white text-[#1A237E] shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Prepaid
              </button>
              <button
                onClick={() => setSelectedMethod("cod")}
                style={{ fontFamily: "var(--font-body)", fontSize: "16px" }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  selectedMethod === "cod"
                    ? "bg-white text-[#1A237E] shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Cash on Delivery
              </button>
            </div>

            {/* Price breakdown */}
            <div className="flex flex-col gap-3">
              {/* Subtotal */}
              <div className="flex justify-between text-sm text-gray-500">
                <span style={{ fontFamily: "var(--font-body)" }}>
                  Subtotal ({items.length} item{items.length > 1 ? "s" : ""})
                </span>
                <span style={{ fontFamily: "var(--font-body)" }}>
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Prepaid breakdown */}
              {selectedMethod === "prepaid" && (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm text-green-600">
                    <span style={{ fontFamily: "var(--font-body)" }}>
                      Prepaid Discount ({prepaidDiscountPercent}%)
                    </span>
                    <span>
                      −₹{Math.round(subtotal * (prepaidDiscountPercent / 100)).toLocaleString("en-IN")}
                    </span>
                  </div>
                  {isEarlyAccess && (
                    <div className="flex justify-between text-sm text-purple-600">
                      <span style={{ fontFamily: "var(--font-body)" }}>
                        Early Access Discount ({earlyAccessPercent}%) 🎉
                      </span>
                      <span>
                        −₹{Math.round(subtotal * (earlyAccessPercent / 100)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-green-600">
                    <span style={{ fontFamily: "var(--font-body)" }}>Delivery</span>
                    <span className="font-medium">FREE</span>
                  </div>
                </div>
              )}

              {/* COD breakdown */}
              {selectedMethod === "cod" && (
                <div className="flex flex-col gap-2">
                  {isEarlyAccess && codDiscount > 0 && (
                    <div className="flex justify-between text-sm text-purple-600">
                      <span style={{ fontFamily: "var(--font-body)" }}>
                        Early Access Discount ({earlyAccessPercent}%) 🎉
                      </span>
                      <span>
                        −₹{codDiscount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-500">
                    <span style={{ fontFamily: "var(--font-body)" }}>
                      Delivery (COD)
                    </span>
                    <span>₹{COD_CHARGE}</span>
                  </div>
                </div>
              )}

              <div className="h-px bg-gray-100 my-1" />

              {/* Total */}
              <div className="flex justify-between items-baseline">
                <div>
                  <span
                    className="text-lg font-bold text-[#1A237E]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Total
                  </span>
                  <p
                    className="text-[10px] text-gray-400 mt-0.5"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Incl. of all taxes
                  </p>
                </div>
                <span
                  className="text-2xl font-bold text-[#1A237E]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  ₹{displayTotal.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Prepaid savings banner */}
              {selectedMethod === "prepaid" && (
                <div
                  className={`flex flex-col gap-1.5 p-3 rounded-xl mt-1 ${
                    isEarlyAccess
                      ? "bg-purple-50 border border-purple-100"
                      : "bg-green-50 border border-green-100"
                  }`}
                >
                  {/* Launch discount saving */}
                  {launchSaving > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 text-xs">🎉</span>
                      <p
                        className="text-xs text-red-600 font-semibold"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Launch Offer: ₹{launchSaving.toLocaleString("en-IN")} off on MRP
                      </p>
                    </div>
                  )}

                  {/* Prepaid / early access saving */}
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${isEarlyAccess ? "text-purple-600" : "text-green-600"}`}>
                      ✦
                    </span>
                    <p
                      className={`text-xs font-medium ${isEarlyAccess ? "text-purple-700" : "text-green-700"}`}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {isEarlyAccess
                        ? `Extra ₹${prepaidDiscount.toLocaleString("en-IN")} off (${totalPrepaidPercent}% — Early Access + Prepaid)`
                        : `Extra ₹${prepaidDiscount.toLocaleString("en-IN")} off with prepaid (5%)`
                      }
                    </p>
                  </div>

                  {/* Total savings line */}
                  <div className="flex items-center gap-2 pt-1 border-t border-white/50 mt-0.5">
                    <p
                      className="text-xs font-bold text-[#1A237E]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Total savings: ₹{(launchSaving + prepaidDiscount).toLocaleString("en-IN")} on this order
                    </p>
                  </div>
                </div>
              )}

              {/* COD banner */}
              {selectedMethod === "cod" && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100 mt-1">
                  <span className="text-amber-600">ℹ</span>
                  <div>
                    {isEarlyAccess ? (
                      <>
                        <p
                          className="text-xs text-amber-700 font-medium"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          Early access {earlyAccessPercent}% off applied on COD too 🎉
                        </p>
                        <p
                          className="text-[10px] text-amber-600 mt-0.5"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          Switch to prepaid to save extra {prepaidDiscountPercent}% + get free delivery
                        </p>
                      </>
                    ) : (
                      <p
                        className="text-xs text-amber-700"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Switch to prepaid to save ₹{prepaidDiscount.toLocaleString("en-IN")} + get free delivery
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className="mt-6">
              {selectedMethod === "prepaid" ? (
                <CheckoutButton
                  paymentMethod="prepaid"
                  displayAmount={prepaidTotal}
                  totalDiscountPercent={totalPrepaidPercent}
                  isEarlyAccess={isEarlyAccess}
                />
              ) : (
                <CODCheckoutButton
                  displayAmount={codTotal}
                  totalDiscountPercent={codDiscountPercent}
                  isEarlyAccess={isEarlyAccess}
                />
              )}
            </div>

            <p
              className="text-[10px] text-gray-400 text-center mt-3"
              style={{ fontFamily: "var(--font-body)" }}
            >
              🔒 Secure checkout · Powered by Razorpay &amp; Shiprocket
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
