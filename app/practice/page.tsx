import type { Metadata } from "next";
import Breadcrumbs from "@/app/components/Breadcrumbs";
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
            <Breadcrumbs items={[{ label: "Practice" }]} />

            <div className="mt-[26px] grid grid-cols-[minmax(0,1fr)_minmax(0,0.78fr)] items-center gap-[64px] max-xl:gap-[44px] max-lg:grid-cols-1 max-lg:gap-[40px]">
              <div>
                <h1 className="text-[clamp(2.2rem,4.6vw,3.4rem)]/[1.06] font-medium tracking-[-0.03em] text-[#0a4a29]">
                  Practice like it&apos;s <span className="marker">exam day</span>
                </h1>
                <p className="text-pretty mt-[18px] max-w-[520px] text-[18px]/[1.55] text-[#566b5d]">
                  Script on screen, dialogue playing, microphone live. Same pace,
                  same pressure, same marking rubric — so nothing on the day is new.
                </p>

                <ul className="mt-[26px] flex flex-wrap gap-[9px]">
                  {[
                    ["Timed segments", "M12 7v5l3.5 2"],
                    ["Recorded answers", "M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Z"],
                    ["Official rubric", "m5 13 4 4L19 7"],
                  ].map(([label, d]) => (
                    <li
                      key={label}
                      className="inline-flex items-center gap-[8px] rounded-full border border-[#e4ece7] bg-white px-[14px] py-[8px] text-[13.5px] font-medium text-[#0a4a29]"
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#056839"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d={d} />
                      </svg>
                      {label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exam console — a still of what a session looks like */}
              <div
                aria-hidden
                className="relative overflow-hidden rounded-[24px] bg-[#0a4a29] p-[26px] shadow-[var(--shadow-soft-lift)] max-sm:p-[20px]"
              >
                <span className="rings pointer-events-none absolute inset-0 opacity-40" />

                <div className="relative flex items-center justify-between">
                  <span className="inline-flex items-center gap-[8px] text-[13px] font-medium uppercase tracking-[0.09em] text-[#9fe9c1]">
                    <span className="relative grid h-[9px] w-[9px] place-items-center">
                      <span className="chat-pulse absolute h-full w-full rounded-full bg-[#ff5a5a]" />
                      <span className="h-[9px] w-[9px] rounded-full bg-[#ff5a5a]" />
                    </span>
                    Recording
                  </span>
                  <span className="text-[17px] font-medium tabular-nums text-white">
                    00:42
                  </span>
                </div>

                <div className="relative mt-[24px] flex h-[86px] items-center gap-[4px]">
                  {[38, 62, 24, 78, 46, 90, 34, 70, 52, 84, 28, 66, 42, 74, 30, 58, 86, 40, 68, 26].map(
                    (h, i) => (
                      <span
                        key={i}
                        className="flex-1 rounded-full"
                        style={{
                          height: `${h}%`,
                          background:
                            i < 11 ? "#50bc7e" : "rgba(255,255,255,0.18)",
                        }}
                      />
                    ),
                  )}
                </div>

                <div className="relative mt-[22px] flex items-center justify-between text-[13px] text-white/60">
                  <span>Segment 4 of 12</span>
                  <span>Hindi &#8646; English</span>
                </div>
                <div className="relative mt-[10px] h-[5px] w-full overflow-hidden rounded-full bg-white/12">
                  <span className="block h-full w-[33%] rounded-full bg-[#50bc7e]" />
                </div>
              </div>
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
