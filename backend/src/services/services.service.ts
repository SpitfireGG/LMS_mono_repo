import { Injectable } from '@nestjs/common';
import { PublishStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto, QueryServiceDto } from './dto/service.dto';
import { SlugService } from '../seo/services/slug.service';
import { RedirectService } from '../seo/services/redirect.service';
import { SeoMeta, SeoMetaService } from '../seo/services/seo-meta.service';
import { BaseService, ContentEntity, SeoAttachable } from '../common/base/base.service';

const CONTENT_FIELDS = [
  'title',
  'body',
  'icon',
  'category',
] as const;

export interface ServiceEntity extends ContentEntity {
  slug: string;
  locale: string;
  status: PublishStatus;
  title: string;
  body: string;
  icon: string;
  category: string;
  sortOrder: number;
}

@Injectable()
export class ServicesService extends BaseService<ServiceEntity, CreateServiceDto, UpdateServiceDto> {
  protected readonly config = {
    modelName: 'Service',
    entityName: 'Service',
    routeName: 'services',
    contentFields: CONTENT_FIELDS,
    seoEntityType: 'service' as const,
    defaultSortBy: 'sortOrder',
    defaultSortOrder: 'asc' as const,
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
    return this.prisma.service;
  }

  protected mapToSeo(entity: ServiceEntity): SeoAttachable {
    return {
      slug: entity.slug,
      locale: entity.locale,
      title: entity.title,
      excerpt: entity.body,
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
      { title: { contains: search, mode: 'insensitive' } },
      { body: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
    ];
  }

  async findAll(query: QueryServiceDto) {
    const where: any = {
      status: PublishStatus.PUBLISHED,
      deletedAt: null,
    };

    if (query.search) {
      where.OR = this.buildSearchConditions(query.search);
    }

    if (query.category) where.category = query.category;

    const orderBy = this.buildOrderBy(query.sortBy, query.sortOrder);
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.service.findMany({ where, orderBy, skip, take: limit }),
      this.prisma.service.count({ where }),
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

  async adminFindAll(query: QueryServiceDto) {
    const where: any = {};
    if (query.search) {
      where.OR = this.buildSearchConditions(query.search);
    }

    const orderBy = { sortOrder: 'asc' as const };
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.service.findMany({ where, orderBy, skip, take: limit }),
      this.prisma.service.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}