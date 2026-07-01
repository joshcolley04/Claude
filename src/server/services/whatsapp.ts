/**
 * WhatsApp Business Platform (Cloud API) integration.
 *
 * Credentials are read exclusively from environment variables — never from the
 * request body, source code, or the database. See docs/SETUP.md for how to
 * provision an access token, phone number ID, and approved message template.
 */
import { env } from "@/lib/env";
import type { Opportunity } from "@/types/market";
import { formatCurrency } from "@/lib/utils";

const GRAPH_API_VERSION = "v21.0";

export interface WhatsAppResult {
  ok: boolean;
  messageId?: string;
  error?: string;
  simulated?: boolean;
}

async function sendText(to: string, body: string): Promise<WhatsAppResult> {
  if (!env.whatsapp.isConfigured) {
    // Graceful degradation: in dev without credentials we simulate delivery so
    // the "Send Test Notification" button still gives useful feedback.
    return { ok: true, simulated: true };
  }

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${env.whatsapp.phoneNumberId}/messages`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.whatsapp.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { preview_url: false, body },
      }),
    });

    const data = (await res.json()) as {
      messages?: { id: string }[];
      error?: { message?: string };
    };

    if (!res.ok) {
      return { ok: false, error: data.error?.message ?? `HTTP ${res.status}` };
    }
    return { ok: true, messageId: data.messages?.[0]?.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function sendTestNotification(to?: string): Promise<WhatsAppResult> {
  const recipient = to ?? env.whatsapp.defaultRecipient;
  if (!recipient) {
    return { ok: false, error: "No recipient configured (WHATSAPP_DEFAULT_RECIPIENT)." };
  }
  return sendText(
    recipient,
    "✅ TRADE24/7 test notification. Your WhatsApp integration is working.",
  );
}

/** Format and send a high-conviction opportunity alert. */
export async function sendOpportunityAlert(
  opportunity: Opportunity,
  to?: string,
): Promise<WhatsAppResult> {
  const recipient = to ?? env.whatsapp.defaultRecipient;
  if (!recipient) {
    return { ok: false, error: "No recipient configured (WHATSAPP_DEFAULT_RECIPIENT)." };
  }

  const targets = [opportunity.takeProfit1, opportunity.takeProfit2]
    .filter((t): t is number => typeof t === "number")
    .map((t) => formatCurrency(t, opportunity.assetClass === "CRYPTO" ? "USD" : "USD"))
    .join(" / ");

  const body = [
    `📈 TRADE24/7 Opportunity — ${opportunity.direction} ${opportunity.symbol}`,
    `${opportunity.name}`,
    ``,
    `Entry: ${formatCurrency(opportunity.suggestedEntry)}`,
    `Stop-loss: ${formatCurrency(opportunity.stopLoss)}`,
    `Target(s): ${targets}`,
    `Confidence: ${opportunity.confidence}/100  ·  Score: ${opportunity.scores.overall}/100`,
    ``,
    opportunity.thesis,
    ``,
    "Not investment advice. Manage risk and size positions responsibly.",
  ].join("\n");

  return sendText(recipient, body);
}
