import { Controller, Get, Header } from "@nestjs/common";
import { FeedService } from "../services/feed.service";
import { SkipTransform } from "../../common/decorators/skip-transform.decorator";
import { Public } from "../../common/decorators/public.decorator";

@Controller()
@SkipTransform()
@Public()
export class FeedController {
  constructor(private readonly feed: FeedService) {}

  @Get("rss.xml")
  @Header("Content-Type", "application/rss+xml; charset=utf-8")
  @Header("Cache-Control", "public, max-age=900, s-maxage=3600")
  rss() {
    return this.feed.rss();
  }

  @Get("atom.xml")
  @Header("Content-Type", "application/atom+xml; charset=utf-8")
  @Header("Cache-Control", "public, max-age=900, s-maxage=3600")
  atom() {
    return this.feed.atom();
  }

  @Get("feed.json")
  @Header("Content-Type", "application/feed+json; charset=utf-8")
  @Header("Cache-Control", "public, max-age=900, s-maxage=3600")
  jsonFeed() {
    return this.feed.jsonFeed();
  }
}
