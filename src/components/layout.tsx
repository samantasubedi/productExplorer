import { Link, Outlet } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-300 bg-gray-100">
        <Link to="/">
          <span className="text-xl font-bold text-blue-600">
            Product Explorer
          </span>
        </Link>
        <Link className="cursor-pointer" to="/cart">
          <ShoppingCart />
        </Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
