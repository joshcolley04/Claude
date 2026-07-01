import type { Opportunity, OpportunityScores } from "@/types/market";
import { mockOpportunities } from "./mock-data";

/** Weighting used to roll component scores into the overall 0-100 score. */
const SCORE_WEIGHTS: Record<keyof Omit<OpportunityScores, "overall">, number> = {
  technical: 0.18,
  fundamental: 0.16,
  momentum: 0.14,
  volume: 0.08,
  institutional: 0.12,
  sentiment: 0.08,
  macro: 0.1,
  liquidity: 0.06,
  risk: 0.08,
};

/**
 * Compute the overall opportunity score (0-100) from component scores.
 * Exposed so both the scanner and the AI analyst produce consistent scores.
 */
export function computeOverallScore(
  components: Omit<OpportunityScores, "overall">,
): number {
  const total = (Object.keys(SCORE_WEIGHTS) as (keyof typeof SCORE_WEIGHTS)[]).reduce(
    (sum, key) => sum + components[key] * SCORE_WEIGHTS[key],
    0,
  );
  return Math.round(total);
}

export async function getTopOpportunities(limit = 10): Promise<Opportunity[]> {
  // TODO(phase-2): pull ACTIVE opportunities from the DB / scanner.
  return [...mockOpportunities]
    .sort((a, b) => b.scores.overall - a.scores.overall)
    .slice(0, limit);
}

export async function getOpportunityById(
  id: string,
): Promise<Opportunity | null> {
  return mockOpportunities.find((o) => o.id === id) ?? null;
}
