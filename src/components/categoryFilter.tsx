import { useCategory } from "../hooks/productHooks";

type Props = {
  value: string;
  onCategoryChange: (slug: string) => void;
};

export const CategoryFilter = ({ value, onCategoryChange }: Props) => {
  const { categories, loading, error, retry } = useCategory();

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <span>Failed to load categories</span>
        <button onClick={retry} className="underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-gray-600">Category:</span>
      <select
        aria-label="Filter by category"
        value={value}
        disabled={loading}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 disabled:opacity-50"
      >
        <option value="">{loading ? "Loading…" : "All categories"}</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
    </label>
  );
};
