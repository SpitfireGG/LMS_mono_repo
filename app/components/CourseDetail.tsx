"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import { useCourseBySlug, useCourses } from "@/app/lib/api/hooks";
import { tones, levelDot, formatStudents } from "@/app/lib/courses";
import { formatMoney } from "@/app/lib/payments";
import WishlistButton from "./WishlistButton";
import CourseCard, { StarIcon } from "./CourseCard";
import { cn } from "@/app/lib/utils";

const shell = "mx-auto w-full max-w-[1320px] px-[60px] max-sm:px-[20px]";
const h2 = "text-[clamp(1.7rem,2.8vw,2.3rem)]/[1.12] font-medium tracking-[-0.03em] text-[#0a4a29]";

const ico = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-[17px] w-[17px] shrink-0 text-[#056839]",
  "aria-hidden": true,
};

const outcomes = [
  "Interpret both directions with the accuracy the rubric rewards",
  "Hold long turns without losing names, numbers or qualifiers",
  "Take notes fast enough to keep up with a natural speaking pace",
  "Handle health, legal and social-service terminology with confidence",
  "Pace yourself against the real clock, segment by segment",
  "Walk in knowing exactly how the sitting is structured and scored",
];

const benefits = [
  { t: "Five PR points", b: "A pass adds five points to your skilled-migration score — often the difference that gets an invitation." },
  { t: "Practice that mirrors the exam", b: "Dialogues recorded to the real format, marked against the criteria the examiners actually use." },
  { t: "Study around your shifts", b: "Self-paced lessons with lifetime access, plus live tutorials when you want a person in the room." },
  { t: "Taught by certified interpreters", b: "Every tutor is NAATI-certified and working in the field, not reading from a textbook." },
  { t: "Marked feedback, not a score", b: "You get the why — which segment lost the mark and what to say instead." },
  { t: "A track record", b: "Thousands of candidates prepared, with a 95% first-attempt pass rate." },
];

function Spec({ label, value, path }: { label: string; value: string; path: React.ReactNode }) {
  return (
    <li className="flex items-start gap-[10px] text-[14.5px]/[1.5] text-[#566b5d]">
      <svg {...ico}>{path}</svg>
      <span>
        {label}: <span className="font-medium text-[#0a4a29]">{value}</span>
      </span>
    </li>
  );
}

