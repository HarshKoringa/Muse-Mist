import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp?: number | null;
  category: string;
  quantity: number;
  image_url?: string | null;
  size?: string | null;
};

type CartStore = {
  items: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const { stock_count, is_active, key_ingredients, how_to_use,
                skin_type, discount_percent, discount_label,
                discount_active, ...safeProduct } = product as any

        set((state) => {
          const existing = state.items.find((i) => i.id === safeProduct.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === safeProduct.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          }
          return { items: [...state.items, { ...safeProduct, quantity: 1 }] }
        })
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      increaseQty: (id) =>
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        }),

      decreaseQty: (id) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;
        if (item.quantity === 1) {
          set({ items: get().items.filter((i) => i.id !== id) });
        } else {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
            ),
          });
        }
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "muse-mist-cart",
      version: 4,
      migrate: (persistedState: unknown, version: number) => {
        if (version < 4) {
          return { items: [] };
        }
        return persistedState as CartStore;
      },
    },
  ),
);
