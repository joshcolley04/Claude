/**
 * Opportunity monitor.
 *
 * Runs the scanner, persists the batch, then notifies each opted-in user of the
 * high-conviction opportunities that meet THEIR configured minimum confidence
 * score. Records an Alert row per delivery so the in-app inbox stays in sync.
 *
 * Designed to be invoked on a schedule (see /api/scan). It is idempotent per
 * run: it only alerts on opportunities generated in the current scan.
 */
import { prisma } from "@/lib/prisma";
import type { Opportunity } from "@/types/market";
import { scanAndPersist } from "./opportunities";
import { sendOpportunityAlert } from "./whatsapp";

export interface MonitorReport {
  scanned: number;
  alertsSent: number;
  usersNotified: number;
}

export async function runMonitor(): Promise<MonitorReport> {
  const opportunities = await scanAndPersist();

  const users = await prisma.user.findMany({
    where: { settings: { whatsappEnabled: true } },
    select: {
      id: true,
      settings: { select: { minConfidenceScore: true } },
      notifications: {
        where: { channel: "whatsapp", active: true },
        select: { target: true },
      },
    },
  });

  let alertsSent = 0;
  let usersNotified = 0;

  for (const user of users) {
    const minConfidence = user.settings?.minConfidenceScore ?? 70;
    const qualifying = opportunities.filter((o) => o.confidence >= minConfidence);
    if (qualifying.length === 0) continue;

    const target = user.notifications[0]?.target; // undefined -> service uses default recipient
    let deliveredAny = false;

    for (const opp of qualifying) {
      const result = await sendOpportunityAlert(opp, target);
      await recordAlert(user.id, opp, result.ok);
      if (result.ok) {
        alertsSent += 1;
        deliveredAny = true;
      }
    }
    if (deliveredAny) usersNotified += 1;
  }

  return { scanned: opportunities.length, alertsSent, usersNotified };
}

async function recordAlert(
  userId: string,
  opp: Opportunity,
  delivered: boolean,
): Promise<void> {
  await prisma.alert.create({
    data: {
      userId,
      type: "OPPORTUNITY",
      title: `${opp.direction} ${opp.symbol} · score ${opp.scores.overall}`,
      message: opp.thesis,
      deliveredVia: delivered ? "whatsapp" : "in-app",
    },
  });
}
