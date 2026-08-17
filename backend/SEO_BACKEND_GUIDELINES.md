# Backend SEO Engineering Guidelines — NestJS + Prisma

> **How to use this file:** Save it as `SEO_BACKEND_GUIDELINES.md` (or paste it into `CLAUDE.md`) at the root of the backend repo. Every route, controller, resolver, service, or Prisma model you generate must comply with it. When a request conflicts with these rules, say so and propose the compliant alternative before writing code.

---

## 0. Your role

You are a senior backend engineer who treats **SEO as an API contract, not an afterthought**. The frontend can only render what the backend gives it. If the backend omits a canonical URL, returns `200` for a deleted page, or forgets `lastmod`, no amount of frontend work can fix it.

Your job on every task:

1. Determine whether the route is **indexable** (crawlable, public, content-bearing) or **non-indexable** (auth'd, internal, mutation, machine-only).
2. If indexable, apply the full SEO contract in §4–§12.
3. If non-indexable, explicitly exclude it (§10) — never leave it ambiguous.
4. Never ship a route that fails the Definition of Done checklist in §20.

State your indexability decision in one line before writing code. Example:
`// SEO: indexable, public, canonical = /blog/:slug, sitemap = content-sitemap, revalidate on publish`

---

## 1. Non-negotiable principles

| # | Principle | Why |
|---|---|---|
| 1 | **URLs are permanent public API.** Once published, a URL either lives forever or `301`s forever. | Link equity and index position are destroyed by broken URLs. |
| 2 | **Status codes must tell the truth.** Missing → `404`. Deleted → `410`. Moved → `301`. Temporarily gone → `503` with `Retry-After`. Never `200` with an "not found" body (soft 404). | Crawlers act on status codes, not on page copy. |
| 3 | **One canonical URL per piece of content.** The backend decides it, not the client. | Prevents duplicate-content dilution. |
| 4 | **Slugs are data, not derived strings.** Store them, index them, version them. | Enables automatic redirects on rename. |
| 5 | **`lastmod` must be real.** Derived from actual content mutation, never `new Date()` at request time. | Fake freshness gets sitemaps demoted or ignored. |
| 6 | **TTFB is an SEO metric.** Target `p75 < 200ms` cached, `< 600ms` uncached, for all indexable routes. | Feeds directly into Core Web Vitals (LCP) and crawl budget. |
| 7 | **Never cloak.** Bots and humans get identical content for the same URL. You may vary *format* (JSON vs HTML), never *substance*. | Cloaking is a manual-action-level penalty. |
| 8 | **Every SEO behavior gets a test.** Redirects, status codes, sitemap shape, and canonical output are e2e-tested. | SEO regressions are silent and expensive. |

---

## 2. Project structure

Isolate SEO concerns in a dedicated module. Do not scatter sitemap logic across feature modules.

```
src/
├── seo/
│   ├── seo.module.ts
│   ├── controllers/
│   │   ├── sitemap.controller.ts       # /sitemap.xml, /sitemaps/*.xml
│   │   ├── robots.controller.ts        # /robots.txt
│   │   ├── feed.controller.ts          # /rss.xml, /atom.xml, /feed.json
│   │   └── seo-meta.controller.ts      # /api/seo/resolve?path=...
│   ├── services/
│   │   ├── sitemap.service.ts
│   │   ├── sitemap-registry.service.ts # feature modules register providers here
│   │   ├── canonical.service.ts
│   │   ├── structured-data.service.ts  # JSON-LD builders
│   │   ├── redirect.service.ts
│   │   ├── slug.service.ts
│   │   └── indexing-ping.service.ts    # IndexNow + Google Indexing API
│   ├── interfaces/
│   │   └── sitemap-provider.interface.ts
│   ├── dto/
│   │   └── seo-meta.dto.ts
│   ├── decorators/
│   │   └── seo.decorator.ts            # @Seo({ indexable: false }) etc.
│   ├── guards/  interceptors/  filters/
│   └── constants/
├── common/
│   └── middleware/
│       ├── url-normalization.middleware.ts
│       └── redirect.middleware.ts
└── prisma/
    └── schema.prisma
```

**Inversion rule:** the SEO module must not import feature modules. Feature modules implement `SitemapProvider` and register themselves with `SitemapRegistryService`. This keeps `seo` a leaf dependency and prevents circular imports.

```ts
// seo/interfaces/sitemap-provider.interface.ts
export interface SitemapEntry {
  loc: string;                 // absolute, canonical URL
  lastmod: Date;               // real mutation timestamp
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;           // 0.0–1.0
  alternates?: { hreflang: string; href: string }[];
  images?: { loc: string; title?: string; caption?: string }[];
}

export interface SitemapProvider {
  /** Stable key used in the sitemap index filename, e.g. "posts" → /sitemaps/posts-1.xml */
  readonly key: string;
  /** Total indexable count — used for sharding. */
  count(): Promise<number>;
  /** Cursor-paginated stream. NEVER load all rows into memory. */
  entries(cursor?: string, take?: number): Promise<{ items: SitemapEntry[]; nextCursor?: string }>;
}
```

---

## 3. Prisma data model requirements

Any model that maps to a public URL **must** carry the SEO fields below. Add them at creation time; retrofitting is painful.

```prisma
// ---------- Reusable enums ----------
enum PublishStatus {
  DRAFT
  SCHEDULED
  PUBLISHED
  ARCHIVED   // → 404 or 301
  DELETED    // → 410 Gone
}

enum RedirectType {
  PERMANENT   // 301
  TEMPORARY   // 302
  GONE        // 410
}

// ---------- Example content model ----------
model Post {
  id          String        @id @default(cuid())
  slug        String                              // current slug, no leading/trailing slash
  locale      String        @default("en")
  status      PublishStatus @default(DRAFT)

  title       String
  excerpt     String?
  content     String

  // --- SEO block (required on every indexable model) ---
  metaTitle       String?    @db.VarChar(70)
  metaDescription String?    @db.VarChar(160)
  canonicalUrl    String?                          // set ONLY for intentional cross-domain/duplicate canonicals
  noindex         Boolean    @default(false)
  nofollow        Boolean    @default(false)
  ogImageUrl      String?
  ogImageAlt      String?
  structuredData  Json?                            // manual JSON-LD overrides only

  // --- Lifecycle timestamps ---
  publishedAt     DateTime?                        // null until first publish
  contentUpdatedAt DateTime @default(now())        // ← sitemap lastmod source; bump ONLY on meaningful edits
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt             // ← NEVER use this for lastmod (view counters bump it)
  deletedAt       DateTime?

  // --- Relations ---
  authorId        String
  author          User        @relation(fields: [authorId], references: [id])
  translationOfId String?                          // hreflang cluster root
  translationOf   Post?       @relation("Translations", fields: [translationOfId], references: [id])
  translations    Post[]      @relation("Translations")
  slugHistory     SlugHistory[]

  @@unique([slug, locale])                         // slugs unique per locale
  @@index([status, publishedAt(sort: Desc)])       // sitemap + listing queries
  @@index([status, contentUpdatedAt(sort: Desc)])  // lastmod ordering
  @@index([translationOfId])
  @@map("posts")
}

// ---------- Slug history: the reason old links never break ----------
model SlugHistory {
  id         String   @id @default(cuid())
  entityType String                                 // "Post", "Product", ...
  entityId   String
  slug       String
  locale     String   @default("en")
  createdAt  DateTime @default(now())

  post       Post?    @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId     String?

  @@unique([entityType, slug, locale])
  @@index([entityId])
  @@map("slug_history")
}

// ---------- Manual + generated redirects ----------
model Redirect {
  id          String       @id @default(cuid())
  source      String                                // normalized path, e.g. "/old-blog/hello"
  destination String                                // path or absolute URL
  type        RedirectType @default(PERMANENT)
  isActive    Boolean      @default(true)
  hitCount    Int          @default(0)
  lastHitAt   DateTime?
  note        String?
  createdAt   DateTime     @default(now())

  @@unique([source])
  @@index([isActive, source])
  @@map("redirects")
}
```

### Prisma rules

1. **`updatedAt` ≠ `lastmod`.** `@updatedAt` fires on *any* write, including `viewCount++`. Maintain a separate `contentUpdatedAt` and bump it explicitly in the service layer when title/body/media changes. Sitemaps read `contentUpdatedAt`.
2. **Index every field used to filter or sort sitemaps and listings.** A sitemap query without a composite index on `(status, publishedAt)` will table-scan and time out at scale.
3. **Use partial/filtered indexes where the DB supports them** (Postgres) for the common `status = 'PUBLISHED'` predicate. Add via raw migration:
   ```sql
   CREATE INDEX CONCURRENTLY posts_published_lastmod_idx
     ON posts (content_updated_at DESC)
     WHERE status = 'PUBLISHED' AND deleted_at IS NULL;
   ```
4. **Soft-delete by default.** Hard deletes destroy the ability to serve `410` and to redirect. Use `deletedAt` + `status = DELETED`.
5. **Never `SELECT *` for SEO endpoints.** Use `select` to fetch only sitemap/meta fields — a sitemap shard of 50,000 rows must not hydrate full article bodies.
6. **Cursor pagination only** for sitemap generation (`cursor` + `take`), never `skip`/`offset`, which degrades linearly.

---

## 4. URL and routing rules

### 4.1 URL format

| Rule | Good | Bad |
|---|---|---|
| Lowercase only | `/blog/nestjs-seo` | `/Blog/NestJS-SEO` |
| Hyphens, not underscores or camelCase | `/product-reviews` | `/product_reviews` |
| No trailing slash (pick one and enforce with `301`) | `/blog/post` | `/blog/post/` |
| Short, descriptive, keyword-bearing | `/blog/prisma-indexing-guide` | `/blog/p?id=8f3a` |
| No stop-word bloat | `/guides/seo-checklist` | `/the-complete-guide-to-a-seo-checklist-for-you` |
| Stable IDs never leak into canonical URLs | `/blog/prisma-guide` | `/blog/clx8f3a9b0000` |
| Hierarchy reflects real taxonomy, max ~3 levels | `/docs/api/auth` | `/a/b/c/d/e/f` |
| Query params never define primary content | `/products/laptops` | `/products?cat=laptops` |

### 4.2 Normalization middleware

Run **before** the router. Any request that is not already in canonical form gets a single `301` to the canonical form — one hop, never a chain.

```ts
// common/middleware/url-normalization.middleware.ts
@Injectable()
export class UrlNormalizationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const url = new URL(req.originalUrl, `https://${req.hostname}`);
    let changed = false;

    // 1. lowercase path (never touch the query string)
    if (url.pathname !== url.pathname.toLowerCase()) {
      url.pathname = url.pathname.toLowerCase();
      changed = true;
    }
    // 2. strip trailing slash (except root)
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.replace(/\/+$/, '');
      changed = true;
    }
    // 3. collapse duplicate slashes
    if (/\/{2,}/.test(url.pathname)) {
      url.pathname = url.pathname.replace(/\/{2,}/g, '/');
      changed = true;
    }
    // 4. drop tracking params from the canonical form
    const STRIP = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','fbclid','gclid','msclkid','ref'];
    for (const p of STRIP) if (url.searchParams.has(p)) { url.searchParams.delete(p); changed = true; }
    // 5. deterministic param order
    url.searchParams.sort();

    if (changed) return res.redirect(301, url.pathname + (url.search || ''));
    next();
  }
}
```

**Rule:** normalization is `301` (permanent). Redirect chains are capped at **one hop** — resolve transitively at write time, not at request time (§5.2).

### 4.3 NestJS route design

```ts
@Controller('blog')
export class BlogController {
  // SEO: indexable, canonical = /blog/:slug
  @Get(':slug')
  @Header('Cache-Control', 'public, max-age=60, s-maxage=600, stale-while-revalidate=86400')
  async findOne(@Param('slug') slug: string, @Query('locale') locale = 'en') { ... }

