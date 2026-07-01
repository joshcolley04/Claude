/**
 * Coinbase OAuth + Advanced (v2) API adapter.
 *
 * Pure functions that operate on an access token — persistence, encryption and
 * refresh live in `connection.ts`. Credentials come only from env. This adapter
 * supports read (accounts/balances) and, when the user has explicitly enabled
 * trading and confirmed the order, execution (buys/sells).
 */
import { env } from "@/lib/env";
import type {
  BrokerAccount,
  OAuthTokens,
  OrderResult,
  PlaceOrderInput,
} from "./types";

const AUTHORIZE_URL = "https://www.coinbase.com/oauth/authorize";
const TOKEN_URL = "https://api.coinbase.com/oauth/token";
const API_BASE = "https://api.coinbase.com/v2";
const CB_VERSION = "2024-01-01";

// Read balances + place buys/sells + read basic user profile.
const SCOPES = [
  "wallet:accounts:read",
  "wallet:user:read",
  "wallet:buys:create",
  "wallet:sells:create",
];

export function getAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: env.broker.coinbaseClientId ?? "",
    redirect_uri: env.broker.coinbaseRedirectUri,
    state,
    scope: SCOPES.join(" "),
    // Ask for a refresh token and constrain account access.
    account: "all",
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

function expiryFrom(expiresInSec?: number): Date | undefined {
  if (!expiresInSec) return undefined;
  return new Date(Date.now() + expiresInSec * 1000);
}

export async function exchangeCode(code: string): Promise<OAuthTokens> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      client_id: env.broker.coinbaseClientId,
      client_secret: env.broker.coinbaseClientSecret,
      redirect_uri: env.broker.coinbaseRedirectUri,
    }),
  });
  if (!res.ok) throw new Error(`Coinbase token exchange failed (${res.status})`);
  const d = (await res.json()) as {
    access_token: string;
    refresh_token?: string;
    scope?: string;
    expires_in?: number;
  };
  return {
    accessToken: d.access_token,
    refreshToken: d.refresh_token,
    scope: d.scope,
    expiresAt: expiryFrom(d.expires_in),
  };
}

export async function refreshTokens(refreshToken: string): Promise<OAuthTokens> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: env.broker.coinbaseClientId,
      client_secret: env.broker.coinbaseClientSecret,
    }),
  });
  if (!res.ok) throw new Error(`Coinbase token refresh failed (${res.status})`);
  const d = (await res.json()) as {
    access_token: string;
    refresh_token?: string;
    scope?: string;
    expires_in?: number;
  };
  return {
    accessToken: d.access_token,
    refreshToken: d.refresh_token ?? refreshToken,
    scope: d.scope,
    expiresAt: expiryFrom(d.expires_in),
  };
}

function authHeaders(accessToken: string): HeadersInit {
  return {
    Authorization: `Bearer ${accessToken}`,
    "CB-VERSION": CB_VERSION,
    "Content-Type": "application/json",
  };
}

export async function getAccounts(accessToken: string): Promise<BrokerAccount[]> {
  const res = await fetch(`${API_BASE}/accounts?limit=100`, {
    headers: authHeaders(accessToken),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Coinbase accounts failed (${res.status})`);
  const d = (await res.json()) as {
    data: {
      id: string;
      name: string;
      currency: { code: string };
      balance: { amount: string; currency: string };
      native_balance?: { amount: string };
    }[];
  };
  return d.data
    .map((a) => ({
      id: a.id,
      name: a.name,
      currency: a.balance.currency,
      balance: parseFloat(a.balance.amount),
      nativeValue: a.native_balance
        ? parseFloat(a.native_balance.amount)
        : undefined,
    }))
    .filter((a) => a.balance > 0);
}

export async function getProfileEmail(accessToken: string): Promise<string | undefined> {
  try {
    const res = await fetch(`${API_BASE}/user`, {
      headers: authHeaders(accessToken),
      cache: "no-store",
    });
    if (!res.ok) return undefined;
    const d = (await res.json()) as { data?: { name?: string; email?: string } };
    return d.data?.email ?? d.data?.name;
  } catch {
    return undefined;
  }
}

/**
 * Place a market buy/sell. Coinbase's buy/sell endpoints denominate `amount`
 * in the crypto asset and `commit: true` executes immediately.
 * The caller MUST have verified: session, settings.tradingEnabled, explicit
 * per-order confirmation. This function does not enforce those policies.
 */
export async function placeOrder(
  accessToken: string,
  input: PlaceOrderInput,
): Promise<OrderResult> {
  const path =
    input.side === "BUY"
      ? `/accounts/${input.accountId}/buys`
      : `/accounts/${input.accountId}/sells`;
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: authHeaders(accessToken),
      body: JSON.stringify({
        amount: String(input.amount),
        currency: input.currency,
        commit: true,
      }),
    });
    const d = (await res.json()) as {
      data?: { id: string; status: string; total?: { amount: string } };
      errors?: { message: string }[];
    };
    if (!res.ok) {
      return { ok: false, error: d.errors?.[0]?.message ?? `HTTP ${res.status}` };
    }
    return {
      ok: true,
      orderId: d.data?.id,
      status: d.data?.status,
      filledPrice: d.data?.total ? parseFloat(d.data.total.amount) : undefined,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Order failed" };
  }
}
