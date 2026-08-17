import { Injectable, NotFoundException, ConflictException, GoneException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseQueryDto, PaginatedResult, buildPaginationMeta } from '../dto/base-query.dto';
import { PublishStatus } from '@prisma/client';
import { SlugService } from '../../seo/services/slug.service';
import { RedirectService } from '../../seo/services/redirect.service';
import { SeoMeta, SeoMetaService, SeoMetaInput } from '../../seo/services/seo-meta.service';

export interface SeoAttachable {
  slug: string;
  locale: string;
  title: string;
  excerpt?: string;
  content?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  noindex: boolean;
  nofollow: boolean;
  ogImageUrl?: string | null;
  ogImageAlt?: string | null;
  publishedAt: Date | null;
  contentUpdatedAt: Date;
  coverImage?: string | null;
  author?: string;
  tags?: string[];
  price?: number;
}

export interface ContentEntity {
  id: string;
  slug: string;
  locale: string;
  status: PublishStatus;
  deletedAt: Date | null;
  publishedAt: Date | null;
  contentUpdatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BaseServiceConfig<T extends ContentEntity> {
  modelName: string;
  entityName: string;
  routeName: string;
  contentFields: readonly string[];
  seoEntityType: string;
  defaultSortBy?: string;
  defaultSortOrder?: 'asc' | 'desc';
  uniqueSlug?: boolean;
  locale?: string;
}

@Injectable()
export abstract class BaseService<T extends ContentEntity, CreateDto, UpdateDto> {
  protected abstract readonly config: BaseServiceConfig<T>;
  protected abstract readonly prisma: PrismaService;
  protected abstract readonly slug: SlugService;
  protected abstract readonly redirects: RedirectService;
  protected abstract readonly seo: SeoMetaService;

  protected abstract getModel(): any;
  protected abstract mapToSeo(entity: T): SeoAttachable;

  async create(dto: CreateDto & { slug: string; status?: PublishStatus }): Promise<T> {
    const slug = this.slug.normalize(dto.slug);
    this.slug.assertUsable(slug);

    if (this.config.uniqueSlug) {
      const existing = await this.getModel().findUnique({
        where: { slug_locale: { slug, locale: this.config.locale ?? 'en' } },
      });
      if (existing) throw new ConflictException('Slug already in use');
    }

    const status = dto.status ?? PublishStatus.PUBLISHED;
    const now = new Date();

    return this.getModel().create({
      data: {
        ...dto,
        slug,
        status,
        publishedAt: status === PublishStatus.PUBLISHED ? now : null,
        contentUpdatedAt: now,
      } as any,
    });
  }

  async findAll(query: BaseQueryDto): Promise<PaginatedResult<T>> {
    const {
      search,
      status,
      sortBy,
      sortOrder,
      page = 1,
      limit = 12,
    } = query;

    const where: any = {
      deletedAt: null,
      status: status ?? PublishStatus.PUBLISHED,
    };

    if (search) {
      where.OR = this.buildSearchConditions(search);
    }

    const orderBy = this.buildOrderBy(sortBy, sortOrder);

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.getModel().findMany({ where, orderBy, skip, take: limit }),
      this.getModel().count({ where }),
    ]);

