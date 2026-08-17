"use client";

import { useState } from "react";
import { cn } from "@/app/lib/utils";
import TestimonialCard from "./TestimonialCard";
import { useTestimonials } from "@/app/lib/api/hooks";

export default function Testimonials({ className }: { className?: string }) {
  const { data, isLoading, error } = useTestimonials({
    featured: true,
    limit: 3,
  });

  const testimonials = data?.data ?? [];

  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-3 gap-[24px] max-md:grid-cols-2 max-sm:grid-cols-1", className)}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white border border-[#cfe3d6] rounded-[20px] h-[280px] p-6" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-center py-12", className)}>
        <p className="text-[#566b5d]">Failed to load testimonials</p>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-3 gap-[24px] max-md:grid-cols-2 max-sm:grid-cols-1", className)}>
      {testimonials.map((t) => (
        <TestimonialCard key={t.id} t={t} />
      ))}
    </div>
  );
}