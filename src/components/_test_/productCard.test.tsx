import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import { ProductCard } from "../productCard";
import { useCartStore } from "../../store/cartStore";
import type { Product } from "../../types/product";

const mockProduct: Product = {
  id: 1,
  title: "Test Phone",
  thumbnail: "test.jpg",
  category: "smartphones",
  price: 299.99,
  rating: 4.5,
  discountPercentage: 10,
  stock: 5,
};

function renderCard(product: Product = mockProduct) {
  return render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  useCartStore.setState({ items: [] });
  localStorage.clear();
});

describe("ProductCard", () => {
  it("renders thumbnail, title, price, rating, category", () => {
    renderCard();
    expect(screen.getByAltText("Test Phone")).toBeInTheDocument();
    expect(screen.getByText("Test Phone")).toBeInTheDocument();
    expect(screen.getByText("$299.99")).toBeInTheDocument();
    expect(screen.getByText("smartphones")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  it("adds to cart on button click", async () => {
    const user = userEvent.setup();
    renderCard();
    await user.click(screen.getByRole("button", { name: /add to cart/i }));
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("shows Out of stock and disables button", () => {
    renderCard({ ...mockProduct, stock: 0 });
    expect(
      screen.getByRole("button", { name: /out of stock/i }),
    ).toBeDisabled();
  });
});
