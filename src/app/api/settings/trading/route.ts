import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({ enabled: z.boolean() });

/** Enable/disable trade execution for the current user. */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await prisma.userSettings.upsert({
    where: { userId: session.user.id },
    update: { tradingEnabled: parsed.data.enabled },
    create: { userId: session.user.id, tradingEnabled: parsed.data.enabled },
  });

  return NextResponse.json({ ok: true, tradingEnabled: parsed.data.enabled });
}
