import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAccessToken } from "@/server/brokers/connection";
import { placeOrder } from "@/server/brokers/coinbase";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  accountId: z.string().min(1),
  side: z.enum(["BUY", "SELL"]),
  amount: z.number().positive().max(1_000_000),
  currency: z.string().min(2).max(10),
  // Explicit per-order confirmation is mandatory — no order without it.
  confirm: z.literal(true),
});

/**
 * Execute a real Coinbase order. Multiple independent gates must all pass:
 *  1. Authenticated session.
 *  2. The user has explicitly enabled trading (settings.tradingEnabled).
 *  3. The request carries an explicit `confirm: true`.
 * Orders are only ever placed by this deliberate user action — the scanner,
 * monitor and alerts never call it.
 */
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
  const { accountId, side, amount, currency } = parsed.data;

  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id },
    select: { tradingEnabled: true },
  });
  if (!settings?.tradingEnabled) {
    return NextResponse.json(
      { error: "Trading is disabled. Enable it in Settings first." },
      { status: 403 },
    );
  }

  const token = await getAccessToken(session.user.id, "coinbase");
  if (!token) {
    return NextResponse.json(
      { error: "Coinbase is not connected (or needs re-authentication)." },
      { status: 409 },
    );
  }

  const result = await placeOrder(token, { accountId, side, amount, currency });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  // Record the fill against the user's portfolio for tracking.
  await recordFill(session.user.id, side, amount, currency, result.filledPrice);

  return NextResponse.json({
    ok: true,
    orderId: result.orderId,
    status: result.status,
    filledPrice: result.filledPrice,
  });
}

async function recordFill(
  userId: string,
  side: "BUY" | "SELL",
  amount: number,
  currency: string,
  filledTotal?: number,
): Promise<void> {
  try {
    const portfolio = await prisma.portfolio.findFirst({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
    if (!portfolio) return;

    const symbol = `${currency}-USD`;
    const instrument = await prisma.instrument.upsert({
      where: { symbol_assetClass: { symbol, assetClass: "CRYPTO" } },
      update: {},
      create: { symbol, name: currency, assetClass: "CRYPTO" },
    });

    const price = filledTotal && amount > 0 ? filledTotal / amount : 0;
    await prisma.transaction.create({
      data: {
        portfolioId: portfolio.id,
        instrumentId: instrument.id,
        side,
        quantity: amount,
        price,
        notes: "Executed via Coinbase",
      },
    });
    await prisma.alert.create({
      data: {
        userId,
        type: "SYSTEM",
        title: `${side} ${amount} ${currency} executed`,
        message: `Order filled via Coinbase${price ? ` at ~${price.toFixed(2)} USD` : ""}.`,
        deliveredVia: "in-app",
      },
    });
  } catch {
    // Fill succeeded at the broker; local bookkeeping is best-effort.
  }
}
