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
  const { data, isLoading } = useActiveAnnouncement();

  const deals = data && data.length > 0
    ? data.map((a) => ({ icon: "📢", text: a.text }))
    : defaultDeals;

  if (!open) return null;

  // Duplicated track for a seamless marquee loop.
  const track = [...deals, ...deals];

  return (
    <div className="relative z-40 w-full overflow-hidden bg-[#0a4a29] text-white">
      <div className="mx-auto flex max-w-[1600px] items-center gap-[16px] px-[20px] py-[9px]">
        <span className="hidden shrink-0 items-center gap-[7px] rounded-full bg-white/12 px-[12px] py-[3px] text-[12px] font-semibold uppercase tracking-[0.06em] text-[#9fe9c1] sm:flex">
          <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-[#50bc7e]" />
          Latest
        </span>

        {/* Marquee */}
        <div className="group relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]">
          <div className="animate-scroll-flags flex w-max items-center gap-[40px] group-hover:[animation-play-state:paused]">
            {track.map((d, i) => (
              <span key={i} className="flex shrink-0 items-center gap-[9px] text-[14px] text-white/90">
                <span aria-hidden>{d.icon}</span>
                <span>{d.text}</span>
                <span className="ml-[24px] text-[#50bc7e]" aria-hidden>•</span>
              </span>
            ))}
          </div>
        </div>

        {data && data.length > 0 && data[0].link && (
          <a href={data[0].link} className="hidden shrink-0 rounded-full bg-[#50bc7e] px-[15px] py-[5px] text-[13px] font-semibold text-[#0a4a29] no-underline transition-colors hover:bg-white md:inline-block">
            {data[0].linkText ?? "Grab the deal"}
          </a>
        )}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Dismiss announcement"
          className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/12 hover:text-white cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}