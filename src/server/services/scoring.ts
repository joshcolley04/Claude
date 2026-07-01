/**
 * Opportunity scoring — pure, dependency-free.
 *
 * Kept separate from `opportunities.ts` (which touches the database) so the
 * scanner and indicator paths stay free of persistence concerns and remain
 * easily unit-testable.
 */
import type { OpportunityScores } from "@/types/market";

/** Weighting used to roll component scores into the overall 0-100 score. */
export const SCORE_WEIGHTS: Record<keyof Omit<OpportunityScores, "overall">, number> = {
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
 * Used by both the scanner and the AI analyst so scores stay consistent.
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
