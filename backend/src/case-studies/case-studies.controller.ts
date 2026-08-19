import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CaseStudiesService } from "./case-studies.service";
import { CreateCaseStudyDto, UpdateCaseStudyDto, QueryCaseStudyDto } from "./dto/case-study.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Public } from "../common/decorators/public.decorator";

@ApiTags("Case Studies")
@Controller("api/case-studies")
export class CaseStudiesController {
  constructor(private readonly service: CaseStudiesService) {}

  @Public() @Get() @ApiOperation({ summary: "List published case studies" })
  findAll(@Query() query: QueryCaseStudyDto) { return this.service.findAll(query); }

  @Public() @Get("slug/:slug") @ApiOperation({ summary: "Get a case study by slug" })
  findBySlug(@Param("slug") slug: string) { return this.service.findBySlug(slug); }

  @Public() @Get(":id") @ApiOperation({ summary: "Get a case study" })
  findOne(@Param("id") id: string) { return this.service.findOne(id); }

  @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles("admin") @ApiBearerAuth()
  @ApiOperation({ summary: "Create case study (admin)" })
  create(@Body() dto: CreateCaseStudyDto) { return this.service.create(dto); }

  @Patch(":id") @UseGuards(JwtAuthGuard, RolesGuard) @Roles("admin") @ApiBearerAuth()
  @ApiOperation({ summary: "Update case study (admin)" })
  update(@Param("id") id: string, @Body() dto: UpdateCaseStudyDto) { return this.service.update(id, dto); }

  @Delete(":id") @UseGuards(JwtAuthGuard, RolesGuard) @Roles("admin") @ApiBearerAuth()
  @ApiOperation({ summary: "Delete case study (admin)" })
  remove(@Param("id") id: string) { return this.service.remove(id); }
}