    return {
      data,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async adminFindAll(query: BaseQueryDto): Promise<PaginatedResult<T>> {
    const {
      search,
      status,
      sortBy,
      sortOrder,
      page = 1,
      limit = 50,
    } = query;

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = this.buildSearchConditions(search);
    }

    const orderBy = this.buildOrderBy(sortBy, sortOrder, 'createdAt', 'desc');

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.getModel().findMany({ where, orderBy, skip, take: limit }),
      this.getModel().count({ where }),
    ]);

    return {
      data,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findOne(id: string): Promise<T & { seo: SeoMeta }> {
    const item = await this.getModel().findFirst({ where: { id } });
    if (!item) throw new NotFoundException(`${this.config.entityName} not found`);
    this.assertViewable(item.status);
    return this.attachSeo(item);
  }

  async findBySlug(slug: string): Promise<T & { seo: SeoMeta }> {
    const item = await this.getModel().findFirst({
      where: { slug, locale: this.config.locale ?? 'en' },
    });
    if (!item) throw new NotFoundException(`${this.config.entityName} not found`);
    this.assertViewable(item.status);
    return this.attachSeo(item);
  }

  async update(id: string, dto: UpdateDto & { slug?: string; status?: PublishStatus }): Promise<T> {
    const existing = await this.getOrFail(id);

    if (dto.slug && this.config.uniqueSlug) {
      const newSlug = this.slug.normalize(dto.slug);
      this.slug.assertUsable(newSlug);
      const clash = await this.getModel().findUnique({
        where: { slug_locale: { slug: newSlug, locale: existing.locale } },
      });
      if (clash && clash.id !== id) throw new ConflictException('Slug already in use');
    }

    const now = new Date();
    const data: any = { ...dto };

    if (dto.slug) data.slug = this.slug.normalize(dto.slug);

    const bumpsContent = this.config.contentFields.some((field) => field in dto);
    if (bumpsContent) data.contentUpdatedAt = now;

    const isPublishing =
      dto.status === PublishStatus.PUBLISHED && existing.status !== PublishStatus.PUBLISHED;
    if (isPublishing && !existing.publishedAt) data.publishedAt = now;

    return this.prisma.$transaction(async (tx: any) => {
      const updated = await tx[this.config.modelName.toLowerCase()].update({ where: { id }, data });
      if (data.slug && data.slug !== existing.slug && this.config.uniqueSlug) {
        await this.redirects.recordSlugRename(
          this.config.entityName,
          id,
          existing.slug,
          data.slug,
          this.config.routeName,
          existing.locale,
          tx,
        );
      }
      return updated;
    });
  }

  async remove(id: string): Promise<T> {
    await this.getOrFail(id);
    return this.getModel().update({
      where: { id },
      data: {
        status: PublishStatus.DELETED,
        deletedAt: new Date(),
        publishedAt: null,
      },
    });
  }

  protected async getOrFail(id: string): Promise<T> {
    const item = await this.getModel().findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`${this.config.entityName} not found`);
    return item;
  }

  protected assertViewable(status: PublishStatus): void {
    if (status === PublishStatus.DELETED) {
      throw new GoneException(`${this.config.entityName} removed`);
    }
    if (status !== PublishStatus.PUBLISHED) {
      throw new NotFoundException(`${this.config.entityName} not found`);
    }
  }

  protected attachSeo(item: T): T & { seo: SeoMeta } {
    const seoData = this.mapToSeo(item);
    const seo: SeoMeta = this.seo.build({
      entityType: this.config.seoEntityType as SeoMetaInput['entityType'],
      slug: seoData.slug,
      title: seoData.title,
      excerpt: seoData.excerpt,
      content: seoData.content ?? undefined,
      metaTitle: seoData.metaTitle ?? undefined,
      metaDescription: seoData.metaDescription ?? undefined,
      canonicalUrl: seoData.canonicalUrl ?? undefined,
      noindex: seoData.noindex,
      nofollow: seoData.nofollow,
      ogImageUrl: seoData.ogImageUrl ?? undefined,
      ogImageAlt: seoData.ogImageAlt ?? undefined,
      locale: seoData.locale,
      publishedAt: seoData.publishedAt,
      contentUpdatedAt: seoData.contentUpdatedAt,
      coverImage: seoData.coverImage ?? undefined,
      author: seoData.author,
      tags: seoData.tags,
      price: seoData.price,
    });
    return { ...(item as any), seo };
  }

  protected buildSearchConditions(search: string): any[] {
    return [
      { title: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
    ];
  }

  protected buildOrderBy(
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    defaultBy?: string,
    defaultOrder?: 'asc' | 'desc',
  ): any {
    const by = sortBy ?? this.config.defaultSortBy ?? defaultBy ?? 'publishedAt';
    const order = sortOrder ?? this.config.defaultSortOrder ?? defaultOrder ?? 'desc';
    return { [by]: order };
  }
}