import { planetaryRelationships } from "../data/relationships";

/**
 * How a target number relates to a subject number's ruling planet, per the
 * classical planetary friendship table in {@link planetaryRelationships}.
 */
export type RelationAlign = "friendly" | "neutral" | "enemy";

/**
 * General-purpose weighting for a {@link RelationAlign} verdict. Used as the
 * default scoring scale wherever a factor's friendliness should swing a
 * result by a small, symmetric amount; callers needing a different scale
 * (e.g. the heavier weekday or plate-total scores) define their own map
 * keyed by the same `RelationAlign` union instead of reusing this one.
 */
export const RELATION_SCORE: Record<RelationAlign, number> = {
  friendly: 2,
  neutral: 0,
  enemy: -2,
};

/**
 * Classifies how `targetNumber` relates to a subject's planetary relationship
 * table: friendly, neutral, or enemy. Any number not explicitly listed as
 * friendly or neutral is treated as an enemy, since the classical friendship
 * tables in {@link planetaryRelationships} are defined to always cover every
 * one of the other eight root numbers across the three buckets.
 */
export function relationAlign(
  relation: { friendly: number[]; neutral: number[]; enemy: number[] },
  targetNumber: number,
): RelationAlign {
  if (relation.friendly.includes(targetNumber)) return "friendly";
  if (relation.neutral.includes(targetNumber)) return "neutral";
  return "enemy";
}

/** True when `targetNumber` sits in `subjectNumber`'s planetary enemy list. */
export function isEnemyOf(subjectNumber: number, targetNumber: number): boolean {
  return (
    planetaryRelationships[subjectNumber.toString()]?.enemy.includes(
      targetNumber,
    ) ?? false
  );
}