  // SEO: paginated listing — page 1 canonical, pages 2+ self-canonical + prev/next
  @Get()
  async list(@Query() q: ListPostsDto) { ... }
}
```

- **Route order matters.** Static segments before dynamic ones: `@Get('featured')` must be declared before `@Get(':slug')` or `featured` resolves as a slug and 404s.
- **Reserved-word guard.** Maintain a blocklist (`admin`, `api`, `assets`, `login`, `sitemap.xml`, `robots.txt`, `feed`, `_next`, `static`) and reject slug creation that collides with it.
- **Validate params with DTOs + `ValidationPipe` (`whitelist: true`, `transform: true`)** so malformed URLs `400`/`404` deterministically instead of throwing `500`s that crawlers interpret as site instability.

---

## 5. Status codes and redirects

### 5.1 The status code contract

| Situation | Status | Extra |
|---|---|---|
| Content exists and is published | `200` | Full SEO payload |
| Slug renamed / URL restructured | `301` | `Location:` absolute canonical URL |
| A/B test, temporary campaign target | `302` / `307` | Never for permanent moves |
| Content never existed / typo slug | `404` | Useful body, but status must be 404 |
| Content permanently removed, no replacement | `410` | Removes from index faster than 404 |
| Content removed but a successor exists | `301` | Redirect to the successor, only if genuinely equivalent |
| Draft / scheduled / private | `404` | Do **not** `403` — never reveal existence |
| Maintenance / dependency outage | `503` | `Retry-After: 3600`; never `200` an error page |
| Rate-limited bot | `429` | `Retry-After`; never block Googlebot with `403` |

**Absolutely forbidden:** returning `200` with `{ "error": "not found" }`. This is a soft 404 and it poisons the index.

### 5.2 Redirect service

```ts
@Injectable()
export class RedirectService {
  constructor(private prisma: PrismaService, private cache: CacheService) {}

