import type { Metadata } from "next";
import Link from "next/link";
import AnnouncementBar from "../components/AnnouncementBar";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import FloatingWidgets from "../components/FloatingWidgets";
import ContactForm from "../components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — NAATI Excellence Academy",
  description:
    "Get in touch with NAATI Excellence Academy in Melbourne, Australia. Call, email or visit us on Collins Street — enrolment, NAATI CCL, PTE/IELTS and corporate training enquiries.",
};

const HQ = {
  line1: "Level 8, 350 Collins Street",
  line2: "Melbourne VIC 3000, Australia",
  phone: "+61 3 9000 1234",
  phoneHref: "tel:+61390001234",
  email: "hello@naatiacademy.edu.au",
  whatsapp: "+61 400 123 456",
  whatsappHref: "https://wa.me/61400123456",
  mapsHref:
    "https://www.google.com/maps/dir/?api=1&destination=350+Collins+Street+Melbourne+VIC+3000",
  embed:
    "https://www.google.com/maps?q=350%20Collins%20Street%2C%20Melbourne%20VIC%203000&z=15&output=embed",
};

/* ── Small inline icons (functional, not decorative) ────────── */
function Icon({ name, className = "h-[22px] w-[22px]" }: { name: string; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
  switch (name) {
    case "phone":
      return (<svg {...common}><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8.1 9.8a16 16 0 006 6l1.3-1.2a2 2 0 012.1-.5c.9.3 1.8.6 2.7.7a2 2 0 011.7 2Z" /></svg>);
    case "mail":
      return (<svg {...common}><rect x="2" y="4" width="20" height="16" rx="2.5" /><path d="M3 6l9 7 9-7" /></svg>);
    case "chat":
      return (<svg {...common}><path d="M21 11.5a8.4 8.4 0 01-11.9 7.6L3 21l1.9-6.1A8.4 8.4 0 1121 11.5Z" /></svg>);
    case "pin":
      return (<svg {...common}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0Z" /><circle cx="12" cy="10" r="3" /></svg>);
    case "clock":
      return (<svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>);
    case "arrow":
      return (<svg {...common}><path d="M5 12h14M12 5l7 7-7 7" /></svg>);
    case "directions":
      return (<svg {...common}><path d="M12 2l10 10-10 10L2 12 12 2Z" /><path d="M9 12h4a2 2 0 012 2v2" /><path d="M13 8l-2 2 2 2" /></svg>);
    case "train":
      return (<svg {...common}><rect x="5" y="3" width="14" height="13" rx="3" /><path d="M5 11h14M9 20l-2 2M15 20l2 2" /><circle cx="8.5" cy="13.5" r="0.6" fill="currentColor" /><circle cx="15.5" cy="13.5" r="0.6" fill="currentColor" /></svg>);
    case "check":
      return (<svg {...common}><path d="M20 6L9 17l-5-5" /></svg>);
    default:
      return null;
  }
}

const methods = [
  { icon: "phone", label: "Call us", value: HQ.phone, sub: "Mon–Fri, 9am–6pm AEST", href: HQ.phoneHref, cta: "Call now" },
  { icon: "mail", label: "Email us", value: HQ.email, sub: "Replies within 1 business day", href: `mailto:${HQ.email}`, cta: "Send email" },
  { icon: "chat", label: "WhatsApp", value: HQ.whatsapp, sub: "Quick questions welcome", href: HQ.whatsappHref, cta: "Message us" },
  { icon: "pin", label: "Visit us", value: "350 Collins St, Melbourne", sub: "Melbourne CBD · VIC 3000", href: HQ.mapsHref, cta: "Get directions" },
];

const hours = [
  { day: "Monday – Friday", time: "9:00 am – 6:00 pm" },
  { day: "Saturday", time: "10:00 am – 2:00 pm" },
  { day: "Sunday & public holidays", time: "Closed" },
];

const departments = [
  { name: "Admissions & enrolment", desc: "Enrol, fees, payment plans and start dates.", email: "admissions@naatiacademy.edu.au", phone: "+61 3 9000 1230" },
  { name: "NAATI CCL enquiries", desc: "Test prep, language pairs and the 5 PR points.", email: "ccl@naatiacademy.edu.au", phone: "+61 3 9000 1231" },
  { name: "Student support", desc: "Current learners: access, scheduling and tutors.", email: "support@naatiacademy.edu.au", phone: "+61 3 9000 1232" },
  { name: "Corporate & partnerships", desc: "Group training, RTOs, migration agents and B2B.", email: "corporate@naatiacademy.edu.au", phone: "+61 3 9000 1233" },
];

const campuses = [
  { tag: "Head office", city: "Melbourne", lines: ["Level 8, 350 Collins Street", "Melbourne VIC 3000"], phone: "+61 3 9000 1234", email: "hello@naatiacademy.edu.au" },
  { tag: "Campus", city: "Sydney", lines: ["Suite 5, Level 3, 88 George Street", "Sydney NSW 2000"], phone: "+61 2 8000 1234", email: "sydney@naatiacademy.edu.au" },
];

export default function ContactPage() {
  return (
    <>
      <AnnouncementBar />
      <div className="relative pt-[26px] max-sm:pt-[20px]">
        <NavigationBar />

        {/* ── Header ─────────────────────────────────────────── */}
        <header className="relative mt-[40px] overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{ background: "radial-gradient(58% 120% at 82% -10%, rgba(80,188,126,0.16), transparent 60%)" }}
          />
          <div className="w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
            <nav className="flex items-center gap-[8px] text-[14px] text-[#566b5d]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#056839]">Home</Link>
              <span aria-hidden>/</span>
              <span className="font-medium text-[#0a4a29]">Contact</span>
            </nav>

            <div className="mt-[18px] max-w-[720px]">
              <span className="chip text-[14px] text-[#0a4a29]">
                <span className="h-[7px] w-[7px] rounded-full bg-[#50bc7e]" />
                We reply within one business day
              </span>
              <h1 className="mt-[18px] text-[clamp(2.4rem,5vw,3.7rem)]/[1.04] font-medium tracking-[-0.03em] text-[#0a4a29]">
                Let&apos;s map out your <span className="marker">path to Australia</span>.
              </h1>
              <p className="text-pretty mt-[18px] text-[18px]/[1.6] text-[#566b5d]">
                Questions about NAATI CCL, PTE/IELTS or which course fits your goal?
                Talk to a real advisor in Melbourne — by phone, email, WhatsApp, or
                pop into our Collins Street office.
              </p>
            </div>
          </div>
        </header>

        {/* ── Quick contact methods ──────────────────────────── */}
        <section className="mt-[44px] w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
          <div className="grid grid-cols-4 gap-[20px] max-xl:grid-cols-2 max-sm:grid-cols-1">
            {methods.map((m) => (
              <a
                key={m.label}
                href={m.href}
                target={m.href.startsWith("http") ? "_blank" : undefined}
                rel={m.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="lift group flex flex-col rounded-[22px] border border-[#dbe6dd] bg-white p-[24px] no-underline shadow-[var(--shadow-e1)]"
              >
                <span className="grid h-[46px] w-[46px] place-items-center rounded-[14px] bg-[#e8f6ee] text-[#056839]">
                  <Icon name={m.icon} />
                </span>
                <p className="mt-[16px] text-[14px] font-medium text-[#8a988e]">{m.label}</p>
                <p className="mt-[3px] text-[17px] font-semibold text-[#0a4a29]">{m.value}</p>
                <p className="mt-[4px] text-[13.5px] text-[#566b5d]">{m.sub}</p>
                <span className="mt-[16px] inline-flex items-center gap-[6px] text-[14px] font-medium text-[#056839]">
                  {m.cta}
                  <Icon name="arrow" className="h-[15px] w-[15px] transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ── Form + office panel ────────────────────────────── */}
        <section className="mt-[80px] max-lg:mt-[60px] w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
          <div className="grid grid-cols-[1.15fr_0.85fr] gap-[40px] max-lg:grid-cols-1 items-start">
            <ContactForm />

            {/* Office info */}
            <aside className="flex flex-col gap-[20px] lg:sticky lg:top-[20px]">
              <div className="rounded-[24px] border border-[#dbe6dd] bg-[#0a4a29] p-[28px] text-white shadow-[var(--shadow-e2)]">
                <p className="flex items-center gap-[9px] text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8fe3b7]">
                  <span className="h-[7px] w-[7px] rounded-full bg-[#50bc7e]" /> Head office
                </p>
                <p className="mt-[14px] text-[19px] font-medium leading-[1.4]">
                  {HQ.line1}
                  <br />
                  {HQ.line2}
                </p>
                <div className="mt-[20px] flex flex-col gap-[10px] text-[15px] text-white/85">
                  <a href={HQ.phoneHref} className="flex items-center gap-[10px] hover:text-white">
                    <Icon name="phone" className="h-[17px] w-[17px] text-[#8fe3b7]" /> {HQ.phone}
                  </a>
                  <a href={`mailto:${HQ.email}`} className="flex items-center gap-[10px] hover:text-white">
                    <Icon name="mail" className="h-[17px] w-[17px] text-[#8fe3b7]" /> {HQ.email}
                  </a>
                  <p className="flex items-start gap-[10px]">
                    <Icon name="pin" className="mt-[2px] h-[17px] w-[17px] text-[#8fe3b7]" /> ABN 24 123 456 789 · NAATI-endorsed CCL preparation
                  </p>
                </div>
                <a
                  href={HQ.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-[22px] inline-flex items-center gap-[8px] rounded-[13px] bg-[#50bc7e] px-[18px] py-[11px] text-[14px] font-semibold text-[#0a4a29] no-underline transition-colors hover:bg-white"
                >
                  <Icon name="directions" className="h-[16px] w-[16px]" /> Get directions
                </a>
              </div>

              {/* Hours */}
              <div className="rounded-[24px] border border-[#dbe6dd] bg-white p-[26px] shadow-[var(--shadow-e1)]">
                <div className="flex items-center gap-[10px]">
                  <span className="grid h-[38px] w-[38px] place-items-center rounded-[11px] bg-[#e8f6ee] text-[#056839]">
                    <Icon name="clock" className="h-[19px] w-[19px]" />
                  </span>
                  <h3 className="text-[17px] font-semibold text-[#0a4a29]">Opening hours</h3>
                </div>
                <dl className="mt-[16px] flex flex-col">
                  {hours.map((h) => (
                    <div key={h.day} className="flex items-center justify-between border-t border-[#e6efe8] py-[11px] text-[14.5px] first:border-t-0">
                      <dt className="text-[#566b5d]">{h.day}</dt>
                      <dd className={h.time === "Closed" ? "font-medium text-[#c0603e]" : "font-medium text-[#0a4a29]"}>{h.time}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-[8px] text-[13px] text-[#8a988e]">All times Australian Eastern Standard Time (AEST / AEDT).</p>
              </div>
            </aside>
          </div>
        </section>

        {/* ── Map + getting here ─────────────────────────────── */}
        <section className="mt-[90px] max-lg:mt-[64px] w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
          <div className="max-w-[640px]">
            <h2 className="text-[clamp(1.9rem,3.6vw,2.6rem)]/[1.1] font-medium tracking-[-0.02em] text-[#0a4a29]">
              Find us in the <span className="underline-brand">heart of Melbourne</span>
            </h2>
            <p className="mt-[14px] text-[17px]/[1.6] text-[#566b5d]">
              We&apos;re right on Collins Street in the CBD — a short walk from Flinders
              Street Station and steps from the free tram zone.
            </p>
          </div>

          <div className="mt-[28px] grid grid-cols-[1fr_360px] gap-[24px] max-lg:grid-cols-1">
            {/* Map */}
            <div className="relative overflow-hidden rounded-[26px] border border-[#dbe6dd] shadow-[var(--shadow-e2)]">
              <iframe
                title="NAATI Excellence Academy — 350 Collins Street, Melbourne"
                src={HQ.embed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[420px] w-full border-0 grayscale-[0.15]"
              />
              <div className="pointer-events-none absolute left-[20px] top-[20px] max-w-[280px] rounded-[16px] border border-[#dbe6dd] bg-white/95 p-[16px] shadow-[var(--shadow-e2)] backdrop-blur">
                <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#056839]">NAATI Excellence Academy</p>
                <p className="mt-[6px] text-[15px]/[1.5] text-[#0a4a29]">{HQ.line1}, {HQ.line2}</p>
              </div>
            </div>

            {/* Getting here */}
            <div className="flex flex-col gap-[16px]">
              <div className="rounded-[22px] border border-[#dbe6dd] bg-white p-[24px] shadow-[var(--shadow-e1)]">
                <div className="flex items-center gap-[10px]">
                  <span className="grid h-[38px] w-[38px] place-items-center rounded-[11px] bg-[#e8f6ee] text-[#056839]">
                    <Icon name="train" className="h-[19px] w-[19px]" />
                  </span>
                  <h3 className="text-[16px] font-semibold text-[#0a4a29]">Getting here</h3>
                </div>
                <ul className="mt-[14px] flex flex-col gap-[11px] text-[14.5px]/[1.5] text-[#566b5d]">
                  {[
                    "5 min walk from Flinders Street Station",
                    "Trams 11, 12, 48 & 109 stop on Collins Street",
                    "Inside the free tram zone",
                    "Secure paid parking at 300 Collins Street",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-[9px]">
                      <span className="mt-[3px] text-[#056839]"><Icon name="check" className="h-[15px] w-[15px]" /></span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={HQ.mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-[8px] rounded-[16px] bg-[#0a4a29] px-[20px] py-[15px] text-[15px] font-medium text-white no-underline transition-colors hover:bg-[#056839]"
              >
                <Icon name="directions" className="h-[17px] w-[17px]" /> Open in Google Maps
              </a>
            </div>
          </div>
        </section>

        {/* ── Departments ────────────────────────────────────── */}
        <section className="mt-[90px] max-lg:mt-[64px] w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
          <div className="max-w-[640px]">
            <h2 className="text-[clamp(1.9rem,3.6vw,2.6rem)]/[1.1] font-medium tracking-[-0.02em] text-[#0a4a29]">
              Reach the right team, faster
            </h2>
            <p className="mt-[14px] text-[17px]/[1.6] text-[#566b5d]">
              Skip the queue — email the team that handles your question directly.
            </p>
          </div>
          <div className="mt-[28px] grid grid-cols-2 gap-[20px] max-md:grid-cols-1">
            {departments.map((d) => (
              <div key={d.name} className="rounded-[22px] border border-[#dbe6dd] bg-white p-[26px] shadow-[var(--shadow-e1)]">
                <h3 className="text-[18px] font-semibold text-[#0a4a29]">{d.name}</h3>
                <p className="mt-[6px] text-[14.5px]/[1.55] text-[#566b5d]">{d.desc}</p>
                <div className="mt-[16px] flex flex-wrap items-center gap-x-[20px] gap-y-[8px] text-[14px]">
                  <a href={`mailto:${d.email}`} className="inline-flex items-center gap-[7px] font-medium text-[#056839] hover:underline">
                    <Icon name="mail" className="h-[15px] w-[15px]" /> {d.email}
                  </a>
                  <a href={`tel:${d.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-[7px] text-[#566b5d] hover:text-[#0a4a29]">
                    <Icon name="phone" className="h-[15px] w-[15px]" /> {d.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Campuses ───────────────────────────────────────── */}
        <section className="mt-[70px] max-lg:mt-[52px] w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
          <div className="grid grid-cols-2 gap-[20px] max-md:grid-cols-1">
            {campuses.map((c) => (
              <div key={c.city} className="flex items-start justify-between gap-[16px] rounded-[22px] border border-[#dbe6dd] bg-[#f2f8f4] p-[26px]">
                <div>
                  <p className="text-[12.5px] font-semibold uppercase tracking-[0.07em] text-[#056839]">{c.tag}</p>
                  <h3 className="mt-[6px] text-[20px] font-semibold text-[#0a4a29]">{c.city}</h3>
                  <p className="mt-[8px] text-[14.5px]/[1.55] text-[#566b5d]">{c.lines[0]}<br />{c.lines[1]}</p>
                  <div className="mt-[12px] flex flex-col gap-[4px] text-[14px]">
                    <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="text-[#0a4a29] hover:text-[#056839]">{c.phone}</a>
                    <a href={`mailto:${c.email}`} className="font-medium text-[#056839] hover:underline">{c.email}</a>
                  </div>
                </div>
                <span className="grid h-[44px] w-[44px] shrink-0 place-items-center rounded-full bg-white text-[#056839] shadow-[var(--shadow-e1)]">
                  <Icon name="pin" className="h-[20px] w-[20px]" />
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────── */}
        <section className="mt-[90px] max-lg:mt-[64px] w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px]">
          <div className="relative overflow-hidden rounded-[32px] bg-[#0a4a29] px-[56px] py-[52px] max-sm:px-[30px] max-sm:py-[38px]">
            <div className="rings-ink pointer-events-none absolute inset-0 opacity-60" aria-hidden />
            <div className="relative flex items-center justify-between gap-[30px] max-md:flex-col max-md:items-start">
              <div className="max-w-[560px]">
                <h2 className="text-[clamp(1.8rem,3.4vw,2.5rem)]/[1.12] font-medium text-white">
                  Prefer to talk it through?
                </h2>
                <p className="mt-[12px] text-[17px]/[1.6] text-white/75">
                  Book a free 20-minute consultation with an advisor. We&apos;ll map your
                  timeline, budget and the fastest route to your goal — no obligation.
                </p>
              </div>
              <a
                href={HQ.phoneHref}
                className="shrink-0 rounded-[16px] bg-[#50bc7e] px-[28px] py-[16px] text-[16px] font-semibold text-[#0a4a29] no-underline transition-colors hover:bg-white"
              >
                Book a free consultation
              </a>
            </div>
          </div>
        </section>

        <Footer className="mt-[120px] max-lg:mt-[90px] max-sm:mt-[60px]" />
        <FloatingWidgets />
      </div>
    </>
  );
}
