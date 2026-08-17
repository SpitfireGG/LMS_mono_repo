import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateContactDto } from "./dto/create-contact.dto";

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContactDto) {
    return this.prisma.contactSubmission.create({
      data: {
        enquiryType: dto.enquiryType,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone ?? null,
        courseOfInterest: dto.courseOfInterest ?? null,
        preferredContact: dto.preferredContact ?? "Email",
        message: dto.message,
        consented: dto.consented,
      },
    });
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.contactSubmission.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
