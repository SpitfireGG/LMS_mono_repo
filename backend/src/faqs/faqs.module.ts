import { Module } from "@nestjs/common";
import { FAQsController } from "./faqs.controller";
import { FAQsService } from "./faqs.service";
import { SeoModule } from "../seo/seo.module";

@Module({
  imports: [SeoModule],
  controllers: [FAQsController],
  providers: [FAQsService],
})
export class FAQsModule {}
