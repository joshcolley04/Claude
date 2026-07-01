import { cn } from "@/lib/utils";

export function Brand({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary to-blue-700 shadow-lg shadow-primary/20">
        <span className="text-sm font-bold text-white">24</span>
      </div>
      {!compact && (
        <div className="leading-tight">
          <span className="text-sm font-semibold tracking-tight">TRADE24/7</span>
          <span className="ml-0.5 align-super text-[8px] text-muted-foreground">™</span>
        </div>
      )}
    </div>
  );
}
