/**
 * Builds the live grounding context passed to the AI analyst: the user's
 * portfolio snapshot, current market overview and the top scanner
 * opportunities. Kept compact (plain text) to stay token-efficient.
 */
import { formatCurrency, formatPercent } from "@/lib/utils";
import { getMarketOverview, getPortfolioSummary, getPositions } from "./market-data";
import { getTopOpportunities } from "./opportunities";

export async function buildAnalystContext(userId: string): Promise<string> {
  const [summary, positions, market, opps] = await Promise.all([
    getPortfolioSummary(userId),
    getPositions(userId),
    getMarketOverview(),
    getTopOpportunities(5),
  ]);

  const lines: string[] = [];

  lines.push("PORTFOLIO:");
  lines.push(
    `  Total ${formatCurrency(summary.totalValue)}, cash ${formatCurrency(summary.cashBalance)}, ` +
      `day ${formatPercent(summary.dayPnlPct)}, week ${formatPercent(summary.weekPnlPct)}, month ${formatPercent(summary.monthPnlPct)}.`,
  );
  if (positions.length) {
    lines.push("  Positions:");
    for (const p of positions.slice(0, 12)) {
      lines.push(
        `   - ${p.symbol} ${p.quantity} @ avg ${formatCurrency(p.avgCost)} ` +
          `(now ${formatCurrency(p.price)}, ${formatPercent(p.unrealizedPnlPct)}, ${p.allocationPct.toFixed(1)}% of book)`,
      );
    }
  }

  lines.push("MARKET OVERVIEW:");
  for (const q of market) {
    lines.push(`   - ${q.symbol} ${formatCurrency(q.price)} (${formatPercent(q.changePct)})`);
  }

  lines.push("TOP OPPORTUNITIES (scanner, 0-100 score):");
  for (const o of opps) {
    lines.push(
      `   - ${o.direction} ${o.symbol} score ${o.scores.overall} conf ${o.confidence}: ` +
        `entry ${formatCurrency(o.suggestedEntry)}, stop ${formatCurrency(o.stopLoss)}, ` +
        `target ${formatCurrency(o.takeProfit1)} (R:R ${o.riskReward}:1)`,
    );
  }

  return lines.join("\n");
}
