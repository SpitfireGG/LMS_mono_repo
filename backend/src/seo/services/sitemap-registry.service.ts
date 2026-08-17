import { Injectable } from "@nestjs/common";
import { SitemapProvider } from "../interfaces/sitemap-provider.interface";

@Injectable()
export class SitemapRegistryService {
  private readonly providers = new Map<string, SitemapProvider>();

  register(provider: SitemapProvider): void {
    this.providers.set(provider.key, provider);
  }

  keys(): string[] {
    return [...this.providers.keys()];
  }

  get(key: string): SitemapProvider | undefined {
    return this.providers.get(key);
  }
}
