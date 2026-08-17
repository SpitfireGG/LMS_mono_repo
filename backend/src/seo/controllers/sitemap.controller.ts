import { Controller, Get, Header, Param, Res } from "@nestjs/common";
import { Response } from "express";
import { SitemapService } from "../services/sitemap.service";
import { Seo } from "../decorators/seo.decorator";
import { SkipTransform } from "../../common/decorators/skip-transform.decorator";
import { Public } from "../../common/decorators/public.decorator";

@Controller()
@SkipTransform()
@Public()
export class SitemapController {
  constructor(private readonly sitemap: SitemapService) {}

  @Get("sitemap.xml")
  @Header("Content-Type", "application/xml; charset=utf-8")
  @Header(
    "Cache-Control",
    "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
  )
  @Seo({ indexable: true })
  async index(@Res({ passthrough: true }) res: Response) {
    const { xml, etag } = await this.sitemap.buildIndex();
    res.setHeader("ETag", etag);
    return xml;
  }

  @Get("sitemaps/:key.xml")
  @Header("Content-Type", "application/xml; charset=utf-8")
  @Header(
    "Cache-Control",
    "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
  )
  @Seo({ indexable: true })
  async shard(@Param("key") key: string, @Res({ passthrough: true }) res: Response) {
    const { xml, etag } = await this.sitemap.buildShard(key);
    res.setHeader("ETag", etag);
    return xml;
  }
}
