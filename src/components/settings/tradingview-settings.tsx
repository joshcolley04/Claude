"use client";

import { useState } from "react";
import { Copy, Check, Webhook } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  webhookUrl: string;
  configured: boolean;
  initialAutoExecute: boolean;
  initialAmount: number | null;
}

export function TradingViewSettings({
  webhookUrl,
  configured,
  initialAutoExecute,
  initialAmount,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [autoExecute, setAutoExecute] = useState(initialAutoExecute);
  const [amount, setAmount] = useState(initialAmount?.toString() ?? "");

  async function save(patch: Record<string, unknown>) {
    await fetch("/api/settings/trading", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  }

  const example = `{"secret":"<your-secret>","symbol":"BTC-USD","action":"buy","assetClass":"CRYPTO","price":{{close}}}`;

  return (
    <div className="space-y-4">
      {!configured && (
        <p className="text-xs text-amber-400">
          Set <code>TRADINGVIEW_WEBHOOK_SECRET</code> in your environment to enable this endpoint.
        </p>
      )}

      <div className="space-y-1.5">
        <Label>Webhook URL</Label>
        <div className="flex items-center gap-2">
          <code className="flex-1 truncate rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs">
            {webhookUrl}
          </code>
          <button
            type="button"
            aria-label="Copy webhook URL"
            onClick={() => {
              void navigator.clipboard.writeText(webhookUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 hover:bg-white/5"
          >
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          In a TradingView alert, set the Webhook URL above and paste this JSON as the message:
        </p>
        <pre className="overflow-x-auto rounded-lg border border-white/10 bg-white/[0.03] p-3 text-[11px] text-muted-foreground">
          {example}
        </pre>
      </div>

      {/* Auto-execution (crypto via Coinbase) */}
      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium">
              <Webhook className="h-4 w-4 text-amber-400" />
              Auto-execute signals (crypto via Coinbase)
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Routes each TradingView signal to Coinbase automatically. Requires
              live trading enabled above and a connected Coinbase account. This is
              the only order path that does not ask for per-order confirmation.
            </p>
          </div>
          <Switch
            checked={autoExecute}
            onCheckedChange={(v) => {
              setAutoExecute(v);
              void save({ tvAutoExecute: v });
            }}
          />
        </div>

        {autoExecute && (
          <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
            <Label htmlFor="tv-amount">Order size (crypto units per signal)</Label>
            <Input
              id="tv-amount"
              type="number"
              step="any"
              value={amount}
              placeholder="e.g. 0.01"
              onChange={(e) => setAmount(e.target.value)}
              onBlur={() => {
                const n = parseFloat(amount);
                void save({ tvOrderAmount: Number.isFinite(n) && n > 0 ? n : null });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
