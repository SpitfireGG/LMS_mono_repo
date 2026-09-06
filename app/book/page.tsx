import type { Metadata } from "next";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import AnnouncementBar from "../components/AnnouncementBar";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import FloatingWidgets from "../components/FloatingWidgets";
import BookingWidget from "../components/BookingWidget";

export const metadata: Metadata = {
  title: "Book a free consultation — NAATI Excellence Academy",
  description:
    "Book a free 20-minute consultation with a NAATI Excellence advisor. Pick your tutor, date and time (AEST).",
};

export default function BookPage() {
  return (
    <>
      <AnnouncementBar />
      <div className="relative pt-[26px] max-sm:pt-[20px]">
        <NavigationBar />
        <header className="relative mt-[40px]">
          <div className="w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
            <Breadcrumbs items={[{ label: "Book a consultation" }]} />
            <div className="mt-[18px] max-w-[680px]">
              <h1 className="text-[clamp(2.3rem,4.6vw,3.4rem)]/[1.05] font-medium tracking-[-0.03em] text-[#0a4a29]">
                Book your <span className="marker">free consultation</span>
              </h1>
              <p className="text-pretty mt-[16px] text-[18px]/[1.6] text-[#566b5d]">
                Pick a tutor and a time that suits you. We&apos;ll map your goal, timeline
                and the fastest route to your result — no obligation.
              </p>
            </div>
          </div>
        </header>

        <div className="mt-[36px] w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
          <BookingWidget />
        </div>

        <Footer className="mt-[110px] max-lg:mt-[80px] max-sm:mt-[56px]" />
        <FloatingWidgets />
      </div>
    </>
  );
}
