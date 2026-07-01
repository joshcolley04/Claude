import type { Metadata } from "next";
import { getLatestNews } from "@/server/services/news";
import { PageHeader } from "@/components/layout/page-header";
import { NewsList } from "@/components/news/news-list";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "News" };

export default async function NewsPage() {
  const news = await getLatestNews();

  return (
    <div className="space-y-6">
      <PageHeader
        title="News Intelligence"
        description="Aggregated financial news with plain-English context on why each story matters."
      />
      <Card>
        <CardContent className="p-5">
          <NewsList items={news} />
        </CardContent>
      </Card>
    </div>
  );
}