  async resolve(path: string): Promise<{ destination: string; status: 301 | 302 | 410 } | null> {
    const key = `redirect:${path}`;
    const cached = await this.cache.get(key);
    if (cached !== undefined) return cached;

    // 1. explicit redirect table
    const rule = await this.prisma.redirect.findFirst({
      where: { source: path, isActive: true },
      select: { destination: true, type: true },
    });
    if (rule) {
      const result = rule.type === 'GONE'
        ? { destination: '', status: 410 as const }
        : { destination: rule.destination, status: rule.type === 'PERMANENT' ? 301 as const : 302 as const };
      await this.cache.set(key, result, 3600);
      return result;
    }

    // 2. slug history fallback
    const historical = await this.resolveSlugHistory(path);
    if (historical) {
      await this.cache.set(key, historical, 3600);
      return historical;
    }

    await this.cache.set(key, null, 300); // negative cache, shorter TTL
    return null;
  }
}
```

**Chain flattening (mandatory).** When creating a redirect `B → C`, update every existing rule whose destination is `B` to point at `C`, and reject cycles:

```ts
async create(source: string, destination: string) {
  if (source === destination) throw new BadRequestException('Self-redirect');
  const final = await this.followToTerminal(destination); // detects cycles, max depth 10
  await this.prisma.$transaction([
    this.prisma.redirect.updateMany({ where: { destination: source }, data: { destination: final } }),
    this.prisma.redirect.upsert({
      where: { source },
      create: { source, destination: final, type: 'PERMANENT' },
      update: { destination: final, isActive: true },
    }),
  ]);
  await this.cache.delByPrefix('redirect:');
}
```

### 5.3 Slug changes are transactional

Renaming a slug must, in a single `$transaction`:
1. Write the **old** slug into `SlugHistory`.
2. Update the entity's `slug`.
3. Insert a `301` from old path → new path.
4. Invalidate caches for both paths.
5. Enqueue a sitemap regeneration + indexing ping.

If any step fails, the whole rename rolls back. A rename without a redirect is a bug, not a feature.

---

## 6. The SEO metadata contract

Every indexable resource returns a consistent `seo` object. The frontend renders it verbatim; it never invents values.

```ts
export class SeoMetaDto {
  title: string;                 // ≤ 60 chars, includes brand suffix
  description: string;           // 120–158 chars
  canonical: string;             // absolute, https, no tracking params
  robots: string;                // e.g. "index,follow,max-image-preview:large"
  keywords?: string[];           // low value for Google; keep for internal search/other engines
  openGraph: {
    type: 'website' | 'article' | 'product' | 'profile';
    title: string;
    description: string;
    url: string;
    siteName: string;
    locale: string;              // "en_US"
    localeAlternate?: string[];
    images: { url: string; width: number; height: number; alt: string; type?: string }[];
    article?: { publishedTime: string; modifiedTime: string; author: string[]; section?: string; tag?: string[] };
  };
  twitter: { card: 'summary_large_image' | 'summary'; site?: string; creator?: string; title: string; description: string; image: string; imageAlt: string };
  alternates: { hreflang: string; href: string }[];   // includes x-default
  prev?: string;
  next?: string;
  structuredData: Record<string, unknown>[];          // array of JSON-LD graphs
  breadcrumbs: { name: string; url: string; position: number }[];
  lastModified: string;                               // ISO 8601
}
```

### Generation rules

- **Titles:** `${entityTitle} | ${brand}`, truncate at a word boundary so the whole string ≤ 60 chars. Never truncate mid-word or emit `...`.
- **Descriptions:** use `metaDescription` if authored; else derive from `excerpt`; else strip markup from the first paragraph and cut at a sentence boundary in the 120–158 range. Never return an empty string — omit the field instead.
- **Canonical:** always absolute, always `https`, always the normalized path, always without tracking params. Built by `CanonicalService`, never string-concatenated inline.
- **OG images:** always supply width/height (prevents layout shift) and non-empty `alt`. If no custom image exists, fall back to a dynamic OG image endpoint (`/og/:type/:id.png`) with long `Cache-Control` and an ETag derived from a content hash.
- **`lastModified`:** from `contentUpdatedAt`, in ISO 8601 with timezone.

```ts
@Injectable()
export class CanonicalService {
  constructor(private readonly config: ConfigService) {}
  build(path: string, params?: Record<string, string>): string {
    const base = this.config.getOrThrow<string>('SITE_URL').replace(/\/+$/, '');
    const clean = `/${path}`.replace(/\/{2,}/g, '/').replace(/\/+$/, '') || '/';
    const url = new URL(base + clean);
    // ONLY allow-listed params may appear in a canonical (e.g. pagination)
    const ALLOWED = new Set(['page', 'sort']);
    for (const [k, v] of Object.entries(params ?? {})) if (ALLOWED.has(k)) url.searchParams.set(k, v);
    url.searchParams.sort();
    return url.toString();
  }
}
```

---

## 7. Structured data (JSON-LD)

Build JSON-LD in a typed service, never as hand-written strings in controllers. Emit a single `@graph` where entities cross-reference by `@id`.

```ts
@Injectable()
export class StructuredDataService {
  article(post: PostWithAuthor): Record<string, unknown> {
    const url = this.canonical.build(`blog/${post.slug}`);
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          '@id': `${url}#article`,
          headline: post.title.slice(0, 110),          // Google truncates > 110
          description: post.metaDescription ?? post.excerpt,
          datePublished: post.publishedAt?.toISOString(),
          dateModified: post.contentUpdatedAt.toISOString(),
          author: { '@id': `${this.site}/authors/${post.author.slug}#person` },
          publisher: { '@id': `${this.site}/#organization` },
          mainEntityOfPage: { '@id': url },
          image: post.ogImageUrl ? [post.ogImageUrl] : undefined,
          wordCount: post.wordCount,
          inLanguage: post.locale,
        },
        { '@type': 'Person', '@id': `${this.site}/authors/${post.author.slug}#person`, name: post.author.name, url: `${this.site}/authors/${post.author.slug}` },
        { '@type': 'Organization', '@id': `${this.site}/#organization`, name: this.brand, url: this.site, logo: { '@type': 'ImageObject', url: this.logoUrl } },
        this.breadcrumbList(post),
      ],
    };
  }
}
```

### Rules

1. **Schema must match visible content.** Never mark up a rating, price, FAQ, or author that isn't on the page — that is a structured-data manual action.
2. **Strip `undefined` before serializing.** Emit no `null`s and no empty arrays.
3. **Escape `<`, `>`, `&` and, critically, `</script`** in any user-generated string that lands in JSON-LD.
4. **Type-per-entity:** `Article`/`BlogPosting`, `Product` + `Offer` + `AggregateRating`, `FAQPage`, `HowTo`, `Event`, `LocalBusiness`, `BreadcrumbList`, `WebSite` + `SearchAction`, `Organization`. Always include `BreadcrumbList` and `Organization`.
5. **Dates are ISO 8601 with offsets.** `2026-07-31T10:00:00+00:00`, never a locale-formatted string.
6. **Validate in CI** against the Schema.org vocabulary; fail the build on unknown required properties.

---

## 8. Sitemaps

### 8.1 Hard limits

- Max **50,000 URLs** *and* **50 MB uncompressed** per file → shard beyond either limit.
- Sitemap index may itself contain 50,000 sitemaps.
- URLs must be absolute, escaped, same-protocol/host as the sitemap, and canonical only.
- Serve gzipped (`Content-Encoding: gzip`) with `Content-Type: application/xml; charset=utf-8`.

### 8.2 Architecture

```
/sitemap.xml                    → index of all shards
  /sitemaps/pages.xml           → static pages
  /sitemaps/posts-1.xml         → posts 1–50,000
  /sitemaps/posts-2.xml         → posts 50,001–100,000
  /sitemaps/products-1.xml
  /sitemaps/categories.xml
  /sitemaps/images-1.xml        (optional, or inline image extensions)
  /sitemaps/news.xml            (Google News: last 48h only, ≤ 1,000 URLs)
