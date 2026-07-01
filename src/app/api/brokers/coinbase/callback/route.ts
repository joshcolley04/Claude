import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { env } from "@/lib/env";
import { exchangeCode, getProfileEmail } from "@/server/brokers/coinbase";
import { saveConnection } from "@/server/brokers/connection";

export const dynamic = "force-dynamic";

function settingsRedirect(query: string) {
  return NextResponse.redirect(new URL(`/settings?${query}`, env.nextAuthUrl));
}

/** OAuth redirect target: verify state, exchange the code, store the connection. */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect(new URL("/login", env.nextAuthUrl));
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const cookieStore = cookies();
  const expectedState = cookieStore.get("cb_oauth_state")?.value;
  cookieStore.delete("cb_oauth_state");

  if (error) return settingsRedirect(`error=coinbase_${encodeURIComponent(error)}`);
  if (!code || !state || !expectedState || state !== expectedState) {
    return settingsRedirect("error=coinbase_state");
  }

  try {
    const tokens = await exchangeCode(code);
    const accountLabel = await getProfileEmail(tokens.accessToken);
    await saveConnection(session.user.id, "coinbase", { ...tokens, accountLabel });
    return settingsRedirect("connected=coinbase");
  } catch {
    return settingsRedirect("error=coinbase_exchange");
  }
}
