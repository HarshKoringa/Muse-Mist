import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AppliedReferral = {
  type: "referral" | "self_purchase" | "coupon";
  discountPercent: number;
  mode: "stack" | "flat";
  ambassadorName?: string;
};

interface ReferralState {
  code: string;
  applied: AppliedReferral | null;
  setApplied: (code: string, applied: AppliedReferral) => void;
  clear: () => void;
}

// Session-scoped (not localStorage like the cart) — an applied discount code
// shouldn't silently resurface on a return visit days later.
export const useReferralStore = create<ReferralState>()(
  persist(
    (set) => ({
      code: "",
      applied: null,
      setApplied: (code, applied) => set({ code, applied }),
      clear: () => set({ code: "", applied: null }),
    }),
    {
      name: "muse-mist-referral",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
