import { Injectable, NotFoundException } from "@nestjs/common";
import { createHash } from "crypto";
import { SitemapEntry } from "../interfaces/sitemap-provider.interface";
import { SitemapRegistryService } from "./sitemap-registry.service";
import { CanonicalService } from "./canonical.service";

const XML_ESCAPE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

const SITEMAP_PAGE_SIZE = 45000;

@Injectable()
export class SitemapService {
  constructor(
    private readonly registry: SitemapRegistryService,
    private readonly canonical: CanonicalService,
  ) {}

  async buildIndex(): Promise<{ xml: string; etag: string }> {
    const site = this.canonical.getSiteUrl();
    const sitemaps: string[] = [];

    for (const key of this.registry.keys()) {
      const count = await this.registry.get(key)!.count();
      if (count === 0) continue;
      const shards = Math.ceil(count / SITEMAP_PAGE_SIZE);
      for (let i = 1; i <= shards; i++) {
        sitemaps.push(
          `  <sitemap>\n    <loc>${this.escape(
            `${site}/sitemaps/${key}-${i}.xml`,
          )}</loc>\n  </sitemap>`,
        );
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.join("\n")}
</sitemapindex>`;

    return { xml, etag: this.hash(xml) };
  }

  async buildShard(key: string): Promise<{ xml: string; etag: string }> {
    const match = /^(.*)-(\d+)$/.exec(key);
    const providerKey = match ? match[1] : key;
    const shardIndex = match ? parseInt(match[2], 10) - 1 : 0;

    const provider = this.registry.get(providerKey);
    if (!provider) throw new NotFoundException("Unknown sitemap shard");

    const site = this.canonical.getSiteUrl();
    const urls: string[] = [];
    let cursor: string | undefined;
    let offset = 0;
    const skipFrom = shardIndex * SITEMAP_PAGE_SIZE;

    let page: SitemapEntry[] = [];
    let done = false;

    do {
      const { items, nextCursor } = await provider.entries(cursor, 1000);
      cursor = nextCursor;

      for (const entry of items) {
        offset++;
        if (offset <= skipFrom) continue;
        if (urls.length >= SITEMAP_PAGE_SIZE) {
          done = true;
          break;
        }
        urls.push(this.entryXml(entry, site));
      }

      page = items;
      if (!nextCursor) done = true;
    } while (!done && page.length > 0);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>`;

    return { xml, etag: this.hash(xml) };
  }

  private entryXml(entry: SitemapEntry, site: string): string {
    const loc = /^https?:\/\//.test(entry.loc)
      ? entry.loc
      : `${site}${entry.loc}`;
    const parts = [`  <url>`, `    <loc>${this.escape(loc)}</loc>`];

    if (entry.lastmod) {
      parts.push(`    <lastmod>${entry.lastmod.toISOString()}</lastmod>`);
    }
    if (entry.changefreq) {
      parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    }
    if (entry.priority !== undefined) {
      parts.push(`    <priority>${entry.priority}</priority>`);
    }
    for (const alt of entry.alternates ?? []) {
      parts.push(
        `    <xhtml:link rel="alternate" hreflang="${this.escape(
          alt.hreflang,
        )}" href="${this.escape(alt.href)}"/>`,
      );
    }
    for (const img of entry.images ?? []) {
      parts.push(
        `    <image:image><image:loc>${this.escape(img.loc)}</image:loc></image:image>`,
      );
    }

    parts.push(`  </url>`);
    return parts.join("\n");
  }

  private escape(value: string): string {
    return value.replace(/[&<>"']/g, (c) => XML_ESCAPE[c]);
  }

  private hash(xml: string): string {
    return `"${createHash("sha256").update(xml).digest("hex")}"`;
  }
}
