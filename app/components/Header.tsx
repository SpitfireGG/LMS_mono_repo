"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import Button from "./Button";
import Hero3D from "./Hero3D"; // This is the upgraded Hero3D we built earlier

import person1 from "@/app/assets/team/person-1.jpg";
import person2 from "@/app/assets/team/person-2.jpg";
import person3 from "@/app/assets/team/person-3.jpg";

const avatars = [person1, person2, person3];

// Framer Motion variants for a smooth, cascading reveal
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

function Stars() {
  return (
    <div className="flex items-center gap-0.5" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#f5a623">
          <path d="M12 2l2.9 6 6.6.6-5 4.4 1.5 6.4L12 16.9 5.9 19.4 7.4 13l-5-4.4 6.6-.6L12 2Z" />
        </svg>
      ))}
    </div>
  );
}

export default function Header({ className }: { className?: string }) {
  return (
    <main
      className={cn(
        "relative flex w-full max-w-[1440px] flex-col justify-center mx-auto px-6 sm:px-8 lg:px-16 xl:px-24 overflow-x-clip py-10",
        className,
      )}
    >
      {/* Subtle Ambient Background Gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-10%] right-[-5%] h-[800px] w-[800px] rounded-full opacity-40 mix-blend-multiply blur-3xl max-lg:hidden"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 60%)",
        }}
      />

      <div className="relative flex items-center justify-between gap-12 lg:gap-8 max-lg:flex-col max-lg:items-start">
        {/* ── Copy & Interactive Layer ─────────────────────────────────────────── */}
        <motion.div
          className="relative z-10 flex w-full max-w-[640px] flex-col items-start max-lg:max-w-none"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} className="flex flex-col gap-[18px]">
            <span className="inline-flex w-fit items-center gap-[8px] rounded-full border border-emerald-100 bg-emerald-50/80 px-[14px] py-[6px] text-[12px] font-semibold uppercase tracking-[0.08em] text-emerald-700 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              2026 Intake Open — 30% Off
            </span>
            <h1 className="text-balance text-[clamp(2.8rem,5.4vw,5rem)] font-medium leading-[0.9] tracking-[-0.045em] text-[#0f172a]">
              Master<br />NAATI CCL.
              <span className="relative mt-[4px] inline-block">
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">Claim your +5 PR points.</span>
                <span aria-hidden className="absolute -bottom-[6px] left-0 hidden h-[8px] w-full opacity-60 sm:block" style={{ background: "url(\"data:image/svg+xml,%3Csvg width='200' height='8' viewBox='0 0 200 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 5.5C35 1.5 85 0.5 130 2.5C155 3.5 180 6 199 5.5' stroke='%2310b981' stroke-width='1.6' stroke-linecap='round' stroke-opacity='0.35'/%3E%3C/svg%3E\") no-repeat center / 100% 100%" }} />
              </span>
            </h1>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-[480px] text-lg leading-relaxed text-zinc-500"
          >
            Bite-sized mock tests, verified tutors, and exam-accurate practice
            materials. Built to get you certified on your first attempt.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex items-center gap-4 w-full sm:w-auto flex-col sm:flex-row"
          >
            {/* Note: Adjust 'Button' props if your custom Button component expects different variants */}
            <Button
              variant="primary"
              href="/book"
              className="w-full sm:w-auto px-8 py-4 bg-[#1d1d1f] text-white hover:bg-zinc-800 transition-colors rounded-xl font-medium flex justify-center shadow-md"
            >
              Book a free consultation
            </Button>
            <Button
              variant="secondary"
              href="#courses"
              className="w-full sm:w-auto px-8 py-4 bg-white border border-zinc-200 text-[#1d1d1f] hover:bg-zinc-50 transition-colors rounded-xl font-medium flex justify-center"
            >
              Browse courses
            </Button>
          </motion.div>

          {/* Social proof stack */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex items-center gap-4 pt-6 border-t border-zinc-100 w-full sm:w-auto"
          >
            <div className="flex -space-x-3">
              {avatars.map((src, i) => (
                <span
                  key={i}
                  className="inline-block h-10 w-10 overflow-hidden rounded-full ring-2 ring-white shadow-sm"
                >
                  <Image
                    src={src}
                    alt="Student avatar"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </span>
              ))}
              <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-600 text-xs font-semibold text-white ring-2 ring-white shadow-sm">
                12k+
              </span>
            </div>
            <div className="flex flex-col">
              <Stars />
              <p className="mt-1 text-sm text-zinc-500">
                Rated{" "}
                <span className="font-semibold text-[#1d1d1f]">4.9/5</span> by
                PR applicants
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* ── 3D / Parallax Scene ─────────────────────────────────────── */}
        <motion.div
          className="relative shrink-0 max-lg:mx-auto max-lg:mt-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <Hero3D className="h-[520px] w-[520px] max-xl:h-[440px] max-xl:w-[440px] max-lg:h-[420px] max-lg:w-[420px] max-sm:h-[340px] max-sm:w-[330px]" />
        </motion.div>
      </div>
    </main>
  );
}
