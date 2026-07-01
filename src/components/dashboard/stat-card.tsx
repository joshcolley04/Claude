import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatPercent, trendClass } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  icon?: LucideIcon;
  hint?: string;
}

export function StatCard({ label, value, change, icon: Icon, hint }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </div>
        <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </p>
        {typeof change === "number" ? (
          <div className={cn("mt-1 flex items-center gap-1 text-sm", trendClass(change))}>
            {change >= 0 ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            <span className="tabular-nums">{formatPercent(change)}</span>
            {hint && <span className="text-muted-foreground">· {hint}</span>}
          </div>
        ) : (
          hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
        )}
      </CardContent>
    </Card>
  );
}
