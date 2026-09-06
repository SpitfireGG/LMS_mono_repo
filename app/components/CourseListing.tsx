"use client";

import { useState } from "react";
import { cn } from "@/app/lib/utils";
import Button from "./Button";
import CourseCard from "./CourseCard";
import Pagination from "./Pagination";
import { categories, type CourseCategory } from "@/app/lib/courses";
import { useCourses } from "@/app/lib/api/hooks";
import type { CourseItem as ApiCourseItem } from "@/app/lib/api/types";

const PAGE_SIZE = 6;

const fallbackCourses: ApiCourseItem[] = [
  { id: "ccl-nepali", slug: "ccl-nepali", locale: "en", status: "PUBLISHED", category: "lang", tag: "NAATI CCL", title: "NAATI CCL Complete Mastery", author: "naati faculty", level: "All Levels", lessons: 42, hours: 18, students: 3200, rating: 4.9, price: 249, originalPrice: 390, tone: "dark", glyph: "interpreting", image: null, description: null, metaTitle: null, metaDescription: null, canonicalUrl: null, noindex: false, nofollow: false, ogImageUrl: null, ogImageAlt: null, publishedAt: new Date().toISOString(), contentUpdatedAt: new Date().toISOString(), deletedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "pte-79", slug: "pte-79", locale: "en", status: "PUBLISHED", category: "test", tag: "PTE", title: "PTE Academic — 79+ Booster", author: "pte experts", level: "Intermediate", lessons: 36, hours: 22, students: 2100, rating: 4.8, price: 199, originalPrice: 320, tone: "lime", glyph: "test", image: null, description: null, metaTitle: null, metaDescription: null, canonicalUrl: null, noindex: false, nofollow: false, ogImageUrl: null, ogImageAlt: null, publishedAt: new Date().toISOString(), contentUpdatedAt: new Date().toISOString(), deletedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "ielts-7", slug: "ielts-7", locale: "en", status: "PUBLISHED", category: "test", tag: "IELTS", title: "IELTS Band 7+ Intensive", author: "ielts pros", level: "Intermediate", lessons: 40, hours: 24, students: 1600, rating: 4.8, price: 189, originalPrice: 300, tone: "grey", glyph: "test", image: null, description: null, metaTitle: null, metaDescription: null, canonicalUrl: null, noindex: false, nofollow: false, ogImageUrl: null, ogImageAlt: null, publishedAt: new Date().toISOString(), contentUpdatedAt: new Date().toISOString(), deletedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "oet", slug: "oet", locale: "en", status: "PUBLISHED", category: "test", tag: "OET", title: "OET for Healthcare Professionals", author: "oet mentors", level: "Intermediate", lessons: 34, hours: 20, students: 640, rating: 4.7, price: 209, originalPrice: 330, tone: "lime", glyph: "test", image: null, description: null, metaTitle: null, metaDescription: null, canonicalUrl: null, noindex: false, nofollow: false, ogImageUrl: null, ogImageAlt: null, publishedAt: new Date().toISOString(), contentUpdatedAt: new Date().toISOString(), deletedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "mandarin", slug: "mandarin", locale: "en", status: "PUBLISHED", category: "lang", tag: "Languages", title: "Conversational Mandarin A1–A2", author: "linguaflow", level: "Beginner", lessons: 48, hours: 26, students: 1100, rating: 4.8, price: 159, originalPrice: 240, tone: "grey", glyph: "languages", image: null, description: null, metaTitle: null, metaDescription: null, canonicalUrl: null, noindex: false, nofollow: false, ogImageUrl: null, ogImageAlt: null, publishedAt: new Date().toISOString(), contentUpdatedAt: new Date().toISOString(), deletedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "fullstack", slug: "fullstack", locale: "en", status: "PUBLISHED", category: "tech", tag: "Coding", title: "Full-Stack Web Development", author: "codecraft", level: "Beginner", lessons: 88, hours: 64, students: 1400, rating: 4.9, price: 349, originalPrice: 520, tone: "grey", glyph: "coding", image: null, description: null, metaTitle: null, metaDescription: null, canonicalUrl: null, noindex: false, nofollow: false, ogImageUrl: null, ogImageAlt: null, publishedAt: new Date().toISOString(), contentUpdatedAt: new Date().toISOString(), deletedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "uiux", slug: "uiux", locale: "en", status: "PUBLISHED", category: "design", tag: "Creative", title: "UI/UX Design from Scratch", author: "purepearl studio", level: "All Levels", lessons: 54, hours: 32, students: 850, rating: 4.9, price: 289, originalPrice: 430, tone: "dark", glyph: "design", image: null, description: null, metaTitle: null, metaDescription: null, canonicalUrl: null, noindex: false, nofollow: false, ogImageUrl: null, ogImageAlt: null, publishedAt: new Date().toISOString(), contentUpdatedAt: new Date().toISOString(), deletedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "xero", slug: "xero", locale: "en", status: "PUBLISHED", category: "biz", tag: "Finance", title: "Bookkeeping & Xero Essentials", author: "ledgerpro", level: "Beginner", lessons: 30, hours: 16, students: 900, rating: 4.7, price: 179, originalPrice: 260, tone: "lime", glyph: "business", image: null, description: null, metaTitle: null, metaDescription: null, canonicalUrl: null, noindex: false, nofollow: false, ogImageUrl: null, ogImageAlt: null, publishedAt: new Date().toISOString(), contentUpdatedAt: new Date().toISOString(), deletedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export default function CourseListing({ className }: { className?: string }) {
  const [activeCategory, setActiveCategory] = useState<CourseCategory | "all">("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useCourses({
    category: activeCategory === "all" ? undefined : activeCategory,
    page,
    limit: PAGE_SIZE,
  });

  const apiCourses = data?.data ?? [];
  const hasApiData = apiCourses.length > 0;
  const filteredFallback = fallbackCourses.filter((c) => activeCategory === "all" || c.category === activeCategory);
  const fallbackPageCount = Math.max(1, Math.ceil(filteredFallback.length / PAGE_SIZE));
  const fallbackSlice = filteredFallback.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const visible: ApiCourseItem[] = hasApiData ? apiCourses : fallbackSlice;
  const pageCount = hasApiData ? (data?.meta.totalPages ?? 1) : fallbackPageCount;
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
        <p className="py-[40px] text-center text-[15.5px] text-[#566b5d]">No courses in this category yet.</p>
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