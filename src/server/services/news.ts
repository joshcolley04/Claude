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
  // TODO(phase-3): fetch from Trading Economics / provider.
  return [...mockEconomicEvents].sort(
    (a, b) =>
      new Date(a.eventTime).getTime() - new Date(b.eventTime).getTime(),
  );
}

/**
 * Aggregate news sentiment for a symbol into a 0-100 score, or null when there
 * is no coverage. Positive articles push the score above 50, negative below.
 */
export async function getSymbolSentiment(
  symbol: string,
): Promise<number | null> {
  const news = await getLatestNews();
  const related = news.filter((n) => n.symbols.includes(symbol));
  if (related.length === 0) return null;

  const value = related.reduce((sum, n) => {
    if (n.sentiment === "positive") return sum + 1;
    if (n.sentiment === "negative") return sum - 1;
    return sum;
  }, 0);
  const avg = value / related.length; // -1..1
  return Math.max(0, Math.min(100, Math.round(50 + avg * 45)));
}
