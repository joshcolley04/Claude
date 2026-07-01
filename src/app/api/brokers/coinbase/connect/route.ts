import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { env } from "@/lib/env";
import { getAuthorizeUrl } from "@/server/brokers/coinbase";

export const dynamic = "force-dynamic";

/** Kick off the Coinbase OAuth flow. */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!env.broker.coinbaseConfigured) {
    return NextResponse.redirect(
      new URL("/settings?error=coinbase_not_configured", env.nextAuthUrl),
    );
  }

  // CSRF protection: random state stored in an httpOnly cookie, verified on callback.
  const state = crypto.randomBytes(16).toString("hex");
  cookies().set("cb_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return NextResponse.redirect(getAuthorizeUrl(state));
}
