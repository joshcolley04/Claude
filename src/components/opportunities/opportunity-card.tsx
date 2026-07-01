import { TrendingDown, TrendingUp } from "lucide-react";
import type { Opportunity } from "@/types/market";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "./score-ring";
import { cn, formatCurrency } from "@/lib/utils";

function Metric({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("mt-0.5 text-sm font-medium tabular-nums", tone)}>{value}</p>
    </div>
  );
}

export function OpportunityCard({ opportunity: o }: { opportunity: Opportunity }) {
  const isBuy = o.direction === "BUY";

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge variant={isBuy ? "success" : "destructive"} className="gap-1">
              {isBuy ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {o.direction}
            </Badge>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{o.symbol}</span>
                <Badge variant="muted" className="text-[10px]">{o.assetClass}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{o.name}</p>
            </div>
          </div>
          <ScoreRing score={o.scores.overall} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Entry" value={formatCurrency(o.suggestedEntry)} />
          <Metric label="Stop" value={formatCurrency(o.stopLoss)} tone="text-destructive" />
          <Metric label="Target 1" value={formatCurrency(o.takeProfit1)} tone="text-success" />
          <Metric label="R : R" value={`${o.riskReward.toFixed(1)} : 1`} />
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {o.thesis}
        </p>

        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Hold {o.holdingPeriod} · Size {o.positionSizePct}%
          </span>
          <span className="font-medium text-primary">Confidence {o.confidence}/100</span>
        </div>
      </CardContent>
    </Card>
  );
}
