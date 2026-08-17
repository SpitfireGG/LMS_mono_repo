import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "../components/AnnouncementBar";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import FloatingWidgets from "../components/FloatingWidgets";
import CoursesCatalog from "../components/CoursesCatalog";

export const metadata: Metadata = {
  title: "Courses — NAATI Excellence Academy",
  description:
    "Browse every NAATI Excellence Academy course. Filter by category, level, price and rating to find your perfect program.",
};

export default function CoursesPage() {
  return (
    <>
      <AnnouncementBar />
      <div className="relative pt-[26px] max-sm:pt-[20px]">
        <NavigationBar />

        {/* Page header */}
        <header className="relative mt-[40px] overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(60% 120% at 80% -10%, rgba(80,188,126,0.16), transparent 60%)",
            }}
          />
          <div className="w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
            <nav className="flex items-center gap-[8px] text-[14px] text-[#566b5d]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#056839]">
                Home
              </Link>
              <span aria-hidden>/</span>
              <span className="font-medium text-[#0a4a29]">Courses</span>
            </nav>

            <div className="mt-[18px] flex items-end justify-between gap-[30px] max-md:flex-col max-md:items-start">
              <div className="max-w-[640px]">
                <span className="chip text-[14px] text-[#0a4a29]">
                  <span className="h-[7px] w-[7px] rounded-full bg-[#50bc7e]" />
                  320+ programs · certified tutors
                </span>
                <h1 className="mt-[18px] text-[clamp(2.4rem,5vw,3.6rem)]/[1.05] font-medium tracking-[-0.03em] text-[#0a4a29]">
                  Explore <span className="marker">all courses</span>
                </h1>
                <p className="text-pretty mt-[16px] text-[18px]/[1.55] text-[#566b5d]">
                  From NAATI CCL and English exams to coding, design and business —
                  filter by what you&apos;re chasing and start today.
                </p>
              </div>

              <div className="flex gap-[36px] max-sm:gap-[24px] shrink-0 max-md:mt-[6px]">
                {[
                  { v: "320+", l: "Courses" },
                  { v: "12k+", l: "Learners" },
                  { v: "4.9", l: "Avg rating" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="text-[30px]/[1.1] font-medium text-[#0a4a29]">{s.v}</p>
                    <p className="mt-[4px] text-[14px] text-[#566b5d]">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="mt-[44px] max-sm:mt-[32px]">
          <CoursesCatalog />
        </div>

        <Footer className="mt-[120px] max-lg:mt-[90px] max-sm:mt-[60px]" />
        <FloatingWidgets />
      </div>
    </>
  );
}
