import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { env } from "@/lib/env";
import { sendTestNotification } from "@/server/services/whatsapp";

const bodySchema = z.object({
  // Optional override; must be E.164 (e.g. +447700900123).
  to: z
    .string()
    .regex(/^\+[1-9]\d{6,14}$/i, "Recipient must be in E.164 format")
    .optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const result = await sendTestNotification(parsed.data.to);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    simulated: result.simulated ?? false,
    configured: env.whatsapp.isConfigured,
    messageId: result.messageId,
  });
}
