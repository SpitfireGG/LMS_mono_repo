"use client";

import { useState } from "react";
import { cn } from "@/app/lib/utils";
import type { FAQItem as ApiFAQItem } from "@/app/lib/api/types";

type FAQItemProps = {
  faq: ApiFAQItem;
  className?: string;
};

export default function FAQItem({ faq, className }: FAQItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("group bg-white border border-[#cfe3d6] rounded-[20px] overflow-hidden transition-all", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-[16px] p-[20px] max-sm:p-[16px] text-left"
        aria-expanded={open}
      >
        <span className="font-medium text-[18px] text-[#0a4a29] pr-[40px]">
          {faq.question}
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#50bc7e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("shrink-0 transition-transform duration-200", open && "rotate-180")}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-out",
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="border-t border-[#e6efe8] px-[20px] max-sm:px-[16px] pb-[20px] pt-[8px] text-[#566b5d] text-[16px] leading-[1.6]">
          {faq.answer}
        </div>
      </div>
    </div>
  );
}