import { BadRequestException, Controller, Get, NotFoundException, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { PathResolverService } from "../services/path-resolver.service";
import { Public } from "../../common/decorators/public.decorator";

@ApiTags("SEO")
@Controller("api/seo")
@Public()
export class SeoMetaController {
  constructor(private readonly resolver: PathResolverService) {}

  @Get("resolve")
  @ApiOperation({
    summary:
      "Resolve a canonical path to its SEO payload (title, description, canonical, OG, JSON-LD). Non-indexable.",
  })
  @ApiQuery({ name: "path", example: "/blog/hello-world", required: true })
  async resolve(@Query("path") path?: string) {
    if (!path) throw new BadRequestException("path query parameter is required");
    const resolved = await this.resolver.resolve(path);
    if (!resolved) throw new NotFoundException("No content at that path");
    return resolved;
  }
}
