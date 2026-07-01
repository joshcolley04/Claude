import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { env } from "@/lib/env";
import { runMonitor } from "@/server/services/monitor";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Triggers a scan + alert run. Authorised either by:
 *  - a Bearer token matching CRON_SECRET (for scheduled jobs / Vercel Cron), or
 *  - an authenticated session (manual trigger from the app).
 */
async function authorize(req: Request): Promise<boolean> {
  const secret = env.cronSecret;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth === `Bearer ${secret}`) return true;
  }
  const session = await getServerSession(authOptions);
  return Boolean(session);
}

export async function POST(req: Request) {
  if (!(await authorize(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const report = await runMonitor();
    return NextResponse.json({ ok: true, ...report });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Scan failed" },
      { status: 500 },
    );
  }
}

// Allow Vercel Cron (GET) to trigger the same job.
export async function GET(req: Request) {
  return POST(req);
}
