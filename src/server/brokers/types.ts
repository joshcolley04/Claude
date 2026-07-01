/** Normalised broker account/balance. */
export interface BrokerAccount {
  id: string;
  name: string;
  currency: string;
  balance: number;
  /** Approx. value in the user's base currency, when the broker provides it. */
  nativeValue?: number;
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  scope?: string;
  /** Absolute expiry. */
  expiresAt?: Date;
  accountLabel?: string;
}

export type OrderSide = "BUY" | "SELL";

export interface PlaceOrderInput {
  /** Broker account id the order is placed against. */
  accountId: string;
  side: OrderSide;
  /** Amount denominated in the crypto asset (e.g. 0.01 BTC). */
  amount: number;
  currency: string; // e.g. BTC
}

export interface OrderResult {
  ok: boolean;
  orderId?: string;
  status?: string;
  filledPrice?: number;
  error?: string;
}
