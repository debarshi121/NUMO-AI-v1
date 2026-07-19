// Import color recommendations data for numerology-based color selection
import { vehicleColorRecommendations } from "../data/colors";

// Represents a color recommendation with its score, category, and explanation
export type LuckyColor = {
  color: string; // The color name (e.g., "Red")
  score: number; // Priority score for the recommendation
  category: "primary" | "secondary"; // Type of match
  hex: string; // Hex code for the color
  reason: string; // Explanation for the recommendation
};

export type AvoidColor = {
  color: string; // The color name (e.g., "Red")
  hex: string; // Hex code for the color
  reason: string; // Explanation for the recommendation
};

// The result of the lucky color calculation
export type LuckyColorsResult = {
  recommended: LuckyColor[]; // List of recommended colors with details
  avoid: AvoidColor[]; // Colors to avoid based on destiny/birth numbers
};

/**
 * Returns recommended and avoided vehicle colors based on numerology birth and destiny numbers.
 *
 * "Recommended" is deliberately generous — any color either number's own guidance calls a
 * primary/secondary pick, scored destiny-first (60% birth weight), so a color special to just
 * one of the two numbers still surfaces. "Avoid" is deliberately stricter: a color only earns
 * that label if {@link getVehicleColorAnalysis}'s destiny-weighted formula — the same one used
 * to judge an already-owned color elsewhere in the report — actually calls it UNLUCKY for this
 * pair, so a color one number personally dislikes but the other (full-weight) number loves
 * isn't flagged here while the Color Match analysis calls that very color "BALANCED".
 * @param birthNumber - The user's birth number (1-9)
 * @param destinyNumber - The user's destiny number (1-9)
 * @returns LuckyColorsResult with recommendations and explanations
 */
export function getLuckyVehicleColors(
  birthNumber: number,
  destinyNumber: number,
): LuckyColorsResult {
  // Get color recommendation objects for birth and destiny numbers
  const birth =
    vehicleColorRecommendations[
      String(birthNumber) as keyof typeof vehicleColorRecommendations
    ];

  const destiny =
    vehicleColorRecommendations[
      String(destinyNumber) as keyof typeof vehicleColorRecommendations
    ];

  // If either number is invalid, return empty recommendations
  if (!birth || !destiny) {
    return {
      recommended: [],
      avoid: [],
    };
  }

  // A color only earns a spot on "avoid" if the SAME destiny-weighted formula
  // getVehicleColorAnalysis uses for an already-owned color (below) actually calls it
  // UNLUCKY — not merely because one number's own list personally dislikes it while the
  // OTHER, more heavily weighted number actually favors it as a primary/secondary pick.
  // A raw union of both numbers' avoid lists used to flag colors this list should
  // recommend, while the Color Match analysis called the very same color "BALANCED"
  // for the very same Birth/Destiny pair.
  const avoidCandidates = new Map<
    string,
    { color: string; hex: string; reason: string }
  >();
  [...birth.avoid, ...destiny.avoid].forEach((item) => {
    const key = item.color.toLowerCase();
    if (!avoidCandidates.has(key)) avoidCandidates.set(key, item);
  });

  const avoid = Array.from(avoidCandidates.values()).filter(
    (item) =>
      getVehicleColorAnalysis(birthNumber, destinyNumber, item.color).status ===
      "UNLUCKY",
  );
  const avoidSet = new Set(avoid.map((item) => item.color.toLowerCase()));

  // Collect every color EITHER number calls out as primary/secondary (and neither avoids).
  // The birth-only version of this used to silently drop colors that only appeared on the
  // destiny number's palette, even though destiny is weighted at least as heavily as birth
  // everywhere else in this report.
  type ColorTier = "primary" | "secondary";
  const TIER_POINTS: Record<ColorTier, number> = { primary: 30, secondary: 15 };

  const candidates = new Map<
    string,
    {
      color: string;
      hex: string;
      birthTier?: ColorTier;
      birthReason?: string;
      destinyTier?: ColorTier;
      destinyReason?: string;
    }
  >();

  const registerCandidates = (
    items: { color: string; hex: string; reason: string }[],
    tier: ColorTier,
    who: "birth" | "destiny",
  ) => {
    items.forEach((item) => {
      const key = item.color.toLowerCase();
      if (avoidSet.has(key)) return;
      const existing = candidates.get(key) ?? { color: item.color, hex: item.hex };
      const currentTier = who === "birth" ? existing.birthTier : existing.destinyTier;
      // Some numbers list the same color in both their primary and secondary tiers
      // (distinct original shades collapsed onto one name) — never let a later
      // secondary-tier pass downgrade an already-registered primary one.
      if (!currentTier || TIER_POINTS[tier] >= TIER_POINTS[currentTier]) {
        if (who === "birth") {
          existing.birthTier = tier;
          existing.birthReason = item.reason;
        } else {
          existing.destinyTier = tier;
          existing.destinyReason = item.reason;
        }
      }
      candidates.set(key, existing);
    });
  };

  registerCandidates(birth.primary, "primary", "birth");
  registerCandidates(birth.secondary, "secondary", "birth");
  registerCandidates(destiny.primary, "primary", "destiny");
  registerCandidates(destiny.secondary, "secondary", "destiny");

  // Destiny weighted fully, birth at 0.6x — the same weighting used throughout the rest
  // of the report (vehicle number, purchase date, and color-match scoring).
  const recommendations: LuckyColor[] = Array.from(candidates.values()).map(
    (candidate) => {
      const birthPoints = candidate.birthTier ? TIER_POINTS[candidate.birthTier] : 0;
      const destinyPoints = candidate.destinyTier
        ? TIER_POINTS[candidate.destinyTier]
        : 0;
      const score = Math.round(destinyPoints + birthPoints * 0.6);
      const category: ColorTier =
        candidate.birthTier === "primary" || candidate.destinyTier === "primary"
          ? "primary"
          : "secondary";

      return {
        color: candidate.color,
        score,
        category,
        hex: candidate.hex,
        // Prefer the destiny number's own reason text when both numbers call out this color.
        reason: candidate.destinyReason ?? candidate.birthReason!,
      };
    },
  );

  // Sort recommendations by score (highest first)
  recommendations.sort((a, b) => b.score - a.score);

  return {
    recommended: recommendations,
    avoid,
  };
}

