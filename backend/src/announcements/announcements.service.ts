import { Injectable } from '@nestjs/common';
import { PublishStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto, UpdateAnnouncementDto, QueryAnnouncementDto } from './dto/announcement.dto';
import { SlugService } from '../seo/services/slug.service';
import { RedirectService } from '../seo/services/redirect.service';
import { SeoMeta, SeoMetaService } from '../seo/services/seo-meta.service';
import { BaseService, ContentEntity, SeoAttachable } from '../common/base/base.service';

const CONTENT_FIELDS = [
  'text',
  'link',
  'linkText',
] as const;

export interface AnnouncementEntity extends ContentEntity {
  slug: string;
  locale: string;
  status: PublishStatus;
  text: string;
  link: string | null;
  linkText: string | null;
}

@Injectable()
export class AnnouncementsService extends BaseService<AnnouncementEntity, CreateAnnouncementDto, UpdateAnnouncementDto> {
  protected readonly config = {
    modelName: 'Announcement',
    entityName: 'Announcement',
    routeName: 'announcements',
    contentFields: CONTENT_FIELDS,
    seoEntityType: 'announcement' as const,
    defaultSortBy: 'publishedAt',
    defaultSortOrder: 'desc' as const,
    uniqueSlug: true,
    locale: 'en',
  };

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly slug: SlugService,
    protected readonly redirects: RedirectService,
    protected readonly seo: SeoMetaService,
  ) {
    super();
  }

  protected getModel(): any {
    return this.prisma.announcement;
  }

  protected mapToSeo(entity: AnnouncementEntity): SeoAttachable {
    return {
      slug: entity.slug,
      locale: entity.locale,
      title: entity.text,
      excerpt: entity.text,
      content: undefined,
      metaTitle: undefined,
      metaDescription: undefined,
      canonicalUrl: undefined,
      noindex: false,
      nofollow: false,
      ogImageUrl: undefined,
      ogImageAlt: undefined,
      publishedAt: entity.publishedAt,
      contentUpdatedAt: entity.contentUpdatedAt,
      coverImage: undefined,
      author: undefined,
    };
  }

  protected buildSearchConditions(search: string): any[] {
    return [
      { text: { contains: search, mode: 'insensitive' } },
    ];
  }

  async findAll(query: QueryAnnouncementDto) {
    const where: any = {
      status: PublishStatus.PUBLISHED,
      deletedAt: null,
    };

    if (query.search) {
      where.OR = this.buildSearchConditions(query.search);
    }

    const orderBy = this.buildOrderBy(query.sortBy, query.sortOrder);
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.announcement.findMany({ where, orderBy, skip, take: limit }),
      this.prisma.announcement.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async adminFindAll(query: QueryAnnouncementDto) {
    const where: any = {};
    if (query.search) {
      where.OR = this.buildSearchConditions(query.search);
    }

    const orderBy: any = { publishedAt: 'desc' };
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.announcement.findMany({ where, orderBy, skip, take: limit }),
      this.prisma.announcement.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findActive() {
    return this.prisma.announcement.findMany({
      where: {
        status: PublishStatus.PUBLISHED,
        deletedAt: null,
      },
      orderBy: { publishedAt: 'desc' },
      take: 1,
    });
  }
}