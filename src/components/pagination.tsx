export const CalculatePages = ({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [
      1,
      2,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }
  return [
    1,
    2,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

type Props = {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
};

export const Pagination = ({ page, totalPages, onChange }: Props) => {
  if (totalPages <= 1) return null;
  const pages = CalculatePages({ currentPage: page, totalPages });

  const base =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 " +
    "disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer";

  const idle =
    "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300";
  const active = "bg-blue-600 text-white shadow-sm ";

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-1.5 p-6"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
        className={`${base} ${idle} gap-1 pr-3.5`}
      >
        <span className="hidden sm:inline">Prev</span>
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`e${i}`}
            aria-hidden="true"
            className="inline-flex h-9 min-w-9 select-none items-center justify-center text-sm text-gray-400"
          >
            ...
          </span>
        ) : (
          <button
            type="button"
            key={p}
            aria-current={p === page ? "page" : undefined}
            aria-label={`Page ${p}`}
            onClick={() => onChange(p as number)}
            className={`${base} ${p === page ? active : idle}`}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
        className={`${base} ${idle} gap-1 pl-3.5`}
      >
        <span className="hidden sm:inline">Next</span>
      </button>
    </nav>
  );
};
