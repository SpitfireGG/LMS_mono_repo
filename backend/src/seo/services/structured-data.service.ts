import { Injectable } from "@nestjs/common";
import { CanonicalService } from "./canonical.service";

export interface StructuredDataInput {
  entityType: "blog" | "course" | "case-study" | "testimonial" | "faq" | "service" | "team-member" | "announcement";
  slug: string;
  title: string;
  description?: string;
  publishedAt?: Date | null;
  contentUpdatedAt: Date;
  author?: string;
  image?: string;
  inLanguage?: string;
  offers?: { price: number; currency?: string; availability?: string };
}

type JsonLd = Record<string, unknown>;

@Injectable()
export class StructuredDataService {
  constructor(private readonly canonical: CanonicalService) {}

  private get site(): string {
    return this.canonical.getSiteUrl();
  }

  private get brand(): string {
    return process.env.BRAND_NAME ?? "NAATI Excellence Academy";
  }

  private organization(): JsonLd {
    return {
      "@type": "Organization",
      "@id": `${this.site}/#organization`,
      name: this.brand,
      url: this.site,
      logo: {
        "@type": "ImageObject",
        url: `${this.site}/favicon.ico`,
      },
    };
  }

  private breadcrumbList(input: StructuredDataInput): JsonLd {
    const sections: { name: string; url: string }[] = [];
    const routeMap: Record<string, { name: string; path: string }> = {
      blog: { name: "Blog", path: "blog" },
      course: { name: "Courses", path: "courses" },
      "case-study": { name: "Case Studies", path: "case-studies" },
      testimonial: { name: "Testimonials", path: "testimonials" },
      faq: { name: "FAQs", path: "faqs" },
      service: { name: "Services", path: "services" },
      "team-member": { name: "Team Members", path: "team-members" },
      announcement: { name: "Announcements", path: "announcements" },
    };
    const route = routeMap[input.entityType];
    if (route) sections.push({ name: route.name, url: `${this.site}/${route.path}` });

    return {
      "@type": "BreadcrumbList",
      "@id": `${this.url(input)}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: this.site },
        ...sections.map((s, i) => ({
          "@type": "ListItem",
          position: i + 2,
          name: s.name,
          item: s.url,
        })),
        {
          "@type": "ListItem",
          position: sections.length + 2,
          name: input.title.slice(0, 110),
          item: this.url(input),
        },
      ],
    };
  }

  private url(input: StructuredDataInput): string {
    const routeMap: Record<string, string> = {
      blog: "blog",
      course: "courses",
      "case-study": "case-studies",
      testimonial: "testimonials",
      faq: "faqs",
      service: "services",
      "team-member": "team-members",
      announcement: "announcements",
    };
    const prefix = routeMap[input.entityType] ?? "pages";
    return this.canonical.build(`${prefix}/${input.slug}`);
  }

  private person(input: StructuredDataInput): JsonLd | undefined {
    if (!input.author) return undefined;
    const authorSlug = input.author.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return {
      "@type": "Person",
      "@id": `${this.site}/authors/${authorSlug}#person`,
      name: input.author,
      url: `${this.site}/authors/${authorSlug}`,
    };
  }

  private core(input: StructuredDataInput): JsonLd[] {
    const nodes: JsonLd[] = [];
    const person = this.person(input);
    if (person) nodes.push(person);
    nodes.push(this.organization(), this.breadcrumbList(input));
    return nodes;
  }

  build(input: StructuredDataInput): JsonLd {
    const url = this.url(input);
    const common = {
      mainEntityOfPage: { "@id": url },
      image: input.image ? [input.image] : undefined,
      inLanguage: input.inLanguage ?? "en",
    };

    let main: JsonLd;
    if (input.entityType === "blog") {
      main = {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: input.title.slice(0, 110),
        description: input.description,
        datePublished: input.publishedAt?.toISOString(),
        dateModified: input.contentUpdatedAt.toISOString(),
        author: input.author
          ? {
              "@id": `${this.site}/authors/${input.author
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")}#person`,
            }
          : undefined,
        publisher: { "@id": `${this.site}/#organization` },
        ...common,
      };
    } else if (input.entityType === "course") {
      main = {
        "@type": "Course",
        "@id": `${url}#course`,
        name: input.title.slice(0, 110),
        description: input.description,
        datePublished: input.publishedAt?.toISOString(),
        dateModified: input.contentUpdatedAt.toISOString(),
        provider: { "@id": `${this.site}/#organization` },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "Online",
          courseWorkload: "PT20H",
        },
        offers: input.offers
          ? {
              "@type": "Offer",
              price: input.offers.price,
              priceCurrency: input.offers.currency ?? "AUD",
              availability: input.offers.availability ?? "https://schema.org/InStock",
            }
          : undefined,
        ...common,
      };
    } else if (input.entityType === "testimonial") {
      main = {
        "@type": "Review",
        "@id": `${url}#review`,
        headline: input.title.slice(0, 110),
        description: input.description,
        datePublished: input.publishedAt?.toISOString(),
        dateModified: input.contentUpdatedAt.toISOString(),
        author: input.author
          ? {
              "@type": "Person",
              name: input.author,
            }
          : undefined,
        publisher: { "@id": `${this.site}/#organization` },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        ...common,
      };
    } else if (input.entityType === "faq") {
      main = {
        "@type": "FAQPage",
        "@id": `${url}#faqpage`,
        mainEntity: {
          "@type": "Question",
          name: input.title.slice(0, 110),
          acceptedAnswer: {
            "@type": "Answer",
            text: input.description,
          },
        },
        ...common,
      };
    } else if (input.entityType === "service") {
      main = {
        "@type": "Service",
        "@id": `${url}#service`,
        name: input.title.slice(0, 110),
        description: input.description,
        provider: { "@id": `${this.site}/#organization` },
        ...common,
      };
    } else if (input.entityType === "team-member") {
      main = {
        "@type": "Person",
        "@id": `${url}#person`,
        name: input.title.slice(0, 110),
        description: input.description,
        worksFor: { "@id": `${this.site}/#organization` },
        ...common,
      };
    } else if (input.entityType === "announcement") {
      main = {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: input.title.slice(0, 110),
        description: input.description,
        datePublished: input.publishedAt?.toISOString(),
        dateModified: input.contentUpdatedAt.toISOString(),
        publisher: { "@id": `${this.site}/#organization` },
        ...common,
      };
    } else {
      main = {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: input.title.slice(0, 110),
        description: input.description,
        datePublished: input.publishedAt?.toISOString(),
        dateModified: input.contentUpdatedAt.toISOString(),
        author: input.author
          ? {
              "@id": `${this.site}/authors/${input.author
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")}#person`,
            }
          : undefined,
        publisher: { "@id": `${this.site}/#organization` },
        ...common,
      };
    }

    return {
      "@context": "https://schema.org",
      "@graph": [main, ...this.core(input)],
    };
  }
}
