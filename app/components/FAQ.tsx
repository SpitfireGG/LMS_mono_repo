"use client";

import { useState } from "react";
import { cn } from "@/app/lib/utils";
import FAQItem from "./FAQItem";
import { useFAQs } from "@/app/lib/api/hooks";

const fallbackFaqs = [
  { id: "fb-faq-1", slug: "do-i-need-prior-experience", locale: "en", question: "Do I need any prior experience before starting a course?", answer: "Not at all. Every program starts from the fundamentals and builds up, and each course page lists exactly what's assumed on day one.", category: "general", sortOrder: 0, status: "PUBLISHED" as const, publishedAt: new Date().toISOString(), contentUpdatedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null },
  { id: "fb-faq-2", slug: "are-classes-self-paced", locale: "en", question: "Are classes self-paced, or do I attend live sessions?", answer: "Both. Core lessons are self-paced with lifetime access, so you learn around work and family. Live tutorials and mock tests run every week.", category: "general", sortOrder: 1, status: "PUBLISHED" as const, publishedAt: new Date().toISOString(), contentUpdatedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null },
  { id: "fb-faq-3", slug: "how-long-course-access", locale: "en", question: "How long will I have access to the course materials?", answer: "Forever. Once you enroll you keep lifetime access to lessons, updates, and practice material.", category: "general", sortOrder: 2, status: "PUBLISHED" as const, publishedAt: new Date().toISOString(), contentUpdatedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null },
  { id: "fb-faq-4", slug: "certificates-recognised", locale: "en", question: "Are your certificates recognised for PR and career goals?", answer: "Our NAATI CCL and test-prep programs are built to the current official criteria, and our completion certificates are widely accepted by employers.", category: "general", sortOrder: 3, status: "PUBLISHED" as const, publishedAt: new Date().toISOString(), contentUpdatedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null },
  { id: "fb-faq-5", slug: "one-on-one-tutor-help", locale: "en", question: "Can I get one-on-one help from a tutor?", answer: "Yes. Every learner can book one-on-one sessions with certified tutors, and our community forum is monitored daily.", category: "general", sortOrder: 4, status: "PUBLISHED" as const, publishedAt: new Date().toISOString(), contentUpdatedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null },
  { id: "fb-faq-6", slug: "refund-policy", locale: "en", question: "What if a course turns out not to be right for me?", answer: "Your first course is on us, and if a paid program isn't the right fit within the first 7 days we'll refund it.", category: "general", sortOrder: 5, status: "PUBLISHED" as const, publishedAt: new Date().toISOString(), contentUpdatedAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null },
];

export default function FAQ({ className }: { className?: string }) {
  const { data, isLoading } = useFAQs({
    limit: 8,
  });

  const apiFaqs = data?.data ?? [];
  const faqs = apiFaqs.length > 0 ? apiFaqs : fallbackFaqs;

  if (isLoading && apiFaqs.length === 0) {
    return (
      <section className={cn("mx-auto w-full max-w-[1440px] px-[100px] max-xl:px-[60px] max-sm:px-[30px]", className)} aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="text-[clamp(2.2rem,4vw,3.4rem)]/[1.05] font-medium tracking-[-0.035em] text-[#0a4a29]"
      >
        Frequently Asked Questions
      </h2>

        <div className="mt-[40px] flex flex-col gap-[14px]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[78px] animate-pulse rounded-[20px] bg-[#f2f8f4]" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={cn("mx-auto w-full max-w-[1440px] px-[100px] max-xl:px-[60px] max-sm:px-[30px]", className)} aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="text-[clamp(2.2rem,4vw,3.4rem)]/[1.05] font-medium tracking-[-0.035em] text-[#0a4a29]"
      >
        Frequently Asked Questions
      </h2>

      <div className="mt-[40px] flex flex-col gap-[14px]">
        {faqs.map((faq, i) => (
          <FAQItem key={faq.id} faq={faq} index={i} />
        ))}
      </div>
    </section>
  );
}