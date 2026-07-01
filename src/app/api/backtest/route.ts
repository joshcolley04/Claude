import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { runSymbolBacktest } from "@/server/services/backtest";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  symbol: z.string().min(1).max(20),
  assetClass: z.enum(["STOCK", "ETF", "CRYPTO", "FOREX", "COMMODITY", "INDEX"]),
  strategy: z.enum(["ma_crossover", "rsi_reversion"]),
  days: z.number().int().min(60).max(1000).optional(),
  feePct: z.number().min(0).max(0.05).optional(),
  stopPct: z.number().min(0).max(0.9).optional(),
  takePct: z.number().min(0).max(5).optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }
  try {
    const summary = await runSymbolBacktest(parsed.data);
    // Trim the equity curve for transport (chart only needs a sampled series).
    const curve = summary.result.equityCurve;
    const step = Math.max(1, Math.floor(curve.length / 120));
    return NextResponse.json({
      symbol: summary.symbol,
      strategy: summary.strategy,
      bars: summary.bars,
      metrics: summary.result.metrics,
      stats: summary.result.stats,
      equityCurve: curve.filter((_, i) => i % step === 0),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Backtest failed" },
      { status: 500 },
    );
  }
}
