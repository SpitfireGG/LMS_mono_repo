"use client";

import { useState, useEffect } from "react";
import { useActiveAnnouncement } from "@/app/lib/api/hooks";

const defaultDeals = [
    { icon: "🎉", text: "New-year intake — 30% off all NAATI CCL courses" },
    { icon: "🔥", text: "Free consultation week: book a 1:1 with a certified tutor" },
    { icon: "✨", text: "New PTE 79+ batch starts Monday — seats filling fast" },
    { icon: "🎓", text: "Refer a friend and you both get $25 off" },
    { icon: "📣", text: 'Live webinar: "Pass CCL on your first try" — Sat 7:00 pm' },
  ];

export default function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  const [index, setIndex] = useState(0);
  const { data } = useActiveAnnouncement();

  const deals = data && data.length > 0 ? data.map((a) => ({ icon: "📢", text: a.text, link: a.link, linkText: a.linkText })) : defaultDeals.map((d) => ({ ...d, link: null, linkText: null }));
  const current = deals[index % deals.length];

  useEffect(() => {
    if (deals.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % deals.length), 4000);
    return () => clearInterval(id);
  }, [deals.length]);

  if (!open) return null;

  return (
    <div className="relative z-40 w-full overflow-hidden bg-[#0a4a29] text-white">
      <div className="mx-auto flex max-w-[1600px] items-center gap-[16px] px-[20px] py-[9px]">
        <span className="hidden shrink-0 items-center gap-[7px] rounded-full bg-white/12 px-[12px] py-[3px] text-[12px] font-semibold uppercase tracking-[0.06em] text-[#9fe9c1] sm:flex">
          <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-[#50bc7e]" />
          Latest
        </span>

        <div className="flex flex-1 items-center justify-center gap-[9px] overflow-hidden text-center">
          <span aria-hidden className="shrink-0">{current.icon}</span>
          <span key={index} className="animate-[fadeIn_0.4s_ease] truncate text-[14px] text-white/90">{current.text}</span>
          {deals.length > 1 && (
            <span className="hidden items-center gap-[6px] sm:flex">
              <span className="text-white/30">•</span>
              <span className="text-[11px] tabular-nums text-white/50">{index + 1}/{deals.length}</span>
            </span>
          )}
        </div>

        {current.link && (
          <a href={current.link} className="hidden shrink-0 rounded-full bg-[#50bc7e] px-[15px] py-[5px] text-[13px] font-semibold text-[#0a4a29] no-underline transition-colors hover:bg-white md:inline-block">
            {current.linkText ?? "Grab the deal"}
          </a>
        )}
        <button type="button" onClick={() => setOpen(false)} aria-label="Dismiss announcement" className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/12 hover:text-white cursor-pointer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
    </div>
  );
}