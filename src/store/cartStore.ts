import { create } from "zustand";
import type { Product } from "../components/productCard";
export type CartItem = {
  product: Product;
  quantity: number;
};
import { persist } from "zustand/middleware";
type CartState = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addToCart: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id,
          );
          if (existingItem) {
            if (existingItem.quantity >= product.stock) {
              return state;
            }
            return {
              items: state.items.map((item) => {
                if (item.product.id === product.id) {
                  return {
                    ...item,
                    quantity: item.quantity + 1,
                  };
                } else {
                  return item;
                }
              }),
            };
          }
          return { items: [...state.items, { product, quantity: 1 }] };
        }),
      clearCart: () =>
        set(() => {
          return {
            items: [],
          };
        }),
      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.product.id !== id),
            };
          }
          return {
            items: state.items.map((item) => {
              return item.product.id === id
                ? { ...item, quantity: Math.min(quantity, item.product.stock) }
                : item;
            }),
          };
        }),
      removeFromCart: (id) =>
        set((state) => {
          return {
            items: state.items.filter((item) => item.product.id !== id),
          };
        }),
    }),
    { name: "cart" },
  ),
);
export const selectTotalItems = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.quantity, 0);

export const selectTotalPrice = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
