import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "../components/AnnouncementBar";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import FloatingWidgets from "../components/FloatingWidgets";
import Team from "../components/Team";

export const metadata: Metadata = {
  title: "About — NAATI Excellence Academy",
  description:
    "NAATI Excellence Academy is a Melbourne-based learning academy helping migrants and students pass NAATI CCL, PTE and IELTS and build careers in Australia.",
};

const stats = [
  { v: "12,000+", l: "Learners taught" },
  { v: "95%", l: "First-attempt pass rate" },
  { v: "40+", l: "Certified tutors" },
  { v: "4.9/5", l: "Average rating" },
];

function ValueIcon({ name }: { name: string }) {
  const p = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: "h-[22px] w-[22px]" };
  switch (name) {
    case "target": return (<svg {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" fill="currentColor" /></svg>);
    case "cap": return (<svg {...p}><path d="M22 10L12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" /></svg>);
    case "doc": return (<svg {...p}><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>);
    case "clock": return (<svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>);
    case "heart": return (<svg {...p}><path d="M20.8 5.6a5 5 0 00-7 0L12 7.3l-1.8-1.7a5 5 0 10-7 7L12 21l8.8-8.4a5 5 0 000-7Z" /></svg>);
    case "scale": return (<svg {...p}><path d="M12 3v18M6 7h12M6 7l-3 6a3 3 0 006 0L6 7Zm12 0l-3 6a3 3 0 006 0l-3-6Z" /></svg>);
    default: return null;
  }
}

const values = [
  { icon: "target", title: "Outcome-obsessed", body: "We measure ourselves by your result — the pass, the points, the job. Everything else is secondary." },
  { icon: "cap", title: "Taught by practitioners", body: "Our tutors are certified, working professionals who know exactly what the exam and the industry demand." },
  { icon: "doc", title: "Exam-accurate practice", body: "Mock tests and drills that mirror the real thing, so test day feels like just another practice run." },
  { icon: "clock", title: "Built around real life", body: "Self-paced lessons with lifetime access, plus live classes — so learning fits around work and family." },
  { icon: "heart", title: "Real human support", body: "Advisors and tutors who actually reply, and a community that keeps you moving when motivation dips." },
  { icon: "scale", title: "Fair & transparent", body: "Clear pricing, no lock-in, lifetime access, and a first course that's genuinely free." },
];

export default function AboutPage() {
  return (
    <>
      <AnnouncementBar />
      <div className="relative pt-[26px] max-sm:pt-[20px]">
        <NavigationBar />

        {/* ── Header ─────────────────────────────────────────── */}
        <header className="relative mt-[40px] overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: "radial-gradient(58% 120% at 82% -10%, rgba(80,188,126,0.16), transparent 60%)" }} />
          <div className="w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
            <nav className="flex items-center gap-[8px] text-[14px] text-[#566b5d]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#056839]">Home</Link>
              <span aria-hidden>/</span>
              <span className="font-medium text-[#0a4a29]">About</span>
            </nav>
            <div className="mt-[18px] max-w-[760px]">
              <span className="chip text-[14px] text-[#0a4a29]">
                <span className="h-[7px] w-[7px] rounded-full bg-[#50bc7e]" /> Melbourne, Australia · since 2018
              </span>
              <h1 className="mt-[18px] text-[clamp(2.5rem,5vw,3.9rem)]/[1.03] font-medium tracking-[-0.03em] text-[#0a4a29]">
                We help you turn study into a{" "}
                <span className="marker">life in Australia</span>.
              </h1>
              <p className="text-pretty mt-[20px] text-[19px]/[1.6] text-[#566b5d]">
                NAATI Excellence Academy started with a simple frustration: exam prep
                that was expensive, generic, and disconnected from what actually
                happens on test day. So we built the opposite.
              </p>
            </div>
          </div>
        </header>

        {/* ── Story + stats ──────────────────────────────────── */}
        <section className="mt-[64px] w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
          <div className="grid grid-cols-[1.15fr_0.85fr] gap-[48px] max-lg:grid-cols-1 items-start">
            <div className="flex flex-col gap-[18px] text-[17px]/[1.7] text-[#566b5d]">
              <h2 className="text-[26px] font-medium tracking-[-0.02em] text-[#0a4a29]">Our story</h2>
              <p>
                Founded in Melbourne in 2018, we began as a small group of certified
                NAATI interpreters tutoring friends and family through the CCL test.
                Word spread — because people passed.
              </p>
              <p>
                Today we&apos;re a full academy: NAATI CCL, PTE and IELTS, plus coding,
                design and business courses — all built on the same belief that great
                teaching should be outcome-driven, exam-accurate, and genuinely
                affordable. Over 12,000 learners later, that hasn&apos;t changed.
              </p>
              <p>
                We&apos;re proud to be part of so many migration stories — the five PR
                points, the first job, the career switch. That&apos;s the real curriculum.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[26px] border border-[#dbe6dd] bg-[#0a4a29] p-[36px] text-white shadow-[var(--shadow-e2)]">
              <div className="rings-ink pointer-events-none absolute inset-0 opacity-70" aria-hidden />
              <p className="relative text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8fe3b7]">By the numbers</p>
              <div className="relative mt-[22px] grid grid-cols-2 gap-x-[24px] gap-y-[28px]">
                {stats.map((s) => (
                  <div key={s.l}>
                    <p className="text-[38px]/[1] font-medium">{s.v}</p>
                    <p className="mt-[7px] text-[14px] text-white/70">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Values ─────────────────────────────────────────── */}
        <section className="mt-[100px] max-lg:mt-[72px] w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
          <div className="max-w-[620px]">
            <h2 className="text-[clamp(2rem,3.6vw,2.7rem)]/[1.1] font-medium tracking-[-0.02em] text-[#0a4a29]">
              What we <span className="underline-brand">stand for</span>
            </h2>
            <p className="mt-[14px] text-[17px]/[1.6] text-[#566b5d]">
              Six principles that shape every course, tutorial and reply.
            </p>
          </div>
          <div className="mt-[32px] grid grid-cols-3 gap-[22px] max-lg:grid-cols-2 max-sm:grid-cols-1">
            {values.map((v) => (
              <div key={v.title} className="lift rounded-[22px] border border-[#dbe6dd] bg-white p-[26px] shadow-[var(--shadow-e1)]">
                <span className="grid h-[46px] w-[46px] place-items-center rounded-[14px] bg-[#e8f6ee] text-[#056839]">
                  <ValueIcon name={v.icon} />
                </span>
                <h3 className="mt-[16px] text-[18px] font-semibold text-[#0a4a29]">{v.title}</h3>
                <p className="mt-[8px] text-[14.5px]/[1.6] text-[#566b5d]">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Team (reused) ──────────────────────────────────── */}
        <section className="mt-[100px] max-lg:mt-[72px]">
          <div className="w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
            <div className="max-w-[620px]">
              <h2 className="text-[clamp(2rem,3.6vw,2.7rem)]/[1.1] font-medium tracking-[-0.02em] text-[#0a4a29]">
                The people behind the pass
              </h2>
              <p className="mt-[14px] text-[17px]/[1.6] text-[#566b5d]">
                Certified, experienced, and genuinely invested in your result.
              </p>
            </div>
          </div>
          <Team className="mt-[36px]" />
        </section>

        {/* ── CTA ────────────────────────────────────────────── */}
        <section className="mt-[100px] max-lg:mt-[72px] w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
          <div className="relative overflow-hidden rounded-[32px] bg-[#0a4a29] px-[56px] py-[52px] max-sm:px-[30px] max-sm:py-[38px]">
            <div className="rings-ink pointer-events-none absolute inset-0 opacity-60" aria-hidden />
            <div className="relative flex items-center justify-between gap-[30px] max-md:flex-col max-md:items-start">
              <div className="max-w-[560px]">
                <h2 className="text-[clamp(1.8rem,3.4vw,2.5rem)]/[1.12] font-medium text-white">
                  Ready to write your own story?
                </h2>
                <p className="mt-[12px] text-[17px]/[1.6] text-white/75">
                  Your first course is on us. Join 12,000+ learners building a future
                  they&apos;re proud of.
                </p>
              </div>
              <div className="flex shrink-0 gap-[12px] max-sm:flex-col max-sm:w-full">
                <Link href="/signup" className="rounded-[16px] bg-[#50bc7e] px-[26px] py-[16px] text-center text-[16px] font-semibold text-[#0a4a29] no-underline transition-colors hover:bg-white">
                  Get started free
                </Link>
                <Link href="/courses" className="rounded-[16px] border border-white/25 px-[26px] py-[16px] text-center text-[16px] font-medium text-white no-underline transition-colors hover:bg-white/10">
                  Browse courses
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer className="mt-[120px] max-lg:mt-[90px] max-sm:mt-[60px]" />
        <FloatingWidgets />
      </div>
    </>
  );
}
