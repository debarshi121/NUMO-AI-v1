import type { VehicleNumberMatchType } from "@/lib/numerology/calculators/others";
import type {
  AvoidColor,
  LuckyColor,
  VehicleColorMatchStatus,
} from "@/lib/numerology/engine/color-engine";
import type {
  PurchaseDateAnalysisStatus,
  RecommendedDate,
} from "@/lib/numerology/engine/date-engine";
import type {
  VehicleHarmonyBreakdown,
  VehicleHarmonyStatus,
} from "@/lib/numerology/engine/harmony-engine";

// Bump whenever generateNewVehicleReportData's shape or scoring changes in a way
// that requires previously-cached reports to be regenerated rather than reused.
export const NEW_VEHICLE_REPORT_SCHEMA_VERSION = 6;

export type TNewVehicleReportData = {
  reportId: string;
  reportSchemaVersion: number;
  birthNumber: number;
  destinyNumber: number;
  buyingPreferenceMonth: number;
  userName: string;
  createdAt: Date;
  recommendedColors: LuckyColor[];
  avoidColors: AvoidColor[];
  vehicleProfileTitle: string;
  vehicleProfileText: string;
  recommendedTotals: number[];
  avoidPatterns: string[];
  recommendedDates: RecommendedDate[];
  recommendedDatesNote: string | null; // Set when the preferred month itself had few/no strong matches
  aiAnalysis?: string; // Optional field for storing AI analysis
};

// Bump whenever generateOldVehicleReportData's shape or scoring changes in a way
// that requires previously-cached reports to be regenerated rather than reused.
export const OLD_VEHICLE_REPORT_SCHEMA_VERSION = 4;

export type TOldVehicleReportData = {
  reportId: string;
  reportSchemaVersion: number;
  vehicleRegNumber: string;
  vehicleColor: string;
  birthNumber: number;
  destinyNumber: number;
  userName: string;
  createdAt: Date;
  vehicleNumerologyNumber: number;
  purchaseDate: Date;
  purchaseDateNumerologyNumber: number;
  vehicleProfileTitle: string;
  vehicleProfileText: string;
  vehicleCompatibilityScore: number;
  vehicleAnalysisDescription: string;
  vehicleAnalysisTraits: string[];
  vehicleAnalysisMatchType: VehicleNumberMatchType;
  vehicleColorMatchPercentage: number;
  vehicleColorMatchReason: string;
  vehicleColorMatchStatus: VehicleColorMatchStatus;
  purchaseDayEnergy: number;
  purchaseDateStatus: PurchaseDateAnalysisStatus;
  purchaseDateTitle: string;
  purchaseDateDescription: string;
  conflicts: string[];
  remedies: { icon: string; text: string }[];
  vehicleHarmonyScore: number;
  vehicleHarmonyStatus: VehicleHarmonyStatus;
  vehicleHarmonyBreakdown: VehicleHarmonyBreakdown;
  aiAnalysis?: string; // Optional field for storing AI analysis
};
