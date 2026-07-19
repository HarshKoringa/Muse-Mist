"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useReferralStore } from "@/store/referralStore";

export default function ReferralCodeField({
  items,
  subtotal,
}: {
  items: { id: string; quantity: number }[];
  subtotal: number;
}) {
  const { code, applied, setApplied, clear } = useReferralStore();

  const [hydrated, setHydrated] = useState(() => useReferralStore.persist.hasHydrated());
  useEffect(() => {
    if (hydrated) return;
    return useReferralStore.persist.onFinishHydration(() => setHydrated(true));
  }, [hydrated]);

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const itemsSignature = items.map((i) => `${i.id}:${i.quantity}`).sort().join(",");
  const prevSignature = useRef(itemsSignature);

  const validate = async (rawCode: string) => {
    const res = await fetch("/api/validate-referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: rawCode, items }),
    });
    return res.json();
  };

  // Re-check the applied code whenever cart contents change — the self-purchase
  // perk is only valid for exactly one item at quantity 1, so adding/removing
  // items can silently invalidate it.
  useEffect(() => {
    if (!hydrated) return;
    if (prevSignature.current === itemsSignature) return;
    prevSignature.current = itemsSignature;
    if (!code) return;

    let cancelled = false;
    validate(code).then((data) => {
      if (cancelled) return;
      if (data.valid) {
        setApplied(code, {
          type: data.type,
          discountPercent: data.discountPercent,
          mode: data.mode,
          ambassadorName: data.ambassadorName,
        });
      } else {
        clear();
        setOpen(true);
        setError(data.message || "Your code is no longer valid for this cart");
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsSignature, hydrated]);

  const handleApply = async () => {
    const raw = inputValue.trim();
    if (!raw) return;
    setLoading(true);
    setError("");
    try {
      const data = await validate(raw);
      if (data.valid) {
        setApplied(raw.toUpperCase(), {
          type: data.type,
          discountPercent: data.discountPercent,
          mode: data.mode,
          ambassadorName: data.ambassadorName,
        });
        setInputValue("");
      } else {
        setError(data.message || "Invalid code");
      }
    } catch {
      setError("Could not validate code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    clear();
    setInputValue("");
    setError("");
  };

  if (!hydrated) return null;

  if (applied) {
    const amount = Math.round((subtotal * applied.discountPercent) / 100);
    const message =
      applied.type === "referral"
        ? `Code ${code} applied — referred by ${applied.ambassadorName}, you saved ₹${amount.toLocaleString("en-IN")}`
        : applied.type === "self_purchase"
          ? `Your ambassador discount applied — ${applied.discountPercent}% off`
          : applied.mode === "stack"
            ? `Code ${code} applied — you saved ₹${amount.toLocaleString("en-IN")}`
            : `Code ${code} applied — flat ${applied.discountPercent}% off`;

    return (
      <div className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-3 gap-2">
        <span
          className="text-sm text-green-700 font-medium flex items-center gap-1.5"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <Check size={15} className="flex-shrink-0" />
          {message}
        </span>
        <button
          onClick={handleRemove}
          style={{ fontFamily: "var(--font-body)" }}
          className="text-sm text-red-500 underline cursor-pointer flex-shrink-0 whitespace-nowrap"
        >
          Remove
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{ fontFamily: "var(--font-body)" }}
        className="text-sm font-medium text-[#1A237E] underline underline-offset-2 cursor-pointer"
      >
        Have a referral or coupon code?
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value.toUpperCase());
            setError("");
          }}
          placeholder="Enter code"
          style={{ fontSize: "16px", fontFamily: "var(--font-body)" }}
          className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-[#1A237E] uppercase"
        />
        <button
          onClick={handleApply}
          disabled={!inputValue.trim() || loading}
          style={{ fontFamily: "var(--font-body)" }}
          className="w-full sm:w-auto px-5 py-3 bg-[#1A237E] text-white rounded-xl text-sm font-medium disabled:opacity-50 whitespace-nowrap cursor-pointer"
        >
          {loading ? "Checking..." : "Apply"}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
