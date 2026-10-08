import { Link, Outlet } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { selectTotalItems } from "../store/cartStore";

export const Layout = () => {
  const totalItems = useCartStore(selectTotalItems);
  return (
    <div className="min-h-screen flex flex-col min-w-0 overflow-x-clip">
      <nav className="flex items-center justify-between px-4 py-4 border-b border-gray-300 bg-gray-100 sticky top-0 z-10 sm:px-6">
        <Link to="/">
          <span className="text-xl font-bold text-blue-600">
            Product Explorer
          </span>
        </Link>
        <Link to="/cart" aria-label="Cart" className="relative cursor-pointer">
          <ShoppingCart />
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-700 px-1 text-xs text-white">
              {totalItems}
            </span>
          )}
        </Link>
      </nav>
      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
};
