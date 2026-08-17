import { Injectable, OnModuleInit } from "@nestjs/common";
import { PublishStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { SitemapEntry, SitemapProvider } from "../seo/interfaces/sitemap-provider.interface";
import { SitemapRegistryService } from "../seo/services/sitemap-registry.service";
import { CanonicalService } from "../seo/services/canonical.service";

@Injectable()
export class CoursesSitemapProvider
  implements SitemapProvider, OnModuleInit
{
  readonly key = "courses";

  constructor(
    private readonly prisma: PrismaService,
    private readonly registry: SitemapRegistryService,
    private readonly canonical: CanonicalService,
  ) {}

  onModuleInit(): void {
    this.registry.register(this);
  }

  async count(): Promise<number> {
    return this.prisma.course.count({
      where: { status: PublishStatus.PUBLISHED, deletedAt: null },
    });
  }

  async entries(
    cursor?: string,
    take = 1000,
  ): Promise<{ items: SitemapEntry[]; nextCursor?: string }> {
    const courses = await this.prisma.course.findMany({
      where: { status: PublishStatus.PUBLISHED, deletedAt: null },
      orderBy: [{ publishedAt: "desc" }, { id: "asc" }],
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

    const hasMore = courses.length > take;
    const page = hasMore ? courses.slice(0, take) : courses;

    return {
      items: page.map((course) => ({
        loc: this.canonical.build(`courses/${course.slug}`),
        lastmod: course.contentUpdatedAt,
        changefreq: "weekly",
        priority: 0.9,
        ...(course.image
          ? {
              images: [
                {
                  loc: this.absolute(course.image),
                  title: course.title,
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
