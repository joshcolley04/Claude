import type { Metadata } from "next";
import { getEconomicCalendar } from "@/server/services/news";
import { PageHeader } from "@/components/layout/page-header";
import { EconomicCalendar } from "@/components/calendar/economic-calendar";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Economic Calendar" };

export default async function CalendarPage() {
  const events = await getEconomicCalendar();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Economic Calendar"
        description="Rate decisions, inflation, GDP, employment and major events — with likely market impact."
      />
      <Card>
        <CardContent className="p-5">
          <EconomicCalendar events={events} />
        </CardContent>
      </Card>
    </div>
  );
}