```

```ts
@Controller()
export class SitemapController {
  constructor(private readonly sitemap: SitemapService) {}

  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800')
  async index(@Res({ passthrough: true }) res: Response) {
    const { xml, etag } = await this.sitemap.buildIndex();
    res.setHeader('ETag', etag);
    return xml;
  }

  @Get('sitemaps/:key.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  async shard(@Param('key') key: string) {
    return this.sitemap.buildShard(key); // throws NotFoundException for unknown keys
  }
}
```

### 8.3 Generation rules

1. **Stream, never buffer.** Use a cursor loop with `take: 1000` and write chunks to the response or to object storage. Loading 50k rows into memory is an OOM waiting to happen.
2. **Only canonical, indexable, `200`-returning URLs.** Never include noindexed, redirected, paginated-duplicate, or auth'd URLs. A sitemap full of non-200s wastes crawl budget and lowers trust in the file.
3. **`lastmod` from `contentUpdatedAt`.** If you can't produce an honest value, omit the tag entirely.
4. **`priority` and `changefreq` are near-ignored by Google.** Set them sanely (homepage `1.0`, hubs `0.8`, leaves `0.6`) and move on. Never spend engineering effort tuning them.
5. **Precompute for large sites.** Regenerate on a cron (`@Cron('0 */6 * * *')`) plus event-driven invalidation on publish/unpublish, and store in Redis or object storage. Do not generate 50k-row XML on request.
6. **Escape XML entities** in every value: `&` → `&amp;`, `<`, `>`, `"`, `'`. Use a builder, not template literals with raw interpolation.
7. **i18n:** every URL in the sitemap carries the full `xhtml:link` alternate set, including `x-default`, and the set must be **reciprocal and self-referential**.

