import axios from "axios";
import { useEffect, useState } from "react";
import { ProductCard, type Product } from "../components/productCard";
import { ProductListSkeleton } from "../components/loadingSkeleton";
import { useSearchParams } from "react-router-dom";

export const ProductListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchText = searchParams.get("q") ?? "";
  const [searchInput, setSearchInput] = useState<string>(searchText);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `https://dummyjson.com/products${searchText ? "/search" : ""}`,
          {
            params: { ...(searchText ? { q: searchText } : {}), limit: 10 },
            signal: controller.signal,
          },
        );
        setProducts(response.data.products);
      } catch (err) {
        if (!axios.isCancel(err)) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("couldn't fetch products");
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchProducts();
    return () => controller.abort();
  }, [searchText]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim() == searchText) {
        return;
      }
      setSearchParams(
        (prev) => {
          const param = new URLSearchParams(prev);
          if (searchInput.trim()) {
            param.set("q", searchInput.trim());
          } else {
            param.delete("q");
          }
          return param;
        },
        { replace: true },
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, searchText, setSearchParams]);

  return (
    <div>
      <input
        type="search"
        aria-label="Search products"
        placeholder="Search products..."
        className="w-40 bg-gray-300"
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
        }}
      />
      {error ? (
        <div>{error}</div>
      ) : loading ? (
        <ProductListSkeleton />
      ) : products.length === 0 ? (
        <p className="p-6">No products found for “{searchText}”.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
