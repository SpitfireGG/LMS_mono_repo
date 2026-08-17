import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { RedirectService } from "../../seo/services/redirect.service";

@Injectable()
export class RedirectMiddleware implements NestMiddleware {
  constructor(private readonly redirects: RedirectService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    if (req.originalUrl.startsWith("/api/")) return next();

    const path = this.pathOnly(req.originalUrl);
    if (!path || path === "/") return next();

    try {
      const resolved = await this.redirects.resolve(path);
      if (!resolved) return next();

      if (resolved.status === 410) {
        return res.status(410).end();
      }

      const absolute = new URL(
        resolved.destination,
        `${req.protocol}://${req.get("host")}`,
      ).toString();
      return res.redirect(resolved.status, absolute);
    } catch {
      return next();
    }
  }

  private pathOnly(originalUrl: string): string {
    const q = originalUrl.indexOf("?");
    return q === -1 ? originalUrl : originalUrl.slice(0, q);
  }
}
