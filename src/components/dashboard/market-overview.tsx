import type { Quote } from "@/types/market";
import { cn, formatPercent, trendClass } from "@/lib/utils";

export function MarketOverview({ quotes }: { quotes: Quote[] }) {
  return (
    <div className="divide-y divide-white/5">
      {quotes.map((q) => (
        <div key={q.symbol} className="flex items-center justify-between py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{q.symbol}</p>
            <p className="truncate text-xs text-muted-foreground">{q.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm tabular-nums">
              {q.price.toLocaleString("en-US", {
                minimumFractionDigits: q.price < 10 ? 4 : 2,
                maximumFractionDigits: q.price < 10 ? 4 : 2,
              })}
            </p>
            <p className={cn("text-xs tabular-nums", trendClass(q.changePct))}>
              {formatPercent(q.changePct)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