export type VehicleColorMatchStatus = "LUCKY" | "UNLUCKY" | "BALANCED";

export type VehicleColorAnalysis = {
  matchPercentage: number; // 0-100 alignment score for the chosen color
  reason: string; // Explanation for the match/conflict
  status: VehicleColorMatchStatus; // Overall verdict for the color
};

type ColorListCategory = "primary" | "secondary" | "avoid";

// How strongly each list category pulls the match score up or down
const COLOR_CATEGORY_SCORE: Record<ColorListCategory | "neutral", number> = {
  primary: 30,
  secondary: 15,
  neutral: 0,
  avoid: -35,
};

const COLOR_STATUS_LEAD_TEXT: Record<VehicleColorMatchStatus, string> = {
  LUCKY: "This color aligns with your birth number & destiny number vibration perfectly.",
  BALANCED:
    "This color holds a steady, balanced relationship with your birth number & destiny number vibrations.",
  UNLUCKY:
    "This color creates friction with your birth number & destiny number vibrations.",
};

/**
 * Finds which list (primary/secondary/avoid) a color falls into for a given
 * number's recommendation entry, checked in that priority order. Returns
 * "neutral" with no reason when the color isn't called out at all.
 */
function findColorMatch(
  entry: (typeof vehicleColorRecommendations)[keyof typeof vehicleColorRecommendations],
  colorLower: string,
): { category: ColorListCategory | "neutral"; reason: string | null } {
  const categories: ColorListCategory[] = ["primary", "secondary", "avoid"];

  for (const category of categories) {
    const match = entry[category].find(
      (item) => item.color.toLowerCase() === colorLower,
    );
    if (match) {
      return { category, reason: match.reason };
    }
  }

  return { category: "neutral", reason: null };
}

/**
 * Scores how well a specific vehicle color matches the owner's birth and
 * destiny number vibrations, using the primary/secondary/avoid lists as
 * the source of truth for alignment.
 */
export function getVehicleColorAnalysis(
  birthNumber: number,
  destinyNumber: number,
  vehicleColor: string,
): VehicleColorAnalysis {
  const birth =
    vehicleColorRecommendations[
      String(birthNumber) as keyof typeof vehicleColorRecommendations
    ];
  const destiny =
    vehicleColorRecommendations[
      String(destinyNumber) as keyof typeof vehicleColorRecommendations
    ];

  if (!birth || !destiny) {
    return {
      matchPercentage: 50,
      status: "BALANCED",
      reason: "Unable to analyze this color against your numerology profile.",
    };
  }

  const colorLower = vehicleColor.toLowerCase();
  const birthMatch = findColorMatch(birth, colorLower);
  const destinyMatch = findColorMatch(destiny, colorLower);

  // Destiny carries the full weight; birth tempers it, mirroring getVehicleNumberAnalysis
  const score =
    50 +
    COLOR_CATEGORY_SCORE[destinyMatch.category] +
    Math.round(COLOR_CATEGORY_SCORE[birthMatch.category] * 0.6);

  const matchPercentage = Math.max(0, Math.min(100, score));

  const status: VehicleColorMatchStatus =
    matchPercentage <= 35
      ? "UNLUCKY"
      : matchPercentage >= 70
        ? "LUCKY"
        : "BALANCED";

  const specificReason = destinyMatch.reason ?? birthMatch.reason;

  const reason = specificReason
    ? `${COLOR_STATUS_LEAD_TEXT[status]} ${specificReason}`
    : `${COLOR_STATUS_LEAD_TEXT[status]} ${vehicleColor} isn't specifically called out for your Birth Number ${birthNumber} or Destiny Number ${destinyNumber}, so it neither strongly amplifies nor conflicts with your core vibration.`;

  return { matchPercentage, reason, status };
}

/**
 * Returns every unique color (by name) referenced across all numerology
 * color recommendation entries, regardless of number or category.
 */
export function getAllUniqueColors(): { color: string; hex: string }[] {
  const uniqueMap = new Map<string, { color: string; hex: string }>();

  Object.values(vehicleColorRecommendations).forEach((entry) => {
    [...entry.primary, ...entry.secondary, ...entry.avoid].forEach((item) => {
      const colorKey = item.color.toLowerCase();
      if (!uniqueMap.has(colorKey)) {
        uniqueMap.set(colorKey, { color: item.color, hex: item.hex });
      }
    });
  });

  return Array.from(uniqueMap.values());
}
