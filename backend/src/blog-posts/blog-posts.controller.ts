import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { BlogPostsService } from "./blog-posts.service";
import { CreateBlogPostDto, UpdateBlogPostDto, QueryBlogPostDto } from "./dto/blog-post.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Public } from "../common/decorators/public.decorator";

@ApiTags("Blog Posts")
@Controller("api/blog-posts")
export class BlogPostsController {
  constructor(private readonly service: BlogPostsService) {}

  @Public() @Get() @ApiOperation({ summary: "List published blog posts" })
  findAll(@Query() query: QueryBlogPostDto) { return this.service.findAll(query); }

  @Public() @Get("slug/:slug") @ApiOperation({ summary: "Get by slug" })
  findBySlug(@Param("slug") slug: string) { return this.service.findBySlug(slug); }

  @Public() @Get(":id") @ApiOperation({ summary: "Get a blog post" })
  findOne(@Param("id") id: string) { return this.service.findOne(id); }

  @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles("admin") @ApiBearerAuth()
  @ApiOperation({ summary: "Create blog post (admin)" })
  create(@Body() dto: CreateBlogPostDto) { return this.service.create(dto); }

  @Patch(":id") @UseGuards(JwtAuthGuard, RolesGuard) @Roles("admin") @ApiBearerAuth()
  @ApiOperation({ summary: "Update blog post (admin)" })
  update(@Param("id") id: string, @Body() dto: UpdateBlogPostDto) { return this.service.update(id, dto); }

  @Delete(":id") @UseGuards(JwtAuthGuard, RolesGuard) @Roles("admin") @ApiBearerAuth()
  @ApiOperation({ summary: "Delete blog post (admin)" })
  remove(@Param("id") id: string) { return this.service.remove(id); }
}
