export type CourseCategory = "test" | "lang" | "tech" | "biz" | "design";
export type Level = "Beginner" | "Intermediate" | "All Levels";
export type CoverTone = "dark" | "lime" | "grey";
export type GlyphKey =
  | "interpreting"
  | "test"
  | "languages"
  | "coding"
  | "design"
  | "business";

export type CourseItem = {
  id: string;
  category: CourseCategory;
  tag: string;
  title: string;
  author: string;
  level: Level;
  lessons: number;
  hours: number;
  students: number;
  rating: number;
  price: number;
  originalPrice: number;
  tone: CoverTone;
  glyph: GlyphKey;
  /**
   * Optional cover media URL. When the backend supplies an uploaded image,
   * the card renders it; otherwise it falls back to the `glyph` illustration.
   */
  image?: string;
};

export const categories: { key: CourseCategory | "all"; label: string }[] = [
  { key: "all", label: "All courses" },
  { key: "test", label: "Test Prep" },
  { key: "lang", label: "Languages" },
  { key: "tech", label: "Technology" },
  { key: "biz", label: "Business" },
  { key: "design", label: "Creative" },
];

export const levels: Level[] = ["Beginner", "Intermediate", "All Levels"];

export const tones: Record<
  CoverTone,
  { bg: string; ink: string; accent: string }
> = {
  dark: { bg: "#0a4a29", ink: "#ffffff", accent: "#50bc7e" },
  lime: { bg: "#056839", ink: "#ffffff", accent: "#50bc7e" },
  grey: { bg: "#e8f6ee", ink: "#0a4a29", accent: "#056839" },
};

export const levelDot: Record<Level, string> = {
  Beginner: "#50bc7e",
  Intermediate: "#f5a623",
  "All Levels": "#056839",
};

export function formatStudents(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k+` : `${n}+`;
}

export const courses: CourseItem[] = [
  { id: "ccl-nepali", category: "lang", tag: "NAATI CCL", title: "NAATI CCL Complete Mastery", author: "naati faculty", level: "All Levels", lessons: 42, hours: 18, students: 3200, rating: 4.9, price: 249, originalPrice: 390, tone: "dark", glyph: "interpreting" },
  { id: "pte-79", category: "test", tag: "PTE", title: "PTE Academic — 79+ Booster", author: "pte experts", level: "Intermediate", lessons: 36, hours: 22, students: 2100, rating: 4.8, price: 199, originalPrice: 320, tone: "lime", glyph: "test" },
  { id: "fullstack", category: "tech", tag: "Coding", title: "Full-Stack Web Development", author: "codecraft", level: "Beginner", lessons: 88, hours: 64, students: 1400, rating: 4.9, price: 349, originalPrice: 520, tone: "grey", glyph: "coding" },
  { id: "xero", category: "biz", tag: "Finance", title: "Bookkeeping & Xero Essentials", author: "ledgerpro", level: "Beginner", lessons: 30, hours: 16, students: 900, rating: 4.7, price: 179, originalPrice: 260, tone: "lime", glyph: "business" },
  { id: "mandarin", category: "lang", tag: "Languages", title: "Conversational Mandarin A1–A2", author: "linguaflow", level: "Beginner", lessons: 48, hours: 26, students: 1100, rating: 4.8, price: 159, originalPrice: 240, tone: "grey", glyph: "languages" },
  { id: "uiux", category: "design", tag: "Creative", title: "UI/UX Design from Scratch", author: "purepearl studio", level: "All Levels", lessons: 54, hours: 32, students: 850, rating: 4.9, price: 289, originalPrice: 430, tone: "dark", glyph: "design" },
  { id: "ielts-7", category: "test", tag: "IELTS", title: "IELTS Band 7+ Intensive", author: "ielts pros", level: "Intermediate", lessons: 40, hours: 24, students: 1600, rating: 4.8, price: 189, originalPrice: 300, tone: "grey", glyph: "test" },
  { id: "digital-mktg", category: "biz", tag: "Business", title: "Digital Marketing Launchpad", author: "market360", level: "All Levels", lessons: 46, hours: 28, students: 900, rating: 4.7, price: 229, originalPrice: 340, tone: "dark", glyph: "business" },
  { id: "python-data", category: "tech", tag: "Coding", title: "Python for Data Analysis", author: "codecraft", level: "Intermediate", lessons: 52, hours: 30, students: 780, rating: 4.8, price: 269, originalPrice: 400, tone: "grey", glyph: "coding" },
  { id: "ccl-hindi", category: "lang", tag: "NAATI CCL", title: "NAATI CCL — Hindi ⇄ English", author: "naati faculty", level: "All Levels", lessons: 40, hours: 17, students: 1500, rating: 4.9, price: 249, originalPrice: 390, tone: "dark", glyph: "interpreting" },
  { id: "oet", category: "test", tag: "OET", title: "OET for Healthcare Professionals", author: "oet mentors", level: "Intermediate", lessons: 34, hours: 20, students: 640, rating: 4.7, price: 209, originalPrice: 330, tone: "lime", glyph: "test" },
  { id: "motion", category: "design", tag: "Creative", title: "Motion & After Effects Basics", author: "purepearl studio", level: "Beginner", lessons: 38, hours: 22, students: 520, rating: 4.6, price: 219, originalPrice: 320, tone: "grey", glyph: "design" },
  { id: "react-next", category: "tech", tag: "Coding", title: "React & Next.js Masterclass", author: "codecraft", level: "Intermediate", lessons: 72, hours: 48, students: 1200, rating: 4.9, price: 329, originalPrice: 480, tone: "dark", glyph: "coding" },
  { id: "payroll", category: "biz", tag: "Finance", title: "Xero Payroll & BAS", author: "ledgerpro", level: "Intermediate", lessons: 26, hours: 14, students: 430, rating: 4.6, price: 169, originalPrice: 250, tone: "grey", glyph: "business" },
  { id: "biz-english", category: "lang", tag: "Languages", title: "Business English Fluency", author: "linguaflow", level: "All Levels", lessons: 44, hours: 24, students: 970, rating: 4.8, price: 179, originalPrice: 260, tone: "lime", glyph: "languages" },
  { id: "brand-id", category: "design", tag: "Creative", title: "Brand Identity Design", author: "purepearl studio", level: "All Levels", lessons: 40, hours: 26, students: 610, rating: 4.8, price: 259, originalPrice: 380, tone: "dark", glyph: "design" },
];
