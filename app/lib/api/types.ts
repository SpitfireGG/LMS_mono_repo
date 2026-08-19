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

export type PaymentProviderKey = 'STRIPE' | 'PAYONEER' | 'CARD';

export type PaymentStatusValue =
  | 'PENDING'
  | 'PROCESSING'
  | 'REQUIRES_ACTION'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED';

/** The trimmed course the API embeds on a payment. */
export interface PaymentCourse {
  id: string;
  slug: string;
  title: string;
  image: string | null;
  tag: string;
  author: string;
}

export interface PaymentItem {
  id: string;
  reference: string;
  userId: string;
  courseId: string;
  provider: PaymentProviderKey;
  status: PaymentStatusValue;
  amount: number;
  currency: string;
  providerRef: string | null;
  checkoutUrl: string | null;
  failureReason: string | null;
  metadata: Record<string, unknown> | null;
  cardBrand: string | null;
  cardLast4: string | null;
  cardExpMonth: number | null;
  cardExpYear: number | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  course?: PaymentCourse;
}

export interface PaymentMethodOption {
  key: PaymentProviderKey;
  label: string;
  description: string;
  enabled: boolean;
  /** True when the provider has no credentials and settles locally. */
  sandbox: boolean;
}

export interface PaymentConfig {
  currency: string;
  providers: PaymentMethodOption[];
  stripePublishableKey: string | null;
  acceptsRawCard: boolean;
}

export interface CardDetailsInput {
  number: string;
  expMonth: number;
  expYear: number;
  cvc: string;
  holderName?: string;
}

export interface CheckoutRequest {
  courseId: string;
  provider: PaymentProviderKey;
  paymentMethodId?: string;
  card?: CardDetailsInput;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutResult {
  payment: PaymentItem;
  /** Hosted provider page, or a 3-D Secure redirect for the card flow. */
  checkoutUrl: string | null;
  clientSecret: string | null;
  sandbox: boolean;
}

export interface WishlistEntry {
  id: string;
  userId: string;
  courseId: string;
  createdAt: string;
  course: CourseItem;
}

export type MockTestKind = 'MOCK_TEST' | 'INTERVIEW';

export interface MockTestItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  language: string;
  category: string;
  level: string;
  kind: MockTestKind;
  isFree: boolean;
  status: PublishStatus;
  sortOrder: number;
  durationSeconds: number | null;
  pdfUrl: string | null;
  pdfName: string | null;
  pdfSize: number | null;
  mediaUrl: string | null;
  mediaName: string | null;
  mediaSize: number | null;
  mediaMimeType: string | null;
  /** True when the assets are withheld because the visitor is signed out. */
  locked?: boolean;
  publishedAt: string | null;
  contentUpdatedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockTestFacets {
  languages: { value: string; count: number }[];
  categories: { value: string; count: number }[];
  kinds: { value: string; count: number }[];
  total: number;
}

export interface MockTestAttempt {
  id: string;
  userId: string;
  mockTestId: string;
  recordingUrl: string | null;
  recordingSize: number | null;
  durationSeconds: number | null;
  notes: string | null;
  createdAt: string;
  mockTest?: { id: string; slug: string; title: string; language: string };
}

export interface MockTestInput {
  title: string;
  slug?: string;
  description?: string;
  language?: string;
  category?: string;
  level?: string;
  kind?: MockTestKind;
  isFree?: boolean;
  sortOrder?: number;
  status?: PublishStatus;
  durationSeconds?: number;
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