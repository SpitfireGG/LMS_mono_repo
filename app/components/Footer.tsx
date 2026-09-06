import { cn } from "../lib/utils";
import LinkedInIcon from "@/app/assets/icons/linkedin.svg";
import FacebookIcon from "@/app/assets/icons/facebook.svg";
import TwitterIcon from "@/app/assets/icons/twitter.svg";
import Link from "next/link";
import SubscriptionForm from "./SubscriptionForm";
import Logo from "./Logo";

type FooterLink = {
  href: string;
  label: string;
  external?: boolean;
};

const footerColumns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Courses",
    links: [
      { href: "/courses", label: "All Courses" },
      { href: "/courses?tag=NAATI CCL", label: "NAATI CCL" },
      { href: "/courses?tag=PTE", label: "PTE" },
      { href: "/courses?tag=IELTS", label: "IELTS" },
      { href: "/courses?tag=OET", label: "OET" },
      { href: "/courses?category=tech", label: "Technology" },
      { href: "/courses?category=biz", label: "Business" },
      { href: "/courses?category=design", label: "Creative" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/practice", label: "Mock Test Live" },
      { href: "/mock-test", label: "Free Mock Test" },
      { href: "/vocabulary", label: "CCL Vocabulary" },
      { href: "/pr-calculator", label: "PR Point Calculator" },
      { href: "/offers", label: "Offers & Discounts" },
      { href: "/blog", label: "Blog" },
      {
        href: "https://my.naati.com.au/",
        label: "Book NAATI's Exam",
        external: true,
      },
      {
        href: "https://calendly.com/cclhub-info",
        label: "Schedule a Class",
        external: true,
      },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact Us" },
      { href: "/careers", label: "Careers" },
      { href: "/reviews", label: "Reviews" },
      { href: "/faq", label: "FAQs" },
    ],
  },
];

const socialLinks = [
  {
    icon: FacebookIcon,
    href: "https://www.facebook.com/cclhub.com.au/",
    label: "Facebook",
  },
  { icon: TwitterIcon, href: "https://x.com/HubCcl", label: "Twitter" },
  {
    icon: LinkedInIcon,
    href: "https://au.linkedin.com/company/cclhub",
    label: "LinkedIn",
  },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
  { href: "/refund", label: "Refunds" },
];

