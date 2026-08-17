import { Module } from "@nestjs/common";
import { TestimonialsController } from "./testimonials.controller";
import { TestimonialsService } from "./testimonials.service";
import { SeoModule } from "../seo/seo.module";

@Module({
  imports: [SeoModule],
  controllers: [TestimonialsController],
  providers: [TestimonialsService],
})
export class TestimonialsModule {}
