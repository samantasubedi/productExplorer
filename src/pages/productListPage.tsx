import { useEffect, useState } from "react";
import { ProductCard } from "../components/productCard";
import { ProductListSkeleton } from "../components/loadingSkeleton";
import { useSearchParams } from "react-router-dom";
import { useDebouncedValue } from "../hooks/debounceHook";
import { useProducts } from "../hooks/productHooks";
import { ErrorState } from "../components/errorState";
import { CategoryFilter } from "../components/categoryFilter";
import type { SortValue } from "../types/product";
import { SortSelect } from "../components/sortSelect";
import { Search } from "lucide-react";

export const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchText = searchParams.get("q") ?? "";
  const [searchInput, setSearchInput] = useState<string>(searchText);
  const debouncedInput = useDebouncedValue(searchInput, 400);
  const category = searchParams.get("category") ?? "";
  const rawSort = searchParams.get("sort") ?? "";
  const validSorts: SortValue[] = [
    "",
    "price-asc",
    "price-desc",
    "rating-asc",
    "rating-desc",
  ];
  const sort: SortValue = validSorts.includes(rawSort as SortValue)
    ? (rawSort as SortValue)
    : "";
  const [sortBy, order] = rawSort ? rawSort.split("-") : [undefined, undefined];
  useEffect(() => {
    if (debouncedInput.trim() !== searchInput.trim()) return;
    const next = debouncedInput.trim();
    if (next === searchText) return;
    setSearchParams((prev) => {
      const param = new URLSearchParams(prev);
      if (next) {
        param.set("q", next);
        param.delete("category");
      } else {
        param.delete("q");
      }
      return param;
    });
  }, [debouncedInput, searchText, searchInput, setSearchParams]);
  const handleCategoryChange = (slug: string) => {
    setSearchInput("");
    setSearchParams((prev) => {
      const param = new URLSearchParams(prev);
      if (slug) param.set("category", slug);
      else param.delete("category");
      param.delete("q");
      return param;
    });
  };
  const handleSortChange = (value: SortValue) => {
    setSearchParams((prev) => {
      const param = new URLSearchParams(prev);
      if (value) param.set("sort", value);
      else param.delete("sort");
      return param;
    });
  };
  const { products, loading, error, retry } = useProducts({
    search: searchText,
    category,
    sortBy,
    order,
  });
  const hasFilters = searchText !== "" || category !== "" || sort !== "";
  return (
    <div>
      <div className="sticky top-[60px] z-10 border-b border-gray-200 bg-gray-50/95 backdrop-blur">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              aria-label="Search products"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-8 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <CategoryFilter
              value={category}
              onCategoryChange={handleCategoryChange}
            />
            <SortSelect value={sort} onChange={handleSortChange} />
            {hasFilters && (
              <button
                onClick={() => {
                  setSearchInput("");
                  setSearchParams({});
                }}
                className="text-sm text-blue-600 underline-offset-2 hover:underline whitespace-nowrap"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>
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
