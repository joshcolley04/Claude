import type { AssetClass } from "@/types/market";

export interface UniverseItem {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  sector?: string;
}

/** Symbols shown in the dashboard "Market Overview" panel. */
export const MARKET_OVERVIEW: UniverseItem[] = [
  { symbol: "SPY", name: "S&P 500 ETF", assetClass: "ETF" },
  { symbol: "QQQ", name: "Nasdaq 100 ETF", assetClass: "ETF" },
  { symbol: "AAPL", name: "Apple Inc.", assetClass: "STOCK", sector: "Technology" },
  { symbol: "NVDA", name: "NVIDIA Corp.", assetClass: "STOCK", sector: "Technology" },
  { symbol: "BTC-USD", name: "Bitcoin", assetClass: "CRYPTO" },
  { symbol: "ETH-USD", name: "Ethereum", assetClass: "CRYPTO" },
];

/**
 * The default scan universe. Kept intentionally small in Phase 2; a later phase
 * populates this from the user's watchlists and a broader market list.
 */
export const SCAN_UNIVERSE: UniverseItem[] = [
  { symbol: "AAPL", name: "Apple Inc.", assetClass: "STOCK", sector: "Technology" },
  { symbol: "NVDA", name: "NVIDIA Corp.", assetClass: "STOCK", sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corp.", assetClass: "STOCK", sector: "Technology" },
  { symbol: "AMZN", name: "Amazon.com Inc.", assetClass: "STOCK", sector: "Consumer" },
  { symbol: "META", name: "Meta Platforms", assetClass: "STOCK", sector: "Technology" },
  { symbol: "QQQ", name: "Nasdaq 100 ETF", assetClass: "ETF" },
  { symbol: "XLE", name: "Energy Select Sector ETF", assetClass: "ETF", sector: "Energy" },
  { symbol: "BTC-USD", name: "Bitcoin", assetClass: "CRYPTO" },
  { symbol: "ETH-USD", name: "Ethereum", assetClass: "CRYPTO" },
];
