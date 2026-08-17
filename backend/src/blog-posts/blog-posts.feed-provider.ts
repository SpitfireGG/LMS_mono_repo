import { Injectable, OnModuleInit } from "@nestjs/common";
import { PublishStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { FeedEntry, FeedProvider } from "../seo/interfaces/feed-provider.interface";
import { FeedRegistryService } from "../seo/services/feed-registry.service";
import { CanonicalService } from "../seo/services/canonical.service";

@Injectable()
export class BlogPostsFeedProvider implements FeedProvider, OnModuleInit {
  readonly key = "blog-posts";

  constructor(
    private readonly prisma: PrismaService,
    private readonly registry: FeedRegistryService,
    private readonly canonical: CanonicalService,
  ) {}

  onModuleInit(): void {
    this.registry.register(this);
  }

  async items(limit: number): Promise<FeedEntry[]> {
    const posts = await this.prisma.blogPost.findMany({
      where: { status: PublishStatus.PUBLISHED, deletedAt: null },
      orderBy: [{ publishedAt: "desc" }, { id: "asc" }],
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        coverImage: true,
        author: true,
        tag: true,
        publishedAt: true,
        contentUpdatedAt: true,
      },
    });

    return posts.map((post) => ({
      id: `blog:${post.id}`,
      title: post.title,
      link: this.canonical.build(`blog/${post.slug}`),
      summary: post.excerpt,
      ...(post.content ? { content: post.content } : {}),
      publishedAt: post.publishedAt ?? post.contentUpdatedAt,
      updatedAt: post.contentUpdatedAt,
      ...(post.author ? { author: post.author } : {}),
      ...(post.coverImage
        ? { image: this.absolute(post.coverImage) }
        : {}),
      categories: post.tag ? [post.tag] : [],
    }));
  }

  private absolute(image: string): string {
    if (/^https?:\/\//i.test(image)) return image;
    return `${this.canonical.getSiteUrl()}${image.startsWith("/") ? "" : "/"}${image}`;
  }
}
