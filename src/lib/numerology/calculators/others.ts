import { divineData } from "../data/divine";
import { energyData } from "../data/energy";
import { planetaryRelationships } from "../data/relationships";
import { vehicleEnergy } from "../data/vehicleEnergy";
import type { VehicleColorMatchStatus } from "../engine/color-engine";
import {
  RELATION_SCORE,
  relationAlign,
  type RelationAlign,
} from "../engine/relationship-utils";

export type NewVehicleAlignmentResult = {
  title: string;
  text: string;
  birthTraits: string[];
  destinyTraits: string[];
};

export type OldVehicleAlignmentResult = {
  title: string;
  text: string;
};

/**
 * Builds the top-of-report profile for a customer who hasn't bought their
 * vehicle yet ("new vehicle" flow), purely from their Birth and Destiny
 * numbers — there's no plate, color, or purchase date to factor in yet.
 *
 * Looks up each number's static profile entry in {@link divineData} and
 * blends the birth number's core traits with the destiny number's broader
 * influences into a single narrative summary.
 */
export function getNewVehicleAlignment(
  birthNumber: number,
  destinyNumber: number,
): NewVehicleAlignmentResult {
  const birth =
    divineData.birthNumbers[
      String(birthNumber) as keyof typeof divineData.birthNumbers
    ];

  const destiny =
    divineData.destinyNumbers[
      String(destinyNumber) as keyof typeof divineData.destinyNumbers
    ];

  if (!birth || !destiny) {
    return {
      title: "Profile Not Found",
      text: "Unable to generate numerology profile.",
      birthTraits: [],
      destinyTraits: [],
    };
  }

  // Use first two birth traits in description
  const highlightedTraits = birth.traits.slice(0, 2).join(" and ");

  return {
    title: birth.coreEnergy,

    text: `Your numerology profile shows strong alignment toward ${birth.alignment}, with ${highlightedTraits} energies influencing your personality and long-term decisions.`,

    birthTraits: birth.traits,
    destinyTraits: destiny.influences,
  };
}

type OldVehicleAlignmentType =
  | "perfect"
  | "strong"
  | "balanced"
  | "mixed"
  | "conflict";

// Rahu (4) and Saturn (8) carry a traditional accident/delay caution for vehicles
// specifically, independent of personal friendliness — unless it's the owner's own
// Birth/Destiny number, in which case it's their own energy to carry. This mirrors
// the same "vehicle taboo" rule already used for plate recommendations elsewhere.
const VEHICLE_TABOO_NUMBERS = [4, 8];

function isVehicleTabooNumber(
  vehicleNumerologyNumber: number,
  birthNumber: number,
  destinyNumber: number,
): boolean {
  const isTaboo = VEHICLE_TABOO_NUMBERS.includes(vehicleNumerologyNumber);
  const isOwnNumber =
    vehicleNumerologyNumber === birthNumber ||
    vehicleNumerologyNumber === destinyNumber;
  return isTaboo && !isOwnNumber;
}

const COLOR_ALIGNMENT_SCORE: Record<VehicleColorMatchStatus, number> = {
  LUCKY: 1,
  BALANCED: 0,
  UNLUCKY: -3,
};

const CONFLICT_PENALTY_PER_ITEM = 2;
const MAX_CONFLICT_PENALTY = 6;

/**
 * Builds the top-of-report verdict for a customer who already owns their
 * vehicle ("old vehicle" flow), weighing the plate's vehicle number against
 * the owner's Birth/Destiny numbers alongside the color match and any hidden
 * cross-factor conflicts found elsewhere in the report.
 *
 * Scoring: start from the vehicle number's planetary friendliness to both
 * Birth and Destiny (via {@link RELATION_SCORE}), subtract a penalty when the
 * number is a Rahu/Saturn "vehicle taboo" the owner doesn't personally own,
 * then layer in the color-match score and a capped penalty for hidden
 * conflicts. The combined score is bucketed into one of five alignment tiers
 * (perfect/strong/balanced/mixed/conflict) that select the headline copy.
 */
