import { Injectable, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSubscriptionDto) {
    const existing = await this.prisma.subscription.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      if (!existing.active) {
        return this.prisma.subscription.update({
          where: { id: existing.id },
          data: { active: true },
        });
      }
      throw new ConflictException("Already subscribed");
    }
    return this.prisma.subscription.create({ data: { email: dto.email } });
  }

  async findAll(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.subscription.findMany({ orderBy: { createdAt: "desc" }, skip, take: limit }),
      this.prisma.subscription.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
