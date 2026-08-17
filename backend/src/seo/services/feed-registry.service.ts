import { Injectable } from "@nestjs/common";
import { FeedProvider } from "../interfaces/feed-provider.interface";

@Injectable()
export class FeedRegistryService {
  private readonly providers = new Map<string, FeedProvider>();

  register(provider: FeedProvider): void {
    this.providers.set(provider.key, provider);
  }

  all(): FeedProvider[] {
    return [...this.providers.values()];
  }
}