export function getOldVehicleAlignment(
  birthNumber: number,
  destinyNumber: number,
  vehicleNumerologyNumber: number,
  colorMatchStatus: VehicleColorMatchStatus,
  hiddenConflictsCount: number,
): OldVehicleAlignmentResult {
  const birth = energyData[birthNumber as keyof typeof energyData];
  const destiny = energyData[destinyNumber as keyof typeof energyData];
  const vehicle =
    vehicleEnergy[vehicleNumerologyNumber as keyof typeof vehicleEnergy];
  const birthRel = planetaryRelationships[birthNumber.toString()];
  const destinyRel = planetaryRelationships[destinyNumber.toString()];

  if (!birth || !destiny || !vehicle || !birthRel || !destinyRel) {
    return {
      title: "Profile Not Found",
      text: "Unable to generate vehicle numerology profile.",
    };
  }

  const vehicleTraits = vehicle.slice(0, 3);
  const traitStr = vehicleTraits.slice(0, 2).join(" and ");

  const birthAlign = relationAlign(birthRel, vehicleNumerologyNumber);
  const destinyAlign = relationAlign(destinyRel, vehicleNumerologyNumber);

  const isTabooNumber = isVehicleTabooNumber(
    vehicleNumerologyNumber,
    birthNumber,
    destinyNumber,
  );

  const vehicleNumberScore =
    RELATION_SCORE[birthAlign] +
    RELATION_SCORE[destinyAlign] -
    (isTabooNumber ? 2 : 0);

  // The vehicle number is only one factor. A number that resonates perfectly with the
  // owner shouldn't be reported as flawless when the current color or hidden
  // cross-factor conflicts are actively working against them elsewhere in the report.
  const conflictPenalty = Math.min(
    hiddenConflictsCount * CONFLICT_PENALTY_PER_ITEM,
    MAX_CONFLICT_PENALTY,
  );
  const score =
    vehicleNumberScore +
    COLOR_ALIGNMENT_SCORE[colorMatchStatus] -
    conflictPenalty;

  const alignmentType: OldVehicleAlignmentType =
    score >= 5
      ? "perfect"
      : score >= 2
        ? "strong"
        : score >= -1
          ? "balanced"
          : score >= -5
            ? "mixed"
            : "conflict";

  let title: string;
  let baseText: string;
  let closingText: string;

  switch (alignmentType) {
    case "perfect":
      title = "Perfect Vehicle Alignment!";
      baseText = `Your vehicle number ${vehicleNumerologyNumber} radiates ${traitStr} energies in outstanding harmony with your Birth Number ${birthNumber}'s ${birth.traits[0]} nature and your Destiny Number ${destinyNumber}'s ${destiny.traits[0]} path.`;
      closingText = `This rare alignment amplifies your personal energy, bringing exceptional support to your finances, peace of mind, and long-term stability.`;
      break;
    case "strong":
      title = "Strong Vehicle Harmony!";
      baseText = `Your vehicle number ${vehicleNumerologyNumber} carries ${traitStr} energies that align well with your Birth Number ${birthNumber}'s ${birth.traits[0]} nature and your Destiny Number ${destinyNumber}'s ${destiny.traits[0]} path.`;
      closingText = `This vehicle largely supports your personal growth and stability, with only minor effort needed to unlock its full potential.`;
      break;
    case "balanced":
      title = "Balanced Vehicle Energy";
      baseText = `Your vehicle number ${vehicleNumerologyNumber} carries ${traitStr} energies that maintain a steady, balanced relationship with your Birth Number ${birthNumber}'s ${birth.traits[0]} nature and your Destiny Number ${destinyNumber}'s ${destiny.traits[0]} path.`;
      closingText = `This vehicle provides stable, consistent support without major amplification or conflict.`;
      break;
    case "mixed":
      title = "Mixed Vehicle Energies!";
      baseText = `Your vehicle number ${vehicleNumerologyNumber} carries ${traitStr} energies that create a push-pull dynamic with your Birth Number ${birthNumber}'s ${birth.traits[0]} nature and your Destiny Number ${destinyNumber}'s ${destiny.traits[0]} path.`;
      closingText = `Channel your vehicle's energy consciously — short-term friction can unlock meaningful long-term progress.`;
      break;
    default:
      title = "Energy Conflict Detected!";
      baseText = `Your vehicle number ${vehicleNumerologyNumber} carries ${traitStr} energies that conflict with your Birth Number ${birthNumber}'s ${birth.traits[0]} nature and create friction with your Destiny Number ${destinyNumber}'s ${destiny.traits[0]} path.`;
      closingText = `This misalignment may be creating subtle obstacles in finances, peace of mind, and long-term stability.`;
  }

  const tabooNote = isTabooNumber
    ? ` As a Number ${vehicleNumerologyNumber} (${vehicleNumerologyNumber === 4 ? "Rahu" : "Saturn"}) plate that isn't your own ruling number, it also carries a traditional caution for accident-proneness or bureaucratic delay.`
    : "";

  const hasOtherFriction = colorMatchStatus === "UNLUCKY" || hiddenConflictsCount > 0;
  const frictionNote = hasOtherFriction
    ? ` However, your current color choice or a hidden numerology conflict is tempering this vehicle number's natural resonance — see the Color Analysis and Hidden Conflict Detection sections below for specifics.`
    : "";

  return { title, text: `${baseText} ${closingText}${tabooNote}${frictionNote}` };
}

