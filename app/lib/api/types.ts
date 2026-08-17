export type PublishStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';

export type CourseCategory = 'test' | 'lang' | 'tech' | 'biz' | 'design';
export type Level = 'Beginner' | 'Intermediate' | 'All Levels';
export type CoverTone = 'dark' | 'lime' | 'grey';
export type GlyphKey =
  | 'interpreting'
  | 'test'
  | 'languages'
  | 'coding'
  | 'design'
  | 'business';

export interface CourseItem {
  id: string;
  slug: string;
  locale: string;
  status: PublishStatus;
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
  originalPrice: number | null;
  tone: CoverTone;
  glyph: GlyphKey;
  image: string | null;
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  noindex: boolean;
  nofollow: boolean;
  ogImageUrl: string | null;
  ogImageAlt: string | null;
  publishedAt: string | null;
  contentUpdatedAt: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  seo?: CourseSeoMeta;
}

export interface CourseSeoMeta {
  title: string;
  description?: string;
  canonical: string;
  robots: string;
  openGraph: {
    type: string;
    title: string;
    description?: string;
    url: string;
    siteName: string;
    locale: string;
    images: { url: string; width: number; height: number; alt: string }[];
  };
  twitter: {
    card: string;
    title: string;
    description?: string;
    image?: string;
    imageAlt?: string;
  };
  alternates: { hreflang: string; href: string }[];
  structuredData: Record<string, unknown>[];
  breadcrumbs: { name: string; url: string; position: number }[];
  lastModified?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface QueryParams {
  search?: string;
  category?: string;
  level?: string;
  priceRange?: 'lt200' | '200to300' | 'gt300';
  minRating?: number;
  sort?: 'popular' | 'rating' | 'price-asc' | 'price-desc' | 'students';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  featured?: boolean;
  status?: PublishStatus;
}

export interface BlogPostItem {
  id: string;
  slug: string;
  locale: string;
  status: PublishStatus;
  tag: string;
  readTime: string;
  title: string;
  excerpt: string;
  content: string | null;
  coverImage: string | null;
  author: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  noindex: boolean;
  nofollow: boolean;
  ogImageUrl: string | null;
  ogImageAlt: string | null;
  publishedAt: string | null;
  contentUpdatedAt: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  seo?: BlogPostSeoMeta;
}

export interface BlogPostSeoMeta {
  title: string;
  description?: string;
  canonical: string;
  robots: string;
  openGraph: {
    type: string;
    title: string;
    description?: string;
    url: string;
    siteName: string;
    locale: string;
    images: { url: string; width: number; height: number; alt: string }[];
  };
  twitter: {
    card: string;
    title: string;
    description?: string;
    image?: string;
    imageAlt?: string;
  };
  alternates: { hreflang: string; href: string }[];
  structuredData: Record<string, unknown>[];
  breadcrumbs: { name: string; url: string; position: number }[];
  lastModified?: string;
}

export interface TestimonialItem {
  id: string;
  slug: string;
  locale: string;
  status: PublishStatus;
  quote: string;
  authorName: string;
  authorTitle: string;
  avatar: string | null;
  featured: boolean;
  sortOrder: number;
  publishedAt: string | null;
  contentUpdatedAt: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  seo?: TestimonialSeoMeta;
}

export interface TestimonialSeoMeta {
  title: string;
  description?: string;
  canonical: string;
  robots: string;
  openGraph: {
    type: string;
    title: string;
    description?: string;
    url: string;
    siteName: string;
    locale: string;
    images: { url: string; width: number; height: number; alt: string }[];
  };
  twitter: {
    card: string;
    title: string;
    description?: string;
    image?: string;
    imageAlt?: string;
  };
  alternates: { hreflang: string; href: string }[];
  structuredData: Record<string, unknown>[];
  breadcrumbs: { name: string; url: string; position: number }[];
  lastModified?: string;
}

export interface FAQItem {
  id: string;
  slug: string;
  locale: string;
  status: PublishStatus;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  publishedAt: string | null;
  contentUpdatedAt: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  seo?: FAQSeoMeta;
}

export interface FAQSeoMeta {
  title: string;
  description?: string;
  canonical: string;
  robots: string;
  openGraph: {
    type: string;
    title: string;
    description?: string;
    url: string;
    siteName: string;
    locale: string;
    images: { url: string; width: number; height: number; alt: string }[];
  };
  twitter: {
    card: string;
    title: string;
    description?: string;
    image?: string;
    imageAlt?: string;
  };
  alternates: { hreflang: string; href: string }[];
  structuredData: Record<string, unknown>[];
  breadcrumbs: { name: string; url: string; position: number }[];
  lastModified?: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  locale: string;
  status: PublishStatus;
  title: string;
  body: string;
  icon: string;
  category: string;
  sortOrder: number;
  publishedAt: string | null;
  contentUpdatedAt: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  seo?: ServiceSeoMeta;
}

export interface ServiceSeoMeta {
  title: string;
  description?: string;
  canonical: string;
  robots: string;
  openGraph: {
    type: string;
    title: string;
    description?: string;
    url: string;
    siteName: string;
    locale: string;
    images: { url: string; width: number; height: number; alt: string }[];
  };
  twitter: {
    card: string;
    title: string;
    description?: string;
    image?: string;
    imageAlt?: string;
  };
  alternates: { hreflang: string; href: string }[];
  structuredData: Record<string, unknown>[];
  breadcrumbs: { name: string; url: string; position: number }[];
  lastModified?: string;
}

export interface TeamMemberItem {
  id: string;
  slug: string;
  locale: string;
  status: PublishStatus;
  name: string;
  role: string;
  bio: string | null;
  image: string | null;
  category: string;
  sortOrder: number;
  publishedAt: string | null;
  contentUpdatedAt: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  seo?: TeamMemberSeoMeta;
}

export interface TeamMemberSeoMeta {
  title: string;
  description?: string;
  canonical: string;
  robots: string;
  openGraph: {
    type: string;
    title: string;
    description?: string;
    url: string;
    siteName: string;
    locale: string;
    images: { url: string; width: number; height: number; alt: string }[];
  };
  twitter: {
    card: string;
    title: string;
    description?: string;
    image?: string;
    imageAlt?: string;
  };
  alternates: { hreflang: string; href: string }[];
  structuredData: Record<string, unknown>[];
  breadcrumbs: { name: string; url: string; position: number }[];
  lastModified?: string;
}

export interface AnnouncementItem {
  id: string;
  slug: string;
  locale: string;
  status: PublishStatus;
  text: string;
  link: string | null;
  linkText: string | null;
  publishedAt: string | null;
  contentUpdatedAt: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  seo?: AnnouncementSeoMeta;
}

export interface AnnouncementSeoMeta {
  title: string;
  description?: string;
  canonical: string;
  robots: string;
  openGraph: {
    type: string;
    title: string;
    description?: string;
    url: string;
    siteName: string;
    locale: string;
    images: { url: string; width: number; height: number; alt: string }[];
  };
  twitter: {
    card: string;
    title: string;
    description?: string;
    image?: string;
    imageAlt?: string;
  };
  alternates: { hreflang: string; href: string }[];
  structuredData: Record<string, unknown>[];
  breadcrumbs: { name: string; url: string; position: number }[];
  lastModified?: string;
}

export interface CaseStudyItem {
  id: string;
  slug: string;
  locale: string;
  status: PublishStatus;
  title: string;
  excerpt: string;
  content: string | null;
  image: string | null;
  result: string | null;
  tags: string;
  sortOrder: number;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  noindex: boolean;
  nofollow: boolean;
  ogImageUrl: string | null;
  ogImageAlt: string | null;
  publishedAt: string | null;
  contentUpdatedAt: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  seo?: CaseStudySeoMeta;
}

export interface CaseStudySeoMeta {
  title: string;
  description?: string;
  canonical: string;
  robots: string;
  openGraph: {
    type: string;
    title: string;
    description?: string;
    url: string;
    siteName: string;
    locale: string;
    images: { url: string; width: number; height: number; alt: string }[];
  };
  twitter: {
    card: string;
    title: string;
    description?: string;
    image?: string;
    imageAlt?: string;
  };
  alternates: { hreflang: string; href: string }[];
  structuredData: Record<string, unknown>[];
  breadcrumbs: { name: string; url: string; position: number }[];
  lastModified?: string;
}