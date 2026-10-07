function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="aspect-square w-full rounded-lg bg-gray-200" />
      <div className="mt-4 space-y-3">
        <div className="h-3 w-1/3 rounded bg-gray-200" />
        <div className="h-4 w-4/5 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-16 rounded bg-gray-200" />
          <div className="h-9 w-24 rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

interface ProductListSkeletonProps {
  count?: number;
}

export function ProductListSkeleton({ count = 12 }: ProductListSkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 animate-pulse"
      role="status"
      aria-busy="true"
    >
      <span className="sr-only">Loading products...</span>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div
      className="mx-auto max-w-6xl p-6 animate-pulse"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading product details...</span>
      <div className="mb-6 h-4 w-24 rounded bg-gray-200" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-square w-full rounded-xl bg-gray-200" />
          <div className="mt-4 flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 w-20 rounded-lg bg-gray-200" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-3 w-1/3 rounded bg-gray-200" />
          <div className="h-8 w-4/5 rounded bg-gray-200" />
          <div className="h-4 w-1/3 rounded bg-gray-200" />
          <div className="flex items-center gap-3 pt-2">
            <div className="h-8 w-24 rounded bg-gray-200" />
            <div className="h-6 w-16 rounded bg-gray-200" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-2/3 rounded bg-gray-200" />
          </div>
          <div className="flex gap-2 pt-2">
            <div className="h-6 w-20 rounded-full bg-gray-200" />
            <div className="h-6 w-16 rounded-full bg-gray-200" />
            <div className="h-6 w-16 rounded-full bg-gray-200" />
          </div>
          <div className="flex gap-3 pt-4">
            <div className="h-11 w-28 rounded-lg bg-gray-200" />
            <div className="h-11 flex-1 rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>
      <div className="mt-12 space-y-4">
        <div className="h-6 w-32 rounded bg-gray-200" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="space-y-2 rounded-xl border border-gray-200 p-4"
          >
            <div className="h-4 w-1/4 rounded bg-gray-200" />
            <div className="h-3 w-1/6 rounded bg-gray-200" />
            <div className="h-4 w-3/4 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
