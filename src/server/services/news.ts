import { env } from "@/lib/env";
import type { EconomicEvent, NewsItem } from "@/types/market";
import { mockEconomicEvents, mockNews } from "./mock-data";

export async function getLatestNews(category?: string): Promise<NewsItem[]> {
  const source =
    !env.news.newsApi && !env.news.marketaux ? mockNews : mockNews; // TODO(phase-2): live aggregation
  const items = category
    ? source.filter((n) => n.category === category)
    : source;
  return [...items].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getEconomicCalendar(): Promise<EconomicEvent[]> {
  // TODO(phase-2): fetch from Trading Economics / provider.
  return [...mockEconomicEvents].sort(
    (a, b) =>
      new Date(a.eventTime).getTime() - new Date(b.eventTime).getTime(),
  );
}
