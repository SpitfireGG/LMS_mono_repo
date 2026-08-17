import { Injectable } from "@nestjs/common";
import { FeedEntry } from "../interfaces/feed-provider.interface";
import { FeedRegistryService } from "./feed-registry.service";
import { CanonicalService } from "./canonical.service";

const FEED_LIMIT = 30;

const XML_ESCAPE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

@Injectable()
export class FeedService {
  constructor(
    private readonly registry: FeedRegistryService,
    private readonly canonical: CanonicalService,
  ) {}

  async buildFeed(limit = FEED_LIMIT): Promise<FeedEntry[]> {
    const all: FeedEntry[] = [];
    for (const provider of this.registry.all()) {
      all.push(...(await provider.items(limit)));
    }
    all.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    return all.slice(0, limit);
  }

  async rss(): Promise<string> {
    const site = this.canonical.getSiteUrl();
    const brand = process.env.BRAND_NAME ?? "Your Brand";
    const lang = process.env.DEFAULT_LOCALE ?? "en";
    const items = await this.buildFeed();

    const channel = [
      `<title>${this.escapeXml(brand)}</title>`,
      `<link>${this.escapeXml(site)}</link>`,
      `<description>Latest articles and case studies from ${this.escapeXml(brand)}</description>`,
      `<language>${this.escapeXml(lang)}</language>`,
      `<atom:link href="${this.escapeXml(site)}/rss.xml" rel="self" type="application/rss+xml"/>`,
    ];

    const latest = this.latestTimestamp(items);
    if (latest) channel.push(`<lastBuildDate>${latest.toUTCString()}</lastBuildDate>`);

    const itemXml = items.map((item) => this.rssItem(item, site));

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
${channel.map((l) => `    ${l}`).join("\n")}
${itemXml.join("\n")}
  </channel>
</rss>`;
  }

  async atom(): Promise<string> {
    const site = this.canonical.getSiteUrl();
    const brand = process.env.BRAND_NAME ?? "Your Brand";
    const items = await this.buildFeed();

    const feedLines = [
      `<title>${this.escapeXml(brand)}</title>`,
      `<link href="${this.escapeXml(site)}/atom.xml" rel="self"/>`,
      `<link href="${this.escapeXml(site)}" rel="alternate"/>`,
      `<id>${this.escapeXml(site)}/</id>`,
      `<updated>${(this.latestTimestamp(items) ?? new Date(0)).toISOString()}</updated>`,
      `<author><name>${this.escapeXml(brand)}</name></author>`,
    ];

    const entryXml = items.map((item) => this.atomEntry(item));

    return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
${feedLines.map((l) => `  ${l}`).join("\n")}
${entryXml.join("\n")}
</feed>`;
  }

  async jsonFeed(): Promise<string> {
    const site = this.canonical.getSiteUrl();
    const brand = process.env.BRAND_NAME ?? "Your Brand";
    const lang = process.env.DEFAULT_LOCALE ?? "en";
    const items = await this.buildFeed();

    const feed = {
      version: "https://jsonfeed.org/version/1.1",
      title: brand,
      home_page_url: site,
      feed_url: `${site}/feed.json`,
      description: `Latest articles and case studies from ${brand}`,
      language: lang,
      items: items.map((item) => ({
        id: item.id,
        url: item.link,
        title: item.title,
        ...(item.summary ? { summary: item.summary } : {}),
        ...(item.content ? { content_html: item.content } : {}),
        date_published: item.publishedAt.toISOString(),
        ...(item.updatedAt ? { date_modified: item.updatedAt.toISOString() } : {}),
        ...(item.author ? { authors: [{ name: item.author }] } : {}),
        ...(item.image ? { image: item.image } : {}),
        ...(item.categories?.length ? { tags: item.categories } : {}),
      })),
    };

    return JSON.stringify(feed, null, 2);
  }

  private rssItem(item: FeedEntry, site: string): string {
    const lines = [
      `    <item>`,
      `      <title>${this.escapeXml(item.title)}</title>`,
      `      <link>${this.escapeXml(item.link)}</link>`,
      `      <guid isPermaLink="false">${this.escapeXml(item.id)}</guid>`,
      `      <pubDate>${item.publishedAt.toUTCString()}</pubDate>`,
      `      <description>${this.cdata(this.itemHtml(item))}</description>`,
    ];

    if (item.content) {
      lines.push(
        `      <content:encoded>${this.cdata(
          this.withImage(item.content, item.image),
        )}</content:encoded>`,
      );
    }
    if (item.author) {
      lines.push(`      <dc:creator>${this.escapeXml(item.author)}</dc:creator>`);
    }
    for (const category of item.categories ?? []) {
      lines.push(`      <category>${this.escapeXml(category)}</category>`);
    }
    lines.push(`    </item>`);
    return lines.join("\n");
  }

  private atomEntry(item: FeedEntry): string {
    const lines = [
      `  <entry>`,
      `    <title>${this.escapeXml(item.title)}</title>`,
      `    <link href="${this.escapeXml(item.link)}"/>`,
      `    <id>${this.escapeXml(item.link)}</id>`,
      `    <published>${item.publishedAt.toISOString()}</published>`,
      `    <updated>${(item.updatedAt ?? item.publishedAt).toISOString()}</updated>`,
      `    <summary type="html">${this.cdata(this.itemHtml(item))}</summary>`,
    ];
    if (item.content) {
      lines.push(
        `    <content type="html">${this.cdata(
          this.withImage(item.content, item.image),
        )}</content>`,
      );
    }
    if (item.author) {
      lines.push(`    <author><name>${this.escapeXml(item.author)}</name></author>`);
    }
    for (const category of item.categories ?? []) {
      lines.push(`    <category term="${this.escapeXml(category)}"/>`);
    }
    lines.push(`  </entry>`);
    return lines.join("\n");
  }

  private itemHtml(item: FeedEntry): string {
    const summary = item.summary ? `<p>${item.summary}</p>` : "";
    return this.withImage(summary || item.title, item.image);
  }

  private withImage(content: string, image?: string): string {
    if (!image) return content;
    return `<img src="${this.escapeXml(image)}" alt="" />${content}`;
  }

  private latestTimestamp(items: FeedEntry[]): Date | null {
    let latest: Date | null = null;
    for (const item of items) {
      const candidate = item.updatedAt ?? item.publishedAt;
      if (!latest || candidate.getTime() > latest.getTime()) latest = candidate;
    }
    return latest;
  }

  private escapeXml(value: string): string {
    return value.replace(/[&<>"']/g, (c) => XML_ESCAPE[c]);
  }

  private cdata(value: string): string {
    return `<![CDATA[${value.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
  }
}
