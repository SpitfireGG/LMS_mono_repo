"use client";

import Image, { type StaticImageData } from "next/image";
import { cn } from "@/app/lib/utils";
import person1 from "@/app/assets/team/person-1.jpg";
import person2 from "@/app/assets/team/person-2.jpg";
import person3 from "@/app/assets/team/person-3.jpg";

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const steps = [
  {
    number: "01",
    title: "Create your free account",
    caption: "Email, Google or a magic link — no card needed",
    icon: (
      <svg {...iconProps}>
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <path d="m10 17 5-5-5-5" />
        <path d="M15 12H3" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Tell us your goal",
    caption: "We map the right path, language and pace for you",
    icon: (
      <svg {...iconProps}>
        <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
        <path d="M1 14h6M9 8h6M17 16h6" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Pick your course",
    caption: "320+ programs, self-paced with live tutorials",
    icon: (
      <svg {...iconProps}>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v14H6.5A2.5 2.5 0 0 0 4 19.5Z" />
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v4H6.5A2.5 2.5 0 0 1 4 19.5Z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Sit the exam, pass it",
    caption: "Marked mock tests until you're exam-ready",
    icon: (
      <svg {...iconProps}>
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M14 7h7v7" />
      </svg>
    ),
  },
];

function Portrait({
  src,
  className,
}: {
  src: StaticImageData;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "absolute aspect-square overflow-hidden rounded-full ring-[6px] ring-white shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        sizes="(max-width: 1024px) 40vw, 260px"
        className="object-cover"
      />
    </span>
  );
}

export default function Process({ className }: { className?: string }) {
  return (
    <section
      className={cn("w-full", className)}
      aria-labelledby="process-heading"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-[minmax(0,1fr)_minmax(0,0.86fr)] items-center gap-[80px] px-[100px] max-xl:gap-[52px] max-xl:px-[60px] max-lg:grid-cols-1 max-lg:gap-[56px] max-sm:px-[30px]">
        {/* ── Steps ─────────────────────────────────────── */}
        <div>
          <h2
            id="process-heading"
            className="text-[clamp(2.2rem,4vw,3.4rem)]/[1.05] font-medium tracking-[-0.035em] text-[#0a4a29]"
          >
            How It Works
          </h2>

          <ol className="mt-[40px] flex flex-col gap-[18px]">
            {steps.map((step, i) => {
              const numberFirst = i % 2 === 0;
              return (
                <li
                  key={step.number}
                  className={cn(
                    "flex items-center gap-[20px] max-sm:gap-[12px]",
                    numberFirst ? "pr-[8%]" : "flex-row-reverse pl-[8%]",
                  )}
                >
                  <span
                    aria-hidden
                    className="shrink-0 text-[46px]/[1] font-medium tracking-[-0.05em] text-[#0a4a29]/15 max-sm:text-[34px]"
                  >
                    {step.number}
                  </span>

                  <div className="flex min-w-0 flex-1 items-center gap-[16px] rounded-full bg-[#f2f8f4] py-[14px] pl-[14px] pr-[26px] transition-colors duration-300 hover:bg-[#e8f6ee] max-sm:gap-[12px] max-sm:pr-[18px]">
                    <span
                      aria-hidden
                      className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full bg-white text-[#056839] shadow-[var(--shadow-soft)] max-sm:h-[40px] max-sm:w-[40px]"
                    >
                      {step.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[18px] font-medium leading-tight tracking-[-0.01em] text-[#0a4a29] max-sm:text-[16px]">
                        {step.title}
                      </span>
                      <span className="mt-[4px] block text-[14px] leading-snug text-[#566b5d] max-sm:text-[13px]">
                        {step.caption}
                      </span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ── Portrait cluster ──────────────────────────── */}
        <div
          className="relative mx-auto aspect-square w-full max-w-[520px] max-lg:max-w-[420px]"
          aria-hidden
        >
          <Portrait src={person1} className="right-[3%] top-0 w-[54%]" />
          <Portrait src={person2} className="bottom-[7%] left-0 w-[47%]" />
          <Portrait src={person3} className="bottom-0 right-0 w-[49%]" />
        </div>
      </div>
    </section>
  );
}
