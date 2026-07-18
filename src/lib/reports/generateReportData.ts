import {
  calculateBirthNumber,
  calculateDestinyNumber,
  calculateVehicleNumerologyNumber,
} from "@/lib/numerology/calculators/numerology";
import {
  getLuckyVehicleColors,
  getVehicleColorAnalysis,
} from "@/lib/numerology/engine/color-engine";
import {
  getOldVehicleAlignment,
  getVehicleNumberAnalysis,
  getVehicleProfile,
} from "@/lib/numerology/calculators/others";
import {
  getAvoidPatterns,
  getRecommendedTotals,
} from "@/lib/numerology/engine/number-engine";
import {
  getPurchaseDateAnalysis,
  getRecommendedDates,
} from "@/lib/numerology/engine/date-engine";
import { getHiddenConflicts } from "@/lib/numerology/engine/conflict-engine";
import { getRecommendedRemedies } from "@/lib/numerology/engine/remedy-engine";
import { getOverallVehicleHarmony } from "@/lib/numerology/engine/harmony-engine";
import {
  NEW_VEHICLE_REPORT_SCHEMA_VERSION,
  OLD_VEHICLE_REPORT_SCHEMA_VERSION,
  TNewVehicleReportData,
} from "@/types/vehicleReport";

export function generateNewVehicleReportData({
  reportId,
  dob,
  buyingPreferenceMonth,
  userName,
  createdAt,
}: {
  reportId: string;
  dob: Date;
  buyingPreferenceMonth: number;
  userName: string;
  createdAt: Date;
}): TNewVehicleReportData {
  // Calculate birth and destiny numbers
  const birthNumber = calculateBirthNumber(new Date(dob));
  const destinyNumber = calculateDestinyNumber(new Date(dob));
  const recommendedTotals = getRecommendedTotals(birthNumber, destinyNumber);
  const avoidPatterns = getAvoidPatterns(birthNumber, destinyNumber);
  const { title: vehicleProfileTitle, text: vehicleProfileText } =
    getVehicleProfile(birthNumber, destinyNumber);
  const { recommended: recommendedColors, avoid: avoidColors } =
    getLuckyVehicleColors(birthNumber, destinyNumber);
  const preferredMonth = buyingPreferenceMonth
    .toString()
    .padStart(2, "0")
    .slice(-2); // Extract month from YYYYMM format
  const {
    dates: recommendedDates,
    preferredMonthMatchCount,
    preferredMonthLabel,
    usingBestAvailable,
  } = getRecommendedDates(birthNumber, destinyNumber, parseInt(preferredMonth, 10));

  // Let the customer know when their preferred month itself didn't offer many
  // strong-match dates, so the surrounding-month results shown don't look unexplained.
  let recommendedDatesNote: string | null = null;
  if (usingBestAvailable) {
    recommendedDatesNote = `Your Birth and Destiny numbers create a naturally particular timing window — we couldn't find a strongly favorable date within the next year, so these are the closest available options.`;
  } else if (preferredMonthMatchCount === 0) {
    recommendedDatesNote = `We couldn't find any strong-match dates in ${preferredMonthLabel} for your profile, so we've included the best available dates from nearby months instead.`;
  } else if (preferredMonthMatchCount <= 2) {
    recommendedDatesNote = `Only ${preferredMonthMatchCount === 1 ? "one strong-match date was" : `${preferredMonthMatchCount} strong-match dates were`} found in ${preferredMonthLabel}, so we've added the best dates from nearby months too.`;
  }

  return {
    reportId,
    reportSchemaVersion: NEW_VEHICLE_REPORT_SCHEMA_VERSION,
    birthNumber,
    destinyNumber,
    recommendedColors,
    avoidColors,
    vehicleProfileTitle,
    vehicleProfileText,
    recommendedTotals,
    avoidPatterns,
    userName,
    createdAt,
    buyingPreferenceMonth,
    recommendedDates,
    recommendedDatesNote,
  };
}