export type VehicleNumberMatchType = "PERFECT" | "GOOD" | "BALANCED" | "POOR";

export type VehicleNumberAnalysis = {
  compatibilityScore: number;
  description: string;
  traits: string[];
  matchType: VehicleNumberMatchType;
};

function getVehicleNumberMatchType(
  compatibilityScore: number,
): VehicleNumberMatchType {
  if (compatibilityScore >= 85) return "PERFECT";
  if (compatibilityScore >= 65) return "GOOD";
  if (compatibilityScore >= 45) return "BALANCED";
  return "POOR";
}

const VEHICLE_NUMBER_ALIGN_SCORE: Record<RelationAlign, number> = {
  friendly: 25,
  neutral: 5,
  enemy: -20,
};

const VEHICLE_TABOO_PENALTY = 15;

const RELATION_VERB_PHRASE: Record<RelationAlign, string> = {
  friendly: "resonates strongly with",
  neutral: "holds a steady, balanced connection with",
  enemy: "creates friction with",
};

function describeVehicleNumberAlignment(
  birthAlign: RelationAlign,
  destinyAlign: RelationAlign,
  traitPhrase: string,
): string {
  const bothPositive = birthAlign !== "enemy" && destinyAlign !== "enemy";
  const closing = bothPositive
    ? `amplifying ${traitPhrase} energy on the road`
    : `tempering its ${traitPhrase} energy with occasional obstacles on the road`;

  if (birthAlign === destinyAlign) {
    return `Your vehicle number ${RELATION_VERB_PHRASE[destinyAlign]} both your Destiny and Birth paths, ${closing}.`;
  }

  return `Your vehicle number ${RELATION_VERB_PHRASE[destinyAlign]} your Destiny path and ${RELATION_VERB_PHRASE[birthAlign]} your Birth path, ${closing}.`;
}

/**
 * Scores how well a vehicle's numerology number compatibility fits the
 * owner's Birth/Destiny numbers, for the dedicated "Vehicle Number Analysis"
 * report section.
 *
 * Scoring starts at a neutral 50 and applies the Destiny number's planetary
 * friendliness at full weight plus the Birth number's at 60% weight (the
 * same destiny-weighted-higher convention used across every score in this
 * app), adds a flat bonus when the vehicle number equals the owner's own
 * Birth or Destiny number (a classic auspicious omen), and subtracts a flat
 * penalty when the number is an unowned Rahu/Saturn "vehicle taboo". The
 * clamped 0-100 result is bucketed into a PERFECT/GOOD/BALANCED/POOR verdict.
 */
