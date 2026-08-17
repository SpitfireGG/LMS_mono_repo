export interface SitemapEntry {
  loc: string;
  lastmod: Date;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
  alternates?: { hreflang: string; href: string }[];
  images?: { loc: string; title?: string; caption?: string }[];
}

export interface SitemapProvider {
  readonly key: string;
  count(): Promise<number>;
  entries(
    cursor?: string,
    take?: number,
  ): Promise<{ items: SitemapEntry[]; nextCursor?: string }>;
}
