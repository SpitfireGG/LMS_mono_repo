"use client";

import { useState, useMemo } from "react";
import { cn } from "@/app/lib/utils";
import CourseCard from "./CourseCard";
import Pagination from "./Pagination";
import { 
  categories, 
  levels, 
  type CourseCategory, 
  type Level,
} from "@/app/lib/courses";
import { useCourses, useInfiniteCourses } from "@/app/lib/api/hooks";

type PriceBucket = "any" | "lt200" | "200to300" | "gt300";
type SortKey = "popular" | "rating" | "price-asc" | "price-desc" | "students";

const priceBuckets: { key: PriceBucket; label: string }[] = [
  { key: "any", label: "Any price" },
  { key: "lt200", label: "Under $200" },
  { key: "200to300", label: "$200 – $300" },
  { key: "gt300", label: "Over $300" },
];

const ratingOptions: { key: number; label: string }[] = [
  { key: 0, label: "Any rating" },
  { key: 4.5, label: "4.5 & up" },
  { key: 4.7, label: "4.7 & up" },
  { key: 4.8, label: "4.8 & up" },
];

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Most popular" },
  { key: "rating", label: "Highest rated" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "students", label: "Most students" },
];

function CheckRow({
  checked,
  onToggle,
  label,
  count,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className="flex w-full items-center gap-[11px] py-[7px] text-left cursor-pointer group"
    >
      <span
        className={cn(
          "grid h-[20px] w-[20px] shrink-0 place-items-center rounded-[6px] border transition-colors",
          checked ? "border-[#056839] bg-[#056839]" : "border-[#cfe3d6] bg-white group-hover:border-[#9ec7ac]"
        )}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5L20 6" />
        </svg>
      </span>
      <span className="flex-1 text-[14.5px] text-[#3f4f45]">{label}</span>
      {typeof count === "number" && (
        <span className="text-[13px] text-[#8a988e]">{count}</span>
      )}
    </button>
  );
}