export function getVehicleNumberAnalysis(
  vehicleNumerologyNumber: number,
  birthNumber: number,
  destinyNumber: number,
): VehicleNumberAnalysis {
  const vehicle =
    vehicleEnergy[vehicleNumerologyNumber as keyof typeof vehicleEnergy];
  const birthRel = planetaryRelationships[birthNumber.toString()];
  const destinyRel = planetaryRelationships[destinyNumber.toString()];

  if (!vehicle || !birthRel || !destinyRel) {
    return {
      compatibilityScore: 50,
      description:
        "Unable to generate a full vehicle number analysis for this profile.",
      traits: [],
      matchType: "BALANCED",
    };
  }

  const birthAlign = relationAlign(birthRel, vehicleNumerologyNumber);
  const destinyAlign = relationAlign(destinyRel, vehicleNumerologyNumber);

  let score =
    50 +
    VEHICLE_NUMBER_ALIGN_SCORE[destinyAlign] +
    Math.round(VEHICLE_NUMBER_ALIGN_SCORE[birthAlign] * 0.6);

  // A vehicle number matching the owner's own Birth/Destiny number is a classic auspicious omen
  if (
    vehicleNumerologyNumber === destinyNumber ||
    vehicleNumerologyNumber === birthNumber
  ) {
    score += 10;
  }

  const isTabooNumber = isVehicleTabooNumber(
    vehicleNumerologyNumber,
    birthNumber,
    destinyNumber,
  );
  if (isTabooNumber) {
    score -= VEHICLE_TABOO_PENALTY;
  }

  const compatibilityScore = Math.max(0, Math.min(100, score));

  const traits = vehicle.slice(0, 4).map((trait) => trait.toUpperCase());
  const traitPhrase = vehicle.slice(0, 3).join(", ").toLowerCase();

  let description = describeVehicleNumberAlignment(
    birthAlign,
    destinyAlign,
    traitPhrase,
  );

  if (isTabooNumber) {
    const tabooPlanet = vehicleNumerologyNumber === 4 ? "Rahu" : "Saturn";
    description += ` As a Number ${vehicleNumerologyNumber} (${tabooPlanet}) plate that isn't your own ruling number, it also carries a traditional caution for accident-proneness or bureaucratic delay.`;
  }

  const matchType = getVehicleNumberMatchType(compatibilityScore);

  return { compatibilityScore, description, traits, matchType };
}

/**
 * Describes the *kind* of vehicle that suits a customer's numerology
 * profile, for the "new vehicle" flow's vehicle-profile card.
 *
 * Classifies the Birth/Destiny relationship into four narrative tiers —
 * exact match ("Exceptional"), friendly ("Strong"), neutral ("Steady"), or
 * enemy ("Dynamic") — each pairing a headline prefix with descriptive text,
 * then weaves in both numbers' keyword/trait data from {@link energyData} to
 * produce a title and description unique to this Birth/Destiny combination.
 */
export function getVehicleProfile(birthNumber: number, destinyNumber: number) {
  const birth = energyData[birthNumber as keyof typeof energyData];
  const destiny = energyData[destinyNumber as keyof typeof energyData];
  const relationships = planetaryRelationships[birthNumber.toString()];

  let prefix = "Balanced"; // Default
  let dynamicText = "balanced decision making";

  // Tier 0: Exact Match — Birth and Destiny numbers are identical, a "double energy"
  // alignment that classical numerology treats as stronger than mere friendliness.
  if (birthNumber === destinyNumber) {
    prefix = "Exceptional";
    dynamicText = "a single, amplified purpose";
  }
  // Tier 1: Friendly Alignment
  else if (relationships.friendly.includes(destinyNumber)) {
    prefix = "Strong";
    dynamicText = "natural harmony and ease";
  }
  // Tier 2: Neutral Alignment
  else if (relationships.neutral.includes(destinyNumber)) {
    prefix = "Steady";
    dynamicText = "consistent growth and effort";
  }
  // Tier 3: Enemy/Challenging Alignment
  else if (relationships.enemy.includes(destinyNumber)) {
    prefix = "Dynamic"; // Using 'Dynamic' instead of 'Growth' for a better UI feel
    dynamicText = "overcoming challenges through awareness";
  }

  // Title: e.g., "Strong Prosperity + Stability Alignment"
  const rawTitle = `${prefix} ${destiny.traits[0]} + ${birth.traits[0]} Alignment`;
  const title = rawTitle
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const article = /^[aeiou]/i.test(prefix) ? "an" : "a";
  const vehicleRepresents =
    birthNumber === destinyNumber
      ? birth.keywords[0].toLowerCase()
      : `both ${birth.keywords[0].toLowerCase()} and ${destiny.keywords[0].toLowerCase()}`;

  // Description
  const text = `Your numerology profile indicates ${article} ${prefix.toLowerCase()} alignment toward ${destiny.traits[0]}, ${birth.traits[1]}, and ${dynamicText}. The synergy between your #${birthNumber} Birth and #${destinyNumber} Destiny numbers suggests a vehicle that represents ${vehicleRepresents}.`;

  return {
    title,
    text: text.charAt(0).toUpperCase() + text.slice(1),
  };
}
