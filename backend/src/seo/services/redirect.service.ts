import { ConflictException, Injectable } from "@nestjs/common";
import { Prisma, RedirectType } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

const MAX_CHAIN_DEPTH = 10;

export interface RedirectResolution {
  destination: string;
  status: 301 | 302 | 410;
}

@Injectable()
export class RedirectService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resolves a normalized path against the redirect table.
   * Chains were flattened at write time, so this is always a single hop.
   */
  async resolve(path: string): Promise<RedirectResolution | null> {
    const rule = await this.prisma.redirect.findFirst({
      where: { source: path, isActive: true },
      select: { destination: true, type: true },
    });
    if (!rule) return null;

    if (rule.type === RedirectType.GONE) {
      return { destination: "", status: 410 };
    }

    const destination = await this.followToTerminal(this.prisma, rule.destination);
    const status = rule.type === RedirectType.PERMANENT ? 301 : 302;
    return { destination, status };
  }

  /**
   * Records a slug rename: writes the old slug into SlugHistory and upserts a
   * 301 from the old path to the new path, flattening any existing rule that
   * pointed at the old path so no chain can form. Run this inside the caller's
   * transaction so a failed rename rolls everything back.
   */
  async recordSlugRename(
    entityType: string,
    entityId: string,
    oldSlug: string,
    newSlug: string,
    pathPrefix: string,
    locale = "en",
    client: Prisma.TransactionClient = this.prisma,
  ): Promise<void> {
    const sourcePath = `/${pathPrefix}/${oldSlug}`;
    const destPath = `/${pathPrefix}/${newSlug}`;
    if (sourcePath === destPath) return;

    const finalDest = await this.followToTerminal(client, destPath);
    if (finalDest === sourcePath) {
      throw new ConflictException("Redirect would create a cycle");
    }

    await client.slugHistory.create({
      data: { entityType, entityId, slug: oldSlug, locale },
    });
    await client.redirect.updateMany({
      where: { destination: sourcePath },
      data: { destination: finalDest },
    });
    await client.redirect.upsert({
      where: { source: sourcePath },
      create: {
        source: sourcePath,
        destination: finalDest,
        type: RedirectType.PERMANENT,
      },
      update: { destination: finalDest, isActive: true },
    });
  }

  private async followToTerminal(
    client: Pick<Prisma.TransactionClient, "redirect">,
    start: string,
  ): Promise<string> {
    let current = start;
    const seen = new Set<string>([start]);
    for (let i = 0; i < MAX_CHAIN_DEPTH; i++) {
      const next = await client.redirect.findUnique({
        where: { source: current },
        select: { destination: true },
      });
      if (!next) return current;
      if (seen.has(next.destination)) {
        throw new ConflictException("Redirect cycle detected");
      }
      seen.add(next.destination);
      current = next.destination;
    }
    throw new ConflictException("Redirect chain too deep");
  }
}
