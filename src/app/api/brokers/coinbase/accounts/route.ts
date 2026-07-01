import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAccessToken, getConnectionInfo } from "@/server/brokers/connection";
import { getAccounts } from "@/server/brokers/coinbase";

export const dynamic = "force-dynamic";

/** Read-only: return connected Coinbase balances. */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const info = await getConnectionInfo(session.user.id, "coinbase");
  if (!info.connected) {
    return NextResponse.json({ connected: false, accounts: [] });
  }

  const token = await getAccessToken(session.user.id, "coinbase");
  if (!token) {
    return NextResponse.json(
      { connected: false, accounts: [], error: "reauth_required" },
      { status: 200 },
    );
  }

  try {
    const accounts = await getAccounts(token);
    return NextResponse.json({
      connected: true,
      accountLabel: info.accountLabel,
      accounts,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load accounts" },
      { status: 502 },
    );
  }
}
