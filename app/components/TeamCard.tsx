import { cn } from "@/app/lib/utils";

type TeamCardProps = {
  name: string;
  title: string;
  description: string;
  imageSrc?: string;
  /** Languages or specialisms this tutor covers. */
  tags?: string[];
  profileUrl?: string;
  className?: string;
};

function initials(name: string) {
  const parts = name.split(/[\s-]+/).filter(Boolean);
  return (parts[0][0] + (parts.at(-1)?.[0] ?? "")).toUpperCase();
}

export default function TeamCard({
  name,
  title,
  description,
  imageSrc,
  tags,
  profileUrl,
  className,
}: TeamCardProps) {
  return (
    <article
      className={cn(
        "offset-card group flex h-full flex-col bg-white p-[28px] max-sm:p-[22px]",
        className,
      )}
    >
      <div className="flex items-start gap-[18px]">
        <span className="portrait-blob relative grid h-[86px] w-[86px] shrink-0 place-items-center overflow-hidden bg-[#e8f6ee] max-sm:h-[72px] max-sm:w-[72px]">
          {imageSrc ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-105"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-[#50bc7e] opacity-[0.18] mix-blend-multiply"
              />
            </>
          ) : (
            <span className="text-[24px] font-medium text-[#056839]">
              {initials(name)}
            </span>
          )}
        </span>

        <div className="min-w-0 pt-[8px]">
          <h3 className="text-[19px] font-medium leading-tight text-[#0a4a29]">
            {name}
          </h3>
          <p className="mt-[5px] text-[14.5px] leading-snug text-[#566b5d]">
            {title}
          </p>
        </div>
      </div>

      <span aria-hidden className="mt-[22px] h-px w-full bg-[#e4ece7]" />

      {description && (
        <p className="text-pretty mt-[18px] text-[15px]/[1.6] text-[#566b5d]">
          {description}
        </p>
      )}

      {tags && tags.length > 0 && (
        <ul className="mt-[18px] flex flex-wrap gap-[7px]">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-[#f2f8f4] px-[11px] py-[4px] text-[12.5px] font-medium text-[#056839]"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      {profileUrl && (
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex w-fit items-center gap-[7px] pt-[20px] text-[14px] font-medium text-[#0a4a29] transition-colors hover:text-[#056839]"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M4.9 3a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM3.3 8.4h3.2V21H3.3V8.4Zm5.6 0h3v1.7h.1a3.4 3.4 0 0 1 3-1.6c3.2 0 3.8 2.1 3.8 4.8V21h-3.1v-5.9c0-1.4 0-3.2-2-3.2s-2.2 1.5-2.2 3.1V21H8.9V8.4Z" />
          </svg>
          View profile
        </a>
      )}
    </article>
  );
}