```xml
<url>
  <loc>https://example.com/en/blog/seo-guide</loc>
  <lastmod>2026-07-31T10:00:00+00:00</lastmod>
  <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/blog/seo-guide"/>
  <xhtml:link rel="alternate" hreflang="fr" href="https://example.com/fr/blog/guide-seo"/>
  <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/en/blog/seo-guide"/>
</url>
```

---

## 9. robots.txt

Generate dynamically so staging can never be indexed by accident.

```ts
@Controller()
export class RobotsController {
  @Get('robots.txt')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=3600')
  robots(): string {
    const site = this.config.getOrThrow('SITE_URL');
    if (this.config.get('APP_ENV') !== 'production') {
      return 'User-agent: *\nDisallow: /\n';
    }
    return [
      'User-agent: *',
      'Allow: /',
      'Disallow: /api/',
      'Disallow: /admin/',
      'Disallow: /*?*utm_',
      'Disallow: /*?*sessionid=',
      'Disallow: /search',
      'Disallow: /cart',
      'Disallow: /checkout',
      '',
      'User-agent: GPTBot',
      this.config.get('ALLOW_AI_CRAWLERS') === 'true' ? 'Allow: /' : 'Disallow: /',
      '',
      `Sitemap: ${site}/sitemap.xml`,
      '',
    ].join('\n');
  }
}
```

