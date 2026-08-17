import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FAQsService } from './faqs.service';
import { CreateFAQDto, UpdateFAQDto, QueryFAQDto } from './dto/faq.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('FAQs')
@Controller('api/faqs')
export class FAQsController {
  constructor(private readonly service: FAQsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List published FAQs' })
  findAll(@Query() query: QueryFAQDto) {
    return this.service.findAll(query);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get FAQ by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a FAQ' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create FAQ (admin)' })
  create(@Body() dto: CreateFAQDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update FAQ (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateFAQDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete FAQ (admin)' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all FAQs including unpublished (admin)' })
  adminFindAll(@Query() query: QueryFAQDto) {
    return this.service.adminFindAll(query);
  }
}