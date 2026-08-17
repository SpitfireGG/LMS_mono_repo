"use client";

import { useEffect, useRef } from "react";

/**
 * Floating course-card composition.
 * A crisp, flat 2D layout (no 3D perspective → sharp edges), with a gentle
 * up/down float, subtle card rotations and a light 2D pointer parallax.
 * Reduced-motion and touch devices get the static composed scene.
 */
export default function Hero3D({ className = "" }: { className?: string }) {
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      // Subtle 2D translate parallax — stays perfectly sharp (no 3D rasterisation).
      targetX = nx * 16;
      targetY = ny * 12;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      group.style.transform = `translate(${curX.toFixed(2)}px, ${curY.toFixed(2)}px)`;
      if (Math.abs(targetX - curX) > 0.05 || Math.abs(targetY - curY) > 0.05) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={`relative ${className}`} aria-hidden>
      {/* Atmosphere */}
      <div className="hero-atmosphere absolute -inset-[12%] rounded-full" />

      {/* Concentric rings — clean, sharp brand motif */}
      <svg
        viewBox="0 0 560 480"
        fill="none"
        shapeRendering="geometricPrecision"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <circle
          cx="280"
          cy="240"
          r="120"
          stroke="#0a4a29"
          strokeOpacity="0.16"
          strokeWidth="1.25"
        />
        <circle
          cx="280"
          cy="240"
          r="175"
          stroke="#0a4a29"
          strokeOpacity="0.12"
          strokeWidth="1.25"
        />
        <circle
          cx="280"
          cy="240"
          r="230"
          stroke="#0a4a29"
          strokeOpacity="0.08"
          strokeWidth="1.25"
        />
      </svg>

      {/* Layered card group (flat 2D → crisp) */}
      <div
        ref={groupRef}
        className="relative h-full w-full will-change-transform"
      >
        {/* BACK — green stat panel */}
        <div
          className="absolute left-[6%] top-[2%] w-[44%]"
          style={{ transform: "rotate(-4deg)" }}
        >
          <div className="card-float-alt">
            <div className="rounded-[24px] border border-[#cfe3d6] bg-[#056839] p-5 shadow-[var(--shadow-e3)]">
              <p className="text-[13px] font-medium text-white/75">
                Courses live now
              </p>
              <p className="mt-1 text-[40px]/[1] font-medium text-white">
                320+
              </p>
              <div className="mt-3 flex gap-1.5">
                {["CCL", "PTE", "Code"].map((t) => (
                  <span
                    key={t}
                    className="rounded-[6px] bg-[#0a4a29] px-2 py-0.5 text-[11px] font-medium text-white"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE — small session card */}
        <div
          className="absolute right-[2%] top-[15%] w-[46%]"
          style={{ transform: "rotate(3deg)" }}
        >
          <div className="card-float-alt" style={{ animationDelay: "1.6s" }}>
            <div className="rounded-[20px] border border-[#cfe3d6] bg-white p-4 shadow-[var(--shadow-e2)]">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0a4a29] text-[15px] font-medium text-[#50bc7e]">
                  PT
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-medium text-[#0a4a29]">
                    PTE Academic — 79+
                  </p>
                  <p className="text-[12px] text-[#58645c]">
                    Live tutorial · 7:00 pm
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-[10px] bg-[#e8f6ee] px-3 py-2">
                <span className="text-[12px] font-medium text-[#0a4a29]">
                  Speaking drill #12
                </span>
                <span className="inline-block h-2 w-2 rounded-full bg-[#50bc7e]" />
              </div>
            </div>
          </div>
        </div>

        {/* FRONT — hero course card */}
        <div
          className="absolute bottom-[4%] left-[12%] w-[62%]"
          style={{ transform: "rotate(-1.5deg)" }}
        >
          <div className="card-float">
            <div className="rounded-[26px] border border-[#cfe3d6] bg-white p-6 shadow-[var(--shadow-e3)]">
              <div className="flex items-start justify-between gap-3">
                <span className="marker text-[13px] font-medium">
                  NAATI CCL
                </span>
                <span className="rounded-full border border-[#cfe3d6] px-2.5 py-0.5 text-[12px] font-medium text-[#0a4a29]">
                  4.9 ★
                </span>
              </div>
              <p className="mt-3 text-[22px]/[1.2] font-medium text-[#0a4a29]">
                Complete Mastery — Nepali ⇄ English
              </p>
              <p className="mt-1.5 text-[13.5px] text-[#58645c]">
                42 lessons · 18 hrs · certified tutors
              </p>
              <div className="mt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-[12.5px] font-medium text-[#0a4a29]">
                    Course progress
                  </span>
                  <span className="text-[12.5px] text-[#58645c]">86%</span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-[#e8f6ee]">
                  <div className="h-full w-[86%] rounded-full bg-[#056839] [box-shadow:inset_0_-2px_3px_rgba(7,60,66,0.5)]" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[#dde6e0] pt-4">
                <span className="text-[15px] font-medium text-[#0a4a29]">
                  Mock test passed
                </span>
                <span className="rounded-[8px] bg-[#0a4a29] px-3 py-1 text-[13px] font-medium text-[#50bc7e]">
                  +5 PR points
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating orbs + stars */}
        <span className="orb-brand card-float-alt absolute right-[8%] top-[3%] block h-12 w-12 rounded-full" />
        <span className="orb-ink absolute bottom-[12%] right-[5%] block h-7 w-7 rounded-full" />
        <svg
          viewBox="0 0 24 24"
          className="absolute left-[1%] top-[32%] h-9 w-9"
          fill="#0a4a29"
        >
          <path d="M12 0c1 6.6 4.4 10 11 12-6.6 2-10 5.4-11 12-1-6.6-4.4-10-11-12C7.6 10 11 6.6 12 0Z" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          className="card-float absolute bottom-[1%] left-[38%] h-6 w-6"
          fill="#50bc7e"
          stroke="#0a4a29"
          strokeWidth="1.2"
        >
          <path d="M12 1c.9 5.9 4 9 9.9 11-5.9 2-9 5.1-9.9 11-.9-5.9-4-9-9.9-11C8 10 11.1 6.9 12 1Z" />
        </svg>
      </div>
    </div>
  );
}
