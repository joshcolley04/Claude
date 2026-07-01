"use client";

import { useCallback, useEffect, useState } from "react";
import { Coins, Link2, Unlink, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface Account {
  id: string;
  name: string;
  currency: string;
  balance: number;
  nativeValue?: number;
}

export function BrokerConnection({ initialTrading }: { initialTrading: boolean }) {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [label, setLabel] = useState<string | undefined>();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [trading, setTrading] = useState(initialTrading);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/brokers/coinbase/accounts");
      const data = await res.json();
      setConnected(Boolean(data.connected));
      setLabel(data.accountLabel);
      setAccounts(data.accounts ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function disconnect() {
    await fetch("/api/brokers/coinbase/disconnect", { method: "POST" });
    setConnected(false);
    setAccounts([]);
    setTrading(false);
    await fetch("/api/settings/trading", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: false }),
    });
  }

  async function toggleTrading(next: boolean) {
    setTrading(next);
    await fetch("/api/settings/trading", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: next }),
    });
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Checking Coinbase connection…</p>;
  }

  if (!connected) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Connect your Coinbase account via secure OAuth to view balances and,
          if you enable trading, place orders.
        </p>
        <Button asChild>
          {/* Full navigation (not fetch) so the OAuth redirect works. */}
          <a href="/api/brokers/coinbase/connect">
            <Link2 className="h-4 w-4" />
            Connect Coinbase
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Connected</span>
          {label && <Badge variant="muted">{label}</Badge>}
        </div>
        <Button variant="outline" size="sm" onClick={disconnect}>
          <Unlink className="h-4 w-4" />
          Disconnect
        </Button>
      </div>

      {accounts.length > 0 && (
        <ul className="divide-y divide-white/5 rounded-lg border border-white/5">
          {accounts.map((a) => (
            <li key={a.id} className="flex items-center justify-between px-3 py-2 text-sm">
              <span className="text-muted-foreground">{a.currency}</span>
              <span className="tabular-nums">
                {a.balance} {a.currency}
                {a.nativeValue !== undefined && (
                  <span className="ml-2 text-muted-foreground">
                    ≈ {formatCurrency(a.nativeValue)}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Trade execution — off by default, explicit opt-in. */}
      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Enable live trading
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Allows placing real orders from this app. Every order still needs
              explicit confirmation. Alerts and the scanner never auto-trade.
            </p>
          </div>
          <Switch checked={trading} onCheckedChange={toggleTrading} />
        </div>

        {trading && <OrderForm accounts={accounts} onFilled={load} />}
      </div>
    </div>
  );
}

function OrderForm({
  accounts,
  onFilled,
}: {
  accounts: Account[];
  onFilled: () => void;
}) {
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [amount, setAmount] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const account = accounts.find((a) => a.id === accountId);
  const amountNum = parseFloat(amount);
  const valid = account && Number.isFinite(amountNum) && amountNum > 0;

  async function submit() {
    if (!valid || !account) return;
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/brokers/coinbase/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: account.id,
          side,
          amount: amountNum,
          currency: account.currency,
          confirm: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Order failed");
      setStatus(`✅ ${side} ${amountNum} ${account.currency} — status ${data.status ?? "submitted"}.`);
      setAmount("");
      setConfirming(false);
      onFilled();
    } catch (e) {
      setStatus(`⚠️ ${e instanceof Error ? e.message : "Order failed"}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="space-y-1.5">
          <Label>Account</Label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.currency}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Side</Label>
          <select
            value={side}
            onChange={(e) => setSide(e.target.value as "BUY" | "SELL")}
            className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label>Amount ({account?.currency})</Label>
          <Input
            type="number"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>
      </div>

      {!confirming ? (
        <Button
          variant="secondary"
          disabled={!valid}
          onClick={() => setConfirming(true)}
        >
          Review order
        </Button>
      ) : (
        <div className="space-y-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
          <p className="text-sm">
            Confirm <strong>{side}</strong> <strong>{amountNum} {account?.currency}</strong>?
            This places a real order on Coinbase.
          </p>
          <div className="flex gap-2">
            <Button size="sm" onClick={submit} disabled={busy}>
              <CheckCircle2 className="h-4 w-4" />
              {busy ? "Placing…" : "Confirm order"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirming(false)} disabled={busy}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {status && <p className="text-sm text-muted-foreground">{status}</p>}
    </div>
  );
}
