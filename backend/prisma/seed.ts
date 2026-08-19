import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  // ── Admin user ──────────────────────────────────────
  const adminHash = await argon2.hash("Admin@123", {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

  await prisma.user.upsert({
    where: { email: "admin@naatiexcellence.com.au" },
    update: {},
    create: {
      email: "admin@naatiexcellence.com.au",
      name: "Admin",
      password: adminHash,
      role: "admin",
      isEmailVerified: true,
    },
  });

  // ── Seed courses ────────────────────────────────────
  const courses = [
    { id: "ccl-nepali", category: "lang", tag: "NAATI CCL", title: "NAATI CCL Complete Mastery", author: "naati faculty", level: "All Levels", lessons: 42, hours: 18, students: 3200, rating: 4.9, price: 249, originalPrice: 390, tone: "dark", glyph: "interpreting" },
    { id: "pte-79", category: "test", tag: "PTE", title: "PTE Academic 79+ Booster", author: "pte experts", level: "Intermediate", lessons: 36, hours: 22, students: 2100, rating: 4.8, price: 199, originalPrice: 320, tone: "lime", glyph: "test" },
    { id: "fullstack", category: "tech", tag: "Coding", title: "Full-Stack Web Development", author: "codecraft", level: "Beginner", lessons: 88, hours: 64, students: 1400, rating: 4.9, price: 349, originalPrice: 520, tone: "grey", glyph: "coding" },
    { id: "xero", category: "biz", tag: "Finance", title: "Bookkeeping & Xero Essentials", author: "ledgerpro", level: "Beginner", lessons: 30, hours: 16, students: 900, rating: 4.7, price: 179, originalPrice: 260, tone: "lime", glyph: "business" },
    { id: "mandarin", category: "lang", tag: "Languages", title: "Conversational Mandarin A1 A2", author: "linguaflow", level: "Beginner", lessons: 48, hours: 26, students: 1100, rating: 4.8, price: 159, originalPrice: 240, tone: "grey", glyph: "languages" },
    { id: "uiux", category: "design", tag: "Creative", title: "UI/UX Design from Scratch", author: "purepearl studio", level: "All Levels", lessons: 54, hours: 32, students: 850, rating: 4.9, price: 289, originalPrice: 430, tone: "dark", glyph: "design" },
    { id: "ielts-7", category: "test", tag: "IELTS", title: "IELTS Band 7+ Intensive", author: "ielts pros", level: "Intermediate", lessons: 40, hours: 24, students: 1600, rating: 4.8, price: 189, originalPrice: 300, tone: "grey", glyph: "test" },
    { id: "digital-mktg", category: "biz", tag: "Business", title: "Digital Marketing Launchpad", author: "market360", level: "All Levels", lessons: 46, hours: 28, students: 900, rating: 4.7, price: 229, originalPrice: 340, tone: "dark", glyph: "business" },
    { id: "python-data", category: "tech", tag: "Coding", title: "Python for Data Analysis", author: "codecraft", level: "Intermediate", lessons: 52, hours: 30, students: 780, rating: 4.8, price: 269, originalPrice: 400, tone: "grey", glyph: "coding" },
    { id: "ccl-hindi", category: "lang", tag: "NAATI CCL", title: "NAATI CCL Hindi English", author: "naati faculty", level: "All Levels", lessons: 40, hours: 17, students: 1500, rating: 4.9, price: 249, originalPrice: 390, tone: "dark", glyph: "interpreting" },
    { id: "oet", category: "test", tag: "OET", title: "OET for Healthcare Professionals", author: "oet mentors", level: "Intermediate", lessons: 34, hours: 20, students: 640, rating: 4.7, price: 209, originalPrice: 330, tone: "lime", glyph: "test" },
    { id: "motion", category: "design", tag: "Creative", title: "Motion & After Effects Basics", author: "purepearl studio", level: "Beginner", lessons: 38, hours: 22, students: 520, rating: 4.6, price: 219, originalPrice: 320, tone: "grey", glyph: "design" },
    { id: "react-next", category: "tech", tag: "Coding", title: "React & Next.js Masterclass", author: "codecraft", level: "Intermediate", lessons: 72, hours: 48, students: 1200, rating: 4.9, price: 329, originalPrice: 480, tone: "dark", glyph: "coding" },
    { id: "payroll", category: "biz", tag: "Finance", title: "Xero Payroll & BAS", author: "ledgerpro", level: "Intermediate", lessons: 26, hours: 14, students: 430, rating: 4.6, price: 169, originalPrice: 250, tone: "grey", glyph: "business" },
    { id: "biz-english", category: "lang", tag: "Languages", title: "Business English Fluency", author: "linguaflow", level: "All Levels", lessons: 44, hours: 24, students: 970, rating: 4.8, price: 179, originalPrice: 260, tone: "lime", glyph: "languages" },
    { id: "brand-id", category: "design", tag: "Creative", title: "Brand Identity Design", author: "purepearl studio", level: "All Levels", lessons: 40, hours: 26, students: 610, rating: 4.8, price: 259, originalPrice: 380, tone: "dark", glyph: "design" },
  ];

  for (const course of courses) {
    const data = { ...course, slug: course.id };
    await prisma.course.upsert({
      where: { id: course.id },
      update: data,
      create: data,
    });
  }

  // ── Seed FAQs ───────────────────────────────────────
  const faqs = [
    { slug: "do-i-need-prior-experience", question: "Do I need any prior experience before starting a course?", answer: "Not at all. Every program starts from the fundamentals and builds up, and each course page lists exactly what's assumed on day one." },
    { slug: "are-classes-self-paced", question: "Are classes self-paced, or do I attend live sessions?", answer: "Both. Core lessons are self-paced with lifetime access, so you learn around work and family. Live tutorials and mock tests run every week." },
    { slug: "how-long-course-access", question: "How long will I have access to the course materials?", answer: "Forever. Once you enroll you keep lifetime access to lessons, updates, and practice material." },
    { slug: "certificates-recognised", question: "Are your certificates recognised for PR and career goals?", answer: "Our NAATI CCL and test-prep programs are built to the current official criteria, and our completion certificates are widely accepted by employers." },
    { slug: "one-on-one-tutor-help", question: "Can I get one-on-one help from a tutor?", answer: "Yes. Every learner can book one-on-one sessions with certified tutors, and our community forum is monitored daily." },
    { slug: "refund-policy", question: "What if a course turns out not to be right for me?", answer: "Your first course is on us, and if a paid program isn't the right fit within the first 7 days we'll refund it." },
  ];

  for (let i = 0; i < faqs.length; i++) {
    const { slug, ...faqData } = faqs[i];
    await prisma.fAQ.upsert({
      where: { slug_locale: { slug, locale: "en" } },
      update: { ...faqData, sortOrder: i },
      create: { slug, locale: "en", ...faqData, sortOrder: i },
    });
  }

  // ── Seed testimonials ───────────────────────────────
  const testimonials = [
    { slug: "priya-nadkarni", quote: "I passed NAATI CCL on my first attempt and claimed my 5 PR points. The mock tests felt exactly like the real thing.", authorName: "Priya Nadkarni", authorTitle: "NAATI CCL Passed on First Attempt" },
    { slug: "james-whitfield", quote: "Went from zero coding experience to landing a junior dev role in four months. Best investment I've made.", authorName: "James Whitfield", authorTitle: "Full-Stack Web Development Graduate" },
    { slug: "mei-ling-tan", quote: "Scored a perfect 90 in PTE after just six weeks. The feedback on my speaking tasks was specific and genuinely useful.", authorName: "Mei Ling Tan", authorTitle: "PTE Academic 90/90 Score" },
    { slug: "sofia-rossi", quote: "The design course gave me a portfolio I am proud of. NAATI Excellence Academy made something intimidating feel completely doable.", authorName: "Sofia Rossi", authorTitle: "UI/UX Design Graduate" },
    { slug: "arjun-mehta", quote: "Best money I have spent on upskilling. Clear, no fluff, and I could study on the train.", authorName: "Arjun Mehta", authorTitle: "Digital Marketing Launchpad Graduate" },
  ];

  for (let i = 0; i < testimonials.length; i++) {
    const { slug, ...testimonialData } = testimonials[i];
    await prisma.testimonial.upsert({
      where: { slug_locale: { slug, locale: "en" } },
      update: { ...testimonialData, sortOrder: i },
      create: { slug, locale: "en", ...testimonialData, sortOrder: i },
    });
  }

  // ── Seed team members ───────────────────────────────
  const team = [
    { slug: "anita-sharma", name: "Dr. Anita Sharma", role: "Lead NAATI CCL Tutor", bio: "Certified NAATI interpreter with 12+ years of experience.", image: null, category: "tutor" },
    { slug: "michael-chen", name: "Michael Chen", role: "PTE/IELTS Director", bio: "Expert in English proficiency test preparation.", image: null, category: "tutor" },
    { slug: "sarah-patel", name: "Sarah Patel", role: "Head of Coding", bio: "Full-stack developer who has taught 2000+ students.", image: null, category: "tutor" },
    { slug: "david-kim", name: "David Kim", role: "Business & Finance Lead", bio: "CPA with background in Xero certification training.", image: null, category: "tutor" },
    { slug: "emma-rodriguez", name: "Emma Rodriguez", role: "Design Mentor", bio: "UX designer previously at Canva and Atlassian.", image: null, category: "tutor" },
    { slug: "raj-patel", name: "Raj Patel", role: "Founder & CEO", bio: "Founded NAATI Excellence Academy in 2018 to make quality education accessible.", image: null, category: "leadership" },
  ];

  for (let i = 0; i < team.length; i++) {
    const { slug, ...memberData } = team[i];
    await prisma.teamMember.upsert({
      where: { slug_locale: { slug, locale: "en" } },
      update: { ...memberData, sortOrder: i },
      create: { slug, locale: "en", ...memberData, sortOrder: i },
    });
  }

  // ── Seed services ───────────────────────────────────
  const services = [
    { slug: "naati-ccl-coaching", title: "NAATI CCL Coaching", body: "Structured preparation for the NAATI Credentialed Community Language test. Mock exams that mirror the real thing.", icon: "interpreting", category: "course" },
    { slug: "pte-ielts-prep", title: "PTE / IELTS Prep", body: "Targeted training for PTE Academic and IELTS. Get the score you need for your visa or university application.", icon: "test", category: "course" },
    { slug: "language-courses", title: "Language Courses", body: "From conversational English to business fluency. Build real-world communication skills.", icon: "languages", category: "course" },
    { slug: "coding-bootcamps", title: "Coding Bootcamps", body: "Full-stack web development, Python, React, and Next.js. From zero to job-ready.", icon: "coding", category: "course" },
    { slug: "design-creative", title: "Design & Creative", body: "UI/UX, motion design, and brand identity. Build a portfolio that stands out.", icon: "design", category: "course" },
    { slug: "business-finance", title: "Business & Finance", body: "Bookkeeping, Xero certification, digital marketing, and BAS preparation.", icon: "business", category: "course" },
  ];

  for (let i = 0; i < services.length; i++) {
    const { slug, ...serviceData } = services[i];
    await prisma.service.upsert({
      where: { slug_locale: { slug, locale: "en" } },
      update: { ...serviceData, sortOrder: i },
      create: { slug, locale: "en", ...serviceData, sortOrder: i },
    });
  }

  console.log("Seed data inserted successfully");
  console.log("Admin: admin@naatiexcellence.com.au / Admin@123");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
