import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { ingestTradingViewSignal } from "@/server/services/tradingview";

export const dynamic = "force-dynamic";

/**
 * Inbound TradingView alert webhook. This endpoint is public (TradingView has
 * no auth headers), so it authenticates via a shared secret in the body or the
 * `?secret=` query param, compared against TRADINGVIEW_WEBHOOK_SECRET.
 *
 * Configure a TradingView alert with "Webhook URL" =
 *   https://<your-host>/api/webhooks/tradingview
 * and a JSON message body, e.g.:
 *   {"secret":"<TRADINGVIEW_WEBHOOK_SECRET>","symbol":"BTC-USD",
 *    "action":"buy","assetClass":"CRYPTO","price":{{close}}}
 */
const bodySchema = z.object({
  secret: z.string().optional(),
  passphrase: z.string().optional(), // TradingView's common field name
  symbol: z.string().min(1).max(20),
  action: z
    .string()
    .transform((s) => s.toUpperCase())
    .pipe(z.enum(["BUY", "SELL"])),
  assetClass: z
    .enum(["STOCK", "ETF", "CRYPTO", "FOREX", "COMMODITY", "INDEX"])
    .default("CRYPTO"),
  price: z.number().positive().optional(),
  amount: z.number().positive().optional(),
  message: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  const secret = env.tradingViewWebhookSecret;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook not configured (TRADINGVIEW_WEBHOOK_SECRET unset)." },
      { status: 503 },
    );
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Accept the secret from the body or the query string.
  const url = new URL(req.url);
  const provided = parsed.data.secret ?? parsed.data.passphrase ?? url.searchParams.get("secret");
  if (provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const report = await ingestTradingViewSignal({
      symbol: parsed.data.symbol.toUpperCase(),
      action: parsed.data.action,
      assetClass: parsed.data.assetClass,
      price: parsed.data.price,
      amount: parsed.data.amount,
      message: parsed.data.message,
    });
    return NextResponse.json({ ok: true, ...report });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ingestion failed" },
      { status: 500 },
    );
  }
}
