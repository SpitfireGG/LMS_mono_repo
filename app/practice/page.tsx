import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "../components/AnnouncementBar";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import FloatingWidgets from "../components/FloatingWidgets";
import PracticeCatalog from "../components/PracticeCatalog";

export const metadata: Metadata = {
  title: "Practice sessions — NAATI Excellence Academy",
  description:
    "Mock tests and mock interviews with the script on screen and the dialogue playing — record your interpretation as you go.",
};

export default function PracticePage() {
  return (
    <>
      <AnnouncementBar />
      <div className="relative pt-[26px] max-sm:pt-[20px]">
        <NavigationBar />

        <header className="relative mt-[40px] overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(60% 120% at 80% -10%, rgba(80,188,126,0.16), transparent 60%)",
            }}
          />
          <div className="mx-auto w-full max-w-[1440px] px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
            <nav className="flex items-center gap-[8px] text-[14px] text-[#566b5d]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#056839]">Home</Link>
              <span aria-hidden>/</span>
              <span className="font-medium text-[#0a4a29]">Practice</span>
            </nav>

            <div className="mt-[18px] max-w-[680px]">
              <span className="chip text-[14px] text-[#0a4a29]">
                <span className="h-[7px] w-[7px] rounded-full bg-[#50bc7e]" />
                Script + audio, side by side
              </span>
              <h1 className="mt-[18px] text-[clamp(2.2rem,4.6vw,3.4rem)]/[1.06] font-medium tracking-[-0.03em] text-[#0a4a29]">
                Practice like it&apos;s <span className="marker">exam day</span>
              </h1>
              <p className="text-pretty mt-[16px] text-[18px]/[1.55] text-[#566b5d]">
                Every session pairs the written script with its recording. Press start and
                both run together, while your microphone captures your interpretation.
              </p>
            </div>
          </div>
        </header>

        <div className="mt-[36px]">
          <PracticeCatalog />
        </div>

        <Footer className="mt-[110px] max-lg:mt-[80px] max-sm:mt-[56px]" />
        <FloatingWidgets />
      </div>
    </>
  );
}
