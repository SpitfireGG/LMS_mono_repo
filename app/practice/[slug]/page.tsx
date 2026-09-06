import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "../../components/AnnouncementBar";
import NavigationBar from "../../components/NavigationBar";
import Footer from "../../components/Footer";
import FloatingWidgets from "../../components/FloatingWidgets";
import MockTestConsole from "../../components/MockTestConsole";

export const metadata: Metadata = {
  title: "Practice session — NAATI Excellence Academy",
  description:
    "Play the dialogue with its script on screen and record your interpretation under exam conditions.",
};

const shell = "mx-auto w-full max-w-[1320px] px-[60px] max-sm:px-[20px]";
const h2 = "text-[clamp(1.9rem,3.2vw,2.6rem)]/[1.1] font-medium tracking-[-0.03em] text-[#0a4a29]";

const svg = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-[22px] w-[22px]",
  "aria-hidden": true,
};

const steps = [
  {
    title: "Listen to the dialogue",
    body: "A professionally recorded conversation plays segment by segment, exactly as it runs in the real sitting.",
    icon: (
      <svg {...svg}>
        <path d="M3 14v-3a9 9 0 0 1 18 0v3" />
        <path d="M21 15a2 2 0 0 1-2 2h-1v-4h1a2 2 0 0 1 2 2ZM3 15a2 2 0 0 0 2 2h1v-4H5a2 2 0 0 0-2 2Z" />
      </svg>
    ),
  },
  {
    title: "Record your interpretation",
    body: "Your microphone captures you as you speak, with a live level meter so you know the input is landing.",
    icon: (
      <svg {...svg}>
        <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Z" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
      </svg>
    ),
  },
  {
    title: "Review and submit",
    body: "Play your recording back against the script, download it, or send it to a tutor for marked feedback.",
    icon: (
      <svg {...svg}>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
  },
];

const guidance = [
  {
    title: "Note-taking",
    tone: "good" as const,
    items: [
      "Catch keywords and numbers as you listen",
      "Use abbreviations — you are not transcribing",
      "Leave space to add detail on the second pass",
    ],
  },
  {
    title: "Recording technique",
    tone: "good" as const,
    items: [
      "Speak clearly and at your natural pace",
      "Start interpreting straight away",
      "Avoid long pauses and filler",
    ],
  },
  {
    title: "Timing",
    tone: "good" as const,
    items: [
      "Each dialogue runs roughly 5–7 minutes",
      "Budget about 30 seconds between segments",
      "Practise against the real clock, not a relaxed one",
    ],
  },
  {
    title: "Common mistakes",
    tone: "bad" as const,
    items: [
      "Translating word for word instead of meaning",
      "Omitting names, numbers or dates",
      "Speaking too fast to stay accurate",
    ],
  },
];

const criteria = [
  { title: "Accuracy", body: "Faithful, complete transfer of meaning between both languages." },
  { title: "Fluency", body: "Natural delivery and pacing, without hesitation or restarts." },
  { title: "Terminology", body: "Correct professional and technical vocabulary for the setting." },
  { title: "Completeness", body: "Nothing omitted — no dropped details, names or qualifiers." },
];

export default async function PracticeSessionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <AnnouncementBar />
      <div className="relative pt-[26px] max-sm:pt-[20px]">
        <NavigationBar />

        <div className="mt-[32px]">
          <MockTestConsole slug={slug} />
        </div>

        {/* ── How the test works ─────────────────────────── */}
        <section className={`${shell} mt-[110px] max-lg:mt-[80px] max-sm:mt-[60px]`}>
          <h2 className={h2}>How the test works</h2>
          <p className="text-pretty mt-[14px] max-w-[560px] text-[17px]/[1.6] text-[#566b5d]">
            Three steps, run under the same conditions as the real assessment.
          </p>

          <ol className="mt-[36px] grid grid-cols-3 gap-[20px] max-lg:grid-cols-1">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="group flex flex-col rounded-[20px] border border-[#e4ece7] bg-white p-[26px] transition-all duration-400 ease-[var(--ease-out-quint)] hover:-translate-y-1.5 hover:border-[#50bc7e] hover:shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-center justify-between gap-[12px]">
                  <span className="grid h-[46px] w-[46px] place-items-center rounded-[14px] bg-[#e8f6ee] text-[#056839] transition-colors duration-400 group-hover:bg-[#0a4a29] group-hover:text-white">
                    {step.icon}
                  </span>
                  <span aria-hidden className="text-[13px] font-medium tabular-nums text-[#b6c7bc]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-[18px] text-[18px] font-medium tracking-[-0.01em] text-[#0a4a29]">
                  {step.title}
                </h3>
                <p className="text-pretty mt-[8px] text-[14.5px]/[1.6] text-[#566b5d]">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Guidance ───────────────────────────────────── */}
        <section className={`${shell} mt-[100px] max-lg:mt-[72px] max-sm:mt-[56px]`}>
          <h2 className={h2}>Before you start</h2>

          <div className="mt-[36px] grid grid-cols-2 gap-[20px] max-md:grid-cols-1">
            {guidance.map((group) => (
              <div
                key={group.title}
                className="rounded-[20px] border border-[#e4ece7] bg-white p-[26px]"
              >
                <h3 className="text-[17px] font-medium tracking-[-0.01em] text-[#0a4a29]">
                  {group.title}
                </h3>
                <ul className="mt-[16px] flex flex-col gap-[11px]">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-[10px] text-[14.5px]/[1.55] text-[#566b5d]">
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={group.tone === "bad" ? "#c0603e" : "#056839"}
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-[3px] shrink-0"
                        aria-hidden
                      >
                        {group.tone === "bad" ? (
                          <path d="M18 6 6 18M6 6l12 12" />
                        ) : (
                          <path d="M20 6 9 17l-5-5" />
                        )}
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── What we evaluate ───────────────────────────── */}
        <section className={`${shell} mt-[100px] max-lg:mt-[72px] max-sm:mt-[56px]`}>
          <h2 className={h2}>What we evaluate</h2>

          <dl className="mt-[36px] grid grid-cols-4 overflow-hidden rounded-[20px] border border-[#e4ece7] bg-white max-lg:grid-cols-2 max-sm:grid-cols-1">
            {criteria.map((c, i) => (
              <div
                key={c.title}
                className={`flex flex-col gap-[8px] p-[26px] ${i > 0 ? "border-l border-[#e4ece7] max-lg:odd:border-l-0 max-sm:border-l-0 max-sm:border-t" : ""} ${i >= 2 ? "max-lg:border-t max-lg:border-t-[#e4ece7]" : ""}`}
              >
                <dt className="text-[17px] font-medium text-[#0a4a29]">{c.title}</dt>
                <dd className="text-pretty text-[14.5px]/[1.6] text-[#566b5d]">{c.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── CTA ────────────────────────────────────────── */}
        <section className={`${shell} mt-[100px] max-lg:mt-[72px] max-sm:mt-[56px]`}>
          <div className="relative overflow-hidden rounded-[32px] bg-[#0a4a29] px-[64px] py-[72px] text-center max-lg:px-[40px] max-lg:py-[56px] max-sm:px-[24px] max-sm:py-[44px]">
            <span aria-hidden className="rings pointer-events-none absolute inset-0 opacity-40" />
            <div className="relative mx-auto max-w-[560px]">
              <h2 className="text-[clamp(1.9rem,3.2vw,2.6rem)]/[1.1] font-medium tracking-[-0.03em] text-white">
                Want this marked by a tutor?
              </h2>
              <p className="text-pretty mx-auto mt-[14px] max-w-[440px] text-[16.5px]/[1.6] text-white/70">
                Send your recording to a certified NAATI specialist and get it
                scored against the real rubric, segment by segment.
              </p>
              <div className="mt-[28px] flex flex-wrap items-center justify-center gap-[14px]">
                <Link
                  href="/book"
                  className="rounded-[14px] bg-white px-[30px] py-[16px] text-[16px] font-medium text-[#0a4a29] shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e8f6ee]"
                >
                  Book a marking session
                </Link>
                <Link
                  href="/practice"
                  className="rounded-[14px] border border-white/30 px-[30px] py-[16px] text-[16px] font-medium text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10"
                >
                  More practice sessions
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer className="mt-[110px] max-lg:mt-[80px] max-sm:mt-[56px]" />
        <FloatingWidgets />
      </div>
    </>
  );
}
