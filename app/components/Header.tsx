import Image from "next/image";
import { cn } from "../lib/utils";
import Button from "./Button";
import Hero3D from "./Hero3D";
import person1 from "@/app/assets/team/person-1.jpg";
import person2 from "@/app/assets/team/person-2.jpg";
import person3 from "@/app/assets/team/person-3.jpg";

const stats = [
  { value: "4.9/5", label: "Learner rating" },
  { value: "12,000+", label: "Students enrolled" },
  { value: "320+", label: "Courses available" },
  { value: "95%", label: "First-attempt pass rate" },
];

const avatars = [person1, person2, person3];

function Stars() {
  return (
    <div className="flex items-center gap-[2px]" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="#f5a623">
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
        "relative w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px] overflow-x-clip",
        className,
      )}
    >
      {/* Ambient brand glow behind the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[120px] right-[-60px] h-[620px] w-[620px] rounded-full opacity-70 max-lg:hidden"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(80,188,126,0.28), rgba(80,188,126,0.05) 55%, transparent 72%)",
        }}
      />

      <div className="relative flex items-center justify-between gap-[40px] max-lg:flex-col max-lg:items-start">
        {/* ── Copy ─────────────────────────────────────────── */}
        <div className="relative z-10 flex max-w-[640px] flex-col items-start max-lg:max-w-none">
          <span className="rise-in rise-in-1 chip text-[14px] text-[#0a4a29]">
            <span className="h-[7px] w-[7px] rounded-full bg-[#50bc7e]" />
            NAATI CCL · PTE · IELTS · Tech · Business
          </span>

          <h1 className="rise-in rise-in-2 mt-[24px] text-[clamp(2.9rem,6.2vw,5.2rem)]/[1.03] font-medium tracking-[-0.03em] text-[#0a4a29]">
            Learn what <span className="marker">moves you</span> forward.
          </h1>

          <p className="rise-in rise-in-3 text-pretty mt-[28px] max-w-[480px] text-[19px]/[1.55] max-xl:text-[17px]/[1.55] text-[#566b5d]">
            Bite-sized courses, certified tutors, and exam-accurate practice —
            from your first lesson to your five PR points, built to fit around
            real life.
          </p>

          <div className="rise-in rise-in-4 mt-[36px] flex items-center gap-[16px] max-sm:w-full max-sm:flex-col">
            <Button
              variant="tertiary"
              href="/book"
              className="py-[18px] max-sm:w-full justify-center"
            >
              Book a free consultation
            </Button>
            <Button
              variant="secondary"
              href="#courses"
              className="py-[18px] max-sm:w-full justify-center"
            >
              Browse courses
            </Button>
          </div>

          {/* Social proof — avatar stack + rating */}
          <div className="rise-in rise-in-5 mt-[32px] flex items-center gap-[16px]">
            <div className="flex -space-x-3">
              {avatars.map((src, i) => (
                <span
                  key={i}
                  className="inline-block h-[42px] w-[42px] overflow-hidden rounded-full ring-2 ring-white shadow-[var(--shadow-e1)]"
                >
                  <Image
                    src={src}
                    alt=""
                    width={42}
                    height={42}
                    className="h-full w-full object-cover"
                  />
                </span>
              ))}
              <span className="grid h-[42px] w-[42px] place-items-center rounded-full bg-[#0a4a29] text-[12px] font-semibold text-white ring-2 ring-white">
                12k+
              </span>
            </div>
            <div className="flex flex-col">
              <Stars />
              <p className="mt-[3px] text-[13.5px] text-[#566b5d]">
                Rated{" "}
                <span className="font-semibold text-[#0a4a29]">4.9/5</span> by
                learners worldwide
              </p>
            </div>
          </div>

          {/* Stats — hairline-ruled editorial row */}
          <div className="rise-in rise-in-5 mt-[44px] max-xl:mt-[36px] w-full border-t border-[#dbe6dd] pt-[26px]">
            <div className="flex items-start gap-[48px] max-xl:gap-[32px] max-md:grid max-md:grid-cols-2 max-md:gap-[24px]">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <p className="text-[30px]/[1.1] max-xl:text-[26px]/[1.1] font-medium text-[#0a4a29]">
                    {s.value}
                  </p>
                  <p className="mt-[6px] text-[14.5px] text-[#566b5d]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 3D scene ─────────────────────────────────────── */}
        <div className="scene-in relative shrink-0 max-lg:mx-auto max-lg:mt-[10px]">
          <Hero3D className="h-[520px] w-[520px] max-xl:h-[440px] max-xl:w-[440px] max-lg:h-[420px] max-lg:w-[420px] max-sm:h-[340px] max-sm:w-[330px]" />
        </div>
      </div>
    </main>
  );
}
