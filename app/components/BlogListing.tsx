"use client";

import { cn } from "@/app/lib/utils";
import LearnMoreLink from "./LearnMoreLink";
import { useBlogs } from "@/app/lib/api/hooks";
import type { BlogPostItem as ApiBlogPostItem } from "@/app/lib/api/types";

const covers = [
  { bg: "#0a4a29", ink: "#ffffff", tagClass: "bg-[#50bc7e] text-[#0a4a29]" },
  { bg: "#056839", ink: "#ffffff", tagClass: "bg-[#0a4a29] text-white" },
  { bg: "#e8f6ee", ink: "#0a4a29", tagClass: "bg-[#0a4a29] text-white" },
];

export default function BlogListing({ className }: { className?: string }) {
  const { data, isLoading, error } = useBlogs({ limit: 3 });
  const blogPosts = data?.data ?? [];

  if (isLoading) {
    return (
      <div className={cn("px-[100px] max-xl:px-[60px] max-sm:px-[30px]", className)} id="blogs">
        <div className="grid grid-cols-3 gap-[40px] max-xl:gap-[30px] max-lg:grid-cols-2 max-md:grid-cols-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white border border-[#cfe3d6] border-solid rounded-[26px] shadow-[var(--shadow-e2)] overflow-hidden flex flex-col h-[400px]" />
          ))}
        </div>
      </div>
    );
  }

  if (error || blogPosts.length === 0) {
    return null;
  }

  return (
    <div className={cn("px-[100px] max-xl:px-[60px] max-sm:px-[30px]", className)} id="blogs">
      <div className="grid grid-cols-3 gap-[40px] max-xl:gap-[30px] max-lg:grid-cols-2 max-md:grid-cols-1">
        {blogPosts.map((post, index) => {
          const cover = covers[index % covers.length];
          return (
            <div key={post.id} className="lift bg-white border border-[#cfe3d6] border-solid rounded-[26px] shadow-[var(--shadow-e2)] overflow-hidden flex flex-col">
              {/* Cover — typographic panel in the brand triad */}
              <div className="relative h-[170px] overflow-hidden" style={{ backgroundColor: cover.bg }}>
                <span className={cn("absolute top-[18px] left-[20px] px-[12px] py-[5px] rounded-[7px] font-medium text-[13.5px]", cover.tagClass)}>
                  {post.tag}
                </span>
                <span className="pointer-events-none absolute -bottom-[12px] left-[16px] select-none text-[72px]/[1] font-medium tracking-[-0.04em] opacity-[0.14]" style={{ color: cover.ink }} aria-hidden>
                  {post.tag.split(" ")[0]}
                </span>
                {/* orbit + star motif */}
                <svg viewBox="0 0 200 90" fill="none" className="absolute right-[-20px] top-[24px] h-[110px] w-auto" aria-hidden>
                  <ellipse cx="110" cy="45" rx="82" ry="30" stroke={cover.ink} strokeOpacity="0.3" strokeWidth="1.5" transform="rotate(-14 110 45)" />
                  <path d="M110 12c2.9 19 12.7 28.8 31.7 31.7-19 2.9-28.8 12.7-31.7 31.7-2.9-19-12.7-28.8-31.7-31.7 19-2.9 28.8-12.7 31.7-31.7Z" fill={cover.bg === "#056839" ? "#ffffff" : cover.bg === "#0a4a29" ? "#50bc7e" : "#056839"} stroke={cover.ink} strokeWidth="1.6" />
                </svg>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-[16px] p-[34px] max-xl:p-[25px] flex-1">
                {/* Meta */}
                <div className="flex items-center gap-[10px] text-[14px] text-[#58645c]">
                  <span>{new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="font-medium text-[22px] leading-[1.27] text-black">
                  {post.title}
                </h3>

                <p className="font-normal text-[16px] leading-[normal] text-[#58645c]">
                  {post.excerpt}
                </p>

                {/* Learn more link */}
                <div className="mt-auto">
                  <LearnMoreLink variant="Black" href={`/blog/${post.slug}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-[40px]">
        <a href="/blog" className="flex items-center gap-[10px] font-medium text-[20px] text-[#0a4a29] no-underline transition-colors hover:opacity-70">
          View all articles
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}