import { Injectable } from "@nestjs/common";
import { PublishStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { SeoMeta, SeoMetaService } from "./seo-meta.service";

export interface ResolvedSeo {
  path: string;
  seo: SeoMeta;
}

@Injectable()
export class PathResolverService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly seo: SeoMetaService,
  ) {}

  async resolve(path: string): Promise<ResolvedSeo | null> {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    const clean = normalized.replace(/\/+$/, "") || "/";
    const segments = clean.split("/").filter(Boolean);

    if (segments.length === 0) {
      return { path: "/", seo: this.seo.homepage() };
    }

    const [section, ...rest] = segments;
    const slug = rest.join("/");

    if (section === "blog" && slug) return this.blog(slug);
    if (section === "courses" && slug) return this.course(slug);
    if (section === "case-studies" && slug) return this.caseStudy(slug);

    return null;
  }

  private async blog(slug: string): Promise<ResolvedSeo | null> {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug, locale: "en", status: PublishStatus.PUBLISHED, deletedAt: null },
    });
    if (!post) return null;
    return {
      path: `/blog/${post.slug}`,
      seo: this.seo.build({
        entityType: "blog",
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content ?? undefined,
        metaTitle: post.metaTitle ?? undefined,
        metaDescription: post.metaDescription ?? undefined,
        canonicalUrl: post.canonicalUrl ?? undefined,
        noindex: post.noindex,
        nofollow: post.nofollow,
        ogImageUrl: post.ogImageUrl ?? undefined,
        ogImageAlt: post.ogImageAlt ?? undefined,
        locale: post.locale,
        publishedAt: post.publishedAt,
        contentUpdatedAt: post.contentUpdatedAt,
        coverImage: post.coverImage ?? undefined,
        author: post.author ?? undefined,
      }),
    };
  }

  private async course(slug: string): Promise<ResolvedSeo | null> {
    const course = await this.prisma.course.findFirst({
      where: { slug, locale: "en", status: PublishStatus.PUBLISHED, deletedAt: null },
    });
    if (!course) return null;
    return {
      path: `/courses/${course.slug}`,
      seo: this.seo.build({
        entityType: "course",
        slug: course.slug,
        title: course.title,
        excerpt: course.description ?? undefined,
        metaTitle: course.metaTitle ?? undefined,
        metaDescription: course.metaDescription ?? undefined,
        canonicalUrl: course.canonicalUrl ?? undefined,
        noindex: course.noindex,
        nofollow: course.nofollow,
        ogImageUrl: course.ogImageUrl ?? undefined,
        ogImageAlt: course.ogImageAlt ?? undefined,
        locale: course.locale,
        publishedAt: course.publishedAt,
        contentUpdatedAt: course.contentUpdatedAt,
        coverImage: course.image ?? undefined,
        price: course.price,
      }),
    };
  }

  private async caseStudy(slug: string): Promise<ResolvedSeo | null> {
    const study = await this.prisma.caseStudy.findFirst({
      where: { slug, locale: "en", status: PublishStatus.PUBLISHED, deletedAt: null },
    });
    if (!study) return null;
    return {
      path: `/case-studies/${study.slug}`,
      seo: this.seo.build({
        entityType: "case-study",
        slug: study.slug,
        title: study.title,
        excerpt: study.excerpt,
        content: study.content ?? undefined,
        metaTitle: study.metaTitle ?? undefined,
        metaDescription: study.metaDescription ?? undefined,
        canonicalUrl: study.canonicalUrl ?? undefined,
        noindex: study.noindex,
        nofollow: study.nofollow,
        ogImageUrl: study.ogImageUrl ?? undefined,
        ogImageAlt: study.ogImageAlt ?? undefined,
        locale: study.locale,
        publishedAt: study.publishedAt,
        contentUpdatedAt: study.contentUpdatedAt,
        coverImage: study.image ?? undefined,
      }),
    };
  }
}
