import type { EconomicEvent } from "@/types/market";
import { Badge } from "@/components/ui/badge";

function importanceVariant(i: EconomicEvent["importance"]) {
  return i === "HIGH" ? "destructive" : i === "MEDIUM" ? "default" : "muted";
}

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EconomicCalendar({
  events,
  showImpact = true,
}: {
  events: EconomicEvent[];
  showImpact?: boolean;
}) {
  return (
    <ul className="space-y-3">
      {events.map((e) => (
        <li key={e.id} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={importanceVariant(e.importance)} className="text-[10px]">
                  {e.importance}
                </Badge>
                <span className="text-xs text-muted-foreground">{e.country}</span>
              </div>
              <p className="mt-1 text-sm font-medium">{e.title}</p>
            </div>
            <span className="whitespace-nowrap text-xs text-muted-foreground">
              {formatWhen(e.eventTime)}
            </span>
          </div>
          <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
            {e.forecast && <span>Forecast: <span className="text-foreground">{e.forecast}</span></span>}
            {e.previous && <span>Previous: <span className="text-foreground">{e.previous}</span></span>}
            {e.actual && <span>Actual: <span className="text-foreground">{e.actual}</span></span>}
          </div>
          {showImpact && (
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {e.potentialImpact}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
