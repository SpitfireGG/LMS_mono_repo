import {
  Controller,
  Get,
  Head,
  Param,
  Req,
  Res,
  NotFoundException,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import type { Request, Response } from "express";
import { createReadStream, promises as fsp } from "fs";
import { join } from "path";
import { Public } from "../common/decorators/public.decorator";
import { NoCache } from "../common/decorators/no-cache.decorator";
import { SkipTransform } from "../common/decorators/skip-transform.decorator";
import { MEDIA_DIR, contentTypeFor, isSafeFilename } from "./media.storage";

/** One year — safe because every asset name is a fresh UUID. */
const IMMUTABLE_CACHE = "public, max-age=31536000, immutable";

@ApiTags("Media")
@Controller("api/media")
@Public()
@NoCache()
@SkipTransform()
export class MediaController {
  @Get(":filename")
  @ApiOperation({ summary: "Stream an uploaded asset with range support" })
  async stream(
    @Param("filename") filename: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { path, size, mtime } = await this.resolve(filename);
    const contentType = contentTypeFor(filename);
    const etag = `"${size.toString(16)}-${mtime.getTime().toString(16)}"`;

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", IMMUTABLE_CACHE);
    res.setHeader("ETag", etag);
    res.setHeader("Last-Modified", mtime.toUTCString());
    // Without this the browser downloads a whole MP4 before it can seek.
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("X-Content-Type-Options", "nosniff");

    if (req.headers["if-none-match"] === etag) {
      res.status(304).end();
      return;
    }

    const range = this.parseRange(req.headers.range, size);

    if (range === "invalid") {
      res.status(416).setHeader("Content-Range", `bytes */${size}`);
      res.end();
      return;
    }

    if (range) {
      const chunkSize = range.end - range.start + 1;
      res.status(206);
      res.setHeader("Content-Range", `bytes ${range.start}-${range.end}/${size}`);
      res.setHeader("Content-Length", chunkSize);
      createReadStream(path, { start: range.start, end: range.end }).pipe(res);
      return;
    }

    res.setHeader("Content-Length", size);
    createReadStream(path).pipe(res);
  }

  @Head(":filename")
  async head(@Param("filename") filename: string, @Res() res: Response) {
    const { size, mtime } = await this.resolve(filename);
    res.setHeader("Content-Type", contentTypeFor(filename));
    res.setHeader("Content-Length", size);
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Cache-Control", IMMUTABLE_CACHE);
    res.setHeader("Last-Modified", mtime.toUTCString());
    res.status(200).end();
  }

  private async resolve(filename: string) {
    // Only UUID names we generated are servable, so no traversal is possible.
    if (!isSafeFilename(filename)) throw new NotFoundException("Asset not found");

    const path = join(MEDIA_DIR, filename);
    try {
      const stat = await fsp.stat(path);
      if (!stat.isFile()) throw new NotFoundException("Asset not found");
      return { path, size: stat.size, mtime: stat.mtime };
    } catch {
      throw new NotFoundException("Asset not found");
    }
  }

  /** Single-range parser: `bytes=start-end`, `bytes=start-`, `bytes=-suffix`. */
  private parseRange(
    header: string | undefined,
    size: number,
  ): { start: number; end: number } | "invalid" | null {
    if (!header) return null;

    const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
    if (!match) return "invalid";

    const [, rawStart, rawEnd] = match;
    if (rawStart === "" && rawEnd === "") return "invalid";

    let start: number;
    let end: number;

    if (rawStart === "") {
      // Suffix form: the last N bytes.
      const suffix = Number(rawEnd);
      if (suffix <= 0) return "invalid";
      start = Math.max(0, size - suffix);
      end = size - 1;
    } else {
      start = Number(rawStart);
      end = rawEnd === "" ? size - 1 : Math.min(Number(rawEnd), size - 1);
    }

    if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || start >= size) {
      return "invalid";
    }

    return { start, end };
  }
}
