"use client";

import { cn } from "@/app/lib/utils";
import LearnMoreLink from "./LearnMoreLink";
import { useCaseStudies } from "@/app/lib/api/hooks";
import person1 from "@/app/assets/team/person-1.jpg";
import person2 from "@/app/assets/team/person-2.jpg";
import person3 from "@/app/assets/team/person-3.jpg";
import type { StaticImageData } from "next/image";

type Story = {
  id: string;
  slug: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  result: string | null;
  image: string | StaticImageData | null;
};

/** Keeps the section on the page when the CMS has nothing published. */
const fallbackStories: Story[] = [
  {
    id: "cs1",
    slug: "rajesh-nepali-ccl",
    name: "Rajesh Karki",
    role: "Nepali CCL · Melbourne",
    quote:
      "Failed twice on my own. Three weeks of marked practice here and I passed with room to spare.",
    rating: 5,
    result: "84/90 · +5 PR points",
    image: person1,
  },
  {
    id: "cs2",
    slug: "priya-hindi-ccl",
    name: "Priya Sharma",
    role: "Hindi CCL · Sydney",
    quote:
      "The mock tests matched the real sitting so closely that exam day felt like another practice run.",
    rating: 5,
    result: "87/90 · first attempt",
    image: person3,
  },
  {
    id: "cs3",
    slug: "thao-vietnamese-ccl",
    name: "Thao Nguyen",
    role: "Vietnamese CCL · Brisbane",
    quote:
      "I work nights. Being able to drill at 2am and still get my recordings marked is what got me over the line.",
    rating: 5,
    result: "83/90 · +5 PR points",
    image: person2,
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="flex items-center gap-[2px]"
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < rating ? "#f5a623" : "rgba(255,255,255,0.22)"}
          aria-hidden
        >
          <path d="M12 2l2.9 6 6.6.6-5 4.4 1.5 6.4L12 16.9 5.9 19.4 7.4 13l-5-4.4 6.6-.6L12 2Z" />
        </svg>
      ))}
    </span>
  );
}

function Avatar({ story }: { story: Story }) {
  const src =
    typeof story.image === "string" ? story.image : (story.image?.src ?? null);

  if (!src) {
    const parts = story.name.split(/[\s-]+/).filter(Boolean);
    return (
      <span
        aria-hidden
        className="grid h-[56px] w-[56px] shrink-0 place-items-center rounded-full bg-white/12 text-[16px] font-medium text-[#9fe9c1]"
      >
        {(parts[0][0] + (parts.at(-1)?.[0] ?? "")).toUpperCase()}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="h-[56px] w-[56px] shrink-0 rounded-full object-cover ring-2 ring-white/20"
    />
  );
}

const panelClass =
  "bg-[#0a4a29] grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-x-[128px] max-xl:gap-x-[80px] max-lg:gap-x-[60px] gap-y-[80px] max-lg:gap-y-[60px] px-[60px] max-lg:px-[40px] pt-[70px] pb-[69px] max-lg:py-[40px] relative rounded-[32px] shrink-0 xl:ml-[3px] xl:mt-px flex-1";

const wrapClass =
  "flex flex-col items-start px-[100px] max-xl:px-[60px] max-sm:px-[30px] py-0 relative w-full max-w-[1440px] mx-auto";

export default function CaseStudies({ className }: { className?: string }) {
  const { data, isLoading } = useCaseStudies({ limit: 3 });

  const published: Story[] = (data?.data ?? []).map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.title,
    role: c.tags || "Success story",
    quote: c.excerpt || c.content?.slice(0, 180) || c.title,
    rating: 5,
    result: c.result,
    image: c.image,
  }));

  const stories = published.length > 0 ? published : fallbackStories;

  if (isLoading && published.length === 0) {
    return (
      <div className={cn(wrapClass, className)}>
        <div className={panelClass}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex animate-pulse flex-col gap-[18px]">
              <div className="h-[56px] w-[56px] rounded-full bg-white/20" />
              <div className="h-[16px] w-[160px] rounded bg-white/20" />
              <div className="h-[14px] w-full rounded bg-white/20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(wrapClass, className)}>
      <div className={panelClass}>
        {stories.map((story, index) => (
          <article
            key={story.id}
            className={cn(
              "relative flex shrink-0 flex-1 flex-col gap-[16px] items-start",
              index % 2 === 0 &&
                index === stories.length - 1 &&
                "max-lg:col-span-2 max-md:col-span-1",
            )}
          >
            {index > 0 && (
              <span
                aria-hidden
                className={cn(
                  "absolute -left-[64px] top-0 bottom-0 h-full w-px bg-white max-xl:-left-[40px] max-lg:-left-[30px] max-md:hidden",
                  index % 2 === 0 && "max-lg:hidden",
                )}
              />
            )}
            {index > 0 && (
              <span
                aria-hidden
                className={cn(
                  "absolute -top-[40px] left-0 right-0 hidden h-px w-full bg-white max-lg:-top-[30px] max-md:block",
                  index === stories.length - 1 && "max-lg:block",
                )}
              />
            )}

            {/* Profile */}
            <div className="flex items-center gap-[14px]">
              <Avatar story={story} />
              <div className="min-w-0">
                <p className="text-[17px] font-medium leading-tight text-white">
                  {story.name}
                </p>
                <p className="mt-[4px] text-[13.5px] leading-tight text-white/60">
                  {story.role}
                </p>
                <span className="mt-[7px] flex items-center gap-[7px]">
                  <Stars rating={story.rating} />
                  <span className="text-[12.5px] font-medium text-white/70">
                    {story.rating.toFixed(1)}
                  </span>
                </span>
              </div>
            </div>

            <p
              className={cn(
                "text-pretty max-w-[286px] text-[17px]/[1.55] text-white/85",
                index === stories.length - 1 && "max-lg:max-w-none",
              )}
            >
              {story.quote}
            </p>

            {story.result && (
              <span className="rounded-full bg-white/10 px-[13px] py-[6px] text-[13px] font-medium text-[#9fe9c1]">
                {story.result}
              </span>
            )}

            <LearnMoreLink
              variant="SimpleGreen"
              href={`/case-studies/${story.slug}`}
            />
          </article>
        ))}
      </div>
    </div>
  );
}
