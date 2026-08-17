import { Module } from "@nestjs/common";
import { CaseStudiesController } from "./case-studies.controller";
import { CaseStudiesService } from "./case-studies.service";
import { CaseStudiesSitemapProvider } from "./case-studies.sitemap-provider";
import { CaseStudiesFeedProvider } from "./case-studies.feed-provider";
import { SeoModule } from "../seo/seo.module";

@Module({
  imports: [SeoModule],
  controllers: [CaseStudiesController],
  providers: [CaseStudiesService, CaseStudiesSitemapProvider, CaseStudiesFeedProvider],
})
export class CaseStudiesModule {}
