import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "msclkid",
  "ref",
];

@Injectable()
export class UrlNormalizationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    if (req.originalUrl.startsWith("/api/")) return next();

    const url = new URL(req.originalUrl, "http://local");
    let changed = false;

    if (url.pathname !== url.pathname.toLowerCase()) {
      url.pathname = url.pathname.toLowerCase();
      changed = true;
    }
    if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.replace(/\/+$/, "");
      changed = true;
    }
    if (/\/{2,}/.test(url.pathname)) {
      url.pathname = url.pathname.replace(/\/{2,}/g, "/");
      changed = true;
    }
    for (const param of TRACKING_PARAMS) {
      if (url.searchParams.has(param)) {
        url.searchParams.delete(param);
        changed = true;
      }
    }
    url.searchParams.sort();

    if (changed) {
      return res.redirect(301, url.pathname + (url.search || ""));
    }
    return next();
  }
}
