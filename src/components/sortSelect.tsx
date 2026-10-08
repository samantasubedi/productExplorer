import type { SortValue } from "../types/product";

const OPTIONS: { value: SortValue; label: string }[] = [
  { value: "", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating: High to Low" },
  { value: "rating-asc", label: "Rating: Low to High" },
];

type Props = { value: SortValue; onChange: (v: SortValue) => void };

export const SortSelect = ({ value, onChange }: Props) => (
  <label className="flex items-center gap-2 text-sm">
    <span className="text-gray-600">Sort by:</span>
    <select
      aria-label="Sort products"
      value={value}
      onChange={(e) => onChange(e.target.value as SortValue)}
      className="rounded-lg border border-gray-300 bg-white px-3 py-2"
    >
      {OPTIONS.map(o => <option key={o.value || "default"} value={o.value}>{o.label}</option>)}
    </select>
  </label>
);
