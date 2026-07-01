"use client";

import { useState } from "react";
import { MessageCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function WhatsAppTest() {
  const [to, setTo] = useState("");
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "ok"; simulated: boolean }
    | { kind: "error"; message: string }
  >({ kind: "idle" });
  const [loading, setLoading] = useState(false);

  async function sendTest() {
    setLoading(true);
    setStatus({ kind: "idle" });
    try {
      const res = await fetch("/api/notifications/whatsapp/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(to ? { to } : {}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send");
      setStatus({ kind: "ok", simulated: Boolean(data.simulated) });
    } catch (e) {
      setStatus({ kind: "error", message: e instanceof Error ? e.message : "Failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="wa-to">Recipient (optional override)</Label>
        <Input
          id="wa-to"
          placeholder="+447700900123"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Leave blank to use <code className="text-foreground/80">WHATSAPP_DEFAULT_RECIPIENT</code>.
        </p>
      </div>
      <Button onClick={sendTest} disabled={loading} variant="secondary">
        <MessageCircle className="h-4 w-4" />
        {loading ? "Sending…" : "Send Test Notification"}
      </Button>

      {status.kind === "ok" && (
        <p className="flex items-center gap-2 text-sm text-success">
          <CheckCircle2 className="h-4 w-4" />
          {status.simulated
            ? "Simulated OK — set WhatsApp credentials in .env to send for real."
            : "Test message sent successfully."}
        </p>
      )}
      {status.kind === "error" && (
        <p className="flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          {status.message}
        </p>
      )}
    </div>
  );
}
