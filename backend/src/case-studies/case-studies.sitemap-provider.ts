import { Injectable, OnModuleInit } from "@nestjs/common";
import { PublishStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { SitemapEntry, SitemapProvider } from "../seo/interfaces/sitemap-provider.interface";
import { SitemapRegistryService } from "../seo/services/sitemap-registry.service";
import { CanonicalService } from "../seo/services/canonical.service";

@Injectable()
export class CaseStudiesSitemapProvider
  implements SitemapProvider, OnModuleInit
{
  readonly key = "case-studies";

  constructor(
    private readonly prisma: PrismaService,
    private readonly registry: SitemapRegistryService,
    private readonly canonical: CanonicalService,
  ) {}

  onModuleInit(): void {
    this.registry.register(this);
  }

  async count(): Promise<number> {
    return this.prisma.caseStudy.count({
      where: { status: PublishStatus.PUBLISHED, deletedAt: null },
    });
  }

  async entries(
    cursor?: string,
    take = 1000,
  ): Promise<{ items: SitemapEntry[]; nextCursor?: string }> {
    const items = await this.prisma.caseStudy.findMany({
      where: { status: PublishStatus.PUBLISHED, deletedAt: null },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: {
        id: true,
        slug: true,
        contentUpdatedAt: true,
        image: true,
        title: true,
      },
    });

    const hasMore = items.length > take;
    const page = hasMore ? items.slice(0, take) : items;

    return {
      items: page.map((item) => ({
        loc: this.canonical.build(`case-studies/${item.slug}`),
        lastmod: item.contentUpdatedAt,
        changefreq: "monthly",
        priority: 0.6,
        ...(item.image
          ? {
              images: [
                {
                  loc: this.absolute(item.image),
                  title: item.title,
                },
              ],
            }
          : {}),
      })),
      nextCursor: hasMore ? page[page.length - 1].id : undefined,
    };
  }

  private absolute(image: string): string {
    if (/^https?:\/\//i.test(image)) return image;
    return `${this.canonical.getSiteUrl()}${image.startsWith("/") ? "" : "/"}${image}`;
  }
}
