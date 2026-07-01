/**
 * Deterministic mock data used when live market-data providers are not
 * configured. This lets the entire platform run end-to-end during development
 * and demos. Every consumer service falls back to these helpers when the
 * relevant API key is absent (see `env.mockDataEnabled`).
 *
 * IMPORTANT: This is illustrative data, NOT investment advice. Numbers are
 * synthetic and must never be presented to end users as live market data.
 */
import type {
  AllocationSlice,
  EconomicEvent,
  NewsItem,
  Opportunity,
  PerformancePoint,
  PortfolioSummary,
  Position,
  Quote,
} from "@/types/market";

export const mockQuotes: Quote[] = [
  { symbol: "SPX", name: "S&P 500", assetClass: "INDEX", price: 5432.1, changePct: 0.62 },
  { symbol: "NDX", name: "Nasdaq 100", assetClass: "INDEX", price: 19234.5, changePct: 0.94 },
  { symbol: "AAPL", name: "Apple Inc.", assetClass: "STOCK", price: 214.3, changePct: 1.21 },
  { symbol: "NVDA", name: "NVIDIA Corp.", assetClass: "STOCK", price: 126.8, changePct: 2.87 },
  { symbol: "BTC-USD", name: "Bitcoin", assetClass: "CRYPTO", price: 63120, changePct: -1.34 },
  { symbol: "ETH-USD", name: "Ethereum", assetClass: "CRYPTO", price: 3410, changePct: -0.72 },
  { symbol: "EURUSD", name: "Euro / US Dollar", assetClass: "FOREX", price: 1.083, changePct: 0.11 },
  { symbol: "XAU", name: "Gold", assetClass: "COMMODITY", price: 2338.4, changePct: 0.45 },
];

export const mockPortfolioSummary: PortfolioSummary = {
  totalValue: 128450.32,
  cashBalance: 18320.5,
  dayPnl: 1342.18,
  dayPnlPct: 1.06,
  weekPnlPct: 2.81,
  monthPnlPct: 6.42,
  openPositions: 7,
  closedPositions: 23,
};

export const mockPositions: Position[] = [
  { symbol: "AAPL", name: "Apple Inc.", assetClass: "STOCK", quantity: 120, avgCost: 178.4, price: 214.3, marketValue: 25716, unrealizedPnl: 4308, unrealizedPnlPct: 20.12, allocationPct: 23.4 },
  { symbol: "NVDA", name: "NVIDIA Corp.", assetClass: "STOCK", quantity: 150, avgCost: 92.1, price: 126.8, marketValue: 19020, unrealizedPnl: 5205, unrealizedPnlPct: 37.68, allocationPct: 17.3 },
  { symbol: "MSFT", name: "Microsoft Corp.", assetClass: "STOCK", quantity: 40, avgCost: 372.5, price: 448.9, marketValue: 17956, unrealizedPnl: 3056, unrealizedPnlPct: 20.51, allocationPct: 16.3 },
  { symbol: "BTC-USD", name: "Bitcoin", assetClass: "CRYPTO", quantity: 0.18, avgCost: 41200, price: 63120, marketValue: 11361.6, unrealizedPnl: 3945.6, unrealizedPnlPct: 53.2, allocationPct: 10.3 },
  { symbol: "VOO", name: "Vanguard S&P 500 ETF", assetClass: "ETF", quantity: 20, avgCost: 402.3, price: 498.7, marketValue: 9974, unrealizedPnl: 1928, unrealizedPnlPct: 23.96, allocationPct: 9.1 },
  { symbol: "ETH-USD", name: "Ethereum", assetClass: "CRYPTO", quantity: 2.1, avgCost: 2280, price: 3410, marketValue: 7161, unrealizedPnl: 2373, unrealizedPnlPct: 49.56, allocationPct: 6.5 },
];

export const mockAllocation: AllocationSlice[] = [
  { label: "Technology", value: 62692, pct: 56.9 },
  { label: "Crypto", value: 18522.6, pct: 16.8 },
  { label: "ETFs", value: 9974, pct: 9.1 },
  { label: "Cash", value: 18320.5, pct: 16.6 },
];

export function mockPerformanceSeries(days = 90): PerformancePoint[] {
  const points: PerformancePoint[] = [];
  let value = 104000;
  const start = new Date();
  start.setDate(start.getDate() - days);
  for (let i = 0; i <= days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    // Deterministic pseudo-random walk (seeded by index).
    const drift = Math.sin(i / 9) * 480 + Math.cos(i / 4) * 220;
    value += drift + i * 28;
    points.push({ date: d.toISOString().slice(0, 10), value: Math.round(value) });
  }
  return points;
}