export const generateOldVehicleReportData = ({
  reportId,
  dob,
  userName,
  createdAt,
  purchaseDate,
  vehicleRegNumber,
  vehicleColor,
}: {
  reportId: string;
  dob: Date;
  userName: string;
  createdAt: Date;
  purchaseDate: Date;
  vehicleRegNumber: string;
  vehicleColor: string;
}) => {
  // Calculate birth and destiny numbers
  const birthNumber = calculateBirthNumber(new Date(dob));
  const destinyNumber = calculateDestinyNumber(new Date(dob));
  const vehicleNumerologyNumber =
    calculateVehicleNumerologyNumber(vehicleRegNumber);
  const purchaseDateNumerologyNumber = calculateDestinyNumber(
    new Date(purchaseDate),
  );
  const {
    compatibilityScore: vehicleCompatibilityScore,
    description: vehicleAnalysisDescription,
    traits: vehicleAnalysisTraits,
    matchType: vehicleAnalysisMatchType,
  } = getVehicleNumberAnalysis(
    vehicleNumerologyNumber,
    birthNumber,
    destinyNumber,
  );

  const { matchPercentage: vehicleColorMatchPercentage, reason: vehicleColorMatchReason, status: vehicleColorMatchStatus } = getVehicleColorAnalysis(
    birthNumber,
    destinyNumber,
    vehicleColor
  );

  const {
    dayEnergy: purchaseDayEnergy,
    matchPercentage: purchaseDateMatchPercentage,
    status: purchaseDateStatus,
    title: purchaseDateTitle,
    description: purchaseDateDescription,
  } = getPurchaseDateAnalysis(purchaseDate, birthNumber, destinyNumber);

  const conflicts = getHiddenConflicts(
    birthNumber,
    destinyNumber,
    vehicleNumerologyNumber,
    vehicleColor,
    purchaseDateNumerologyNumber,
    purchaseDate,
  );

  // Computed after color/conflict analysis so the profile verdict can't call the
  // vehicle number "perfect" while the color or hidden conflicts say otherwise.
  const { title: vehicleProfileTitle, text: vehicleProfileText } =
    getOldVehicleAlignment(
      birthNumber,
      destinyNumber,
      vehicleNumerologyNumber,
      vehicleColorMatchStatus,
      conflicts.length,
    );

  const remedies = getRecommendedRemedies(
    birthNumber,
    destinyNumber,
    vehicleNumerologyNumber,
    vehicleColor,
    purchaseDateNumerologyNumber,
    purchaseDate,
  );

  const {
    overallScore: vehicleHarmonyScore,
    status: vehicleHarmonyStatus,
    breakdown: vehicleHarmonyBreakdown,
  } = getOverallVehicleHarmony(
    vehicleCompatibilityScore,
    vehicleColorMatchPercentage,
    purchaseDateMatchPercentage,
    conflicts.length,
  );

  return {
    reportId,
    reportSchemaVersion: OLD_VEHICLE_REPORT_SCHEMA_VERSION,
    vehicleRegNumber,
    birthNumber,
    destinyNumber,
    vehicleNumerologyNumber,
    vehicleColor,
    purchaseDate,
    purchaseDateNumerologyNumber,
    vehicleProfileTitle,
    vehicleProfileText,
    vehicleCompatibilityScore,
    vehicleAnalysisDescription,
    vehicleAnalysisTraits,
    vehicleAnalysisMatchType,
    vehicleColorMatchPercentage,
    vehicleColorMatchReason,
    vehicleColorMatchStatus,
    purchaseDayEnergy,
    purchaseDateStatus,
    purchaseDateTitle,
    purchaseDateDescription,
    conflicts,
    remedies,
    vehicleHarmonyScore,
    vehicleHarmonyStatus,
    vehicleHarmonyBreakdown,
    userName,
    createdAt,
  };
};
