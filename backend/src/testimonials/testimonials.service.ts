import { Injectable } from '@nestjs/common';
import { PublishStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestimonialDto, UpdateTestimonialDto, QueryTestimonialDto } from './dto/testimonial.dto';
import { SlugService } from '../seo/services/slug.service';
import { RedirectService } from '../seo/services/redirect.service';
import { SeoMeta, SeoMetaService } from '../seo/services/seo-meta.service';
import { BaseService, ContentEntity, SeoAttachable } from '../common/base/base.service';

const CONTENT_FIELDS = [
  'quote',
  'authorName',
  'authorTitle',
  'avatar',
  'featured',
] as const;

export interface TestimonialEntity extends ContentEntity {
  quote: string;
  authorName: string;
  authorTitle: string;
  avatar: string | null;
  featured: boolean;
  sortOrder: number;
  status: PublishStatus;
}

@Injectable()
export class TestimonialsService extends BaseService<TestimonialEntity, CreateTestimonialDto, UpdateTestimonialDto> {
  protected readonly config = {
    modelName: 'Testimonial',
    entityName: 'Testimonial',
    routeName: 'testimonials',
    contentFields: CONTENT_FIELDS,
    seoEntityType: 'testimonial' as const,
    defaultSortBy: 'sortOrder',
    defaultSortOrder: 'asc' as const,
    uniqueSlug: false,
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
    return this.prisma.testimonial;
  }

  protected mapToSeo(entity: TestimonialEntity): SeoAttachable {
    return {
      slug: entity.slug ?? '',
      locale: 'en',
      title: entity.authorName,
      excerpt: entity.quote,
      content: undefined,
      metaTitle: undefined,
      metaDescription: undefined,
      canonicalUrl: undefined,
      noindex: false,
      nofollow: false,
      ogImageUrl: entity.avatar ?? undefined,
      ogImageAlt: undefined,
      publishedAt: entity.publishedAt,
      contentUpdatedAt: entity.contentUpdatedAt,
      coverImage: entity.avatar ?? undefined,
      author: entity.authorName,
    };
  }

  protected buildSearchConditions(search: string): any[] {
    return [
      { quote: { contains: search, mode: 'insensitive' } },
      { authorName: { contains: search, mode: 'insensitive' } },
      { authorTitle: { contains: search, mode: 'insensitive' } },
    ];
  }

  async findAll(query: QueryTestimonialDto) {
    const where: any = {
      status: PublishStatus.PUBLISHED,
      deletedAt: null,
    };

    if (query.search) {
      where.OR = this.buildSearchConditions(query.search);
    }

    if (query.featured !== undefined) where.featured = query.featured;

    const orderBy = this.buildOrderBy(query.sortBy, query.sortOrder);
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.testimonial.findMany({ where, orderBy, skip, take: limit }),
      this.prisma.testimonial.count({ where }),
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

  async adminFindAll(query: QueryTestimonialDto) {
    const where: any = {};
    if (query.search) {
      where.OR = this.buildSearchConditions(query.search);
    }

    const orderBy = { sortOrder: 'asc' as const };
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.testimonial.findMany({ where, orderBy, skip, take: limit }),
      this.prisma.testimonial.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}