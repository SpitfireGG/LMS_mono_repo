import { Module } from "@nestjs/common";
import { BlogPostsController } from "./blog-posts.controller";
import { BlogPostsService } from "./blog-posts.service";
import { BlogPostsSitemapProvider } from "./blog-posts.sitemap-provider";
import { BlogPostsFeedProvider } from "./blog-posts.feed-provider";
import { SeoModule } from "../seo/seo.module";

@Module({
  imports: [SeoModule],
  controllers: [BlogPostsController],
  providers: [BlogPostsService, BlogPostsSitemapProvider, BlogPostsFeedProvider],
})
export class BlogPostsModule {}
