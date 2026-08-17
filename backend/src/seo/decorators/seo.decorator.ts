import { SetMetadata } from "@nestjs/common";

export const SEO_KEY = "seo:options";

export interface SeoOptions {
  indexable?: boolean;
}

export const Seo = (options: SeoOptions = {}) => SetMetadata(SEO_KEY, options);