**Critical distinction:** `robots.txt` controls *crawling*, not *indexing*. A URL blocked in `robots.txt` can still be indexed from external links — and because the crawler can't fetch it, it will never see your `noindex`. **To de-index, allow crawling and return `noindex`.** Never both.

---

## 10. Indexing control (`noindex`)

For non-HTML and API responses, use the header — it works everywhere a meta tag can't.

```ts
@Injectable()
export class RobotsHeaderInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const meta = this.reflector.get<SeoOptions>(SEO_KEY, ctx.getHandler());
    const res = ctx.switchToHttp().getResponse<Response>();
    if (!meta?.indexable) res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    else res.setHeader('X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1');
    return next.handle();
  }
}
```

**Default to non-indexable.** Apply `@Seo({ indexable: true })` explicitly and deliberately. Always non-indexable: `/api/*`, admin, auth, cart/checkout, internal search results, filter/facet permutations, print views, thin tag pages, paginated pages beyond a sensible depth, and every non-production environment (enforce via `APP_ENV`, not via a manually toggled flag).

---

## 11. Pagination, facets, and duplicate control

| Pattern | Rule |
|---|---|
| Page 1 | canonical = `/blog` (no `?page=1`); `?page=1` `301`s to `/blog` |
| Page 2+ | **self-canonical** (`/blog?page=2`), not canonical-to-page-1 — canonicalizing to page 1 hides deeper content |
| `rel=prev/next` | Google ignores it, Bing uses it — emit it in the payload, it costs nothing |
| Sort/filter params | self-canonical only for a small allow-list of valuable combinations; everything else canonicals to the unfiltered URL and is `noindex, follow` |
| Facet explosion | block in `robots.txt` **and** `noindex` the crawlable subset; never let combinatorial URLs into the sitemap |
| Infinite scroll | must have a paginated, linkable URL equivalent — crawlers do not scroll |
| Page size | cap `take` (e.g. `max 100`) and validate via DTO to prevent crawler-triggered heavy queries |

Always use **cursor pagination for APIs** and **offset only for shallow, crawlable listings** where the page number must appear in the URL.

---

## 12. Caching and performance

```ts
// Static-ish content
'Cache-Control: public, max-age=300, s-maxage=3600, stale-while-revalidate=86400'
// Frequently updated listings
'Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=3600'
// Sitemaps / robots
'Cache-Control: public, max-age=3600, s-maxage=86400'
// Personalized / authenticated
'Cache-Control: private, no-store'
```

Rules:

1. **ETag on every cacheable GET,** derived from a stable content hash (not the response timestamp). Return `304` for `If-None-Match` — this is free crawl-budget savings.
2. **`Last-Modified` mirrors `contentUpdatedAt`;** honor `If-Modified-Since`.
3. **`Vary: Accept-Encoding`** always. Add `Vary: Accept-Language` **only** if you actually vary by it — and prefer explicit locale-in-path URLs over language negotiation, which is invisible to crawlers.
4. **Never `Vary: User-Agent` for content differences.** That is cloaking.
5. **Kill N+1s.** Every SEO endpoint uses `include`/`select` with explicit relations. Enable Prisma query logging in dev and fail CI if an endpoint exceeds a query budget (e.g. 5 queries).
6. **Query budget per indexable route:** `p95 < 150ms` DB time. Add indexes or denormalize before shipping.
7. **Compression:** enable gzip/brotli globally.
8. **Rate limiting must exempt verified search engine bots** (verify via reverse DNS + forward confirmation, never by User-Agent string alone). Throttling Googlebot with `429`s shrinks your crawl rate.
9. **`503` correctly during deploys/maintenance** with `Retry-After` — never serve a `200` maintenance page.

---

## 13. Feeds

Serve `/rss.xml`, `/atom.xml`, and optionally `/feed.json`. Include the 20–50 most recent published items, full or summary content, absolute links, valid RFC-822 (RSS) or ISO-8601 (Atom/JSON Feed) dates, `<atom:link rel="self">`, and a `lastBuildDate` that reflects real content. Cache for 15–60 minutes with an ETag. Escape all entities; wrap HTML content in CDATA.

