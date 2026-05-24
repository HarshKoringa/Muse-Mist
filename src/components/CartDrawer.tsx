"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useCartUIStore } from "@/store/cartUIStore";
import { createClient } from "@/utils/supabase/client";
import { getDiscountInfo } from "@/app/actions/getDiscountInfo";

const gradientMap: Record<string, string> = {
  Sunscreen: "from-[#DCEFFF] via-[#DCD9F8] to-white",
  Moisturiser: "from-[#DCD9F8] via-[#DCEFFF] to-white",
  Serum: "from-[#1A237E] via-[#3949AB] to-[#DCD9F8]",
  "Face Wash": "from-[#DCEFFF] via-white to-[#DCD9F8]",
};

const COD_CHARGE = 50;

export default function CartDrawer() {
  const { isCartOpen, openCart, closeCart } = useCartUIStore();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);
  const router = useRouter();

  const [selectedMethod, setSelectedMethod] = useState<"prepaid" | "cod">("prepaid");
  const [discountLoading, setDiscountLoading] = useState(true);
  const [prepaidDiscountPercent, setPrepaidDiscountPercent] = useState(5);
  const [earlyAccessPercent, setEarlyAccessPercent] = useState(0);
  const [totalPrepaidPercent, setTotalPrepaidPercent] = useState(5);
  const [codDiscountPercent, setCodDiscountPercent] = useState(0);
  const [isEarlyAccess, setIsEarlyAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Auto-open when redirected back from Google OAuth with ?openCart=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('openCart') === '1') {
      openCart();
      const url = new URL(window.location.href);
      url.searchParams.delete('openCart');
      window.history.replaceState({}, '', url.toString());
    }
  }, [openCart]);

  // Fetch discount info each time the drawer opens
  useEffect(() => {
    if (!isCartOpen) return;
    setDiscountLoading(true);
    getDiscountInfo().then((info) => {
      setPrepaidDiscountPercent(info.prepaidDiscountPercent);
      setEarlyAccessPercent(info.earlyAccessPercent);
      setTotalPrepaidPercent(info.totalPrepaidPercent);
      setCodDiscountPercent(info.codDiscountPercent);
      setIsEarlyAccess(info.isEarlyAccess);
      setDiscountLoading(false);
    });
  }, [isCartOpen]);

  // Lock body scroll on mobile only — desktop keeps page scrollable
  useEffect(() => {
    if (isCartOpen && !isDesktop) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen, isDesktop]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const prepaidDiscount = Math.round(subtotal * (totalPrepaidPercent / 100));
  const prepaidTotal = subtotal - prepaidDiscount;

  const codDiscount = Math.round(subtotal * (codDiscountPercent / 100));
  const codTotal = subtotal - codDiscount + (items.length > 0 ? COD_CHARGE : 0);

  const displayTotal = selectedMethod === "prepaid" ? prepaidTotal : codTotal;

  const handleProceed = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        closeCart();
        router.push("/login?redirect=checkout");
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            slug: item.slug,
            price: item.price,
            mrp: item.mrp,
            quantity: item.quantity,
            image_url: item.image_url,
            size: item.size,
          })),
          payment_method: selectedMethod,
          user_id: user.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");

      const discountPercent = data.total_discount_percent ?? 0;
      const multiplier = (100 - discountPercent) / 100;

      sessionStorage.setItem(
        "checkout_data",
        JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            slug: item.slug,
            price: item.price,
            mrp: item.mrp ?? null,
            quantity: item.quantity,
            category: item.category,
            image_url: item.image_url ?? null,
            stock_count: item.stock_count,
            size: item.size ?? null,
            final_price: Math.round(item.price * multiplier),
          })),
          payment_method: selectedMethod,
          user_id: user.id,
          subtotal: data.subtotal,
          discount: data.discount,
          delivery_charge: data.delivery_charge,
          total: data.total,
          is_early_access: data.is_early_access,
          total_discount_percent: data.total_discount_percent,
          razorpay_order_id: data.razorpay_order_id,
          razorpay_key: data.razorpay_key,
        })
      );

      closeCart();
      router.push(`/checkout/address?method=${selectedMethod}`);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop — mobile only */}
          {!isDesktop && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeCart}
            />
          )}

          {/* Drawer panel */}
          <motion.div
            className={`fixed right-0 bg-white flex flex-col ${
              isDesktop
                ? "top-[65px] z-30 w-[420px] h-[calc(100vh-65px)] border-l border-[#E5E7EB] shadow-[-4px_0_24px_rgba(0,0,0,0.06)]"
                : "top-0 bottom-0 z-50 w-full shadow-2xl"
            }`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] flex-shrink-0">
              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="text-xl font-semibold text-[#0D1117]"
              >
                Your Cart ({totalItemCount} {totalItemCount === 1 ? "item" : "items"})
              </h2>
              <button
                onClick={closeCart}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X size={20} className="text-[#0D1117]" />
              </button>
            </div>

            {/* Empty state */}
            {items.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
                <ShoppingBag size={48} className="text-[#1A237E] opacity-20" />
                <p
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-xl font-light text-[#0D1117] opacity-50"
                >
                  Your cart is empty
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    router.push("/#products");
                  }}
                  style={{ fontFamily: "var(--font-body)", fontSize: "16px" }}
                  className="mt-2 px-6 py-3 rounded-xl bg-[#1A237E] text-white text-base font-medium hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Shop Now
                </button>
              </div>
            )}

            {/* Items + summary */}
            {items.length > 0 && (
              <>
                {/* Scrollable items list */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
                  <AnimatePresence>
                    {items.map((item, i) => {
                      const gradient =
                        gradientMap[item.category] ?? "from-[#DCD9F8] to-[#DCEFFF]";
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -40 }}
                          transition={{ duration: 0.2, delay: i * 0.04 }}
                          className="bg-white rounded-2xl border border-[#E5E7EB] p-3 flex gap-3 items-start"
                        >
                          {/* Thumbnail */}
                          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#DCEFFF]">
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className={`w-full h-full bg-gradient-to-br ${gradient} flex items-end p-1`}
                              >
                                <span className="text-[7px] font-bold tracking-widest uppercase text-[#1A237E] opacity-30">
                                  M&amp;M
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <p
                              style={{ fontFamily: "var(--font-display)" }}
                              className="text-sm font-medium text-[#0D1117] leading-tight"
                            >
                              {item.name}
                              {item.size && (
                                <span className="text-[#0D1117]/50"> · {item.size}</span>
                              )}
                            </p>

                            <div className="flex items-baseline gap-1.5 mt-1">
                              <span
                                style={{ fontFamily: "var(--font-body)" }}
                                className="text-sm font-semibold text-[#1A237E]"
                              >
                                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                              </span>
                              {item.mrp && item.mrp > item.price && (
                                <span
                                  style={{ fontFamily: "var(--font-body)" }}
                                  className="text-xs text-gray-400 line-through"
                                >
                                  ₹{(item.mrp * item.quantity).toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>

                            {/* Quantity controls */}
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => decreaseQty(item.id)}
                                style={{ minWidth: "44px", minHeight: "44px" }}
                                className="w-8 h-8 rounded-full border border-[#E5E7EB] flex items-center justify-center hover:border-[#1A237E] hover:text-[#1A237E] transition-colors cursor-pointer text-[#0D1117]"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={13} />
                              </button>
                              <span
                                style={{ fontFamily: "var(--font-body)" }}
                                className="text-sm font-semibold text-[#1A237E] w-5 text-center"
                              >
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => increaseQty(item.id)}
                                disabled={item.quantity >= item.stock_count}
                                style={{ minWidth: "44px", minHeight: "44px" }}
                                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                                  item.quantity >= item.stock_count
                                    ? "border-gray-100 text-gray-300 cursor-not-allowed"
                                    : "border-[#E5E7EB] hover:border-[#1A237E] hover:text-[#1A237E] cursor-pointer text-[#0D1117]"
                                }`}
                                aria-label="Increase quantity"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeItem(item.id)}
                            style={{ minWidth: "44px", minHeight: "44px" }}
                            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors cursor-pointer text-gray-300 hover:text-[#EF4444] flex-shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Sticky bottom: payment toggle + summary + CTA */}
                <div className="border-t border-[#E5E7EB] px-5 pt-4 pb-5 space-y-3 bg-white flex-shrink-0">
                  {/* Prepaid / COD toggle */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedMethod("prepaid")}
                      style={{ fontFamily: "var(--font-body)", fontSize: "16px" }}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border cursor-pointer ${
                        selectedMethod === "prepaid"
                          ? "bg-[#1A237E] text-white border-[#1A237E]"
                          : "bg-white text-[#0D1117] border-[#E5E7EB] hover:border-[#1A237E]"
                      }`}
                    >
                      Prepaid {selectedMethod === "prepaid" && "✓"}
                    </button>
                    <button
                      onClick={() => setSelectedMethod("cod")}
                      style={{ fontFamily: "var(--font-body)", fontSize: "16px" }}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border cursor-pointer ${
                        selectedMethod === "cod"
                          ? "bg-[#1A237E] text-white border-[#1A237E]"
                          : "bg-white text-[#0D1117] border-[#E5E7EB] hover:border-[#1A237E]"
                      }`}
                    >
                      COD {selectedMethod === "cod" && "✓"}
                    </button>
                  </div>

                  {/* Toggle info line */}
                  {selectedMethod === "prepaid" ? (
                    <p
                      style={{ fontFamily: "var(--font-body)" }}
                      className="text-xs text-green-600 font-medium"
                    >
                      ✓ Extra 5% off + Free shipping
                    </p>
                  ) : (
                    <p
                      style={{ fontFamily: "var(--font-body)" }}
                      className="text-xs text-gray-500"
                    >
                      ₹50 delivery charge added
                    </p>
                  )}

                  {/* Price breakdown */}
                  {discountLoading ? (
                    <div className="flex items-center gap-2 py-1">
                      <Loader2 size={14} className="animate-spin text-[#1A237E]" />
                      <span
                        style={{ fontFamily: "var(--font-body)" }}
                        className="text-xs text-gray-400"
                      >
                        Calculating your savings...
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1.5" style={{ fontFamily: "var(--font-body)" }}>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString("en-IN")}</span>
                      </div>

                      {selectedMethod === "prepaid" && (
                        <>
                          {isEarlyAccess && earlyAccessPercent > 0 && (
                            <div className="flex justify-between text-sm text-purple-600">
                              <span>Early Access -{earlyAccessPercent}%</span>
                              <span>
                                −₹
                                {Math.round(
                                  (subtotal * earlyAccessPercent) / 100
                                ).toLocaleString("en-IN")}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Prepaid -{prepaidDiscountPercent}%</span>
                            <span>
                              −₹
                              {Math.round(
                                (subtotal * prepaidDiscountPercent) / 100
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Delivery</span>
                            <span className="font-medium">Free</span>
                          </div>
                        </>
                      )}

                      {selectedMethod === "cod" && (
                        <>
                          {isEarlyAccess && codDiscount > 0 && (
                            <div className="flex justify-between text-sm text-purple-600">
                              <span>Early Access -{earlyAccessPercent}%</span>
                              <span>−₹{codDiscount.toLocaleString("en-IN")}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Delivery (COD)</span>
                            <span>+₹{COD_CHARGE}</span>
                          </div>
                        </>
                      )}

                      <div className="h-px bg-[#E5E7EB] my-1" />

                      <div className="flex justify-between items-center">
                        <span className="text-base font-bold text-[#0D1117]">Total</span>
                        <span className="text-xl font-bold text-[#1A237E]">
                          ₹{displayTotal.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <button
                    onClick={handleProceed}
                    disabled={loading || items.length === 0}
                    style={{ fontFamily: "var(--font-body)", fontSize: "16px" }}
                    className={`w-full py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-opacity ${
                      loading || items.length === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-[#1A237E] text-white hover:opacity-90 cursor-pointer"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Proceed to Payment — ₹${displayTotal.toLocaleString("en-IN")}`
                    )}
                  </button>

                  <p
                    style={{ fontFamily: "var(--font-body)" }}
                    className="text-[10px] text-gray-400 text-center"
                  >
                    🔒 Secure checkout · Powered by Razorpay &amp; Shiprocket
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
