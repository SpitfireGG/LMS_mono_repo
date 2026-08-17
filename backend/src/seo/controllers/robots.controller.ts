import { Controller, Get, Header } from "@nestjs/common";
import { Seo } from "../decorators/seo.decorator";
import { SkipTransform } from "../../common/decorators/skip-transform.decorator";
import { Public } from "../../common/decorators/public.decorator";

@Controller()
@SkipTransform()
@Public()
export class RobotsController {
  @Get("robots.txt")
  @Header("Content-Type", "text/plain; charset=utf-8")
  @Header("Cache-Control", "public, max-age=3600")
  @Seo({ indexable: true })
  robots(): string {
    if (process.env.APP_ENV !== "production") {
      return "User-agent: *\nDisallow: /\n";
    }

    const site = process.env.SITE_URL;
    const lines = [
      "User-agent: *",
      "Allow: /",
      "Disallow: /api/",
      "Disallow: /docs",
      "Disallow: /uploads",
      "Disallow: /*?*utm_",
      "",
      "User-agent: GPTBot",
      process.env.ALLOW_AI_CRAWLERS === "true" ? "Allow: /" : "Disallow: /",
      "",
    ];

    if (site) lines.push(`Sitemap: ${site}/sitemap.xml`, "");

    return lines.join("\n");
  }
}
