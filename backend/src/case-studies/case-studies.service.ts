import { Injectable, NotFoundException, ConflictException, GoneException } from "@nestjs/common";
import { PublishStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCaseStudyDto, UpdateCaseStudyDto } from "./dto/case-study.dto";
import { SlugService } from "../seo/services/slug.service";
import { RedirectService } from "../seo/services/redirect.service";
import { SeoMeta, SeoMetaService } from "../seo/services/seo-meta.service";

const CONTENT_FIELDS = [
  "title",
  "excerpt",
  "content",
  "image",
  "result",
  "tags",
  "metaTitle",
  "metaDescription",
  "ogImageUrl",
  "ogImageAlt",
] as const;

@Injectable()
export class CaseStudiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly slug: SlugService,
    private readonly redirects: RedirectService,
    private readonly seo: SeoMetaService,
  ) {}

  async create(dto: CreateCaseStudyDto) {
    const slug = this.slug.normalize(dto.slug);
    this.slug.assertUsable(slug);

    const existing = await this.prisma.caseStudy.findUnique({
      where: { slug_locale: { slug, locale: "en" } },
    });
    if (existing) throw new ConflictException("Slug already in use");

    const status = dto.status ?? PublishStatus.PUBLISHED;
    const now = new Date();

    return this.prisma.caseStudy.create({
      data: {
        ...dto,
        slug,
        status,
        publishedAt: status === PublishStatus.PUBLISHED ? now : null,
        contentUpdatedAt: now,
      },
    });
  }

  async findAll() {
    return this.prisma.caseStudy.findMany({
      where: { status: PublishStatus.PUBLISHED, deletedAt: null },
      orderBy: { sortOrder: "asc" },
    });
  }

  async adminFindAll() {
    return this.prisma.caseStudy.findMany({ orderBy: { sortOrder: "asc" } });
  }

  async findOne(id: string) {
    const item = await this.prisma.caseStudy.findFirst({
      where: { id },
    });
    if (!item) throw new NotFoundException("Case study not found");
    this.assertViewable(item.status);
    return this.attachSeo(item);
  }

  async findBySlug(slug: string) {
    const item = await this.prisma.caseStudy.findFirst({
      where: { slug, locale: "en" },
    });
    if (!item) throw new NotFoundException("Case study not found");
    this.assertViewable(item.status);
    return this.attachSeo(item);
  }

  async update(id: string, dto: UpdateCaseStudyDto) {
    const existing = await this.getOrFail(id);

    if (dto.slug) {
      const newSlug = this.slug.normalize(dto.slug);
      this.slug.assertUsable(newSlug);
      const clash = await this.prisma.caseStudy.findUnique({
        where: { slug_locale: { slug: newSlug, locale: existing.locale } },
      });
      if (clash && clash.id !== id) throw new ConflictException("Slug already in use");
    }

    const now = new Date();
    const data: UpdateCaseStudyDto & { slug?: string; contentUpdatedAt?: Date; publishedAt?: Date } =
      { ...dto };

    if (dto.slug) data.slug = this.slug.normalize(dto.slug);

    const bumpsContent = CONTENT_FIELDS.some((field) => field in dto);
    if (bumpsContent) data.contentUpdatedAt = now;

    const isPublishing =
      dto.status === PublishStatus.PUBLISHED &&
      existing.status !== PublishStatus.PUBLISHED;
    if (isPublishing && !existing.publishedAt) data.publishedAt = now;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.caseStudy.update({ where: { id }, data });
      if (data.slug && data.slug !== existing.slug) {
        await this.redirects.recordSlugRename(
          "CaseStudy",
          id,
          existing.slug,
          data.slug,
          "case-studies",
          existing.locale,
          tx,
        );
      }
      return updated;
    });
  }

  async remove(id: string) {
    await this.getOrFail(id);
    return this.prisma.caseStudy.update({
      where: { id },
      data: {
        status: PublishStatus.DELETED,
        deletedAt: new Date(),
        publishedAt: null,
      },
    });
  }

  private async getOrFail(id: string) {
    const item = await this.prisma.caseStudy.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Case study not found");
    return item;
  }

  private assertViewable(status: PublishStatus): void {
    if (status === PublishStatus.DELETED) {
      throw new GoneException("Case study removed");
    }
    if (status !== PublishStatus.PUBLISHED) {
      throw new NotFoundException("Case study not found");
    }
  }

  private attachSeo(
    item: unknown,
  ): Record<string, unknown> & { seo: SeoMeta } {
    const cs = item as {
      slug: string;
      locale: string;
      title: string;
      excerpt: string;
      content: string | null;
      metaTitle: string | null;
      metaDescription: string | null;
      canonicalUrl: string | null;
      noindex: boolean;
      nofollow: boolean;
      ogImageUrl: string | null;
      ogImageAlt: string | null;
      publishedAt: Date | null;
      contentUpdatedAt: Date;
      image: string | null;
    };
    const seo: SeoMeta = this.seo.build({
      entityType: "case-study",
      slug: cs.slug,
      title: cs.title,
      excerpt: cs.excerpt,
      content: cs.content ?? undefined,
      metaTitle: cs.metaTitle ?? undefined,
      metaDescription: cs.metaDescription ?? undefined,
      canonicalUrl: cs.canonicalUrl ?? undefined,
      noindex: cs.noindex,
      nofollow: cs.nofollow,
      ogImageUrl: cs.ogImageUrl ?? undefined,
      ogImageAlt: cs.ogImageAlt ?? undefined,
      locale: cs.locale,
      publishedAt: cs.publishedAt,
      contentUpdatedAt: cs.contentUpdatedAt,
      coverImage: cs.image ?? undefined,
    });
    return { ...(item as Record<string, unknown>), seo };
  }
}
