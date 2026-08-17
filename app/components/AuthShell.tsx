import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";
import AuthForm from "./AuthForm";
import person1 from "@/app/assets/team/person-1.jpg";

type Mode = "login" | "signup";

const copy: Record<
  Mode,
  { eyebrow: string; heading: React.ReactNode; benefits: string[] }
> = {
  login: {
    eyebrow: "Welcome back",
    heading: (
      <>
        Pick up right where you <span className="text-[#8fe3b7]">left off</span>.
      </>
    ),
    benefits: [
      "Resume your courses and keep your streak alive",
      "Jump into this week's live tutorials",
      "Track your progress toward your 5 PR points",
    ],
  },
  signup: {
    eyebrow: "Start for free",
    heading: (
      <>
        Learn what <span className="text-[#8fe3b7]">moves you</span> forward.
      </>
    ),
    benefits: [
      "Your first course is on us — no card required",
      "Certified tutors and exam-accurate practice",
      "Lifetime access, on web and mobile",
    ],
  },
};

export default function AuthShell({ mode }: { mode: Mode }) {
  const c = copy[mode];

  return (
    <div className="min-h-screen w-full bg-[#f7faf6] lg:grid lg:grid-cols-[1.02fr_1fr]">
      {/* ── Brand panel ─────────────────────────────────────── */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#0a4a29] to-[#04371f] p-[56px] text-white lg:flex lg:flex-col lg:justify-between">
        <div className="rings pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        {/* atmospheric glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[80px] -top-[80px] h-[420px] w-[420px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(80,188,126,0.35), transparent 70%)" }}
        />

        <Link href="/" className="relative flex items-center gap-[12px] no-underline">
          <Logo className="h-[46px] w-[54px] text-white" />
          <span className="text-[19px] font-medium text-white">NAATI EXCELLENCE</span>
        </Link>

        <div className="relative max-w-[440px]">
          <span className="inline-flex items-center gap-[8px] rounded-full bg-white/10 px-[14px] py-[6px] text-[13px] font-semibold uppercase tracking-[0.07em] text-[#8fe3b7]">
            <span className="h-[6px] w-[6px] rounded-full bg-[#50bc7e]" /> {c.eyebrow}
          </span>
          <h2 className="mt-[22px] text-[clamp(2rem,3vw,2.7rem)]/[1.12] font-medium tracking-[-0.02em]">
            {c.heading}
          </h2>
          <ul className="mt-[28px] flex flex-col gap-[14px]">
            {c.benefits.map((b) => (
              <li key={b} className="flex items-start gap-[12px] text-[15.5px]/[1.5] text-white/85">
                <span className="mt-[1px] grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-[#50bc7e]/20 text-[#8fe3b7]">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonial */}
        <div className="relative rounded-[20px] border border-white/12 bg-white/8 p-[22px] backdrop-blur-sm">
          <div className="flex gap-[2px] text-[#f5a623]" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6 6.6.6-5 4.4 1.5 6.4L12 16.9 5.9 19.4 7.4 13l-5-4.4 6.6-.6L12 2Z" /></svg>
            ))}
          </div>
          <p className="mt-[12px] text-[15px]/[1.6] text-white/90">
            “I passed NAATI CCL on my first attempt and got my 5 points. The mock
            tests felt exactly like the real thing.”
          </p>
          <div className="mt-[16px] flex items-center gap-[11px]">
            <span className="h-[38px] w-[38px] overflow-hidden rounded-full ring-2 ring-white/30">
              <Image src={person1} alt="" width={38} height={38} className="h-full w-full object-cover" />
            </span>
            <div>
              <p className="text-[14px] font-semibold text-white">Priya M.</p>
              <p className="text-[12.5px] text-white/60">NAATI CCL graduate · Melbourne</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Form side ───────────────────────────────────────── */}
      <main className="flex min-h-screen flex-col px-[48px] py-[32px] max-sm:px-[24px]">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-[10px] no-underline lg:hidden">
            <Logo className="h-[40px] w-[46px]" />
            <span className="text-[17px] font-medium text-[#0a4a29]">NAATI EXCELLENCE</span>
          </Link>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-[7px] rounded-full border border-[#cfe3d6] bg-white px-[16px] py-[8px] text-[14px] font-medium text-[#0a4a29] no-underline transition-colors hover:bg-[#e8f6ee]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back to site
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-[40px]">
          <div className="w-full max-w-[430px]">
            {/* AuthForm reads ?next= to return people to checkout after login. */}
            <Suspense fallback={<div className="h-[520px] animate-pulse rounded-[18px] bg-[#eef4ee]" />}>
              <AuthForm mode={mode} />
            </Suspense>
          </div>
        </div>

        <p className="text-center text-[13px] text-[#8a988e]">
          © 2026 NAATI Excellence Academy · Melbourne, Australia
        </p>
      </main>
    </div>
  );
}
