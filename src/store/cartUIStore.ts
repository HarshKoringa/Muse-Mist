import { create } from "zustand";

interface CartUIState {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartUIStore = create<CartUIState>()((set) => ({
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
}));
