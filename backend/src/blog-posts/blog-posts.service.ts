import {
  Injectable,
  NotFoundException,
  ConflictException,
  GoneException,
} from "@nestjs/common";
import { PublishStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBlogPostDto, UpdateBlogPostDto, QueryBlogPostDto } from "./dto/blog-post.dto";
import { SlugService } from "../seo/services/slug.service";
import { RedirectService } from "../seo/services/redirect.service";
import { SeoMeta, SeoMetaService } from "../seo/services/seo-meta.service";

const CONTENT_FIELDS = [
  "title",
  "content",
  "excerpt",
  "coverImage",
  "tag",
  "author",
  "metaTitle",
  "metaDescription",
  "ogImageUrl",
  "ogImageAlt",
] as const;

@Injectable()
export class BlogPostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly slug: SlugService,
    private readonly redirects: RedirectService,
    private readonly seo: SeoMetaService,
  ) {}

  async create(dto: CreateBlogPostDto) {
    const slug = this.slug.normalize(dto.slug);
    this.slug.assertUsable(slug);

    const existing = await this.prisma.blogPost.findUnique({
      where: { slug_locale: { slug, locale: "en" } },
    });
    if (existing) throw new ConflictException("Slug already in use");

    const status = dto.status ?? PublishStatus.PUBLISHED;
    const now = new Date();

    return this.prisma.blogPost.create({
      data: {
        ...dto,
        slug,
        status,
        publishedAt: status === PublishStatus.PUBLISHED ? now : null,
        contentUpdatedAt: now,
      },
    });
  }

  async findAll(query: QueryBlogPostDto) {
    const where: any = {
      status: PublishStatus.PUBLISHED,
      deletedAt: null,
    };

    if (query.tag) where.tag = query.tag;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { excerpt: { contains: query.search, mode: "insensitive" } },
        { content: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const orderBy: Prisma.BlogPostOrderByWithRelationInput = query.sortBy
      ? { [query.sortBy]: query.sortOrder ?? "desc" }
      : { publishedAt: "desc" };
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.blogPost.findMany({ where, orderBy, skip, take: limit }),
      this.prisma.blogPost.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async adminFindAll() {
    return this.prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
  }

  async findOne(id: string) {
    const item = await this.prisma.blogPost.findFirst({
      where: { id },
    });
    if (!item) throw new NotFoundException("Blog post not found");
    this.assertViewable(item.status);
    return this.attachSeo(item);
  }

  async findBySlug(slug: string) {
    const item = await this.prisma.blogPost.findFirst({
      where: { slug, locale: "en" },
    });
    if (!item) throw new NotFoundException("Blog post not found");
    this.assertViewable(item.status);
    return this.attachSeo(item);
  }

  async update(id: string, dto: UpdateBlogPostDto) {
    const existing = await this.getOrFail(id);

    if (dto.slug) {
      const newSlug = this.slug.normalize(dto.slug);
      this.slug.assertUsable(newSlug);
      const clash = await this.prisma.blogPost.findUnique({
        where: { slug_locale: { slug: newSlug, locale: existing.locale } },
      });
      if (clash && clash.id !== id) throw new ConflictException("Slug already in use");
    }

    const now = new Date();
    const data: UpdateBlogPostDto & { slug?: string; contentUpdatedAt?: Date; publishedAt?: Date } =
      { ...dto };

    if (dto.slug) data.slug = this.slug.normalize(dto.slug);

    const bumpsContent = CONTENT_FIELDS.some((field) => field in dto);
    if (bumpsContent) data.contentUpdatedAt = now;

    const isPublishing =
      dto.status === PublishStatus.PUBLISHED &&
      existing.status !== PublishStatus.PUBLISHED;
    if (isPublishing && !existing.publishedAt) data.publishedAt = now;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.blogPost.update({ where: { id }, data });
      if (data.slug && data.slug !== existing.slug) {
        await this.redirects.recordSlugRename(
          "BlogPost",
          id,
          existing.slug,
          data.slug,
          "blog",
          existing.locale,
          tx,
        );
      }
      return updated;
    });
  }

  async remove(id: string) {
    await this.getOrFail(id);
    return this.prisma.blogPost.update({
      where: { id },
      data: {
        status: PublishStatus.DELETED,
        deletedAt: new Date(),
        publishedAt: null,
      },
    });
  }

  private async getOrFail(id: string) {
    const item = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Blog post not found");
    return item;
  }

  private assertViewable(status: PublishStatus): void {
    if (status === PublishStatus.DELETED) {
      throw new GoneException("Blog post removed");
    }
    if (status !== PublishStatus.PUBLISHED) {
      throw new NotFoundException("Blog post not found");
    }
  }

  private attachSeo(
    item: unknown,
  ): Record<string, unknown> & { seo: SeoMeta } {
    const post = item as {
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
      coverImage: string | null;
      author: string | null;
    };
    const seo: SeoMeta = this.seo.build({
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
    });
    return { ...(item as Record<string, unknown>), seo };
  }
}
