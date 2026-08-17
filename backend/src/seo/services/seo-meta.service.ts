import { Injectable } from "@nestjs/common";
import { CanonicalService } from "./canonical.service";
import {
  StructuredDataService,
  StructuredDataInput,
} from "./structured-data.service";

export interface SeoMetaInput {
  entityType: "blog" | "course" | "case-study" | "testimonial" | "faq" | "service" | "team-member" | "announcement";
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
  ogImageUrl?: string;
  ogImageAlt?: string;
  locale?: string;
  publishedAt?: Date | null;
  contentUpdatedAt: Date;
  coverImage?: string;
  author?: string;
  tags?: string[];
  price?: number;
}

export interface SeoMeta {
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

const TITLE_LIMIT = 60;
const DESC_MIN = 120;
const DESC_MAX = 158;

@Injectable()
export class SeoMetaService {
  constructor(
    private readonly canonical: CanonicalService,
    private readonly structuredData: StructuredDataService,
  ) {}

  private get brand(): string {
    return process.env.BRAND_NAME ?? "NAATI Excellence Academy";
  }

  private get defaultLocale(): string {
    return process.env.DEFAULT_LOCALE ?? "en";
  }

  private pathPrefix(entityType: SeoMetaInput["entityType"]): string {
    switch (entityType) {
      case "blog":
        return "blog";
      case "course":
        return "courses";
      case "case-study":
        return "case-studies";
      case "testimonial":
        return "testimonials";
      case "faq":
        return "faqs";
      case "service":
        return "services";
      case "team-member":
        return "team-members";
      case "announcement":
        return "announcements";
      default:
        return "pages";
    }
  }

  private truncateAtWord(value: string, limit: number): string {
    if (value.length <= limit) return value;
    const trimmed = value.slice(0, limit);
    const lastSpace = trimmed.lastIndexOf(" ");
    return lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed;
  }

  private buildTitle(entityTitle: string, metaTitle?: string): string {
    if (metaTitle?.trim()) return this.truncateAtWord(metaTitle.trim(), TITLE_LIMIT);
    return this.truncateAtWord(`${entityTitle} | ${this.brand}`, TITLE_LIMIT);
  }

  private buildDescription(input: SeoMetaInput): string | undefined {
    if (input.metaDescription?.trim()) return input.metaDescription.trim().slice(0, DESC_MAX);
    if (input.excerpt?.trim()) return input.excerpt.trim().slice(0, DESC_MAX);

    const text = (input.content ?? "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) return undefined;

    if (text.length <= DESC_MAX) return text;
    const firstSentence = text.match(/^.*?[.!?](\s|$)/);
    if (firstSentence && firstSentence[0].trim().length >= DESC_MIN) {
      return this.truncateAtWord(firstSentence[0].trim(), DESC_MAX);
    }
    return this.truncateAtWord(text, DESC_MAX);
  }

  private buildRobots(input: SeoMetaInput): string {
    const indexable = !input.noindex;
    const followable = !input.nofollow;
    const index = indexable ? "index" : "noindex";
    const follow = followable ? "follow" : "nofollow";
    return `${index}, ${follow}, max-image-preview:large, max-snippet:-1`;
  }

  build(input: SeoMetaInput): SeoMeta {
    const path = `${this.pathPrefix(input.entityType)}/${input.slug}`;
    const canonical = input.canonicalUrl ?? this.canonical.build(path);
    const locale = input.locale ?? this.defaultLocale;
    const title = this.buildTitle(input.title, input.metaTitle);
    const description = this.buildDescription(input);
    const image = input.ogImageUrl ?? input.coverImage;

    const siteName = this.brand;
    const ogType =
      input.entityType === "course" ? "product" : "article";

    const structured = this.structuredData.build({
      entityType: input.entityType,
      slug: input.slug,
      title: input.title,
      description,
      publishedAt: input.publishedAt,
      contentUpdatedAt: input.contentUpdatedAt,
      author: input.author,
      image,
      inLanguage: locale,
      offers:
        input.entityType === "course" && input.price !== undefined
          ? { price: input.price }
          : undefined,
    } as StructuredDataInput);

    return {
      title,
      ...(description ? { description } : {}),
      canonical,
      robots: this.buildRobots(input),
      openGraph: {
        type: ogType,
        title,
        ...(description ? { description } : {}),
        url: canonical,
        siteName,
        locale: `${locale}_${locale.toUpperCase()}`,
        images: image
          ? [{ url: image, width: 1200, height: 630, alt: input.ogImageAlt ?? "" }]
          : [],
      },
      twitter: {
        card: image ? "summary_large_image" : "summary",
        title,
        ...(description ? { description } : {}),
        ...(image ? { image, imageAlt: input.ogImageAlt ?? "" } : {}),
      },
      alternates: [
        { hreflang: locale, href: canonical },
        { hreflang: "x-default", href: canonical },
      ],
      structuredData: [
        this.stripEmpty(structured) as Record<string, unknown>,
      ],
      breadcrumbs: [
        { name: "Home", url: this.canonical.getSiteUrl(), position: 1 },
        {
          name: this.pathPrefix(input.entityType),
          url: this.canonical.build(this.pathPrefix(input.entityType)),
          position: 2,
        },
        { name: input.title, url: canonical, position: 3 },
      ],
      lastModified: input.contentUpdatedAt.toISOString(),
    };
  }

  private stripEmpty(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value
        .map((v) => this.stripEmpty(v))
        .filter((v) => this.isFilled(v));
    }
    if (value && typeof value === "object") {
      const out: Record<string, unknown> = {};
      for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
        const cleaned = this.stripEmpty(v);
        if (this.isFilled(cleaned)) out[key] = cleaned;
      }
      return out;
    }
    return value;
  }

  private isFilled(value: unknown): boolean {
    if (value === undefined || value === null) return false;
    if (typeof value === "string") return value.length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object") return Object.keys(value).length > 0;
    return true;
  }

  homepage(): SeoMeta {
    const site = this.canonical.getSiteUrl();
    const locale = this.defaultLocale;
    const description = process.env.HOME_DESCRIPTION ?? undefined;
    return {
      title: this.brand,
      ...(description ? { description } : {}),
      canonical: site,
      robots: "index, follow, max-image-preview:large, max-snippet:-1",
      openGraph: {
        type: "website",
        title: this.brand,
        ...(description ? { description } : {}),
        url: site,
        siteName: this.brand,
        locale: `${locale}_${locale.toUpperCase()}`,
        images: [],
      },
      twitter: { card: "summary", title: this.brand, ...(description ? { description } : {}) },
      alternates: [
        { hreflang: locale, href: site },
        { hreflang: "x-default", href: site },
      ],
      structuredData: [
        {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${site}/#website`,
              name: this.brand,
              url: site,
              inLanguage: locale,
            },
            {
              "@type": "Organization",
              "@id": `${site}/#organization`,
              name: this.brand,
              url: site,
            },
          ],
        },
      ],
      breadcrumbs: [{ name: "Home", url: site, position: 1 }],
    };
  }
}
