import { Injectable, OnModuleInit } from "@nestjs/common";
import { PublishStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { SitemapEntry, SitemapProvider } from "../seo/interfaces/sitemap-provider.interface";
import { SitemapRegistryService } from "../seo/services/sitemap-registry.service";
import { CanonicalService } from "../seo/services/canonical.service";

@Injectable()
export class BlogPostsSitemapProvider
  implements SitemapProvider, OnModuleInit
{
  readonly key = "blog-posts";

  constructor(
    private readonly prisma: PrismaService,
    private readonly registry: SitemapRegistryService,
    private readonly canonical: CanonicalService,
  ) {}

  onModuleInit(): void {
    this.registry.register(this);
  }

  async count(): Promise<number> {
    return this.prisma.blogPost.count({
      where: { status: PublishStatus.PUBLISHED, deletedAt: null },
    });
  }

  async entries(
    cursor?: string,
    take = 1000,
  ): Promise<{ items: SitemapEntry[]; nextCursor?: string }> {
    const posts = await this.prisma.blogPost.findMany({
      where: { status: PublishStatus.PUBLISHED, deletedAt: null },
      orderBy: [{ publishedAt: "desc" }, { id: "asc" }],
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: { id: true, slug: true, publishedAt: true, contentUpdatedAt: true },
    });

    const hasMore = posts.length > take;
    const page = hasMore ? posts.slice(0, take) : posts;

    return {
      items: page.map((post) => ({
        loc: this.canonical.build(`blog/${post.slug}`),
        lastmod: post.contentUpdatedAt,
      })),
      nextCursor: hasMore ? page[page.length - 1].id : undefined,
    };
  }
}
