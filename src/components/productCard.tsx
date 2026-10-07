import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import type { Product } from "../types/product";


type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const outOfStock = product.stock === 0;
  const cartItems = useCartStore((state) => state.items);
  const existing = cartItems.find((item) => item.product.id == product.id);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm transition hover:shadow-md">
      <Link
        to={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-gray-100"
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.discountPercentage > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs uppercase tracking-wide text-gray-500">
          {product.category}
        </p>

        <Link to={`/products/${product.id}`}>
          <h2 className="line-clamp-1 font-medium hover:underline">
            {product.title}
          </h2>
        </Link>

        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          {product.rating.toFixed(1)}
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-semibold">
            ${product.price.toFixed(2)}
          </span>

          {existing ? (
            <div className="mt-2 flex w-fit items-center gap-4 rounded-lg  px-2 py-2">
              <button
                onClick={() =>
                  updateQuantity(product.id, existing.quantity - 1)
                }
                aria-label="Decrease quantity"
                className="flex h-8 w-8 font-bold text-2xl cursor-pointer items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200"
              >
                -
              </button>
              <span className="min-w-6 text-center font-medium">
                {existing.quantity}
              </span>
              <button
                onClick={() =>
                  updateQuantity(product.id, existing.quantity + 1)
                }
                disabled={existing.quantity >= product.stock}
                aria-label="Increase quantity"
                className="flex h-8 w-8 font-bold text-2xl cursor-pointer items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              disabled={outOfStock}
              className="mt-2 rounded-lg bg-blue-700 px-6 py-3 text-white transition hover:bg-blue-800 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {outOfStock ? "Out of stock" : "Add to cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
