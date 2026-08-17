import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { MockTest, Prisma, PublishStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { SlugService } from "../seo/services/slug.service";
import {
  CreateMockTestDto,
  UpdateMockTestDto,
  QueryMockTestDto,
  CreateAttemptDto,
} from "./dto/mock-test.dto";
import { deleteAsset, publicUrlFor } from "./media.storage";

export interface Viewer {
  id: string;
  email: string;
  role: string;
}

/**
 * Columns the catalogue needs — everything except the SEO and lifecycle fields
 * a card never renders. The asset URLs are read here but stripped again by
 * `withAccess` for visitors who aren't allowed to see them.
 */
const LIST_SELECT = {
  id: true,
  slug: true,
  title: true,
  description: true,
  language: true,
  category: true,
  level: true,
  kind: true,
  isFree: true,
  status: true,
  sortOrder: true,
  durationSeconds: true,
  pdfUrl: true,
  pdfName: true,
  pdfSize: true,
  mediaUrl: true,
  mediaName: true,
  mediaSize: true,
  mediaMimeType: true,
  contentUpdatedAt: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.MockTestSelect;

export type MockTestListItem = Prisma.MockTestGetPayload<{ select: typeof LIST_SELECT }>;

@Injectable()
export class MockTestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly slug: SlugService,
  ) {}

  // ── Public reads ────────────────────────────────────────────────

  async findAll(query: QueryMockTestDto, viewer?: Viewer) {
    const where: Prisma.MockTestWhereInput = {
      deletedAt: null,
      status: PublishStatus.PUBLISHED,
    };

    if (query.language) where.language = query.language;
    if (query.category) where.category = query.category;
    if (query.kind) where.kind = query.kind;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 24;

    const [rows, total] = await Promise.all([
      this.prisma.mockTest.findMany({
        where,
        select: LIST_SELECT,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.mockTest.count({ where }),
    ]);

    return {
      data: rows.map((row) => this.withAccess(row, viewer)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /** The distinct languages and categories actually in use, for the filters. */
  async facets() {
    const rows = await this.prisma.mockTest.findMany({
      where: { deletedAt: null, status: PublishStatus.PUBLISHED },
      select: { language: true, category: true, kind: true },
    });

    const tally = (values: string[]) =>
      Object.entries(
        values.reduce<Record<string, number>>((acc, value) => {
          acc[value] = (acc[value] ?? 0) + 1;
          return acc;
        }, {}),
      )
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));

    return {
      languages: tally(rows.map((r) => r.language)),
      categories: tally(rows.map((r) => r.category)),
      kinds: tally(rows.map((r) => r.kind)),
      total: rows.length,
    };
  }

  async findBySlug(slug: string, viewer?: Viewer) {
    const item = await this.prisma.mockTest.findFirst({
      where: { slug, locale: "en", deletedAt: null },
    });
    if (!item) throw new NotFoundException("Practice session not found");
    if (item.status !== PublishStatus.PUBLISHED && viewer?.role !== "admin") {
      throw new NotFoundException("Practice session not found");
    }
    return this.withAccess(item, viewer);
  }

  // ── Admin ───────────────────────────────────────────────────────

  async adminFindAll(query: QueryMockTestDto) {
    const where: Prisma.MockTestWhereInput = { deletedAt: null };
    if (query.status) where.status = query.status;
    if (query.language) where.language = query.language;
    if (query.kind) where.kind = query.kind;
    if (query.search) {
      where.OR = [{ title: { contains: query.search, mode: "insensitive" } }];
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 24;

    const [data, total] = await Promise.all([
      this.prisma.mockTest.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.mockTest.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async create(
    dto: CreateMockTestDto,
    files: { pdf?: Express.Multer.File; media?: Express.Multer.File },
  ) {
    const slug = await this.uniqueSlug(dto.slug || dto.title);

    const status = dto.status ?? PublishStatus.DRAFT;
    const now = new Date();

    return this.prisma.mockTest.create({
      data: {
        slug,
        title: dto.title,
        description: dto.description,
        language: dto.language ?? "Nepali",
        category: dto.category ?? "general",
        level: dto.level ?? "All Levels",
        kind: dto.kind,
        isFree: dto.isFree ?? false,
        sortOrder: dto.sortOrder ?? 0,
        status,
        durationSeconds: dto.durationSeconds,
        publishedAt: status === PublishStatus.PUBLISHED ? now : null,
        contentUpdatedAt: now,
        ...this.fileFields(files),
      },
    });
  }

  async update(
    id: string,
    dto: UpdateMockTestDto,
    files: { pdf?: Express.Multer.File; media?: Express.Multer.File },
  ) {
    const existing = await this.getOrFail(id);

    const data: Prisma.MockTestUpdateInput = { ...dto, contentUpdatedAt: new Date() };

    if (dto.slug && dto.slug !== existing.slug) {
      data.slug = await this.uniqueSlug(dto.slug, id);
    }

    if (dto.status === PublishStatus.PUBLISHED && !existing.publishedAt) {
      data.publishedAt = new Date();
    }

    // Replacing a file frees the bytes the old one was using.
    if (files.pdf) deleteAsset(existing.pdfUrl);
    if (files.media) deleteAsset(existing.mediaUrl);

    Object.assign(data, this.fileFields(files));

    return this.prisma.mockTest.update({ where: { id }, data });
  }

  async remove(id: string) {
    const existing = await this.getOrFail(id);
    deleteAsset(existing.pdfUrl);
    deleteAsset(existing.mediaUrl);

    return this.prisma.mockTest.update({
      where: { id },
      data: {
        status: PublishStatus.DELETED,
        deletedAt: new Date(),
        publishedAt: null,
        pdfUrl: null,
        mediaUrl: null,
      },
    });
  }

  // ── Attempts ────────────────────────────────────────────────────

  async createAttempt(
    viewer: Viewer,
    mockTestId: string,
    dto: CreateAttemptDto,
    recording?: Express.Multer.File,
  ) {
    const mockTest = await this.prisma.mockTest.findFirst({
      where: { id: mockTestId, deletedAt: null },
      select: { id: true },
    });
    if (!mockTest) throw new NotFoundException("Practice session not found");
    if (!recording) throw new BadRequestException("No recording uploaded");

    return this.prisma.mockTestAttempt.create({
      data: {
        userId: viewer.id,
        mockTestId,
        recordingUrl: publicUrlFor(recording.filename),
        recordingSize: recording.size,
        durationSeconds: dto.durationSeconds,
        notes: dto.notes,
      },
    });
  }

  async findMyAttempts(viewer: Viewer, mockTestId?: string) {
    return this.prisma.mockTestAttempt.findMany({
      where: { userId: viewer.id, ...(mockTestId ? { mockTestId } : {}) },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        mockTest: { select: { id: true, slug: true, title: true, language: true } },
      },
    });
  }

  async removeAttempt(viewer: Viewer, attemptId: string) {
    const attempt = await this.prisma.mockTestAttempt.findUnique({
      where: { id: attemptId },
    });
    if (!attempt || attempt.userId !== viewer.id) {
      throw new NotFoundException("Recording not found");
    }
    deleteAsset(attempt.recordingUrl);
    await this.prisma.mockTestAttempt.delete({ where: { id: attemptId } });
    return { id: attemptId, removed: true };
  }

  // ── Internals ───────────────────────────────────────────────────

  private fileFields(files: { pdf?: Express.Multer.File; media?: Express.Multer.File }): {
    pdfUrl?: string;
    pdfName?: string;
    pdfSize?: number;
    mediaUrl?: string;
    mediaName?: string;
    mediaSize?: number;
    mediaMimeType?: string;
  } {
    const data: {
      pdfUrl?: string;
      pdfName?: string;
      pdfSize?: number;
      mediaUrl?: string;
      mediaName?: string;
      mediaSize?: number;
      mediaMimeType?: string;
    } = {};

    if (files.pdf) {
      data.pdfUrl = publicUrlFor(files.pdf.filename);
      data.pdfName = files.pdf.originalname;
      data.pdfSize = files.pdf.size;
    }
    if (files.media) {
      data.mediaUrl = publicUrlFor(files.media.filename);
      data.mediaName = files.media.originalname;
      data.mediaSize = files.media.size;
      data.mediaMimeType = files.media.mimetype;
    }

    return data;
  }

  /**
   * Paid sessions keep their media URLs hidden from signed-out visitors, so the
   * catalogue stays public while the assets stay behind the login.
   */
  private withAccess<T extends Partial<MockTest>>(item: T, viewer?: Viewer) {
    const unlocked = item.isFree === true || !!viewer;
    return {
      ...item,
      locked: !unlocked,
      pdfUrl: unlocked ? (item as MockTest).pdfUrl ?? null : null,
      mediaUrl: unlocked ? (item as MockTest).mediaUrl ?? null : null,
    };
  }

  private async getOrFail(id: string) {
    const item = await this.prisma.mockTest.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Practice session not found");
    return item;
  }

  private async uniqueSlug(source: string, ignoreId?: string) {
    const base = this.slug.normalize(source);
    this.slug.assertUsable(base);

    const clash = await this.prisma.mockTest.findUnique({
      where: { slug_locale: { slug: base, locale: "en" } },
      select: { id: true },
    });

    if (!clash || clash.id === ignoreId) return base;

    // Slugs are user-visible, so suffix rather than reject on a title collision.
    for (let n = 2; n < 50; n++) {
      const candidate = `${base}-${n}`;
      const taken = await this.prisma.mockTest.findUnique({
        where: { slug_locale: { slug: candidate, locale: "en" } },
        select: { id: true },
      });
      if (!taken) return candidate;
    }

    throw new ConflictException("Could not derive a free slug for that title");
  }
}
