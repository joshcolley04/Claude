/**
 * AI Investment Analyst.
 *
 * Wraps the Anthropic Claude API. When no API key is configured it returns a
 * clearly-labelled illustrative response so the UI remains functional in dev.
 *
 * The system prompt enforces the platform's operating rules: evidence-based
 * analysis, explicit separation of facts / analysis / assumptions / opinions,
 * mandatory risk disclosure, and NO guarantees about future returns.
 */
import { env } from "@/lib/env";

const SYSTEM_PROMPT = `You are the TRADE24/7 AI Investment Analyst.
Rules you must always follow:
- Prioritise capital preservation and disciplined risk management.
- Base analysis on evidence. Clearly label each statement as FACT, ANALYSIS, ASSUMPTION, or OPINION.
- Never present projections or expected returns as guarantees.
- Always state principal risks and invalidation criteria.
- For any trade idea, include: asset name, ticker, current price, suggested entry, stop-loss, profit target(s), holding period, position size (as % of portfolio), risk-to-reward ratio, and a confidence score (0-100).
- If information is insufficient, say what additional information is required rather than guessing.`;

export interface AnalystMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AnalystResponse {
  content: string;
  model: string;
  simulated: boolean;
}

export async function askAnalyst(
  messages: AnalystMessage[],
): Promise<AnalystResponse> {
  if (!env.ai.apiKey) {
    return {
      simulated: true,
      model: env.ai.model,
      content:
        "**[Illustrative response — AI provider not configured]**\n\n" +
        "To enable the live AI Investment Analyst, set `ANTHROPIC_API_KEY` in your `.env`.\n\n" +
        "When configured, I analyse companies, crypto, sectors, ETFs and macro developments and return structured trade ideas — always labelling facts, analysis and assumptions, and never guaranteeing outcomes.",
    };
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ai.apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: env.ai.model,
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`AI provider error (${res.status}): ${detail}`);
  }

  const data = (await res.json()) as {
    content: { type: string; text: string }[];
  };
  const text = data.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  return { content: text, model: env.ai.model, simulated: false };
}
