import { Injectable } from "@nestjs/common";

@Injectable()
export class CanonicalService {
  getSiteUrl(): string {
    const site = process.env.SITE_URL;
    if (!site) {
      throw new Error("SITE_URL is required to build canonical URLs");
    }
    return site.replace(/\/+$/, "");
  }

  build(path: string, params?: Record<string, string>): string {
    const base = this.getSiteUrl();
    const clean = `/${path}`.replace(/\/{2,}/g, "/").replace(/\/+$/, "") || "/";
    const url = new URL(base + clean);

    const ALLOWED = new Set(["page", "sort"]);
    for (const [key, value] of Object.entries(params ?? {})) {
      if (ALLOWED.has(key)) url.searchParams.set(key, value);
    }
    url.searchParams.sort();

    return url.toString();
  }
}
