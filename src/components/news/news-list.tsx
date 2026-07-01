import { ExternalLink } from "lucide-react";
import type { NewsItem } from "@/types/market";
import { Badge } from "@/components/ui/badge";

function sentimentVariant(s: NewsItem["sentiment"]) {
  return s === "positive" ? "success" : s === "negative" ? "destructive" : "muted";
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export function NewsList({ items, showWhy = true }: { items: NewsItem[]; showWhy?: boolean }) {
  return (
    <ul className="space-y-4">
      {items.map((n) => (
        <li key={n.id} className="group">
          <a href={n.url} target="_blank" rel="noopener noreferrer" className="block">
            <div className="flex items-center gap-2">
              <Badge variant={sentimentVariant(n.sentiment)} className="capitalize">
                {n.category.replace("-", " ")}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {n.source} · {timeAgo(n.publishedAt)}
              </span>
            </div>
            <p className="mt-1.5 flex items-start gap-1 text-sm font-medium leading-snug group-hover:text-primary">
              {n.title}
              <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-60" />
            </p>
          </a>
          {showWhy && (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground/80">Why it matters: </span>
              {n.whyItMatters}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
