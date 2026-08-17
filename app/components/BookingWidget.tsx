"use client";

import { useMemo, useState } from "react";
import { cn } from "@/app/lib/utils";

const tutors = [
  { id: "any", name: "Any available advisor", role: "First free slot", initials: "NA" },
  { id: "sarah", name: "Dr. Sarah Chen", role: "NAATI CCL Lead Tutor", initials: "SC" },
  { id: "james", name: "James Mitchell", role: "PTE & IELTS Specialist", initials: "JM" },
  { id: "priya", name: "Priya Sharma", role: "Technology Courses", initials: "PS" },
];

const slots = ["9:00 am", "10:30 am", "12:00 pm", "2:00 pm", "3:30 pm", "5:00 pm"];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function nextDays(n: number) {
  const out: { key: string; dow: string; day: number; mon: string; weekend: boolean }[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 1; out.length < n; i++) {
    const t = new Date(d);
    t.setDate(d.getDate() + i);
    const weekend = t.getDay() === 0 || t.getDay() === 6;
    out.push({
      key: t.toISOString().slice(0, 10),
      dow: DAYS[t.getDay()],
      day: t.getDate(),
      mon: MONTHS[t.getMonth()],
      weekend,
    });
  }
  return out;
}

export default function BookingWidget() {
  const days = useMemo(() => nextDays(8).filter((d) => !d.weekend).slice(0, 6), []);
  const [tutor, setTutor] = useState("any");
  const [date, setDate] = useState(days[0]?.key ?? "");
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [booked, setBooked] = useState(false);

  const chosenTutor = tutors.find((t) => t.id === tutor)!;
  const chosenDay = days.find((d) => d.key === date);

  const confirm = () => {
    if (!slot) return setError("Pick a time that suits you.");
    if (!name.trim()) return setError("Please add your name.");
    if (!email.includes("@")) return setError("Please add a valid email.");
    setError("");
    setBooked(true);
  };

  if (booked) {
    return (
      <div className="mx-auto max-w-[560px] rounded-[26px] border border-[#cfe3d6] bg-white p-[44px] text-center shadow-[var(--shadow-e2)]">
        <div className="mx-auto grid h-[64px] w-[64px] place-items-center rounded-full bg-[#e8f6ee]">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#056839" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <h2 className="mt-[20px] text-[26px] font-medium text-[#0a4a29]">You&apos;re booked in! 🎉</h2>
        <p className="mt-[10px] text-[15.5px]/[1.6] text-[#566b5d]">
          Your free 20-min consultation with{" "}
          <span className="font-medium text-[#0a4a29]">{chosenTutor.name}</span> is set for{" "}
          <span className="font-medium text-[#0a4a29]">{chosenDay?.dow} {chosenDay?.day} {chosenDay?.mon}, {slot} AEST</span>.
          We&apos;ve emailed the details and a calendar invite to {email}.
        </p>
        <button
          onClick={() => { setBooked(false); setSlot(""); }}
          className="mt-[24px] rounded-[12px] border border-[#cfe3d6] bg-white px-[20px] py-[11px] text-[14px] font-medium text-[#0a4a29] transition-colors hover:bg-[#e8f6ee] cursor-pointer"
        >
          Book another time
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[300px_1fr] gap-[28px] max-lg:grid-cols-1">
      {/* Tutor picker */}
      <aside className="rounded-[24px] border border-[#dbe6dd] bg-white p-[22px] shadow-[var(--shadow-e1)] lg:sticky lg:top-[20px] h-fit">
        <p className="mb-[6px] text-[13px] font-semibold uppercase tracking-[0.06em] text-[#8a988e]">Choose who you meet</p>
        <div className="flex flex-col gap-[8px]">
          {tutors.map((t) => {
            const active = tutor === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTutor(t.id)}
                aria-pressed={active}
                className={cn(
                  "flex items-center gap-[12px] rounded-[15px] border p-[12px] text-left transition-colors cursor-pointer",
                  active ? "border-[#056839] bg-[#e8f6ee]" : "border-[#dbe6dd] bg-white hover:bg-[#f2f8f4]"
                )}
              >
                <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-[#0a4a29] text-[14px] font-semibold text-[#50bc7e]">{t.initials}</span>
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-semibold text-[#0a4a29]">{t.name}</span>
                  <span className="block truncate text-[13px] text-[#566b5d]">{t.role}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-[16px] flex items-center gap-[8px] rounded-[12px] bg-[#f2f8f4] px-[13px] py-[10px] text-[13px] text-[#566b5d]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#056839" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" /></svg>
          20 minutes · free · no obligation
        </div>
      </aside>

      {/* Date + time + details */}
      <div className="rounded-[24px] border border-[#dbe6dd] bg-white p-[28px] max-sm:p-[22px] shadow-[var(--shadow-e2)]">
        <p className="text-[15px] font-semibold text-[#0a4a29]">1 · Pick a date</p>
        <div className="mt-[12px] flex flex-wrap gap-[10px]">
          {days.map((d) => {
            const active = date === d.key;
            return (
              <button
                key={d.key}
                onClick={() => setDate(d.key)}
                className={cn(
                  "flex w-[74px] flex-col items-center rounded-[15px] border py-[12px] transition-colors cursor-pointer",
                  active ? "border-[#0a4a29] bg-[#0a4a29] text-white" : "border-[#dbe6dd] text-[#0a4a29] hover:bg-[#e8f6ee]"
                )}
              >
                <span className={cn("text-[12.5px]", active ? "text-white/70" : "text-[#8a988e]")}>{d.dow}</span>
                <span className="text-[20px] font-semibold leading-tight">{d.day}</span>
                <span className={cn("text-[12px]", active ? "text-white/70" : "text-[#8a988e]")}>{d.mon}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-[26px] text-[15px] font-semibold text-[#0a4a29]">2 · Pick a time <span className="font-normal text-[#8a988e]">(AEST)</span></p>
        <div className="mt-[12px] grid grid-cols-3 gap-[10px] max-sm:grid-cols-2">
          {slots.map((s) => {
            const active = slot === s;
            return (
              <button
                key={s}
                onClick={() => setSlot(s)}
                className={cn(
                  "rounded-[13px] border py-[12px] text-[14.5px] font-medium transition-colors cursor-pointer",
                  active ? "border-[#056839] bg-[#056839] text-white" : "border-[#dbe6dd] text-[#0a4a29] hover:bg-[#e8f6ee]"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>

        <p className="mt-[26px] text-[15px] font-semibold text-[#0a4a29]">3 · Your details</p>
        <div className="mt-[12px] grid grid-cols-2 gap-[14px] max-sm:grid-cols-1">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" autoComplete="name"
            className="rounded-[13px] border border-[#dbe6dd] bg-white px-[15px] py-[12px] text-[15px] text-[#0a4a29] placeholder:text-[#8a988e] focus:border-[#50bc7e] focus:outline-none focus:ring-2 focus:ring-[#50bc7e]/30" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" autoComplete="email"
            className="rounded-[13px] border border-[#dbe6dd] bg-white px-[15px] py-[12px] text-[15px] text-[#0a4a29] placeholder:text-[#8a988e] focus:border-[#50bc7e] focus:outline-none focus:ring-2 focus:ring-[#50bc7e]/30" />
        </div>

        {error && <p className="mt-[14px] rounded-[10px] bg-[#fbeee9] px-[13px] py-[9px] text-[13.5px] text-[#c0603e]">{error}</p>}

        <div className="mt-[22px] flex items-center justify-between gap-[16px] border-t border-[#e6efe8] pt-[20px] max-sm:flex-col max-sm:items-stretch">
          <p className="text-[14px] text-[#566b5d]">
            {slot ? (
              <>Booking <span className="font-medium text-[#0a4a29]">{chosenTutor.name}</span> · {chosenDay?.dow} {chosenDay?.day} {chosenDay?.mon} · {slot}</>
            ) : "Select a time to continue"}
          </p>
          <button
            onClick={confirm}
            className="shrink-0 rounded-[14px] bg-[#0a4a29] px-[26px] py-[14px] text-[15px] font-medium text-white shadow-[var(--shadow-e2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#056839] cursor-pointer"
          >
            Confirm booking
          </button>
        </div>
      </div>
    </div>
  );
}
