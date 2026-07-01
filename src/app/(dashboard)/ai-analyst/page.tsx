import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { AnalystChat } from "@/components/ai/analyst-chat";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "AI Analyst" };

export default function AiAnalystPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Investment Analyst"
        description="Research companies, crypto, sectors, ETFs and macro. Every idea labels facts, analysis and assumptions — and never guarantees outcomes."
      >
        <Badge variant="muted">Educational · not advice</Badge>
      </PageHeader>
      <AnalystChat />
    </div>
  );
}
