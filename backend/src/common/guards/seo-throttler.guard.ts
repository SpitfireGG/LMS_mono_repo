import { ExecutionContext, Injectable } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";
import { Request } from "express";
import { lookup, reverse } from "node:dns/promises";

const CRAWLER_UA =
  /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|applebot|commoncrawl|ahrefsbot|semrushbot|mj12bot|mojeekbot|sogou|exabot|ia_archiver/i;

const CRAWLER_SUFFIXES = [
  ".googlebot.com",
  ".google.com",
  ".search.msn.com",
  ".crawl.bing.net",
  ".search.yahoo.com",
  ".yandex.net",
  ".yandex.com",
  ".baidu.com",
  ".baiduspider.com",
  ".duckduckgo.com",
  ".applebot.apple.com",
  ".commoncrawl.org",
  ".ahrefs.com",
  ".semrush.com",
  ".majestic12.co.uk",
  ".mojeek.com",
];

const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_MAX = 1024;
const DNS_TIMEOUT_MS = 1500;

@Injectable()
export class SeoThrottlerGuard extends ThrottlerGuard {
  private cache = new Map<string, { verified: boolean; at: number }>();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    if (await this.isVerifiedCrawler(req)) return true;
    return super.canActivate(context);
  }

  private async isVerifiedCrawler(req: Request): Promise<boolean> {
    const ua = req.headers["user-agent"];
    if (typeof ua !== "string" || !CRAWLER_UA.test(ua)) return false;

    const ip = req.ip ?? req.socket?.remoteAddress ?? "";
    if (!ip) return false;

    const cached = this.cache.get(ip);
    if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.verified;

    if (this.cache.size >= CACHE_MAX) this.prune();

    let verified = false;
    try {
      const hostnames = await withTimeout(reverse(ip), DNS_TIMEOUT_MS);
      for (const hostname of hostnames) {
        if (!CRAWLER_SUFFIXES.some((s) => hostname.endsWith(s))) continue;
        const addrs = await withTimeout(
          lookup(hostname, { all: true, verbatim: true }),
          DNS_TIMEOUT_MS,
        );
        if (addrs.some((a) => a.address === ip)) verified = true;
        break;
      }
    } catch {
      verified = false;
    }

    this.cache.set(ip, { verified, at: Date.now() });
    return verified;
  }

  private prune(): void {
    const now = Date.now();
    for (const [key, value] of this.cache) {
      if (now - value.at >= CACHE_TTL_MS) this.cache.delete(key);
    }
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("dns timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}
