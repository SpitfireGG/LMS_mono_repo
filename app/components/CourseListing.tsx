"use client";

import { useState } from "react";
import { cn } from "@/app/lib/utils";
import Button from "./Button";
import CourseCard from "./CourseCard";
import Pagination from "./Pagination";
import { categories, type CourseCategory } from "@/app/lib/courses";
import { useCourses } from "@/app/lib/api/hooks";

const PAGE_SIZE = 6;

export default function CourseListing({ className }: { className?: string }) {
  const [activeCategory, setActiveCategory] = useState<CourseCategory | "all">("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useCourses({
    category: activeCategory === "all" ? undefined : activeCategory,
    page,
    limit: PAGE_SIZE,
  });

  const visible = data?.data ?? [];
  const pageCount = data?.meta.totalPages ?? 1;
  const safePage = Math.min(page, Math.max(1, pageCount));

  const selectCategory = (key: CourseCategory | "all") => {
    setActiveCategory(key);
    setPage(1);
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
        {isLoading
          ? [...Array(PAGE_SIZE)].map((_, i) => (
              <div
                key={i}
                className="h-[280px] animate-pulse rounded-[24px] border border-[#cfe3d6] bg-white"
              />
            ))
          : visible.map((course) => (
              <CourseCard key={course.id} c={course} />
            ))}
      </div>

      {!isLoading && visible.length === 0 && (
        <p className="py-[40px] text-center text-[15.5px] text-[#566b5d]">
          {isError
            ? "Courses are unavailable right now. Please try again shortly."
            : "No courses in this category yet."}
        </p>
      )}

      {pageCount > 1 && (
        <Pagination page={safePage} pageCount={pageCount} onChange={setPage} className="mt-[40px]" />
      )}

      <div className="flex justify-center mt-[44px]">
        <Button variant="primary" href="/courses" className="py-[19px] px-[35px]">
          Explore all courses
        </Button>
      </div>
    </div>
  );
}