"use client";

import { cn } from "@/app/lib/utils";
import { useTestimonials } from "@/app/lib/api/hooks";
import type { TestimonialItem } from "@/app/lib/api/types";

type Quote = Pick<TestimonialItem, "id" | "quote" | "authorName" | "authorTitle">;

/** Shown while the CMS has nothing published — keeps the section from
    collapsing into an error state on a cold backend. */
const fallbackQuotes: Quote[] = [
  {
    id: "f1",
    quote:
      "I sat the Nepali CCL twice on my own and missed both times. Three weeks of marked practice here and I walked out with 84. The feedback on my recordings was the difference.",
    authorName: "Rajesh Karki",
    authorTitle: "Nepali CCL · Melbourne",
  },
  {
    id: "f2",
    quote:
      "The mock tests are the closest thing to the real sitting I have found. Same pace, same pressure. Nothing on exam day surprised me.",
    authorName: "Priya Sharma",
    authorTitle: "Hindi CCL · Sydney",
  },
  {
    id: "f3",
    quote:
      "My tutor went through every dialogue line by line and showed me exactly where I was losing marks. I stopped guessing and started fixing.",
    authorName: "Amina Hassan",
    authorTitle: "Arabic CCL · Perth",
  },
  {
    id: "f4",
    quote:
      "I work nights, so a fixed class was never going to happen. Being able to drill at 2am and still get my recordings marked is what got me those 5 points.",
    authorName: "Thao Nguyen",
    authorTitle: "Vietnamese CCL · Brisbane",
  },
  {
    id: "f5",
    quote:
      "Clear, honest and no upselling. They told me which course I actually needed instead of the most expensive one.",
    authorName: "Jin-woo Park",
    authorTitle: "Korean CCL · Adelaide",
  },
  {
    id: "f6",
    quote:
      "The vocabulary lists for healthcare and legal terms were worth the fee on their own. Both showed up in my exam.",
    authorName: "Wei Chen",
    authorTitle: "Mandarin CCL · Canberra",
  },
];

const avatarTints = [
  "bg-[#0a4a29] text-[#9fe9c1]",
  "bg-[#056839] text-[#c7f0d8]",
  "bg-[#e8f6ee] text-[#056839]",
  "bg-[#d7efe1] text-[#0a4a29]",
];

function initials(name: string) {
  return name
    .split(/[\s-]+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function QuoteCard({
  q,
  index,
  featured,
}: {
  q: Quote;
  index: number;
  featured?: boolean;
}) {
  return (
    <figure
      className={cn(
        "mb-[20px] break-inside-avoid p-[24px] max-sm:mb-[16px] max-sm:p-[20px]",
        featured
          ? "offset-card offset-card-ink bg-[#0a4a29]"
          : "card-clean card-clean-hover",
      )}
    >
      <figcaption className="flex items-start justify-between gap-[12px]">
        <div className="flex items-center gap-[12px]">
          <span
            aria-hidden
            className={cn(
              "grid h-[40px] w-[40px] shrink-0 place-items-center rounded-full text-[14px] font-medium tracking-[0.02em]",
              featured
                ? "bg-white/12 text-[#9fe9c1]"
                : avatarTints[index % avatarTints.length],
            )}
          >
            {initials(q.authorName)}
          </span>
          <div className="min-w-0">
            <p
              className={cn(
                "text-[15px] font-medium leading-tight",
                featured ? "text-white" : "text-[#0a4a29]",
              )}
            >
              {q.authorName}
            </p>
            <p
              className={cn(
                "mt-[3px] text-[13px] leading-tight",
                featured ? "text-white/55" : "text-[#8a988e]",
              )}
            >
              {q.authorTitle}
            </p>
          </div>
        </div>

        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={cn(
            "mt-[2px] shrink-0",
            featured ? "text-[#50bc7e]" : "text-[#cfe6d8]",
          )}
          aria-hidden
        >
          <path d="M9.4 5.5C6.3 7 4.5 9.9 4.5 13.4c0 3.1 1.8 5.1 4.2 5.1 2.1 0 3.7-1.6 3.7-3.6 0-2-1.4-3.5-3.3-3.5-.4 0-.8.1-1 .2.4-1.6 1.9-3 3.6-3.8l-2.3-2.3Zm9.1 0C15.4 7 13.6 9.9 13.6 13.4c0 3.1 1.8 5.1 4.2 5.1 2.1 0 3.7-1.6 3.7-3.6 0-2-1.4-3.5-3.3-3.5-.4 0-.8.1-1 .2.4-1.6 1.9-3 3.6-3.8l-2.3-2.3Z" />
        </svg>
      </figcaption>

      <blockquote
        className={cn(
          "text-pretty mt-[16px] text-[15px]/[1.65]",
          featured ? "text-white/85" : "text-[#4a5c51]",
        )}
      >
        {q.quote}
      </blockquote>
    </figure>
  );
}

export default function Testimonials({ className }: { className?: string }) {
  const { data, isLoading } = useTestimonials({ featured: true, limit: 6 });

  const published = data?.data ?? [];
  const quotes: Quote[] = published.length > 0 ? published : fallbackQuotes;

  return (
    <section
      className={cn(
        "soft-canvas w-full py-[110px] max-lg:py-[80px] max-sm:py-[60px]",
        className,
      )}
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-[1440px] px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
        <div className="mx-auto mb-[56px] flex max-w-[720px] flex-col items-center text-center max-lg:mb-[44px] max-sm:mb-[32px]">
          <h2
            id="testimonials-heading"
            className="text-[clamp(2rem,3.6vw,3rem)]/[1.08] font-medium tracking-[-0.03em] text-[#0a4a29]"
          >
            Public cheers for us
          </h2>
          <p className="text-pretty mt-[16px] text-[17px]/[1.6] text-[#566b5d] max-sm:text-[16px]">
            What learners say after they walk out of the exam room.
          </p>
        </div>

        {isLoading && published.length === 0 ? (
          <div className="columns-3 gap-[20px] max-lg:columns-2 max-sm:columns-1 max-sm:gap-[16px]">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="card-clean mb-[20px] h-[190px] animate-pulse break-inside-avoid"
              />
            ))}
          </div>
        ) : (
          <div className="columns-3 gap-[20px] max-lg:columns-2 max-sm:columns-1 max-sm:gap-[16px]">
            {quotes.map((q, i) => (
              <QuoteCard key={q.id} q={q} index={i} featured={i === 0} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
