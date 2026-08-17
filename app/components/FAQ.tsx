"use client";

import { useState } from "react";
import { cn } from "@/app/lib/utils";
import FAQItem from "./FAQItem";
import { useFAQs } from "@/app/lib/api/hooks";

export default function FAQ({ className }: { className?: string }) {
  const { data, isLoading, error } = useFAQs({
    limit: 8,
  });

  const faqs = data?.data ?? [];

  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-[16px] max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]", className)}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white border border-[#cfe3d6] rounded-[20px] h-[80px]" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-center py-12", className)}>
        <p className="text-[#566b5d]">Failed to load FAQs</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-[16px] max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]", className)}>
      {faqs.map((faq) => (
        <FAQItem key={faq.id} faq={faq} />
      ))}
    </div>
  );
}