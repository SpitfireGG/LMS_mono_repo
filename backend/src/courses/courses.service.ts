import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma, PublishStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto, QueryCourseDto } from './dto/course.dto';
import { SlugService } from '../seo/services/slug.service';
import { RedirectService } from '../seo/services/redirect.service';
import { SeoMeta, SeoMetaService } from '../seo/services/seo-meta.service';
import { BaseService, ContentEntity, SeoAttachable } from '../common/base/base.service';

const CONTENT_FIELDS = [
  'title',
  'description',
  'author',
  'level',
  'category',
  'tag',
  'lessons',
  'hours',
  'price',
  'originalPrice',
  'image',
  'metaTitle',
  'metaDescription',
  'ogImageUrl',
  'ogImageAlt',
] as const;

export interface CourseEntity extends ContentEntity {
  slug: string;
  locale: string;
  status: PublishStatus;
  title: string;
  author: string;
  level: string;
  category: string;
  tag: string;
  lessons: number;
  hours: number;
  students: number;
  rating: number;
  price: number;
  originalPrice: number | null;
  tone: string;
  glyph: string;
  image: string | null;
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  noindex: boolean;
  nofollow: boolean;
  ogImageUrl: string | null;
  ogImageAlt: string | null;
  publishedAt: Date | null;
  contentUpdatedAt: Date;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class CoursesService extends BaseService<CourseEntity, CreateCourseDto, UpdateCourseDto> {
  protected readonly config = {
    modelName: 'Course',
    entityName: 'Course',
    routeName: 'courses',
    contentFields: CONTENT_FIELDS,
    seoEntityType: 'course' as const,
    defaultSortBy: 'students',
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
    return this.prisma.course;
  }

  protected mapToSeo(entity: CourseEntity): SeoAttachable {
    return {
      slug: entity.slug,
      locale: entity.locale,
      title: entity.title,
      excerpt: entity.description ?? undefined,
      content: undefined,
      metaTitle: entity.metaTitle ?? undefined,
      metaDescription: entity.metaDescription ?? undefined,
      canonicalUrl: entity.canonicalUrl ?? undefined,
      noindex: entity.noindex,
      nofollow: entity.nofollow,
      ogImageUrl: entity.ogImageUrl ?? undefined,
      ogImageAlt: entity.ogImageAlt ?? undefined,
      publishedAt: entity.publishedAt,
      contentUpdatedAt: entity.contentUpdatedAt,
      coverImage: entity.image ?? undefined,
      author: entity.author,
      tags: entity.tag ? [entity.tag] : undefined,
      price: entity.price,
    };
  }

  protected buildSearchConditions(search: string): any[] {
    return [
      { title: { contains: search, mode: 'insensitive' } },
      { author: { contains: search, mode: 'insensitive' } },
      { tag: { contains: search, mode: 'insensitive' } },
    ];
  }

  protected buildOrderBy(
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
  ): any {
    const sort = sortBy ?? 'popular';
    switch (sort) {
      case 'rating':
        return { rating: sortOrder ?? 'desc' };
      case 'price-asc':
        return { price: 'asc' };
      case 'price-desc':
        return { price: 'desc' };
      case 'students':
        return { students: 'desc' };
      default:
        return { students: 'desc' };
    }
  }

  async findAll(query: QueryCourseDto) {
    const where: Prisma.CourseWhereInput = {
      status: PublishStatus.PUBLISHED,
      deletedAt: null,
    };

    if (query.search) {
      where.OR = this.buildSearchConditions(query.search);
    }

    if (query.category) where.category = query.category;
    if (query.level) where.level = query.level;

    if (query.priceRange === 'lt200') where.price = { lt: 200 };
    else if (query.priceRange === '200to300') where.price = { gte: 200, lte: 300 };
    else if (query.priceRange === 'gt300') where.price = { gt: 300 };

    if (query.minRating) where.rating = { gte: query.minRating };

    const orderBy = this.buildOrderBy(query.sort, query.sortOrder);
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.course.findMany({ where, orderBy, skip, take: limit }),
      this.prisma.course.count({ where }),
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

  async adminFindAll(query: QueryCourseDto) {
    const where: Prisma.CourseWhereInput = {};
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { author: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.category) where.category = query.category;

    const orderBy = { createdAt: 'desc' as const };
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.course.findMany({ where, orderBy, skip, take: limit }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async uploadImage(id: string, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No image file uploaded');

    await this.getOrFail(id);

    const imageUrl = `/api/uploads/${file.filename}`;

    return this.prisma.course.update({
      where: { id },
      data: { image: imageUrl, contentUpdatedAt: new Date() },
    });
  }
}