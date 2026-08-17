import { cn } from "@/app/lib/utils";
import Button from "./Button";

type CTAProps = {
  className?: string;
};

/* Orbit + orb + star composition — same motif language as the hero scene. */
function CtaDecoration({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)} aria-hidden>
      <svg viewBox="0 0 380 320" fill="none" className="h-auto w-full overflow-visible">
        <ellipse cx="190" cy="170" rx="170" ry="64" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.6" transform="rotate(-12 190 170)" />
        <ellipse cx="190" cy="172" rx="140" ry="50" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1.4" transform="rotate(-12 190 172)" />
        {/* big star */}
        <path
          d="M228 44c4.4 29 19.4 44 48.4 48.4-29 4.4-44 19.4-48.4 48.4-4.4-29-19.4-44-48.4-48.4 29-4.4 44-19.4 48.4-48.4Z"
          fill="#50bc7e"
        />
        {/* small white star */}
        <path
          d="M118 196c2.6 17.4 11.6 26.4 29 29-17.4 2.6-26.4 11.6-29 29-2.6-17.4-11.6-26.4-29-29 17.4-2.6 26.4-11.6 29-29Z"
          fill="#ffffff"
        />
      </svg>
      {/* glossy orbs riding the orbit */}
      <span className="orb-brand absolute left-[10%] top-[30%] block h-14 w-14 rounded-full" />
      <span className="orb-ink absolute bottom-[16%] right-[14%] block h-8 w-8 rounded-full border border-white/20" />
    </div>
  );
}

export default function CTA({ className }: CTAProps) {
  return (
    <div
      className={cn(
        "flex items-center px-[100px] max-xl:px-[60px] max-sm:px-[30px] py-0 relative w-full max-w-[1440px] mx-auto",
        className
      )}
    >
      <div className="bg-[#0a4a29] flex items-center justify-between px-[60px] max-xl:px-[40px] max-sm:px-[30px] py-0 gap-[10px] relative rounded-[45px] shrink-0 w-full my-[23px] overflow-hidden">
        <div className="flex flex-col gap-[24px] items-start relative shrink-0 flex-3 max-lg:flex-4 py-[52px] max-sm:py-[36px] z-10">
          <h3 className="font-medium leading-[1.15] relative shrink-0 text-[34px] max-sm:text-[28px] text-white max-w-[500px]">
            Ready to build a future you&apos;re{" "}
            <span className="marker font-medium">proud of?</span>
          </h3>
          <div className="hidden max-md:block w-full">
            <CtaDecoration className="mx-auto max-w-[280px]" />
          </div>
          <p className="text-pretty font-normal relative shrink-0 text-[17px]/[1.55] text-white/75 max-w-[460px]">
            Join 12,000+ learners growing their skills with NAATI EXCELLENCE
            ACADEMY. Your first course is on us — no card required.
          </p>
          <Button
            variant="tertiary"
            href="#courses"
            className="py-[19px] mb-[2px] max-sm:w-full justify-center font-medium"
          >
            Browse courses
          </Button>
        </div>
        <div className="flex-2 w-full max-w-[440px] flex items-center justify-center shrink-0 relative pr-[20px] max-md:hidden">
          <CtaDecoration className="w-full max-w-[380px]" />
        </div>
      </div>
    </div>
  );
}