export default function CourseDetail({ slug }: { slug: string }) {
  const { data: course, isLoading, error } = useCourseBySlug(slug);
  const { data: related } = useCourses(
    { category: course?.category, limit: 4 },
    { enabled: !!course?.category },
  );

  const [openModule, setOpenModule] = useState(0);

  /* Other published courses in the same category act as the alternative
     packages — each one is a real record, managed from the admin panel. */
  const packages = useMemo(
    () => (related?.data ?? []).filter((c) => c.slug !== slug).slice(0, 3),
    [related, slug],
  );

  const modules = useMemo(() => {
    if (!course) return [];
    const per = Math.max(1, Math.round(course.lessons / 4));
    return [
      { title: "Getting oriented", body: "How the sitting runs, how it is marked, and where candidates most often lose marks.", lessons: per },
      { title: "Core dialogues", body: "Worked recordings across health, legal and social-service settings, with model interpretations.", lessons: per },
      { title: "Vocabulary and terminology", body: "The domain glossaries that carry the most marks, drilled until they are automatic.", lessons: per },
      { title: "Full mock sittings", body: "Timed runs under exam conditions, each returned with segment-by-segment feedback.", lessons: course.lessons - per * 3 },
    ].filter((m) => m.lessons > 0);
  }, [course]);

  if (isLoading) {
    return (
      <div className={shell}>
        <div className="grid grid-cols-[minmax(0,1fr)_380px] gap-[40px] max-lg:grid-cols-1">
          <div className="h-[520px] animate-pulse rounded-[24px] bg-white" />
          <div className="h-[420px] animate-pulse rounded-[24px] bg-white" />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className={`${shell} py-[60px] text-center`}>
        <p className="text-[19px] font-medium text-[#0a4a29]">Course not found</p>
        <Link href="/courses" className="mt-[14px] inline-block text-[15px] font-medium text-[#056839]">
          Browse all courses
        </Link>
      </div>
    );
  }

  const tone = tones[course.tone] ?? tones.dark;
  const saving = course.originalPrice ? course.originalPrice - course.price : 0;
  const discount = course.originalPrice
    ? Math.round((saving / course.originalPrice) * 100)
    : 0;

  return (
    <div className={shell}>
      <Breadcrumbs items={[{ label: "Courses", href: "/courses" }, { label: course.title }]} />

      {/* ── Hero + purchase panel ───────────────────────── */}
      <div className="mt-[22px] grid grid-cols-[minmax(0,1fr)_380px] items-start gap-[48px] max-xl:gap-[32px] max-lg:grid-cols-1">
        <div>
          <div
            className="relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-[24px]"
            style={{ backgroundColor: course.image ? "#0a4a29" : tone.bg }}
          >
            {course.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
            ) : (
              <span aria-hidden className="rings absolute inset-0 opacity-50" />
            )}
            <span className="absolute bottom-[14px] right-[14px] inline-flex items-center gap-[7px] rounded-full bg-black/55 px-[12px] py-[6px] text-[13px] font-medium text-white backdrop-blur-[2px]">
              <StarIcon className="text-[#f5a623]" /> {course.rating}
              <span className="text-white/60">· {formatStudents(course.students)} learners</span>
            </span>
          </div>

          <p className="mt-[20px] text-[14.5px] text-[#8a988e]">
            A course by <span className="font-medium text-[#056839]">{course.author}</span>
          </p>
          <h1 className="mt-[8px] text-[clamp(2rem,3.6vw,2.9rem)]/[1.08] font-medium tracking-[-0.03em] text-[#0a4a29]">
            {course.title}
          </h1>

          <div className="mt-[16px] flex flex-wrap items-center gap-[8px] text-[13.5px]">
            <span className="rounded-full bg-[#e8f6ee] px-[12px] py-[5px] font-medium text-[#056839]">{course.tag}</span>
            <span className="inline-flex items-center gap-[7px] rounded-full bg-[#f2f8f4] px-[12px] py-[5px] text-[#566b5d]">
              <span className="h-[7px] w-[7px] rounded-full" style={{ background: levelDot[course.level] }} />
              {course.level}
            </span>
          </div>

          {course.description && (
            <p className="text-pretty mt-[20px] max-w-[640px] text-[16.5px]/[1.7] text-[#566b5d]">
              {course.description}
            </p>
          )}
        </div>

        {/* Purchase panel */}
        <aside className="rounded-[24px] border border-[#e4ece7] bg-white p-[26px] lg:sticky lg:top-[28px]">
          <div className="flex flex-wrap items-baseline gap-[10px]">
            <span className="text-[34px]/[1] font-medium tracking-[-0.03em] text-[#0a4a29]">
              {formatMoney(course.price, "AUD")}
            </span>
            {saving > 0 && course.originalPrice && (
              <>
                <span className="text-[17px] text-[#8a988e] line-through">
                  {formatMoney(course.originalPrice, "AUD")}
                </span>
                <span className="text-[14px] font-medium text-[#056839]">{discount}% off</span>
              </>
            )}
          </div>

          <div className="mt-[18px] grid grid-cols-2 overflow-hidden rounded-[14px] border border-[#e4ece7]">
            {[
              ["Lessons", String(course.lessons)],
              ["Difficulty", course.level],
            ].map(([l, v], i) => (
              <div key={l} className={cn("px-[16px] py-[12px]", i > 0 && "border-l border-[#e4ece7]")}>
                <p className="text-[11.5px] font-medium uppercase tracking-[0.07em] text-[#8a988e]">{l}</p>
                <p className="mt-[3px] text-[15px] font-medium text-[#0a4a29]">{v}</p>
              </div>
            ))}
          </div>

          <ul className="mt-[20px] flex flex-col gap-[11px]">
            <Spec label="Students" value={formatStudents(course.students)} path={<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>} />
            <Spec label="Duration" value={`${course.hours}h of video`} path={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>} />
            <Spec label="Access" value="Lifetime, on any device" path={<><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8" /></>} />
            <Spec label="Certificate" value="On completion" path={<><circle cx="12" cy="9" r="5" /><path d="m8.5 13.5-1 7 4.5-2.4 4.5 2.4-1-7" /></>} />
            <Spec label="Mock tests" value="Marked by a tutor" path={<><path d="M9 11l2 2 4-4" /><rect x="3" y="4" width="18" height="16" rx="2" /></>} />
          </ul>

          <Link
            href={`/checkout/${course.slug}`}
            className="mt-[22px] block w-full rounded-[14px] bg-[#0a4a29] px-[24px] py-[16px] text-center text-[16px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#056839]"
          >
            Enrol in this course
          </Link>
          <WishlistButton courseId={course.id} variant="full" className="mt-[10px] w-full" />
          <p className="mt-[12px] text-center text-[12.5px] text-[#8a988e]">
            7-day refund if it is not the right fit
          </p>

          <div className="mt-[22px] flex flex-col gap-[16px] border-t border-[#e4ece7] pt-[20px]">
            {[
              ["Time commitment", "Plan on 1–2 hours a day across lessons, drills and mock sittings."],
              ["Prerequisites", "Fluency in both languages. No interpreting experience assumed."],
              ["What you need", "A quiet room, headphones and a working microphone."],
            ].map(([t, b]) => (
              <div key={t}>
                <p className="text-[11.5px] font-medium uppercase tracking-[0.08em] text-[#8a988e]">{t}</p>
                <p className="text-pretty mt-[6px] text-[14px]/[1.55] text-[#566b5d]">{b}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* ── What you'll learn ───────────────────────────── */}
      <section className="mt-[90px] max-lg:mt-[64px]">
        <h2 className={h2}>What you&apos;ll learn</h2>
        <ul className="mt-[28px] grid grid-cols-2 gap-x-[40px] gap-y-[14px] rounded-[20px] border border-[#e4ece7] bg-white p-[28px] max-md:grid-cols-1 max-sm:p-[22px]">
          {outcomes.map((o) => (
            <li key={o} className="flex items-start gap-[11px] text-[15px]/[1.55] text-[#566b5d]">
              <svg {...ico}><path d="M20 6 9 17l-5-5" /></svg>
              {o}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Curriculum ──────────────────────────────────── */}
      <section className="mt-[80px] max-lg:mt-[60px]">
        <h2 className={h2}>Course contents</h2>
        <p className="mt-[12px] text-[16px] text-[#566b5d]">
          {course.lessons} lessons · {course.hours} hours of video
        </p>

        <div className="mt-[26px] flex flex-col gap-[10px]">
          {modules.map((m, i) => {
            const open = openModule === i;
            return (
              <div key={m.title} className={cn("overflow-hidden rounded-[16px] bg-[#f2f8f4] transition-colors", open && "bg-[#e8f6ee]")}>
                <button
                  type="button"
                  onClick={() => setOpenModule(open ? -1 : i)}
                  aria-expanded={open}
                  className="flex w-full cursor-pointer items-center gap-[16px] p-[18px] text-left"
                >
                  <span className={cn("grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full text-[13px] font-medium tabular-nums transition-colors", open ? "bg-[#0a4a29] text-[#9fe9c1]" : "bg-[#d7efe1] text-[#056839]")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16.5px] font-medium text-[#0a4a29]">{m.title}</span>
                    <span className="mt-[3px] block text-[13.5px] text-[#8a988e]">{m.lessons} lessons</span>
                  </span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("shrink-0 text-[#0a4a29] transition-transform duration-300", open && "rotate-90")}>
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </button>
                <div className={cn("grid transition-all duration-300 ease-[var(--ease-out-quint)]", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                  <div className="overflow-hidden">
                    <p className="text-pretty pb-[20px] pl-[68px] pr-[48px] text-[14.5px]/[1.6] text-[#566b5d] max-sm:pl-[54px] max-sm:pr-[20px]">
                      {m.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {packages.length > 0 && (
        <section className="mt-[90px] max-lg:mt-[64px]">
          <div className="flex flex-wrap items-end justify-between gap-[16px]">
            <h2 className={h2}>Other packages in this track</h2>
            <Link href={`/courses?category=${course.category}`} className="hidden items-center gap-[6px] text-[14px] font-medium text-[#056839] hover:text-[#0a4a29] sm:inline-flex">View all<span aria-hidden>→</span></Link>
          </div>
          <div className="mt-[28px] grid grid-cols-3 gap-[22px] max-lg:grid-cols-1">
            {packages.map((p) => (
              <CourseCard key={p.id} c={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── Why this package ────────────────────────────── */}
      <section className="mt-[80px] max-lg:mt-[60px]">
        <h2 className={h2}>Why candidates pick this course</h2>
        <div className="mt-[28px] grid grid-cols-3 gap-[20px] max-lg:grid-cols-2 max-sm:grid-cols-1">
          {benefits.map((b, i) => (
            <div key={b.t} className="rounded-[20px] border border-[#e4ece7] bg-white p-[24px]">
              <span aria-hidden className="text-[13px] font-medium tabular-nums text-[#b6c7bc]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-[10px] text-[17px] font-medium tracking-[-0.01em] text-[#0a4a29]">{b.t}</h3>
              <p className="text-pretty mt-[8px] text-[14.5px]/[1.6] text-[#566b5d]">{b.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mock tests + coaching ───────────────────────── */}
      <section className="mt-[80px] grid grid-cols-2 gap-[20px] max-lg:mt-[60px] max-md:grid-cols-1">
        {[
          {
            t: "Mock tests under exam conditions",
            b: "Timed dialogues recorded exactly as they run on the day, returned with segment-by-segment feedback rather than a bare score.",
            href: "/practice",
            cta: "Try a practice session",
            dark: true,
          },
          {
            t: "One-to-one coaching",
            b: "Targeted sessions on whatever is costing you marks — vocabulary gaps, pacing, or nerves — with a certified interpreter.",
            href: "/book",
            cta: "Book a session",
            dark: false,
          },
        ].map((p) => (
          <div
            key={p.t}
            className={cn(
              "relative overflow-hidden rounded-[24px] p-[32px] max-sm:p-[24px]",
              p.dark ? "bg-[#0a4a29]" : "border border-[#e4ece7] bg-white",
            )}
          >
            {p.dark && <span aria-hidden className="rings pointer-events-none absolute inset-0 opacity-40" />}
            <h3 className={cn("relative text-[21px]/[1.25] font-medium tracking-[-0.02em]", p.dark ? "text-white" : "text-[#0a4a29]")}>
              {p.t}
            </h3>
            <p className={cn("text-pretty relative mt-[12px] text-[15.5px]/[1.6]", p.dark ? "text-white/70" : "text-[#566b5d]")}>
              {p.b}
            </p>
            <Link
              href={p.href}
              className={cn(
                "relative mt-[22px] inline-flex items-center gap-[8px] rounded-[13px] px-[22px] py-[13px] text-[15px] font-medium transition-all duration-300 hover:-translate-y-0.5",
                p.dark ? "bg-white text-[#0a4a29] hover:bg-[#e8f6ee]" : "border border-[#0a4a29] text-[#0a4a29] hover:bg-[#e8f6ee]",
              )}
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
