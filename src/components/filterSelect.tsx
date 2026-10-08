import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type FilterOption = { value: string; label: string };

type Props = {
  label: string;
  ariaLabel: string;
  value: string;
  options: FilterOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
};

export const FilterSelect = ({
  label,
  ariaLabel,
  value,
  options,
  disabled,
  onChange,
}: Props) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative w-full min-w-0 max-w-full sm:w-auto">
      <span className="mb-1 block text-sm text-gray-600">{label}</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm disabled:opacity-50 sm:w-auto sm:min-w-[160px] sm:max-w-[200px]"
      >
        <span className="min-w-0 flex-1 truncate">
          {selected?.label ?? "Select…"}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {options.map((o) => (
            <li
              key={o.value || "all"}
              role="option"
              aria-selected={o.value === value}
            >
              <button
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                  o.value === value
                    ? "font-medium text-blue-700"
                    : "text-gray-800"
                }`}
              >
                <span className="truncate">{o.label}</span>
                {o.value === value && <Check className="h-4 w-4 shrink-0" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
