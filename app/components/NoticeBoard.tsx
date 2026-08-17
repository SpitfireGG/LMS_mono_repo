"use client";

import { useState } from "react";
import { cn } from "@/app/lib/utils";

type Notice = {
  tag: string;
  color: string;
  date: string;
  text: string;
};

const notices: Notice[] = [
  {
    tag: "Exam",
    color: "#056839",
    date: "24 Jul",
    text: "New NAATI CCL exam dates for March 2026 released — booking is now open.",
  },
  {
    tag: "Event",
    color: "#f5a623",
    date: "22 Jul",
    text: "Live webinar “Pass CCL on your first try” — this Saturday, 7:00 pm.",
  },
  {
    tag: "Tutors",
    color: "#50bc7e",
    date: "18 Jul",
    text: "Three new PTE specialist tutors have joined the faculty this week.",
  },
  {
    tag: "Scholarship",
    color: "#0a4a29",
    date: "15 Jul",
    text: "Merit scholarship applications are open until 15 February.",
  },
  {
    tag: "Notice",
    color: "#566b5d",
    date: "12 Jul",
    text: "Campus & office closed on 26 January for the public holiday.",
  },
];

export default function NoticeBoard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Panel */}
      <div
        role="dialog"
        aria-label="Notice board"
        aria-hidden={!open}
        className={cn(
          "fixed left-[90px] top-1/2 z-[70] w-[350px] max-w-[calc(100vw-112px)] origin-left",
          "rounded-[22px] border border-[#dbe6dd] bg-white shadow-[var(--shadow-lift)]",
          "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          open
            ? "pointer-events-auto -translate-y-1/2 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1/2 scale-95 opacity-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-[22px] bg-[#0a4a29] px-[20px] py-[16px]">
          <div className="flex items-center gap-[10px]">
            <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-white/12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/notice-icon.png" alt="" className="h-[18px] w-[18px] object-contain [filter:brightness(0)_invert(1)]" />
            </span>
            <div>
              <p className="text-[15px] font-semibold text-white">Notice Board</p>
              <p className="text-[12px] text-white/60">Announcements &amp; updates</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close notice board"
            className="grid h-[28px] w-[28px] place-items-center rounded-full text-white/70 transition-colors hover:bg-white/12 hover:text-white cursor-pointer"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* List */}
        <div className="max-h-[52vh] overflow-y-auto p-[10px]">
          {notices.map((n, i) => (
            <div
              key={i}
              className="flex gap-[12px] rounded-[14px] p-[12px] transition-colors hover:bg-[#f2f8f4]"
            >
              <span
                className="mt-[5px] h-[9px] w-[9px] shrink-0 rounded-full"
                style={{ background: n.color }}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-[8px]">
                  <span
                    className="rounded-[6px] px-[7px] py-[1px] text-[11px] font-semibold"
                    style={{ background: `${n.color}1f`, color: n.color }}
                  >
                    {n.tag}
                  </span>
                  <span className="text-[12px] text-[#8a988e]">{n.date}</span>
                </div>
                <p className="mt-[5px] text-[13.5px]/[1.5] text-[#3f4f45]">{n.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <a
          href="#blogs"
          className="block rounded-b-[22px] border-t border-[#e6efe8] py-[13px] text-center text-[14px] font-medium text-[#056839] no-underline transition-colors hover:bg-[#e8f6ee]"
        >
          View all announcements
        </a>
      </div>

      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close notice board" : "Open notice board"}
        aria-expanded={open}
        className={cn(
          "group fixed left-[22px] top-1/2 -translate-y-1/2 z-[70] grid h-[56px] w-[56px] place-items-center rounded-full",
          "border border-[#cfe3d6] bg-white shadow-[var(--shadow-lift)] transition-transform duration-300 hover:scale-105 cursor-pointer"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/notice-icon.png" alt="" className="h-[24px] w-[24px] object-contain" />
        <span className="absolute right-[9px] top-[9px] h-[11px] w-[11px] rounded-full bg-[#f5a623] ring-2 ring-white" />
      </button>
    </>
  );
}
