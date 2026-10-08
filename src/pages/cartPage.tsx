import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  selectDiscount,
  selectSubtotal,
  selectTotal,
  useCartStore,
} from "../store/cartStore";

export const CartPage = () => {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartStore(selectSubtotal);
  const discount = useCartStore(selectDiscount);
  const total = useCartStore(selectTotal);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl p-4 text-center sm:p-6">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-gray-600">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-blue-700 px-6 py-3 text-white transition hover:bg-blue-800"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between sticky top-14 backdrop-blur-3xl bg-white z-10">
        <h1 className="text-2xl font-bold">Shopping cart</h1>
        <button
          onClick={clearCart}
          className="cursor-pointer text-sm bg-gray-200 p-2 rounded-xl font-semibold text-red-600 hover:bg-red-100"
        >
          Clear cart
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <ul className="space-y-4 lg:col-span-2">
          {items.map(({ product, quantity }) => (
            <li
              key={product.id}
              className="flex gap-3 rounded-xl bg-gray-100 p-3 sm:gap-4 sm:p-4"
            >
              <Link
                to={`/products/${product.id}`}
                className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white sm:h-24 sm:w-24"
              >
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      to={`/products/${product.id}`}
                      className="font-medium hover:underline"
                    >
                      {product.title}
                    </Link>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      {product.category}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    aria-label={`Remove ${product.title}`}
                    className="cursor-pointer text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3 rounded-lg bg-white px-2 py-1">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      aria-label="Decrease quantity"
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-6 text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                      aria-label="Increase quantity"
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <span className="font-semibold">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-xl bg-gray-100 p-4 sm:p-6 lg:sticky lg:top-24">
          <h2 className="mb-4 text-lg font-semibold">Order summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount</span>
              <span className="text-green-600">-${discount.toFixed(2)}</span>
            </div>
            <div className="mt-3 flex justify-between border-t pt-3 text-base font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
