import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { SitemapController } from "./controllers/sitemap.controller";
import { RobotsController } from "./controllers/robots.controller";
import { SeoMetaController } from "./controllers/seo-meta.controller";
import { FeedController } from "./controllers/feed.controller";
import { SitemapService } from "./services/sitemap.service";
import { SitemapRegistryService } from "./services/sitemap-registry.service";
import { CanonicalService } from "./services/canonical.service";
import { SlugService } from "./services/slug.service";
import { RedirectService } from "./services/redirect.service";
import { StructuredDataService } from "./services/structured-data.service";
import { SeoMetaService } from "./services/seo-meta.service";
import { PathResolverService } from "./services/path-resolver.service";
import { FeedService } from "./services/feed.service";
import { FeedRegistryService } from "./services/feed-registry.service";
import { UrlNormalizationMiddleware } from "../common/middleware/url-normalization.middleware";
import { RedirectMiddleware } from "../common/middleware/redirect.middleware";

@Module({
  controllers: [SitemapController, RobotsController, SeoMetaController, FeedController],
  providers: [
    SitemapService,
    SitemapRegistryService,
    CanonicalService,
    SlugService,
    RedirectService,
    StructuredDataService,
    SeoMetaService,
    PathResolverService,
    FeedService,
    FeedRegistryService,
  ],
  exports: [
    SitemapRegistryService,
    CanonicalService,
    SlugService,
    RedirectService,
    SeoMetaService,
    FeedRegistryService,
  ],
})
export class SeoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UrlNormalizationMiddleware, RedirectMiddleware)
      .exclude(
        { path: "api/(.*)", method: RequestMethod.ALL },
        { path: "uploads/(.*)", method: RequestMethod.ALL },
        { path: "docs/(.*)", method: RequestMethod.ALL },
      )
      .forRoutes("*");
  }
}
