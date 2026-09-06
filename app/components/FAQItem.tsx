"use client";

import { useState } from "react";
import { cn } from "@/app/lib/utils";
import type { FAQItem as ApiFAQItem } from "@/app/lib/api/types";

type FAQItemProps = {
  faq: ApiFAQItem;
  index: number;
  className?: string;
};

export default function FAQItem({ faq, index, className }: FAQItemProps) {
  const [open, setOpen] = useState(false);
  const panelId = `faq-panel-${faq.id}`;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[20px] bg-[#f2f8f4] transition-colors duration-300",
        open && "bg-[#e8f6ee]",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center gap-[18px] p-[20px] text-left max-sm:gap-[13px] max-sm:p-[16px]"
      >
        <span
          aria-hidden
          className={cn(
            "grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full text-[14px] font-medium tabular-nums transition-colors duration-300 max-sm:h-[32px] max-sm:w-[32px] max-sm:text-[13px]",
            open
              ? "bg-[#0a4a29] text-[#9fe9c1]"
              : "bg-[#d7efe1] text-[#056839]",
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="min-w-0 flex-1 text-[17.5px]/[1.35] font-medium text-[#0a4a29] max-sm:text-[15.5px]">
          {faq.question}
        </span>

        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={cn(
            "shrink-0 text-[#0a4a29] transition-transform duration-300 ease-[var(--ease-out-quint)]",
            open && "rotate-90",
          )}
        >
          <path d="m9 6 6 6-6 6" />
        </svg>
      </button>

      <div
        id={panelId}
        className={cn(
          "grid transition-all duration-300 ease-[var(--ease-out-quint)]",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <p className="text-pretty pb-[22px] pl-[76px] pr-[56px] text-[15.5px]/[1.65] text-[#566b5d] max-sm:pl-[61px] max-sm:pr-[20px]">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}
