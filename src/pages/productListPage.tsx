import { useEffect, useState } from "react";
import { ProductCard } from "../components/productCard";
import { ProductListSkeleton } from "../components/loadingSkeleton";
import { useSearchParams } from "react-router-dom";

import { useDebouncedValue } from "../hooks/debounceHook";
import { useProducts } from "../hooks/productHooks";
import { ErrorState } from "../components/errorState";

export const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchText = searchParams.get("q") ?? "";
  const [searchInput, setSearchInput] = useState<string>(searchText);
  const debouncedInput = useDebouncedValue(searchInput, 400);
  useEffect(() => {
    const next = debouncedInput.trim();
    if (next === searchText) return;
    setSearchParams((prev) => {
      const param = new URLSearchParams(prev);
      if (next) {
        param.set("q", next);
      } else {
        param.delete("q");
      }
      return param;
    });
  }, [debouncedInput, searchText, setSearchParams]);
  const { products, loading, error, retry } = useProducts({
    search: searchText,
  });

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
        <ErrorState message={error ?? "something went wrong"} onRetry={retry} />
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