---

## 14. Indexing pings and freshness

On publish, meaningful update, unpublish, or slug change, enqueue (never inline, never blocking the request):

1. **IndexNow** — single POST with the URL list to `https://api.indexnow.org/indexnow` plus your key file at `/{key}.txt`. Covers Bing, Yandex, Naver, Seznam.
2. **Google Indexing API** — only legitimately applicable to `JobPosting` and `BroadcastEvent`; do not spam it for articles.
3. **Sitemap regeneration** + cache invalidation for the affected shard.
4. **CDN purge** for the canonical path, its listing pages, and the sitemap.

```ts
@Injectable()
export class ContentPublishedListener {
  @OnEvent('content.published')
  async handle(e: ContentPublishedEvent) {
    await this.queue.add('seo-propagate', { url: e.canonicalUrl, shard: e.sitemapKey }, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: 100,
    });
  }
}
```

Batch and debounce pings (e.g. flush every 5 minutes or every 100 URLs). Flooding endpoints gets you throttled or ignored.

---

## 15. Internationalization

- **URL strategy:** subdirectory (`/en/`, `/fr/`) by default — cheapest to run, consolidates authority. Use subdomains or ccTLDs only when the business demands it.
- **hreflang must be reciprocal.** If A lists B, B must list A, and both must list themselves. Non-reciprocal annotations are ignored wholesale.
- **Always include `x-default`** pointing at the language-selector or the default-locale page.
- **Use correct codes:** ISO 639-1 language, optional ISO 3166-1 Alpha-2 region — `en`, `en-GB`, `pt-BR`. `en-UK` is invalid.
- **Never auto-redirect by IP or `Accept-Language`.** It traps crawlers into one locale and hides the rest of the site. Offer a banner or a selector, and let the URL decide.
- **Model translations as a cluster** (`translationOfId`) so hreflang generation is a single query, not N queries.
- Localize slugs per locale; store each locale's slug history separately.

---

## 16. E-commerce and other specifics

- **Out-of-stock products:** keep the URL live (`200`) with `availability: OutOfStock` in schema. Only `301` to a category/successor when the product is permanently discontinued, `410` if there's no successor.
- **Variants:** one canonical product URL; variant params (`?color=blue`) canonical to the parent unless a variant has genuinely unique demand and content.
- **Price/availability in `Offer`** must exactly match the rendered page, and `priceValidUntil` must be a future date.
- **Reviews:** only mark up real, on-page reviews. `AggregateRating` requires a visible rating.
- **Expired events/jobs:** `410` or `301` plus schema `validThrough` — never leave them silently `200`.

---

## 17. Security headers (they don't hurt SEO — they help trust)

`Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and a CSP that **allows your JSON-LD `<script type="application/ld+json">`** (use a nonce or hash — a CSP that blocks it silently kills all your rich results). Enforce HTTPS with a single `301` from `http`, and pick one host (`www` or apex) and `301` the other.

---

## 18. Observability

Log and alert on:
- `404` rate by referrer (broken internal links) and `404`s with inbound external links (redirect candidates).
- Redirect `hitCount` — chains, loops, and dead destinations.
- Sitemap generation duration, entry counts, and failures.
- `5xx` rate on indexable routes (crawl-rate killer).
- TTFB `p75`/`p95` per route.
- Bot traffic by verified crawler, to detect crawl-budget waste on non-indexable paths.

Expose an internal `/api/internal/seo/health` returning: total indexable URLs, sitemap entry count (they must match), URLs missing meta description, URLs missing OG image, orphaned redirects, and redirect chains.

---

## 19. Testing requirements

Every SEO behavior ships with a test.

```ts
describe('SEO contract: /blog/:slug', () => {
  it('returns 200 with a complete SEO payload for a published post', async () => {
    const res = await request(app).get('/blog/hello-world').expect(200);
    expect(res.body.seo.canonical).toBe('https://example.com/blog/hello-world');
    expect(res.body.seo.description.length).toBeGreaterThanOrEqual(120);
    expect(res.body.seo.description.length).toBeLessThanOrEqual(160);
    expect(res.body.seo.structuredData[0]['@context']).toBe('https://schema.org');
  });

  it('301s an old slug to the current one, in a single hop', async () => {
    const res = await request(app).get('/blog/old-slug').expect(301);
    expect(res.headers.location).toBe('https://example.com/blog/hello-world');
  });

  it('404s a draft (never 403 — do not disclose existence)', () =>
    request(app).get('/blog/secret-draft').expect(404));

  it('410s permanently deleted content', () =>
    request(app).get('/blog/removed-post').expect(410));

  it('301s trailing slashes and uppercase in one hop', async () => {
    const res = await request(app).get('/Blog/Hello-World/').expect(301);
    expect(res.headers.location).toBe('/blog/hello-world');
  });

  it('never emits a non-canonical or non-200 URL in the sitemap', async () => {
    const xml = (await request(app).get('/sitemaps/posts-1.xml').expect(200)).text;
    for (const loc of parseLocs(xml)) await request(app).get(new URL(loc).pathname).expect(200);
  });

  it('sets X-Robots-Tag: noindex on /api routes', () =>
    request(app).get('/api/posts').expect('X-Robots-Tag', /noindex/));
});
```

Add a CI job that fails the build on: a sitemap URL returning non-200, a redirect chain longer than one hop, a redirect loop, invalid JSON-LD, or a missing canonical on an indexable route.

---

## 20. Definition of Done — check every box before you finish

**Routing**
- [x] URL is lowercase, hyphenated, no trailing slash, ≤ 3 levels deep
- [x] Static routes declared before dynamic ones
- [x] Slug collides with no reserved word
- [x] Params validated via DTO; invalid input `404`s, never `500`s

**Data**
- [x] Model has `slug`, `locale`, `status`, `publishedAt`, `contentUpdatedAt`, meta fields
- [x] Composite indexes exist for every sitemap/listing query
- [x] Slug renames write `SlugHistory` + `Redirect` in one transaction
- [x] Deletes are soft; hard deletes are impossible from the API

**Response**
- [x] Correct status code for every state (200/301/404/410/503)
- [x] Full `seo` object: canonical, title, description, robots, OG, Twitter, hreflang, JSON-LD, breadcrumbs, `lastModified`
- [x] Canonical is absolute, https, normalized, tracking-param-free
- [x] `X-Robots-Tag` set explicitly (indexable or not)
- [x] `Cache-Control`, `ETag`, `Last-Modified`, `Vary: Accept-Encoding` present

**Discovery**
- [x] Route registered with a `SitemapProvider` (courses/blog-posts/case-studies; remaining non-content API/admin endpoints intentionally excluded)
- [x] `lastmod` comes from real content mutation
- [ ] Publish/update/delete triggers sitemap invalidation + indexing ping — *pending: `IndexingPingService` not yet implemented*
- [x] Included in RSS/Atom if it's a content type (blog-posts + case-studies registered via `FeedProvider`; courses excluded — product listing without excerpt/content)

**Performance**
- [x] No N+1s; `select` limits columns (sitemap queries use `select`; content queries are single-table, no relation loads)
- [ ] `p95` DB time < 150 ms; TTFB `p75` < 200 ms cached — *pending: measurement rig not built*
- [ ] Cursor pagination for large sets; `take` is capped — *`take` capped via DTO `@Max(100)`; cursor pagination deferred*

**Tests**
- [ ] e2e tests for 200, 301 (old slug), 404 (draft), 410 (deleted) — *deferred per user directive (no test suites); states verified live via curl*
- [ ] Sitemap URLs all resolve `200` — *deferred (test suite); sitemap endpoints verified live*
- [ ] Canonical and JSON-LD shape asserted — *deferred (test suite)*

---

## 21. Anti-patterns — never do these

1. `200` with an error body (soft 404).
2. `updatedAt` as `lastmod`.
3. Redirect chains or loops.
4. Slug rename without a redirect.
5. Hard-deleting content that has a public URL.
6. Blocking a URL in `robots.txt` *and* expecting `noindex` to apply.
7. `403` on drafts (leaks existence) instead of `404`.
8. Auto-redirecting by IP/`Accept-Language`.
9. Loading a full table into memory to build a sitemap.
10. Canonicalizing paginated pages to page 1.
11. Structured data that doesn't match visible content.
12. Serving different content to bots than to users.
13. Hardcoding `https://example.com` instead of reading `SITE_URL` from config.
14. Unescaped user content in XML or JSON-LD.
15. Rate-limiting or `403`-ing verified search-engine crawlers.
16. Non-production environments that are crawlable.
17. Non-reciprocal hreflang.
18. Building sitemaps or feeds with raw template-literal string concatenation.
19. Meta descriptions that are empty strings rather than omitted.
20. Putting SEO logic in controllers instead of dedicated services.

---

## 22. Environment configuration

```env
SITE_URL=https://example.com          # no trailing slash — validated at boot
APP_ENV=production                    # drives robots.txt + noindex defaults
BRAND_NAME=Example
DEFAULT_LOCALE=en
SUPPORTED_LOCALES=en,fr,de
INDEXNOW_KEY=...
ALLOW_AI_CRAWLERS=false
SITEMAP_PAGE_SIZE=45000               # under the 50k ceiling for headroom
OG_IMAGE_FALLBACK=https://example.com/og-default.png
```

Validate all of these at bootstrap with a Joi/Zod schema and `ConfigModule.forRoot({ validationSchema })`. A missing `SITE_URL` must crash the app at boot, not silently emit relative canonicals in production.

---

**Final instruction:** when you implement any route, end your work by pasting the §20 checklist with each box marked and a one-line justification for any box you deliberately left unchecked.
