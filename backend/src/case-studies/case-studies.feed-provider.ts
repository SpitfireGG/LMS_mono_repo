import { Injectable, OnModuleInit } from "@nestjs/common";
import { PublishStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { FeedEntry, FeedProvider } from "../seo/interfaces/feed-provider.interface";
import { FeedRegistryService } from "../seo/services/feed-registry.service";
import { CanonicalService } from "../seo/services/canonical.service";

@Injectable()
export class CaseStudiesFeedProvider implements FeedProvider, OnModuleInit {
  readonly key = "case-studies";

  constructor(
    private readonly prisma: PrismaService,
    private readonly registry: FeedRegistryService,
    private readonly canonical: CanonicalService,
  ) {}

  onModuleInit(): void {
    this.registry.register(this);
  }

  async items(limit: number): Promise<FeedEntry[]> {
    const items = await this.prisma.caseStudy.findMany({
      where: { status: PublishStatus.PUBLISHED, deletedAt: null },
      orderBy: [{ publishedAt: "desc" }, { id: "asc" }],
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        image: true,
        tags: true,
        publishedAt: true,
        contentUpdatedAt: true,
      },
    });

    return items.map((item) => ({
      id: `case-study:${item.id}`,
      title: item.title,
      link: this.canonical.build(`case-studies/${item.slug}`),
      summary: item.excerpt,
      ...(item.content ? { content: item.content } : {}),
      publishedAt: item.publishedAt ?? item.contentUpdatedAt,
      updatedAt: item.contentUpdatedAt,
      ...(item.image ? { image: this.absolute(item.image) } : {}),
      categories: item.tags
        ? item.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    }));
  }

  private absolute(image: string): string {
    if (/^https?:\/\//i.test(image)) return image;
    return `${this.canonical.getSiteUrl()}${image.startsWith("/") ? "" : "/"}${image}`;
  }
}
