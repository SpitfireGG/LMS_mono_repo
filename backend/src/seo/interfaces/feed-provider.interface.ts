export interface FeedEntry {
  id: string;
  title: string;
  link: string;
  summary?: string;
  content?: string;
  publishedAt: Date;
  updatedAt?: Date;
  author?: string;
  image?: string;
  categories?: string[];
}

export interface FeedProvider {
  readonly key: string;
  items(limit: number): Promise<FeedEntry[]>;
}
