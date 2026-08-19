import { cn } from "../lib/utils";

const flags: Record<string, string> = {
  Australia:
    '<rect width="34" height="24" fill="#0a2a6b"/><path d="M0 0h17v12H0z" fill="#0a2a6b"/><path d="M0 0l8 5M9 0L0 6" stroke="#fff" stroke-width="2"/><circle cx="24" cy="8" r="1.4" fill="#fff"/><circle cx="27" cy="14" r="1.4" fill="#fff"/><circle cx="22" cy="17" r="1" fill="#fff"/>',
  India:
    '<rect width="34" height="8" fill="#ff9933"/><rect y="8" width="34" height="8" fill="#fff"/><rect y="16" width="34" height="8" fill="#138808"/><circle cx="17" cy="12" r="2.4" fill="none" stroke="#0a3b8c" stroke-width="1"/>',
  China:
    '<rect width="34" height="24" fill="#de2910"/><path d="M7 5l1 2.4 2.4.1-1.9 1.5.7 2.3L7 10l-2.2 1.4.7-2.3L3.6 7.5 6 7.4 7 5Z" fill="#ffde00"/><circle cx="13" cy="4" r=".9" fill="#ffde00"/><circle cx="15" cy="7" r=".9" fill="#ffde00"/><circle cx="15" cy="11" r=".9" fill="#ffde00"/><circle cx="13" cy="14" r=".9" fill="#ffde00"/>',
  Nepal: "",
  Vietnam:
    '<rect width="34" height="24" fill="#da251d"/><path d="M17 6l1.5 4.5H23l-3.7 2.8 1.4 4.5L17 15l-3.7 2.8 1.4-4.5L11 10.5h4.5L17 6Z" fill="#ff0"/>',
  Iran: '<rect width="34" height="8" fill="#239f40"/><rect y="8" width="34" height="8" fill="#fff"/><rect y="16" width="34" height="8" fill="#da0000"/>',
  Philippines:
    '<rect width="34" height="12" fill="#0038a8"/><rect y="12" width="34" height="12" fill="#ce1126"/><path d="M0 0l13 12L0 24z" fill="#fff"/><circle cx="4" cy="12" r="2" fill="#fcd116"/>',
  Pakistan:
    '<rect width="34" height="24" fill="#01411c"/><rect width="9" height="24" fill="#fff"/><path d="M24 7a5 5 0 100 10 6 6 0 110-10Z" fill="#fff"/><path d="M27 9l.6 1.7 1.7.1-1.4 1 .5 1.6-1.4-1-1.4 1 .5-1.6-1.4-1 1.7-.1L27 9Z" fill="#fff"/>',
  "United Kingdom":
    '<rect width="34" height="24" fill="#012169"/><path d="M0 0l34 24M34 0L0 24" stroke="#fff" stroke-width="4"/><path d="M0 0l34 24M34 0L0 24" stroke="#c8102e" stroke-width="2"/><path d="M17 0v24M0 12h34" stroke="#fff" stroke-width="6"/><path d="M17 0v24M0 12h34" stroke="#c8102e" stroke-width="3"/>',
  Brazil:
    '<rect width="34" height="24" fill="#009b3a"/><path d="M17 3l14 9-14 9L3 12z" fill="#fedf00"/><circle cx="17" cy="12" r="4.5" fill="#002776"/>',
  Japan:
    '<rect width="34" height="24" fill="#fff"/><circle cx="17" cy="12" r="6" fill="#bc002d"/>',
  SouthKorea:
    '<rect width="34" height="24" fill="#fff"/><circle cx="17" cy="12" r="5" fill="#c60c30"/><path d="M17 7a5 5 0 010 10" fill="#003478"/>',
};

const flagNames = Object.keys(flags);

function NepalFlag() {
  return (
    <svg
      viewBox="0 0 24 28"
      width="21"
      height="24"
      role="img"
      aria-label="Flag of Nepal"
      className="drop-shadow-[0_0_0.5px_rgba(0,0,0,0.25)]"
    >
      {/* Nepal's constitutional double-pennant silhouette and blue border. */}
      <path d="M1 1v26h22L11.2 16H23L1 1Z" fill="#003893" />
      <path d="M2.5 4v21.5h16.7L7.4 14.7h11.2L2.5 4Z" fill="#DC143C" />

      {/* Crescent moon with its rays. */}
      <g fill="#fff">
        <path d="M5.15 9.55a3.2 3.2 0 0 0 5.95 0 3.8 3.8 0 0 1-5.95 0Z" />
        <path d="m8.12 5.25.42 1.15 1.08-.58-.45 1.13 1.2.22-1.08.56.82.91-1.19-.24.05 1.22-.8-.93-.75.96.01-1.22-1.18.29.79-.94-1.1-.52 1.19-.26-.49-1.11 1.1.54.38-1.16Z" />
      </g>

      {/* Twelve-rayed sun. */}
      <g fill="#fff" transform="translate(8.15 20.55)">
        <circle r="2.05" />
        <path d="M0-3.65.45-2.3-.45-2.3ZM0 3.65.45 2.3-.45 2.3ZM-3.65 0l1.35-.45v.9ZM3.65 0l-1.35-.45v.9ZM-2.58-2.58l1.28.64-.64.64ZM2.58 2.58l-1.28-.64.64-.64ZM2.58-2.58l-.64 1.28-.64-.64ZM-2.58 2.58l.64-1.28.64.64ZM-1.82-3.16l1.06 1.03-.78.45ZM1.82 3.16.76 2.13l.78-.45ZM1.82-3.16l-.28 1.45-.78-.45ZM-1.82 3.16l.28-1.45.78.45Z" />
      </g>
    </svg>
  );
}

function FlagItem({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-[10px] font-medium text-[16px] text-[#4A382C] whitespace-nowrap shrink-0 mx-[23px]">
      {name === "Nepal" ? (
        <div className="flex h-[24px] w-[34px] shrink-0 items-center justify-center">
          <NepalFlag />
        </div>
      ) : (
        <div className="w-[34px] h-[24px] rounded-[5px] shadow-[0_0_0_1px_#ECDFCD] overflow-hidden shrink-0">
          <svg
            viewBox="0 0 34 24"
            width="34"
            height="24"
            role="img"
            aria-label={`Flag of ${name}`}
            dangerouslySetInnerHTML={{ __html: flags[name] }}
          />
        </div>
      )}
      <span>{name}</span>
    </div>
  );
}

export default function Logotypes({ className }: { className?: string }) {
  const flagItems = flagNames.map((name) => (
    <FlagItem key={name} name={name} />
  ));

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Top label */}
      <div className="text-center mb-[28px]">
        <p className="font-normal text-[16px] text-[#58645c]">
          Learners from{" "}
          <span className="font-medium text-black">30+ countries</span> are
          building their future with NAATI EXCELLENCE ACADEMY
        </p>
      </div>

      {/* Carousel track */}
      <div className="relative">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 h-full w-[60px] max-sm:w-[30px] bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-[60px] max-sm:w-[30px] bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Scrolling container */}
        <div className="overflow-hidden">
          <div
            className="flex items-center w-max"
            style={{ animation: "scrollFlags 30s linear infinite" }}
          >
            {flagItems}
            {flagItems}
          </div>
        </div>
      </div>
    </div>
  );
}
