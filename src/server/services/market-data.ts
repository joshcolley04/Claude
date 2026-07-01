/**
 * Market data service.
 *
 * This is the single seam through which the rest of the app reads market data.
 * In Phase 1 it returns mock data when provider keys are absent. Real provider
 * adapters (Finnhub, Polygon, CoinGecko, …) plug in behind this interface in a
 * later phase without changing any UI code.
 */
import { env } from "@/lib/env";
import type {
  AllocationSlice,
  PerformancePoint,
  PortfolioSummary,
  Position,
  Quote,
} from "@/types/market";
import {
  mockAllocation,
  mockPerformanceSeries,
  mockPortfolioSummary,
  mockPositions,
  mockQuotes,
} from "./mock-data";

export async function getMarketOverview(): Promise<Quote[]> {
  if (!env.marketData.finnhub && !env.marketData.polygon) {
    return mockQuotes;
  }
  // TODO(phase-2): fetch live quotes from the configured provider.
  return mockQuotes;
}

export async function getPortfolioSummary(
  _userId: string,
): Promise<PortfolioSummary> {
  // TODO(phase-2): compute from Holding/Transaction + live quotes.
  return mockPortfolioSummary;
}

export async function getPositions(_userId: string): Promise<Position[]> {
  // TODO(phase-2): join Holding with live quotes and compute P&L.
  return mockPositions;
}

export async function getAllocation(_userId: string): Promise<AllocationSlice[]> {
  return mockAllocation;
}

export async function getPerformanceSeries(
  _userId: string,
  days = 90,
): Promise<PerformancePoint[]> {
  return mockPerformanceSeries(days);
}
