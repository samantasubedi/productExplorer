import { useCategory } from "../hooks/productHooks";
import { FilterSelect } from "./filterSelect";

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
    <FilterSelect
      label="Category:"
      ariaLabel="Filter by category"
      value={value}
      disabled={loading}
      options={[
        { value: "", label: loading ? "Loading…" : "All categories" },
        ...categories.map((c) => ({ value: c.slug, label: c.name })),
      ]}
      onChange={onCategoryChange}
    />
  );
};
