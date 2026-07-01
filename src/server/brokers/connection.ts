/**
 * Broker connection persistence.
 *
 * Stores OAuth tokens encrypted at rest and returns a usable (decrypted,
 * auto-refreshed) access token to callers. Only server code should import this.
 */
import { prisma } from "@/lib/prisma";
import { decrypt, encrypt } from "@/lib/crypto";
import type { OAuthTokens } from "./types";
import { refreshTokens as refreshCoinbase } from "./coinbase";

const REFRESH_SKEW_MS = 60_000; // refresh a minute before expiry

export async function saveConnection(
  userId: string,
  broker: string,
  tokens: OAuthTokens,
): Promise<void> {
  const data = {
    accessTokenEnc: encrypt(tokens.accessToken),
    refreshTokenEnc: tokens.refreshToken ? encrypt(tokens.refreshToken) : null,
    scope: tokens.scope ?? null,
    expiresAt: tokens.expiresAt ?? null,
    externalAccountLabel: tokens.accountLabel ?? null,
    status: "connected",
  };
  await prisma.brokerConnection.upsert({
    where: { userId_broker: { userId, broker } },
    update: data,
    create: { userId, broker, ...data },
  });
}

export interface ConnectionInfo {
  connected: boolean;
  broker: string;
  accountLabel?: string | null;
  status?: string;
}

export async function getConnectionInfo(
  userId: string,
  broker: string,
): Promise<ConnectionInfo> {
  const c = await prisma.brokerConnection.findUnique({
    where: { userId_broker: { userId, broker } },
    select: { externalAccountLabel: true, status: true },
  });
  if (!c) return { connected: false, broker };
  return {
    connected: c.status === "connected",
    broker,
    accountLabel: c.externalAccountLabel,
    status: c.status,
  };
}

/**
 * Return a valid access token for the connection, refreshing it if expired.
 * Returns null if there is no active connection.
 */
export async function getAccessToken(
  userId: string,
  broker: string,
): Promise<string | null> {
  const c = await prisma.brokerConnection.findUnique({
    where: { userId_broker: { userId, broker } },
  });
  if (!c || c.status !== "connected") return null;

  const needsRefresh =
    c.expiresAt && c.expiresAt.getTime() - REFRESH_SKEW_MS <= Date.now();

  if (needsRefresh && c.refreshTokenEnc && broker === "coinbase") {
    try {
      const refreshed = await refreshCoinbase(decrypt(c.refreshTokenEnc));
      await saveConnection(userId, broker, refreshed);
      return refreshed.accessToken;
    } catch {
      await prisma.brokerConnection.update({
        where: { userId_broker: { userId, broker } },
        data: { status: "expired" },
      });
      return null;
    }
  }

  return decrypt(c.accessTokenEnc);
}

export async function disconnect(userId: string, broker: string): Promise<void> {
  await prisma.brokerConnection.deleteMany({ where: { userId, broker } });
}
