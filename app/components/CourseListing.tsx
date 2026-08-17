"use client";

import { useState, useMemo } from "react";
import { cn } from "@/app/lib/utils";
import Button from "./Button";
import CourseCard from "./CourseCard";
import Pagination from "./Pagination";
import { courses, categories, type CourseCategory } from "@/app/lib/courses";
import type { CourseItem as ApiCourseItem } from "@/app/lib/api/types";

const PAGE_SIZE = 6;

const mapLocalToApi = (c: typeof courses[0]): ApiCourseItem => ({
  id: c.id,
  slug: c.title.toLowerCase().replace(/\s+/g, '-'),
  locale: "en",
  status: "PUBLISHED" as const,
  category: c.category,
  tag: c.tag,
  title: c.title,
  author: c.author,
  level: c.level,
  lessons: c.lessons,
  hours: c.hours,
  students: c.students,
  rating: c.rating,
  price: c.price,
  originalPrice: c.originalPrice,
  tone: c.tone ?? "dark",
  glyph: c.glyph ?? "interpreting",
  image: c.image ?? null,
  description: "",
  metaTitle: null,
  metaDescription: null,
  canonicalUrl: null,
  noindex: false,
  nofollow: false,
  ogImageUrl: null,
  ogImageAlt: null,
  publishedAt: new Date().toISOString(),
  contentUpdatedAt: new Date().toISOString(),
  deletedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export default function CourseListing({ className }: { className?: string }) {
  const [activeCategory, setActiveCategory] = useState<CourseCategory | "all">("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => 
    activeCategory === "all"
      ? courses
      : courses.filter((c) => c.category === activeCategory),
  [activeCategory]);

  const filteredApi = useMemo(() => filtered.map(mapLocalToApi), [filtered]);

  const pageCount = Math.ceil(filteredApi.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(0, pageCount - 1));
  const visible = filteredApi.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const selectCategory = (key: CourseCategory | "all") => {
    setActiveCategory(key);
    setPage(0);
  };

  return (
    <div
      className={cn(
        "w-full max-w-[1440px] mx-auto px-[100px] max-xl:px-[60px] max-sm:px-[30px] scroll-mt-[40px]",
        className
      )}
      id="courses"
    >
      {/* Filter tabs */}
      <div
        role="tablist"
        aria-label="Course categories"
        className="flex gap-[10px] items-center justify-center flex-wrap mb-[44px] max-sm:mb-[30px]"
      >
        {categories.map((cat) => (
          <button
            key={cat.key}
            role="tab"
            aria-selected={activeCategory === cat.key}
            onClick={() => selectCategory(cat.key)}
            className={cn(
              "rounded-full px-[20px] py-[10px] font-medium text-[15px] transition-all duration-300 cursor-pointer border",
              activeCategory === cat.key
                ? "bg-[#0a4a29] text-white border-[#0a4a29] shadow-[var(--shadow-e1)]"
                : "bg-white text-[#0a4a29] border-[#cfe3d6] hover:bg-[#e8f6ee]"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-3 gap-[28px] max-xl:gap-[24px] max-xl:grid-cols-2 max-sm:grid-cols-1">
        {visible.map((course) => (
          <CourseCard key={course.id} c={course} />
        ))}
      </div>

      <Pagination page={safePage} pageCount={pageCount} onChange={setPage} className="mt-[40px]" />

      <div className="flex justify-center mt-[44px]">
        <Button variant="primary" href="/courses" className="py-[19px] px-[35px]">
          Explore all courses
        </Button>
      </div>
    </div>
  );
}