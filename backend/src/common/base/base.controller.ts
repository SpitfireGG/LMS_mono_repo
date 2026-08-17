import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Public } from '../decorators/public.decorator';
import { BaseQueryDto } from '../dto/base-query.dto';
import { PaginatedResult } from '../dto/base-query.dto';
import { BaseService, ContentEntity } from '../../common/base/base.service';
import { PublishStatus } from '@prisma/client';

export interface BaseControllerOptions {
  route: string;
  tag: string;
  entityName: string;
}

export function createBaseController<
  T extends ContentEntity,
  CreateDto extends { slug: string; status?: PublishStatus },
  UpdateDto extends { slug?: string; status?: PublishStatus },
  QueryDto extends BaseQueryDto = BaseQueryDto
>(
  service: BaseService<T, CreateDto, UpdateDto>,
  options: BaseControllerOptions,
) {
  @ApiTags(options.tag)
  @Controller(`api/${options.route}`)
  class BaseController {
    constructor(public readonly service: BaseService<T, CreateDto, UpdateDto>) {}

    @Public()
    @Get()
    @ApiOperation({ summary: `List published ${options.entityName}s` })
    async findAll(@Query() query: QueryDto): Promise<PaginatedResult<T>> {
      return this.service.findAll(query);
    }

    @Public()
    @Get('slug/:slug')
    @ApiOperation({ summary: `Get ${options.entityName} by slug` })
    async findBySlug(@Param('slug') slug: string): Promise<T & { seo: any }> {
      return this.service.findBySlug(slug);
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: `Get a ${options.entityName}` })
    async findOne(@Param('id') id: string): Promise<T & { seo: any }> {
      return this.service.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: `Create ${options.entityName} (admin)` })
    async create(@Body() dto: CreateDto): Promise<T> {
      return this.service.create(dto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: `Update ${options.entityName} (admin)` })
    async update(@Param('id') id: string, @Body() dto: UpdateDto): Promise<T> {
      return this.service.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: `Delete ${options.entityName} (admin)` })
    async remove(@Param('id') id: string): Promise<T> {
      return this.service.remove(id);
    }

    @Get('admin/all')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: `List all ${options.entityName}s including unpublished (admin)` })
    async adminFindAll(@Query() query: QueryDto): Promise<PaginatedResult<T>> {
      return this.service.adminFindAll(query);
    }
  }

  return BaseController;
}