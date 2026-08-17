import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto, UpdateAnnouncementDto, QueryAnnouncementDto } from './dto/announcement.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Announcements')
@Controller('api/announcements')
export class AnnouncementsController {
  constructor(private readonly service: AnnouncementsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List published announcements' })
  findAll(@Query() query: QueryAnnouncementDto) {
    return this.service.findAll(query);
  }

  @Public()
  @Get('active')
  @ApiOperation({ summary: 'Get latest active announcement' })
  findActive() {
    return this.service.findActive();
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get announcement by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get an announcement' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create announcement (admin)' })
  create(@Body() dto: CreateAnnouncementDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update announcement (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateAnnouncementDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete announcement (admin)' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all announcements including unpublished (admin)' })
  adminFindAll(@Query() query: QueryAnnouncementDto) {
    return this.service.adminFindAll(query);
  }
}