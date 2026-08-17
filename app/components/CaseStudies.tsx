"use client";

import { cn } from "@/app/lib/utils";
import LearnMoreLink from "./LearnMoreLink";
import { useCaseStudies } from "@/app/lib/api/hooks";
import type { CaseStudyItem as ApiCaseStudyItem } from "@/app/lib/api/types";

export default function CaseStudies({ className }: { className?: string }) {
  const { data, isLoading, error } = useCaseStudies({ limit: 3 });
  const caseStudies = data?.data ?? [];

  if (isLoading) {
    return (
      <div className={cn("flex flex-col items-start px-[100px] max-xl:px-[60px] max-sm:px-[30px] py-0 relative w-full max-w-[1440px] mx-auto", className)} data-name="Case studies block">
        <div className="bg-[#0a4a29] grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-x-[128px] max-xl:gap-x-[80px] max-lg:gap-x-[60px] gap-y-[80px] max-lg:gap-y-[60px] px-[60px] max-lg:px-[40px] pt-[70px] pb-[69px] max-lg:py-[40px] relative rounded-[45px] shrink-0 xl:ml-[3px] xl:mt-px flex-1" data-name="Case studies">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col gap-[18px] items-start relative shrink-0 flex-1 animate-pulse">
              <div className="h-[20px] w-[200px] bg-white/20 rounded" />
              <div className="h-[16px] w-[120px] bg-white/20 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || caseStudies.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-col items-start px-[100px] max-xl:px-[60px] max-sm:px-[30px] py-0 relative w-full max-w-[1440px] mx-auto", className)} data-name="Case studies block">
      <div className="bg-[#0a4a29] grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-x-[128px] max-xl:gap-x-[80px] max-lg:gap-x-[60px] gap-y-[80px] max-lg:gap-y-[60px] px-[60px] max-lg:px-[40px] pt-[70px] pb-[69px] max-lg:py-[40px] relative rounded-[45px] shrink-0 xl:ml-[3px] xl:mt-px flex-1" data-name="Case studies">
        {caseStudies.map((caseStudy, index) => {
          return (
            <div key={caseStudy.id} className={cn("flex flex-col gap-[18px] items-start relative shrink-0 flex-1", index % 2 === 0 && index === caseStudies.length - 1 && "max-lg:col-span-2 max-md:col-span-1")} data-name="Case study">
              {index > 0 && (
                <div className={cn("absolute -left-[64px] max-xl:-left-[40px] max-lg:-left-[30px] top-0 bottom-0 w-px h-full bg-white max-md:hidden", index % 2 === 0 && "max-lg:hidden")} aria-hidden="true" />
              )}
              {index > 0 && (
                <div className={cn("absolute -top-[40px] max-lg:-top-[30px] left-0 right-0 h-px w-full bg-white hidden max-md:block", index === caseStudies.length - 1 && "max-lg:block")} aria-hidden="true" />
              )}
              <p className={cn("font-normal relative shrink-0 text-[18px]/[normal] text-white max-w-[286px] whitespace-pre-wrap", index === caseStudies.length - 1 && "max-lg:max-w-none")}>
                {caseStudy.excerpt || caseStudy.content?.slice(0, 200) || caseStudy.title}
              </p>
              <LearnMoreLink variant="SimpleGreen" href={`/case-studies/${caseStudy.slug}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}