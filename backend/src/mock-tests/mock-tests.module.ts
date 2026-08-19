import { Module } from "@nestjs/common";
import { MockTestsController } from "./mock-tests.controller";
import { MediaController } from "./media.controller";
import { MockTestsService } from "./mock-tests.service";
import { SeoModule } from "../seo/seo.module";

@Module({
  imports: [SeoModule],
  controllers: [MockTestsController, MediaController],
  providers: [MockTestsService],
  exports: [MockTestsService],
})
export class MockTestsModule {}
