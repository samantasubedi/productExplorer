import { describe, it, expect, beforeEach } from "vitest";
import {
  useCartStore,
  selectSubtotal,
  selectTotalItems,
  selectTotal,
} from "../cartStore";
import type { Product } from "../../types/product";

const mockProduct: Product = {
  id: 1,
  title: "Test Phone",
  thumbnail: "x.jpg",
  category: "smartphones",
  price: 100,
  rating: 4.5,
  discountPercentage: 10,
  stock: 5,
};

const mockProduct2: Product = {
  ...mockProduct,
  id: 2,
  title: "Laptop",
  price: 50,
  stock: 10,
};

beforeEach(() => {
  useCartStore.setState({ items: [] });
  localStorage.clear();
});

describe("cartStore", () => {
  it("adds new item with quantity 1", () => {
    useCartStore.getState().addToCart(mockProduct);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(1);
    expect(selectTotalItems(useCartStore.getState())).toBe(1);
  });

  it("increments quantity and respects stock cap", () => {
    const { addToCart } = useCartStore.getState();
    addToCart(mockProduct);
    addToCart(mockProduct);
    expect(useCartStore.getState().items[0].quantity).toBe(2);

    for (let i = 0; i < 10; i++) useCartStore.getState().addToCart(mockProduct);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it("updateQuantity caps at stock and removes on 0", () => {
    useCartStore.getState().addToCart(mockProduct);
    useCartStore.getState().updateQuantity(1, 10);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
    useCartStore.getState().updateQuantity(1, 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("removeFromCart + clearCart + subtotal/total math", () => {
    useCartStore.getState().addToCart(mockProduct);
    useCartStore.getState().addToCart(mockProduct2);
    expect(selectSubtotal(useCartStore.getState())).toBe(150);
    useCartStore.getState().removeFromCart(1);
    expect(useCartStore.getState().items).toHaveLength(1);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
    expect(selectTotal(useCartStore.getState())).toBe(0);
  });
});