function RadioRow({
  checked,
  onSelect,
  label,
}: {
  checked: boolean;
  onSelect: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className="flex w-full items-center gap-[11px] py-[7px] text-left cursor-pointer group"
    >
      <span
        className={cn(
          "grid h-[20px] w-[20px] shrink-0 place-items-center rounded-full border transition-colors",
          checked ? "border-[#056839]" : "border-[#cfe3d6] group-hover:border-[#9ec7ac]"
        )}
      >
        <span className={cn("h-[10px] w-[10px] rounded-full transition-colors", checked ? "bg-[#056839]" : "bg-transparent")} />
      </span>
      <span className="text-[14.5px] text-[#3f4f45]">{label}</span>
    </button>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-[#e6efe8] py-[18px] first:border-t-0 first:pt-0">
      <p className="mb-[6px] text-[13px] font-semibold uppercase tracking-[0.06em] text-[#8a988e]">
        {title}
      </p>
      {children}
    </div>
  );
}

export default function CoursesCatalog() {
  const [query, setQuery] = useState("");
  const [cats, setCats] = useState<Set<CourseCategory>>(new Set());
  const [levs, setLevs] = useState<Set<Level>>(new Set());
  const [price, setPrice] = useState<PriceBucket>("any");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<SortKey>("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const catCounts = useMemo(() => {
    const m = new Map<CourseCategory, number>();
    for (const c of categories.filter(c => c.key !== "all")) {
      m.set(c.key as CourseCategory, 0);
    }
    return m;
  }, []);

  const toggleCat = (k: CourseCategory) =>
    setCats((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  const toggleLev = (k: Level) =>
    setLevs((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const activeCount =
    cats.size + levs.size + (price !== "any" ? 1 : 0) + (minRating > 0 ? 1 : 0) + (query ? 1 : 0);

  const clearAll = () => {
    setQuery("");
    setCats(new Set());
    setLevs(new Set());
    setPrice("any");
    setMinRating(0);
  };

  const params = useMemo(() => ({
    search: query || undefined,
    category: cats.size > 0 ? Array.from(cats)[0] : undefined,
    level: levs.size > 0 ? Array.from(levs)[0] : undefined,
    priceRange: price !== "any" ? price : undefined,
    minRating: minRating > 0 ? minRating : undefined,
    sort,
    page,
    limit: 8,
  }), [query, cats, levs, price, minRating, sort, page]);

  const { data, isLoading, error, refetch } = useCourses(params);

  const results = data?.data ?? [];
  const meta = data?.meta;
  const pageCount = meta?.totalPages ?? 1;
  const totalResults = meta?.total ?? 0;
  const safePage = data ? Math.min(page, Math.max(1, pageCount)) : 1;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const handleFilterChange = () => setPage(1);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
      <div className="grid grid-cols-[288px_1fr] gap-[36px] max-lg:grid-cols-1 max-lg:gap-[20px] items-start">
        {/* ── Sidebar filters ─────────────────────────────── */}
        <aside
          className={cn(
            "rounded-[22px] border border-[#dbe6dd] bg-white p-[24px] shadow-[var(--shadow-e1)]",
            "lg:sticky lg:top-[20px]",
            showFilters ? "block" : "hidden lg:block"
          )}
        >
          <div className="mb-[12px] flex items-center justify-between">
            <p className="text-[17px] font-semibold text-[#0a4a29]">Filters</p>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-[13px] font-medium text-[#056839] hover:underline cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          <FilterGroup title="Category">
            {categories
              .filter((c) => c.key !== "all")
              .map((c) => (
                <CheckRow
                  key={c.key}
                  checked={cats.has(c.key as CourseCategory)}
                  onToggle={() => {
                    toggleCat(c.key as CourseCategory);
                    handleFilterChange();
                  }}
                  label={c.label}
                  count={catCounts.get(c.key as CourseCategory) ?? 0}
                />
              ))}
          </FilterGroup>

          <FilterGroup title="Level">
            {levels.map((l) => (
              <CheckRow key={l} checked={levs.has(l)} onToggle={() => { toggleLev(l); handleFilterChange(); }} label={l} />
            ))}
          </FilterGroup>

          <FilterGroup title="Price">
            {priceBuckets.map((p) => (
              <RadioRow key={p.key} checked={price === p.key} onSelect={() => { setPrice(p.key); handleFilterChange(); }} label={p.label} />
            ))}
          </FilterGroup>

          <FilterGroup title="Rating">
            {ratingOptions.map((r) => (
              <RadioRow key={r.key} checked={minRating === r.key} onSelect={() => { setMinRating(r.key); handleFilterChange(); }} label={r.label} />
            ))}
          </FilterGroup>
        </aside>

        {/* ── Results ─────────────────────────────────────── */}
        <div>
          {/* Search + sort toolbar */}
          <div className="mb-[24px] flex flex-col gap-[16px]">
            <div className="relative">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a988e" strokeWidth="2" strokeLinecap="round" className="absolute left-[18px] top-1/2 -translate-y-1/2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                value={query}
                onChange={handleSearch}
                placeholder="Search courses, topics or tutors…"
                aria-label="Search courses"
                className="w-full rounded-[16px] border border-[#dbe6dd] bg-white py-[14px] pl-[48px] pr-[16px] text-[15px] text-[#0a4a29] placeholder:text-[#8a988e] shadow-[var(--shadow-e1)] focus:border-[#50bc7e] focus:outline-none focus:ring-2 focus:ring-[#50bc7e]/30"
              />
            </div>
            <div className="flex items-center justify-between gap-[12px]">
              <p className="text-[15px] text-[#566b5d]">
                <span className="font-semibold text-[#0a4a29]">{totalResults}</span>{" "}
                {totalResults === 1 ? "course" : "courses"}
              </p>
              <div className="flex items-center gap-[10px]">
                <button
                  type="button"
                  onClick={() => setShowFilters((v) => !v)}
                  className="flex items-center gap-[8px] rounded-[12px] border border-[#cfe3d6] bg-white px-[16px] py-[10px] text-[14px] font-medium text-[#0a4a29] lg:hidden cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 6h16M7 12h10M10 18h4" />
                  </svg>
                  Filters{activeCount > 0 ? ` (${activeCount})` : ""}
                </button>
                <label className="flex items-center gap-[8px] text-[14px] text-[#566b5d]">
                  <span className="max-sm:hidden">Sort</span>
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value as SortKey); handleFilterChange(); }}
                    aria-label="Sort courses"
                    className="rounded-[12px] border border-[#cfe3d6] bg-white px-[14px] py-[10px] text-[14px] font-medium text-[#0a4a29] focus:border-[#50bc7e] focus:outline-none cursor-pointer"
                  >
                    {sortOptions.map((o) => (
                      <option key={o.key} value={o.key}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>

          {/* Grid / empty state / loading */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-[24px] max-md:grid-cols-1">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white border border-[#cfe3d6] rounded-[26px] h-[380px]" />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center rounded-[22px] border border-dashed border-[#ff6b6b] bg-white py-[80px] text-center">
              <div className="grid h-[56px] w-[56px] place-items-center rounded-full bg-[#ffe8e8]">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </div>
              <p className="mt-[16px] text-[18px] font-medium text-[#0a4a29]">Failed to load courses</p>
              <p className="mt-[6px] text-[15px] text-[#566b5d]">Please try again or check your connection.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-[20px] rounded-[12px] bg-[#0a4a29] px-[20px] py-[11px] text-[14px] font-medium text-white transition-colors hover:bg-[#056839] cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-[24px] max-md:grid-cols-1">
                {results.map((c) => (
                  <CourseCard key={c.id} c={c} />
                ))}
              </div>
              <Pagination page={safePage} pageCount={pageCount} onChange={setPage} className="mt-[36px]" />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[22px] border border-dashed border-[#cfe3d6] bg-white py-[80px] text-center">
              <div className="grid h-[56px] w-[56px] place-items-center rounded-full bg-[#e8f6ee]">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#056839" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
              </div>
              <p className="mt-[16px] text-[18px] font-medium text-[#0a4a29]">No courses match your filters</p>
              <p className="mt-[6px] text-[15px] text-[#566b5d]">Try widening your search or clearing a filter.</p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-[20px] rounded-[12px] bg-[#0a4a29] px-[20px] py-[11px] text-[14px] font-medium text-white transition-colors hover:bg-[#056839] cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}