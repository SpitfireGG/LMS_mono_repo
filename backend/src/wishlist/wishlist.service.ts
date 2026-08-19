import { Injectable, NotFoundException } from "@nestjs/common";
import { PublishStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { QueryWishlistDto } from "./dto/wishlist.dto";

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, query: QueryWishlistDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 24;
    const where = { userId, course: { deletedAt: null } };

    const [items, total] = await Promise.all([
      this.prisma.wishlistItem.findMany({
        where,
        include: { course: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.wishlistItem.count({ where }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /** Just the course ids — cheap enough for the catalogue to hydrate its hearts. */
  async findIds(userId: string) {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      select: { courseId: true },
    });
    return items.map((item) => item.courseId);
  }

  async add(userId: string, courseId: string) {
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, deletedAt: null, status: PublishStatus.PUBLISHED },
    });
    if (!course) throw new NotFoundException("Course not found");

    // Adding twice is a no-op rather than an error — the heart is a toggle.
    return this.prisma.wishlistItem.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: {},
      create: { userId, courseId },
      include: { course: true },
    });
  }

  async remove(userId: string, courseId: string) {
    const { count } = await this.prisma.wishlistItem.deleteMany({ where: { userId, courseId } });
    if (count === 0) throw new NotFoundException("That course is not on your wishlist");
    return { courseId, removed: true };
  }

  async clear(userId: string) {
    const { count } = await this.prisma.wishlistItem.deleteMany({ where: { userId } });
    return { removed: count };
  }
}