export const mockOpportunities: Opportunity[] = [
  {
    id: "opp-nvda",
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    assetClass: "STOCK",
    direction: "BUY",
    currentPrice: 126.8,
    suggestedEntry: 124.5,
    stopLoss: 114.0,
    takeProfit1: 142.0,
    takeProfit2: 158.0,
    holdingPeriod: "6-12 weeks",
    positionSizePct: 6,
    riskReward: 2.4,
    confidence: 82,
    scores: { overall: 87, technical: 90, fundamental: 88, momentum: 92, volume: 84, institutional: 89, sentiment: 80, macro: 72, liquidity: 98, risk: 68 },
    thesis:
      "Analysis: price is consolidating above the rising 50-day moving average after a breakout, with accelerating data-center demand supporting the fundamental picture. Assumption: AI capex remains elevated through the next two quarters.",
    strengths: ["Strong relative strength vs. sector", "Above-average institutional accumulation", "Expanding gross margins"],
    weaknesses: ["Elevated valuation multiple", "High single-customer concentration risk"],
    principalRisks: ["Broad tech drawdown on rate surprises", "Guidance disappointment at next earnings"],
    invalidation: "A daily close below the 114.0 stop-loss invalidates the setup.",
  },
  {
    id: "opp-btc",
    symbol: "BTC-USD",
    name: "Bitcoin",
    assetClass: "CRYPTO",
    direction: "BUY",
    currentPrice: 63120,
    suggestedEntry: 61500,
    stopLoss: 56000,
    takeProfit1: 72000,
    takeProfit2: 80000,
    holdingPeriod: "2-4 months",
    positionSizePct: 4,
    riskReward: 1.9,
    confidence: 71,
    scores: { overall: 74, technical: 78, fundamental: 65, momentum: 70, volume: 72, institutional: 80, sentiment: 62, macro: 60, liquidity: 95, risk: 52 },
    thesis:
      "Analysis: spot ETF inflows and a constructive higher-low structure support continuation. Assumption: liquidity conditions stay supportive and no major regulatory shock occurs.",
    strengths: ["Persistent net ETF inflows", "Higher-low market structure intact"],
    weaknesses: ["High realized volatility", "Sensitive to macro liquidity shifts"],
    principalRisks: ["Sharp risk-off move", "Adverse regulatory headline"],
    invalidation: "A weekly close below 56,000 invalidates the bullish structure.",
  },
  {
    id: "opp-xle",
    symbol: "XLE",
    name: "Energy Select Sector ETF",
    assetClass: "ETF",
    direction: "BUY",
    currentPrice: 94.2,
    suggestedEntry: 92.8,
    stopLoss: 88.0,
    takeProfit1: 102.0,
    holdingPeriod: "4-8 weeks",
    positionSizePct: 5,
    riskReward: 1.9,
    confidence: 68,
    scores: { overall: 70, technical: 74, fundamental: 71, momentum: 66, volume: 60, institutional: 68, sentiment: 58, macro: 76, liquidity: 90, risk: 64 },
    thesis:
      "Analysis: energy is showing improving relative strength as a hedge against sticky inflation. Assumption: crude holds its current range.",
    strengths: ["Attractive relative valuation", "Improving sector momentum"],
    weaknesses: ["Commodity-price dependency"],
    principalRisks: ["Demand slowdown", "Sharp fall in crude prices"],
    invalidation: "A close below 88.0 negates the thesis.",
  },
];

export const mockNews: NewsItem[] = [
  {
    id: "news-1",
    title: "Federal Reserve holds rates steady, signals data-dependent path",
    summary: "The FOMC left the policy rate unchanged and emphasised incoming inflation data.",
    url: "https://example.com/fed-holds",
    source: "Market Wire",
    category: "central-banks",
    symbols: ["SPX", "NDX"],
    sentiment: "neutral",
    whyItMatters:
      "Rate expectations drive equity and bond valuations broadly; a data-dependent stance keeps volatility elevated around each inflation print.",
    publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "news-2",
    title: "Semiconductor demand accelerates on AI infrastructure buildout",
    summary: "Leading chipmakers report record data-center bookings.",
    url: "https://example.com/semis",
    source: "TechFinance",
    category: "technology",
    symbols: ["NVDA", "AMD"],
    sentiment: "positive",
    whyItMatters:
      "Sustained AI capex supports revenue visibility for the semiconductor complex, a key driver of index-level performance.",
    publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: "news-3",
    title: "Bitcoin ETFs see continued net inflows",
    summary: "Spot ETF products recorded another week of positive net flows.",
    url: "https://example.com/btc-etf",
    source: "CryptoDesk",
    category: "crypto",
    symbols: ["BTC-USD"],
    sentiment: "positive",
    whyItMatters:
      "ETF inflows represent structural demand that can support price during consolidation phases.",
    publishedAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
  },
];

export const mockEconomicEvents: EconomicEvent[] = [
  {
    id: "eco-1",
    title: "US CPI (YoY)",
    country: "US",
    category: "inflation",
    importance: "HIGH",
    forecast: "3.1%",
    previous: "3.3%",
    potentialImpact:
      "A hotter-than-expected print typically pressures rate-sensitive equities and strengthens the dollar; a cooler print tends to support risk assets.",
    eventTime: new Date(Date.now() + 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: "eco-2",
    title: "ECB Interest Rate Decision",
    country: "EU",
    category: "rates",
    importance: "HIGH",
    forecast: "hold",
    previous: "hold",
    potentialImpact:
      "Guidance on the easing path affects EUR crosses and European equity risk premia.",
    eventTime: new Date(Date.now() + 1000 * 60 * 60 * 44).toISOString(),
  },
  {
    id: "eco-3",
    title: "US Non-Farm Payrolls",
    country: "US",
    category: "employment",
    importance: "HIGH",
    forecast: "180K",
    previous: "206K",
    potentialImpact:
      "Labour-market strength influences the Fed's policy path and near-term rate expectations.",
    eventTime: new Date(Date.now() + 1000 * 60 * 60 * 68).toISOString(),
  },
];
