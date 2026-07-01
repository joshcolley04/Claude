/**
 * Centralised, typed access to environment variables.
 * We deliberately do NOT throw at import time for optional integrations so the
 * platform can boot with mock data during development.
 */

function optional(key: string): string | undefined {
  const v = process.env[key];
  return v && v.length > 0 ? v : undefined;
}

function required(key: string): string {
  const v = optional(key);
  if (!v) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return v;
}

export const env = {
  get databaseUrl() {
    return required("DATABASE_URL");
  },
  get nextAuthSecret() {
    return required("NEXTAUTH_SECRET");
  },
  nextAuthUrl: optional("NEXTAUTH_URL") ?? "http://localhost:3000",

  github: {
    id: optional("GITHUB_ID"),
    secret: optional("GITHUB_SECRET"),
  },
  google: {
    id: optional("GOOGLE_CLIENT_ID"),
    secret: optional("GOOGLE_CLIENT_SECRET"),
  },

  ai: {
    apiKey: optional("ANTHROPIC_API_KEY"),
    model: optional("AI_MODEL") ?? "claude-opus-4-8",
  },

  marketData: {
    alphaVantage: optional("ALPHAVANTAGE_API_KEY"),
    finnhub: optional("FINNHUB_API_KEY"),
    polygon: optional("POLYGON_API_KEY"),
    coingecko: optional("COINGECKO_API_KEY"),
    tradingEconomics: optional("TRADING_ECONOMICS_API_KEY"),
  },

  news: {
    newsApi: optional("NEWSAPI_KEY"),
    marketaux: optional("MARKETAUX_API_KEY"),
  },

  whatsapp: {
    phoneNumberId: optional("WHATSAPP_PHONE_NUMBER_ID"),
    accessToken: optional("WHATSAPP_ACCESS_TOKEN"),
    businessAccountId: optional("WHATSAPP_BUSINESS_ACCOUNT_ID"),
    defaultRecipient: optional("WHATSAPP_DEFAULT_RECIPIENT"),
    templateName: optional("WHATSAPP_TEMPLATE_NAME") ?? "trade247_alert",
    get isConfigured() {
      return Boolean(
        optional("WHATSAPP_PHONE_NUMBER_ID") &&
          optional("WHATSAPP_ACCESS_TOKEN"),
      );
    },
  },

  broker: {
    coinbaseClientId: optional("COINBASE_CLIENT_ID"),
    coinbaseClientSecret: optional("COINBASE_CLIENT_SECRET"),
    coinbaseRedirectUri:
      optional("COINBASE_REDIRECT_URI") ??
      `${optional("NEXTAUTH_URL") ?? "http://localhost:3000"}/api/brokers/coinbase/callback`,
    get coinbaseConfigured() {
      return Boolean(
        optional("COINBASE_CLIENT_ID") && optional("COINBASE_CLIENT_SECRET"),
      );
    },
  },

  // 32-byte key (base64 or hex) used to encrypt broker tokens at rest.
  get encryptionKey() {
    return required("ENCRYPTION_KEY");
  },

  // Shared secret authorising the scheduled /api/scan job.
  cronSecret: optional("CRON_SECRET"),

  // Secret that authenticates inbound TradingView alert webhooks.
  tradingViewWebhookSecret: optional("TRADINGVIEW_WEBHOOK_SECRET"),

  mockDataEnabled: (optional("ENABLE_MOCK_DATA") ?? "true") === "true",
} as const;
