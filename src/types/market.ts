export type AssetClass =
  | "STOCK"
  | "ETF"
  | "CRYPTO"
  | "FOREX"
  | "COMMODITY"
  | "INDEX";

export type Direction = "BUY" | "SELL";

export interface Quote {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  price: number;
  changePct: number;
  volume?: number;
  currency?: string;
}

export interface PortfolioSummary {
  totalValue: number;
  cashBalance: number;
  dayPnl: number;
  dayPnlPct: number;
  weekPnlPct: number;
  monthPnlPct: number;
  openPositions: number;
  closedPositions: number;
}

export interface Position {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  quantity: number;
  avgCost: number;
  price: number;
  marketValue: number;
  unrealizedPnl: number;
  unrealizedPnlPct: number;
  allocationPct: number;
}

export interface AllocationSlice {
  label: string;
  value: number;
  pct: number;
}

export interface PerformancePoint {
  date: string;
  value: number;
}

/** Component breakdown for the AI Opportunity Score (0-100 each). */
export interface OpportunityScores {
  overall: number;
  technical: number;
  fundamental: number;
  momentum: number;
  volume: number;
  institutional: number;
  sentiment: number;
  macro: number;
  liquidity: number;
  risk: number;
}

export interface Opportunity {
  id: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  direction: Direction;
  currentPrice: number;
  suggestedEntry: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2?: number;
  holdingPeriod: string;
  positionSizePct: number;
  riskReward: number;
  confidence: number;
  scores: OpportunityScores;
  thesis: string;
  strengths: string[];
  weaknesses: string[];
  principalRisks: string[];
  invalidation: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  category: string;
  symbols: string[];
  sentiment: "positive" | "neutral" | "negative";
  whyItMatters: string;
  publishedAt: string;
}

export interface EconomicEvent {
  id: string;
  title: string;
  country: string;
  category: string;
  importance: "LOW" | "MEDIUM" | "HIGH";
  actual?: string;
  forecast?: string;
  previous?: string;
  potentialImpact: string;
  eventTime: string;
}
