"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/app/lib/utils";
import { useMockTests, useMockTestFacets } from "@/app/lib/api/hooks";
import type { MockTestItem, MockTestKind } from "@/app/lib/api/types";

function formatTime(seconds?: number | null): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-[14px] py-[7px] text-[13.5px] font-medium transition-colors cursor-pointer",
        active
          ? "border-[#056839] bg-[#056839] text-white"
          : "border-[#e4ece7] bg-white text-[#0a4a29] hover:bg-[#e8f6ee]"
      )}
    >
      {children}
    </button>
  );
}

/** Stable per-session waveform — seeded by slug so SSR and client agree. */
function waveform(seed: string, n = 26) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return Array.from({ length: n }, () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    return 24 + ((h >>> 16) % 74);
  });
}

function SessionCard({ item }: { item: MockTestItem }) {
  const bars = waveform(item.slug);
  const isInterview = item.kind === "INTERVIEW";

  return (
    <Link
      href={`/practice/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-[20px] border border-[#e4ece7] bg-white no-underline shadow-[var(--shadow-soft)] transition-all duration-400 ease-[var(--ease-out-quint)] hover:-translate-y-1.5 hover:border-[#50bc7e] hover:shadow-[var(--shadow-soft-lift)]"
    >
      {/* Audio strip */}
      <div className="relative h-[112px] shrink-0 overflow-hidden bg-[#0a4a29] px-[18px]">
        <span aria-hidden className="rings pointer-events-none absolute inset-0 opacity-40" />

        <div aria-hidden className="relative flex h-full items-center gap-[3px]">
          {bars.map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-full transition-colors duration-500"
              style={{
                height: `${h * 0.62}%`,
                background:
                  i < bars.length / 2.6
                    ? "#50bc7e"
                    : "rgba(255,255,255,0.16)",
              }}
            />
          ))}
        </div>

        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 grid h-[46px] w-[46px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#0a4a29] shadow-[var(--shadow-soft)] transition-transform duration-400 ease-[var(--ease-out-quint)] group-hover:scale-110"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7L8 5Z" />
          </svg>
        </span>

        <span className="absolute left-[14px] top-[12px] rounded-full bg-white/12 px-[10px] py-[4px] text-[11.5px] font-semibold uppercase tracking-[0.06em] text-[#9fe9c1]">
          {isInterview ? "Interview" : "Mock test"}
        </span>

        {item.isFree && (
          <span className="absolute right-[14px] top-[12px] rounded-full bg-[#50bc7e] px-[10px] py-[4px] text-[11.5px] font-semibold uppercase tracking-[0.06em] text-[#06371f]">
            Free
          </span>
        )}

        <span className="absolute bottom-[12px] right-[14px] rounded-[7px] bg-black/55 px-[8px] py-[3px] text-[12px] font-medium tabular-nums text-white backdrop-blur-[2px]">
          {formatTime(item.durationSeconds)}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-[20px]">
        <div className="flex flex-wrap items-center gap-[7px]">
          <span className="rounded-full bg-[#e8f6ee] px-[10px] py-[3px] text-[12px] font-semibold text-[#056839]">
            {item.language}
          </span>
          <span className="rounded-full bg-[#f2f8f4] px-[10px] py-[3px] text-[12px] capitalize text-[#566b5d]">
            {item.category}
          </span>
        </div>

        <h3 className="mt-[12px] text-[17px]/[1.3] font-medium text-[#0a4a29] transition-colors group-hover:text-[#056839]">
          {item.title}
        </h3>

        {item.description && (
          <p className="mt-[7px] line-clamp-2 text-[14px]/[1.55] text-[#566b5d]">
            {item.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-[12px] border-t border-[#e4ece7] pt-[14px] text-[13px] text-[#566b5d]">
          <span className="inline-flex items-center gap-[6px]">
            {item.pdfUrl || item.pdfName ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
                  <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5Z" />
                  <path d="M14 3v5h5" />
                </svg>
                Script included
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3ZM5 11a7 7 0 0 0 14 0M12 18v3" />
                </svg>
                Audio only
              </>
            )}
          </span>

          <span className="inline-flex items-center gap-[6px] font-medium text-[#056839]">
            Start
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function PracticeCatalog() {
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState<string>();
  const [category, setCategory] = useState<string>();
  const [kind, setKind] = useState<MockTestKind>();

  const { data: facets } = useMockTestFacets();
  const { data, isLoading, error, refetch } = useMockTests({
    search: search || undefined,
    language,
    category,
    kind,
    limit: 24,
  });

  const items = data?.data ?? [];

  return (
    <div className="mx-auto w-full max-w-[1440px] px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
      {/* Filters */}
      <div className="flex flex-col gap-[14px]">
        <div className="relative max-w-[520px]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a988e" strokeWidth="2" strokeLinecap="round" className="absolute left-[16px] top-1/2 -translate-y-1/2" aria-hidden>
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search practice sessions…"
            aria-label="Search practice sessions"
            className="w-full rounded-[14px] border border-[#e4ece7] bg-white py-[12px] pl-[46px] pr-[14px] text-[15px] text-[#0a4a29] placeholder:text-[#8a988e] focus:border-[#50bc7e] focus:outline-none focus:ring-2 focus:ring-[#50bc7e]/30"
          />
        </div>

        <div className="flex flex-wrap gap-[8px]">
          <Pill active={!kind} onClick={() => setKind(undefined)}>All types</Pill>
          <Pill active={kind === "MOCK_TEST"} onClick={() => setKind("MOCK_TEST")}>Mock tests</Pill>
          <Pill active={kind === "INTERVIEW"} onClick={() => setKind("INTERVIEW")}>Interviews</Pill>
        </div>

        {facets && facets.languages.length > 0 && (
          <div className="flex flex-wrap gap-[8px]">
            <Pill active={!language} onClick={() => setLanguage(undefined)}>All languages</Pill>
            {facets.languages.map((l) => (
              <Pill key={l.value} active={language === l.value} onClick={() => setLanguage(l.value)}>
                {l.value} <span className="opacity-60">{l.count}</span>
              </Pill>
            ))}
          </div>
        )}

        {facets && facets.categories.length > 1 && (
          <div className="flex flex-wrap gap-[8px]">
            <Pill active={!category} onClick={() => setCategory(undefined)}>All topics</Pill>
            {facets.categories.map((c) => (
              <Pill key={c.value} active={category === c.value} onClick={() => setCategory(c.value)}>
                <span className="capitalize">{c.value}</span>
              </Pill>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mt-[28px]">
        {isLoading ? (
          <div className="grid grid-cols-3 gap-[20px] max-lg:grid-cols-2 max-md:grid-cols-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[300px] animate-pulse rounded-[20px] border border-[#e4ece7] bg-white" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[18px] border border-dashed border-[#ff6b6b] bg-white py-[60px] text-center">
            <p className="text-[17px] font-medium text-[#0a4a29]">Couldn&apos;t load practice sessions</p>
            <button type="button" onClick={() => refetch()}
              className="mt-[16px] rounded-[12px] bg-[#0a4a29] px-[18px] py-[10px] text-[14px] font-medium text-white cursor-pointer hover:bg-[#056839]">
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-[#e4ece7] bg-white py-[60px] text-center">
            <p className="text-[17px] font-medium text-[#0a4a29]">No sessions published yet</p>
            <p className="mt-[6px] text-[15px] text-[#566b5d]">
              Once an admin uploads a script and its audio, it appears here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-[20px] max-lg:grid-cols-2 max-md:grid-cols-1">
            {items.map((item) => (
              <SessionCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