const contactDetails = [
  {
    label: "Email",
    value: "hello@naatiacademy.edu.au",
    href: "mailto:hello@naatiacademy.edu.au",
    icon: (
      <>
        <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
  },
  {
    label: "Phone",
    value: "+61 2 8000 0000",
    href: "tel:+61280000000",
    icon: (
      <path d="M15.5 21A13.5 13.5 0 0 1 3 8.5 2.5 2.5 0 0 1 5.5 6h1.7a1 1 0 0 1 1 .8l.7 3a1 1 0 0 1-.5 1.1l-1.3.7a11 11 0 0 0 4.8 4.8l.7-1.3a1 1 0 0 1 1.1-.5l3 .7a1 1 0 0 1 .8 1v1.7A2.5 2.5 0 0 1 15.5 21Z" />
    ),
  },
  {
    label: "Address",
    value: "Melbourne, VIC, Australia",
    icon: (
      <>
        <path d="M12 21.5s7-5.9 7-11a7 7 0 1 0-14 0c0 5.1 7 11 7 11Z" />
        <circle cx="12" cy="10.5" r="2.6" />
      </>
    ),
  },
];

export default function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("relative w-full", className)}>
      <div className="relative overflow-hidden rounded-tl-[32px] rounded-tr-[32px] bg-[#0a4a29] text-white">
        {/* Brand ring motif, barely there */}
        <span
          aria-hidden
          className="rings pointer-events-none absolute -bottom-[420px] left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 opacity-25 max-lg:hidden"
        />

        <div className="relative mx-auto max-w-[1440px] px-[100px] pb-[40px] pt-[70px] max-xl:px-[60px] max-lg:pt-[56px] max-sm:px-[30px] max-sm:pb-[30px] max-sm:pt-[44px]">
          {/* ── Newsletter band ─────────────────────────── */}
          <div className="flex items-center justify-between gap-[48px] rounded-[20px] border border-white/12 bg-white/[0.05] p-[38px] max-lg:flex-col max-lg:items-start max-lg:gap-[26px] max-sm:p-[26px]">
            <div className="max-w-[520px]">
              <h2 className="text-[26px]/[1.2] font-medium tracking-[-0.02em] text-white max-sm:text-[22px]">
                Exam dates, drills and score tips — monthly
              </h2>
              <p className="text-pretty mt-[10px] text-[15.5px]/[1.6] text-white/70">
                What is changing in the NAATI CCL sitting, and exactly how to
                prepare for it. Written by our tutors, not a marketing team.
              </p>
            </div>
            <SubscriptionForm />
          </div>

          {/* ── Main grid ───────────────────────────────── */}
          <div className="mt-[64px] grid grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] gap-[56px] max-xl:gap-[36px] max-lg:grid-cols-2 max-lg:gap-[44px] max-sm:gap-[32px]">
            {/* Brand column */}
            <div className="flex flex-col items-start max-sm:col-span-2">
              <Link
                href="/"
                className="flex items-center gap-[12px]"
                aria-label="Home"
              >
                <Logo className="h-[40px] w-[40px] shrink-0 [filter:brightness(0)_invert(1)]" />
                <span className="text-[17px] font-medium leading-[1.25] text-white">
                  NAATI EXCELLENCE
                  <br />
                  ACADEMY
                </span>
              </Link>

              <p className="text-pretty mt-[22px] max-w-[330px] text-[15px]/[1.65] text-white/65">
                Certified NAATI CCL, PTE and IELTS preparation for migrants
                across Australia — taught online, marked by specialists.
              </p>

              <ul className="mt-[26px] flex flex-col gap-[13px]">
                {contactDetails.map((item) => {
                  const body = (
                    <>
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-[2px] shrink-0 text-[#50bc7e]"
                        aria-hidden
                      >
                        {item.icon}
                      </svg>
                      <span>{item.value}</span>
                    </>
                  );

                  return (
                    <li key={item.label} className="text-[15px] text-white/75">
                      {item.href ? (
                        <a
                          href={item.href}
                          className="flex items-start gap-[10px] transition-colors duration-300 hover:text-white"
                        >
                          {body}
                        </a>
                      ) : (
                        <span className="flex items-start gap-[10px]">
                          {body}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-[26px] flex items-center gap-[10px]">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-[40px] w-[40px] place-items-center rounded-full border border-white/18 text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#50bc7e] hover:bg-white/10"
                  >
                    <Icon width={19} height={19} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {footerColumns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9fe9c1]">
                  {column.title}
                </h3>
                <ul className="mt-[18px] flex flex-col gap-[11px]">
                  {column.links.map(({ href, label, external }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-[6px] text-[15px] text-white/75 transition-colors duration-300 hover:text-white"
                      >
                        {label}
                        {external && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="shrink-0 text-white/35"
                            aria-hidden
                          >
                            <path d="M8 5h11v11" />
                            <path d="M19 5 5 19" />
                          </svg>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {/* ── Bottom bar ──────────────────────────────── */}
          <div className="mt-[64px] flex flex-wrap items-center justify-between gap-x-[36px] gap-y-[14px] border-t border-white/15 pt-[26px] max-lg:mt-[48px]">
            <p className="text-[14.5px] text-white/55">
              © {new Date().getFullYear()} NAATI EXCELLENCE ACADEMY. All rights
              reserved.
            </p>
            <ul className="flex flex-wrap items-center gap-x-[26px] gap-y-[10px]">
              {legalLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[14.5px] text-white/55 transition-colors duration-300 hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
