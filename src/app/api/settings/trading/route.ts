import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  enabled: z.boolean().optional(),
  tvAutoExecute: z.boolean().optional(),
  tvOrderAmount: z.number().positive().max(1_000_000).nullable().optional(),
});

/** Update trade-execution preferences for the current user. */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (parsed.data.enabled !== undefined) patch.tradingEnabled = parsed.data.enabled;
  if (parsed.data.tvAutoExecute !== undefined) patch.tvAutoExecute = parsed.data.tvAutoExecute;
  if (parsed.data.tvOrderAmount !== undefined) patch.tvOrderAmount = parsed.data.tvOrderAmount;

  await prisma.userSettings.upsert({
    where: { userId: session.user.id },
    update: patch,
    create: { userId: session.user.id, ...patch },
  });

  return NextResponse.json({ ok: true, ...patch });
}
