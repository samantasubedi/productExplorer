import type { SortValue } from "../types/product";
import { FilterSelect } from "./filterSelect";

const OPTIONS: { value: SortValue; label: string }[] = [
  { value: "", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating: High to Low" },
  { value: "rating-asc", label: "Rating: Low to High" },
];

type Props = { value: SortValue; onChange: (v: SortValue) => void };

export const SortSelect = ({ value, onChange }: Props) => (
  <FilterSelect
    label="Sort by:"
    ariaLabel="Sort products"
    value={value}
    options={OPTIONS}
    onChange={(v) => onChange(v as SortValue)}
  />
);
