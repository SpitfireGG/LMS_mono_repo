import { Module } from "@nestjs/common";
import { TeamMembersController } from "./team-members.controller";
import { TeamMembersService } from "./team-members.service";
import { SeoModule } from "../seo/seo.module";

@Module({
  imports: [SeoModule],
  controllers: [TeamMembersController],
  providers: [TeamMembersService],
})
export class TeamMembersModule {}
