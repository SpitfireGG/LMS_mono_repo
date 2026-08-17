"use client";

import { useState } from "react";
import { cn } from "@/app/lib/utils";
import { courses } from "@/app/lib/courses";

const enquiryTypes = [
  "General enquiry",
  "Course enrolment",
  "NAATI CCL preparation",
  "PTE / IELTS preparation",
  "Corporate & group training",
  "Feedback or complaint",
];

const contactMethods = ["Email", "Phone", "WhatsApp"] as const;

function labelCls() {
  return "mb-[7px] block text-[13.5px] font-medium text-[#0a4a29]";
}
function fieldCls(invalid = false) {
  return cn(
    "w-full rounded-[13px] border bg-white px-[15px] py-[12px] text-[15px] text-[#0a4a29] placeholder:text-[#8a988e]",
    "focus:outline-none focus:ring-2 transition-colors",
    invalid
      ? "border-[#d98b6a] focus:border-[#d98b6a] focus:ring-[#d98b6a]/25"
      : "border-[#dbe6dd] focus:border-[#50bc7e] focus:ring-[#50bc7e]/30"
  );
}

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [method, setMethod] = useState<(typeof contactMethods)[number]>("Email");
  const [consent, setConsent] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTriedSubmit(true);
    if (!consent) return;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center rounded-[24px] border border-[#cfe3d6] bg-white p-[44px] text-center shadow-[var(--shadow-e2)]">
        <div className="grid h-[64px] w-[64px] place-items-center rounded-full bg-[#e8f6ee]">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#056839" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="mt-[20px] text-[24px] font-medium text-[#0a4a29]">Message sent — thank you!</h3>
        <p className="mt-[10px] max-w-[420px] text-[15.5px]/[1.6] text-[#566b5d]">
          A NAATI Excellence advisor will get back to you within one business day
          (Mon–Fri, AEST). For anything urgent, call{" "}
          <a href="tel:+61390001234" className="font-medium text-[#056839]">
            +61 3 9000 1234
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-[24px] rounded-[12px] border border-[#cfe3d6] bg-white px-[20px] py-[11px] text-[14px] font-medium text-[#0a4a29] transition-colors hover:bg-[#e8f6ee] cursor-pointer"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[24px] border border-[#dbe6dd] bg-white p-[32px] max-sm:p-[24px] shadow-[var(--shadow-e2)]"
    >
      <h2 className="text-[24px] font-medium text-[#0a4a29]">Send us a message</h2>
      <p className="mt-[6px] text-[15px] text-[#566b5d]">
        Fields marked <span className="text-[#c0603e]">*</span> are required. We reply within one business day.
      </p>

      <div className="mt-[24px] flex flex-col gap-[18px]">
        {/* Enquiry type */}
        <div>
          <label htmlFor="enquiry" className={labelCls()}>
            What&apos;s this about? <span className="text-[#c0603e]">*</span>
          </label>
          <select id="enquiry" name="enquiry" required defaultValue={enquiryTypes[0]} className={cn(fieldCls(), "cursor-pointer")}>
            {enquiryTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div className="grid grid-cols-2 gap-[16px] max-sm:grid-cols-1">
          <div>
            <label htmlFor="firstName" className={labelCls()}>
              First name <span className="text-[#c0603e]">*</span>
            </label>
            <input id="firstName" name="firstName" required autoComplete="given-name" placeholder="Aashish" className={fieldCls()} />
          </div>
          <div>
            <label htmlFor="lastName" className={labelCls()}>
              Last name <span className="text-[#c0603e]">*</span>
            </label>
            <input id="lastName" name="lastName" required autoComplete="family-name" placeholder="Sharma" className={fieldCls()} />
          </div>
        </div>

        {/* Email + phone */}
        <div className="grid grid-cols-2 gap-[16px] max-sm:grid-cols-1">
          <div>
            <label htmlFor="email" className={labelCls()}>
              Email <span className="text-[#c0603e]">*</span>
            </label>
            <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@email.com" className={fieldCls()} />
          </div>
          <div>
            <label htmlFor="phone" className={labelCls()}>
              Phone <span className="text-[#8a988e]">(optional)</span>
            </label>
            <div className="flex items-stretch gap-[8px]">
              <span className="flex shrink-0 items-center rounded-[13px] border border-[#dbe6dd] bg-[#f2f8f4] px-[13px] text-[15px] font-medium text-[#566b5d]">
                🇦🇺 +61
              </span>
              <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="4XX XXX XXX" className={fieldCls()} />
            </div>
          </div>
        </div>

        {/* Course of interest */}
        <div>
          <label htmlFor="course" className={labelCls()}>
            Course of interest <span className="text-[#8a988e]">(optional)</span>
          </label>
          <select id="course" name="course" defaultValue="" className={cn(fieldCls(), "cursor-pointer")}>
            <option value="">I&apos;m not sure yet — help me choose</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Preferred contact method */}
        <div>
          <span className={labelCls()}>Preferred way to reach you</span>
          <div className="flex flex-wrap gap-[10px]">
            {contactMethods.map((m) => {
              const active = method === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full border px-[18px] py-[9px] text-[14px] font-medium transition-colors cursor-pointer",
                    active
                      ? "border-[#0a4a29] bg-[#0a4a29] text-white"
                      : "border-[#cfe3d6] bg-white text-[#0a4a29] hover:bg-[#e8f6ee]"
                  )}
                >
                  {m}
                </button>
              );
            })}
            <input type="hidden" name="preferredContact" value={method} />
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className={labelCls()}>
            Your message <span className="text-[#c0603e]">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="Tell us your goal — the exam you're preparing for, your timeline, or anything you'd like to ask…"
            className={cn(fieldCls(), "resize-y min-h-[130px]")}
          />
        </div>

        {/* Consent */}
        <button
          type="button"
          role="checkbox"
          aria-checked={consent}
          onClick={() => setConsent((v) => !v)}
          className="flex items-start gap-[11px] text-left cursor-pointer group"
        >
          <span
            className={cn(
              "mt-[1px] grid h-[20px] w-[20px] shrink-0 place-items-center rounded-[6px] border transition-colors",
              consent ? "border-[#056839] bg-[#056839]" : "border-[#cfe3d6] bg-white group-hover:border-[#9ec7ac]",
              triedSubmit && !consent && "border-[#d98b6a]"
            )}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 6" />
            </svg>
          </span>
          <span className="text-[13.5px]/[1.55] text-[#566b5d]">
            I agree to NAATI Excellence Academy contacting me about my enquiry and
            accept the{" "}
            <span className="font-medium text-[#056839]">Privacy Policy</span>.{" "}
            <span className="text-[#c0603e]">*</span>
          </span>
        </button>
        {triedSubmit && !consent && (
          <p className="-mt-[8px] text-[13px] text-[#c0603e]">Please accept the privacy policy to continue.</p>
        )}

        <button
          type="submit"
          className="mt-[4px] inline-flex items-center justify-center gap-[8px] rounded-[14px] bg-[#0a4a29] px-[28px] py-[15px] text-[16px] font-medium text-white shadow-[var(--shadow-e2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#056839] hover:shadow-[var(--shadow-lift)] cursor-pointer"
        >
          Send message
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}
