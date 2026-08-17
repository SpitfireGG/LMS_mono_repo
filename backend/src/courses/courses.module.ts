import { Module } from "@nestjs/common";
import { CoursesController } from "./courses.controller";
import { CoursesService } from "./courses.service";
import { CoursesSitemapProvider } from "./courses.sitemap-provider";
import { SeoModule } from "../seo/seo.module";

@Module({
  imports: [SeoModule],
  controllers: [CoursesController],
  providers: [CoursesService, CoursesSitemapProvider],
  exports: [CoursesService],
})
export class CoursesModule {}
