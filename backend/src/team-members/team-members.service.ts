import { Injectable } from '@nestjs/common';
import { PublishStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamMemberDto, UpdateTeamMemberDto, QueryTeamMemberDto } from './dto/team-member.dto';
import { SlugService } from '../seo/services/slug.service';
import { RedirectService } from '../seo/services/redirect.service';
import { SeoMeta, SeoMetaService } from '../seo/services/seo-meta.service';
import { BaseService, ContentEntity, SeoAttachable } from '../common/base/base.service';

const CONTENT_FIELDS = [
  'name',
  'role',
  'bio',
  'image',
  'category',
] as const;

export interface TeamMemberEntity extends ContentEntity {
  slug: string;
  locale: string;
  status: PublishStatus;
  name: string;
  role: string;
  bio: string | null;
  image: string | null;
  category: string;
  sortOrder: number;
}

@Injectable()
export class TeamMembersService extends BaseService<TeamMemberEntity, CreateTeamMemberDto, UpdateTeamMemberDto> {
  protected readonly config = {
    modelName: 'TeamMember',
    entityName: 'TeamMember',
    routeName: 'team-members',
    contentFields: CONTENT_FIELDS,
    seoEntityType: 'team-member' as const,
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
    return this.prisma.teamMember;
  }

  protected mapToSeo(entity: TeamMemberEntity): SeoAttachable {
    return {
      slug: entity.slug,
      locale: entity.locale,
      title: entity.name,
      excerpt: entity.bio ?? undefined,
      content: undefined,
      metaTitle: undefined,
      metaDescription: undefined,
      canonicalUrl: undefined,
      noindex: false,
      nofollow: false,
      ogImageUrl: entity.image ?? undefined,
      ogImageAlt: undefined,
      publishedAt: entity.publishedAt,
      contentUpdatedAt: entity.contentUpdatedAt,
      coverImage: entity.image ?? undefined,
      author: undefined,
    };
  }

  protected buildSearchConditions(search: string): any[] {
    return [
      { name: { contains: search, mode: 'insensitive' } },
      { role: { contains: search, mode: 'insensitive' } },
      { bio: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
    ];
  }

  async findAll(query: QueryTeamMemberDto) {
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
      this.prisma.teamMember.findMany({ where, orderBy, skip, take: limit }),
      this.prisma.teamMember.count({ where }),
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

  async adminFindAll(query: QueryTeamMemberDto) {
    const where: any = {};
    if (query.search) {
      where.OR = this.buildSearchConditions(query.search);
    }

    const orderBy = { sortOrder: 'asc' as const };
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.teamMember.findMany({ where, orderBy, skip, take: limit }),
      this.prisma.teamMember.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}