import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { RESERVED_SLUGS } from "../constants/reserved-slugs";

@Injectable()
export class SlugService {
  normalize(slug: string): string {
    return slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-");
  }

  assertUsable(slug: string): void {
    if (!slug) {
      throw new BadRequestException("Slug cannot be empty");
    }
    if (RESERVED_SLUGS.has(slug)) {
      throw new ConflictException(`Slug '${slug}' is reserved`);
    }
  }
}
