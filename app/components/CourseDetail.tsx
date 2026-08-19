"use client";

import Link from "next/link";
import { useCourseBySlug } from "@/app/lib/api/hooks";
import { tones, levelDot, formatStudents } from "@/app/lib/courses";
import { formatMoney } from "@/app/lib/payments";
import WishlistButton from "./WishlistButton";
import { StarIcon } from "./CourseCard";
import {
  GlyphInterpreting,
  GlyphTestPrep,
  GlyphLanguages,
  GlyphCoding,
  GlyphDesign,
  GlyphBusiness,
} from "./CategoryGlyphs";

const glyphMap = {
  interpreting: GlyphInterpreting,
  test: GlyphTestPrep,
  languages: GlyphLanguages,
  coding: GlyphCoding,
  design: GlyphDesign,
  business: GlyphBusiness,
} as const;

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-[#e6efe8] bg-white px-[18px] py-[14px]">
      <p className="text-[19px] font-medium text-[#0a4a29]">{value}</p>
      <p className="mt-[2px] text-[13.5px] text-[#566b5d]">{label}</p>
    </div>
  );
}

export default function CourseDetail({ slug }: { slug: string }) {
  const { data: course, isLoading, error } = useCourseBySlug(slug);

  if (isLoading) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
        <div className="grid grid-cols-[1fr_380px] gap-[36px] max-lg:grid-cols-1">
          <div className="h-[460px] animate-pulse rounded-[26px] bg-white/70" />
          <div className="h-[360px] animate-pulse rounded-[26px] bg-white/70" />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
        <div className="flex flex-col items-center justify-center rounded-[22px] border border-dashed border-[#cfe3d6] bg-white py-[80px] text-center">
          <p className="text-[18px] font-medium text-[#0a4a29]">We couldn&apos;t find that course</p>
          <p className="mt-[6px] text-[15px] text-[#566b5d]">
            It may have been renamed or unpublished.
          </p>
          <Link
            href="/courses"
            className="mt-[20px] rounded-[12px] bg-[#0a4a29] px-[20px] py-[11px] text-[14px] font-medium text-white no-underline transition-colors hover:bg-[#056839]"
          >
            Browse all courses
          </Link>
        </div>
      </div>
    );
  }

  const tone = tones[course.tone as keyof typeof tones] ?? tones.dark;
  const Glyph = glyphMap[course.glyph as keyof typeof glyphMap] ?? GlyphTestPrep;
  const saving =
    course.originalPrice && course.originalPrice > course.price
      ? course.originalPrice - course.price
      : 0;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
      <nav className="flex items-center gap-[8px] text-[14px] text-[#566b5d]" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#056839]">
          Home
        </Link>
        <span aria-hidden>/</span>
        <Link href="/courses" className="hover:text-[#056839]">
          Courses
        </Link>
        <span aria-hidden>/</span>
        <span className="font-medium text-[#0a4a29]">{course.title}</span>
      </nav>

      <div className="mt-[26px] grid grid-cols-[1fr_380px] items-start gap-[36px] max-lg:grid-cols-1">
        {/* ── Course ─────────────────────────────────────────── */}
        <div>
          <span className="chip text-[14px] text-[#0a4a29]">
            <span className="h-[7px] w-[7px] rounded-full bg-[#50bc7e]" />
            {course.tag}
          </span>

          <h1 className="mt-[16px] text-[clamp(2rem,4vw,3rem)]/[1.08] font-medium tracking-[-0.03em] text-[#0a4a29]">
            {course.title}
          </h1>

          <p className="mt-[14px] text-[16px] text-[#566b5d]">
            by <span className="font-medium text-[#056839]">{course.author}</span>
            <span className="mx-[10px] text-[#cfe3d6]">·</span>
            <span className="inline-flex items-center gap-[5px]">
              <StarIcon className="text-[#f5a623]" /> {course.rating}
            </span>
            <span className="mx-[10px] text-[#cfe3d6]">·</span>
            {formatStudents(course.students)} learners
          </p>

          <div
            className="relative mt-[26px] h-[300px] overflow-hidden rounded-[24px] max-sm:h-[220px]"
            style={{ backgroundColor: course.image ? "#0a4a29" : tone.bg }}
          >
            {course.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={course.image}
                alt={course.title}
                className="h-full w-full object-cover"
                decoding="async"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Glyph ink={tone.ink} accent={tone.accent} className="h-[200px] w-auto" />
              </div>
            )}
            <span
              className="absolute left-[18px] top-[18px] flex items-center gap-[6px] rounded-full bg-white px-[12px] py-[6px] text-[13px] font-medium text-[#0a4a29]"
            >
              <span className="h-[7px] w-[7px] rounded-full" style={{ background: levelDot[course.level] }} />
              {course.level}
            </span>
          </div>

          <div className="mt-[26px] grid grid-cols-4 gap-[14px] max-sm:grid-cols-2">
            <Stat label="Lessons" value={String(course.lessons)} />
            <Stat label="Hours of video" value={`${course.hours}h`} />
            <Stat label="Level" value={course.level} />
            <Stat label="Rating" value={`${course.rating} / 5`} />
          </div>

          {course.description && (
            <div className="mt-[30px]">
              <h2 className="text-[22px] font-medium text-[#0a4a29]">About this course</h2>
              <p className="text-pretty mt-[12px] text-[16.5px]/[1.6] text-[#566b5d]">
                {course.description}
              </p>
            </div>
          )}

          <div className="mt-[30px]">
            <h2 className="text-[22px] font-medium text-[#0a4a29]">What&apos;s included</h2>
            <ul className="mt-[14px] grid grid-cols-2 gap-[12px] max-sm:grid-cols-1">
              {[
                `${course.lessons} on-demand lessons`,
                `${course.hours} hours of tutorials`,
                "Lifetime access, on web and mobile",
                "Weekly live sessions with tutors",
                "Exam-accurate practice and mock tests",
                "Certificate of completion",
              ].map((item) => (
                <li key={item} className="flex items-start gap-[10px] text-[15.5px] text-[#3f4f45]">
                  <span className="mt-[2px] grid h-[20px] w-[20px] shrink-0 place-items-center rounded-full bg-[#e8f6ee] text-[#056839]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Purchase panel ─────────────────────────────────── */}
        <aside className="rounded-[22px] border border-[#dbe6dd] bg-white p-[26px] shadow-[var(--shadow-e2)] lg:sticky lg:top-[20px]">
          <div className="flex items-baseline gap-[8px]">
            <span className="text-[32px] font-medium text-[#0a4a29]">
              {formatMoney(course.price, "AUD")}
            </span>
            {saving > 0 && course.originalPrice && (
              <span className="text-[16px] line-through text-[#8a988e]">
                {formatMoney(course.originalPrice, "AUD")}
              </span>
            )}
          </div>
          {saving > 0 ? (
            <p className="mt-[6px] text-[14px] font-medium text-[#056839]">
              You save {formatMoney(saving, "AUD")} — limited time
            </p>
          ) : (
            <p className="mt-[6px] text-[14px] text-[#566b5d]">One payment, lifetime access</p>
          )}

          <Link
            href={`/checkout/${course.slug}`}
            className="mt-[20px] flex items-center justify-center gap-[8px] rounded-[14px] bg-[#0a4a29] px-[24px] py-[15px] text-[16px] font-medium text-white no-underline shadow-[var(--shadow-e2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#056839] hover:shadow-[var(--shadow-lift)]"
          >
            Checkout this course
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          <WishlistButton courseId={course.id} variant="full" className="mt-[12px] w-full" />

          <p className="mt-[16px] text-center text-[13px] text-[#8a988e]">
            Pay with Stripe, Payoneer or any credit / debit card
          </p>

          <ul className="mt-[20px] flex flex-col gap-[10px] border-t border-[#e6efe8] pt-[18px] text-[14px] text-[#566b5d]">
            <li className="flex items-center gap-[9px]">
              <span className="text-[#056839]">✓</span> 7-day money-back guarantee
            </li>
            <li className="flex items-center gap-[9px]">
              <span className="text-[#056839]">✓</span> Invoice emailed instantly
            </li>
            <li className="flex items-center gap-[9px]">
              <span className="text-[#056839]">✓</span> Learn at your own pace
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
