"use client";

import { cn } from "@/app/lib/utils";

function ArrowBtn({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous page" : "Next page"}
      className={cn(
        "grid h-[46px] w-[46px] place-items-center rounded-[14px] border transition-all duration-300",
        disabled
          ? "border-[#dbe6dd] text-[#b6c7ba] cursor-not-allowed"
          : dir === "next"
            ? "border-[#0a4a29] bg-[#0a4a29] text-white hover:bg-[#056839] cursor-pointer"
            : "border-[#cfe3d6] bg-white text-[#0a4a29] hover:bg-[#e8f6ee] cursor-pointer"
      )}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {dir === "prev" ? <path d="M19 12H5M12 19l-7-7 7-7" /> : <path d="M5 12h14M12 5l7 7-7 7" />}
      </svg>
    </button>
  );
}

export default function Pagination({
  page,
  pageCount,
  onChange,
  className,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  className?: string;
}) {
  if (pageCount <= 1) return null;

  return (
    <div className={cn("flex items-center justify-center gap-[24px]", className)}>
      <div className="flex items-center gap-[8px]">
        {Array.from({ length: pageCount }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            aria-label={`Page ${i + 1}`}
            aria-current={i === page}
            className={cn(
              "h-[8px] rounded-full transition-all duration-300 cursor-pointer",
              i === page ? "w-[28px] bg-[#0a4a29]" : "w-[8px] bg-[#cfe3d6] hover:bg-[#9ec7ac]"
            )}
          />
        ))}
      </div>
      <div className="flex items-center gap-[10px]">
        <ArrowBtn dir="prev" disabled={page === 0} onClick={() => onChange(Math.max(0, page - 1))} />
        <ArrowBtn dir="next" disabled={page >= pageCount - 1} onClick={() => onChange(Math.min(pageCount - 1, page + 1))} />
      </div>
    </div>
  );
}
