import {
  tones,
  levelDot,
  formatStudents,
} from "@/app/lib/courses";
import type { CourseItem as ApiCourseItem } from "@/app/lib/api/types";
import WishlistButton from "./WishlistButton";
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

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l2.9 6 6.6.6-5 4.4 1.5 6.4L12 16.9 5.9 19.4 7.4 13l-5-4.4 6.6-.6L12 2Z" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
      <path d="M4 5a2 2 0 012-2h6v16H6a2 2 0 00-2 2V5Z" strokeLinejoin="round" />
      <path d="M20 5a2 2 0 00-2-2h-6v16h6a2 2 0 012 2V5Z" strokeLinejoin="round" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

export { StarIcon };

export default function CourseCard({ c }: { c: ApiCourseItem }) {
  const tone = tones[c.tone as keyof typeof tones];
  const Glyph = glyphMap[c.glyph as keyof typeof glyphMap];
  const level = c.level;

  return (
    <article className="lift flex h-full flex-col overflow-hidden rounded-[24px] border border-[#dbe6dd] bg-white shadow-[var(--shadow-e2)]">
      {/* Cover — uploaded media if present, else brand illustration */}
      <div
        className="relative h-[172px] shrink-0 overflow-hidden"
        style={{ backgroundColor: c.image ? "#0a4a29" : tone.bg }}
      >
        {c.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.image} alt={c.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span
              className="pointer-events-none absolute -bottom-[16px] left-[14px] select-none text-[86px]/[1] font-medium tracking-[-0.04em] opacity-[0.13]"
              style={{ color: tone.ink }}
              aria-hidden
            >
              {c.tag.split(" ")[0]}
            </span>
            <Glyph ink={tone.ink} accent={tone.accent} className="h-[128px] w-auto" />
          </div>
        )}

        {/* rating — top left */}
        <span className="absolute left-[14px] top-[14px] z-10 flex items-center gap-[5px] rounded-full bg-white px-[10px] py-[5px] text-[13px] font-semibold text-[#0a4a29] shadow-[var(--shadow-e1)]">
          <StarIcon className="text-[#f5a623]" /> {c.rating}
        </span>
        {/* level — top right */}
        <span className="absolute right-[14px] top-[14px] z-10 flex items-center gap-[6px] rounded-full bg-white px-[10px] py-[5px] text-[12px] font-medium text-[#0a4a29] shadow-[var(--shadow-e1)]">
          <span className="h-[7px] w-[7px] rounded-full" style={{ background: levelDot[level] }} />
          {c.level}
        </span>
        {/* wishlist — bottom right, clear of the rating and level chips */}
        <WishlistButton courseId={c.id} className="absolute bottom-[14px] right-[14px] z-10" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-[12px] p-[22px] max-sm:p-[20px]">
        <div>
          <h3 className="text-pretty font-medium text-[18px]/[1.32] text-[#0a4a29]">
            {c.title}
          </h3>
          <p className="mt-[5px] text-[14px] text-[#566b5d]">
            by <span className="font-medium text-[#056839]">{c.author}</span>
          </p>
        </div>

        {/* Compact single-line meta */}
        <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[6px] text-[13.5px] text-[#566b5d]">
          <span className="inline-flex items-center gap-[6px] text-[#056839]">
            <BookIcon />
            <span className="text-[#566b5d]">{c.lessons} lessons</span>
          </span>
          <span className="inline-flex items-center gap-[6px] text-[#056839]">
            <ClockIcon />
            <span className="text-[#566b5d]">{c.hours}h</span>
          </span>
          <span className="inline-flex items-center gap-[6px] text-[#056839]">
            <UsersIcon />
            <span className="text-[#566b5d]">{formatStudents(c.students)}</span>
          </span>
        </div>

        {/* Price + enroll */}
        <div className="mt-auto flex items-center justify-between gap-[10px] border-t border-[#e6efe8] pt-[16px]">
          <div className="flex items-baseline gap-[3px]">
            {c.originalPrice && c.originalPrice > c.price ? (
              <>
                <span className="font-semibold text-[21px] text-[#0a4a29]">${c.price}</span>
                <span className="text-[13px] line-through text-[#8a988e]">${c.originalPrice}</span>
                <span className="text-[12px] text-[#056839] font-medium">
                  Save ${c.originalPrice - c.price}
                </span>
              </>
            ) : (
              <>
                <span className="font-semibold text-[21px] text-[#0a4a29]">${c.price}</span>
                <span className="text-[13px] text-[#566b5d]">/lifetime</span>
              </>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-[8px]">
            <a
              href={`/courses/${c.slug}`}
              className="rounded-[12px] border border-[#cfe3d6] px-[14px] py-[9px] font-medium text-[14px] text-[#0a4a29] no-underline transition-colors duration-300 hover:bg-[#e8f6ee]"
            >
              Details
            </a>
            <a
              href={`/checkout/${c.slug}`}
              className="rounded-[12px] bg-[#0a4a29] px-[17px] py-[9px] font-medium text-[14px] text-white no-underline transition-colors duration-300 hover:bg-[#056839]"
            >
              Enroll
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
