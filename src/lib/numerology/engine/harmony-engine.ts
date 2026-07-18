export type VehicleHarmonyStatus = "Harmonious" | "Balanced" | "Mixed" | "Conflicted";

export type VehicleHarmonyBreakdown = {
    number: number;
    color: number;
    timing: number;
    stability: number;
};

export type VehicleHarmonyResult = {
    overallScore: number; // 0-100
    status: VehicleHarmonyStatus;
    breakdown: VehicleHarmonyBreakdown;
};

const STABILITY_PENALTY_PER_CONFLICT = 20;

/** Buckets the 0-100 overall harmony score into its display status label. */
function getHarmonyStatus(score: number): VehicleHarmonyStatus {
    if (score >= 85) return "Harmonious";
    if (score >= 65) return "Balanced";
    if (score >= 45) return "Mixed";
    return "Conflicted";
}

/**
 * Aggregates the vehicle number, color, and purchase-timing match scores
 * plus the hidden-conflict count into a single overall harmony score for
 * the report's summary dial.
 */
export function getOverallVehicleHarmony(
    vehicleCompatibilityScore: number,
    vehicleColorMatchPercentage: number,
    purchaseDateMatchPercentage: number,
    hiddenConflictsCount: number,
): VehicleHarmonyResult {
    const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

    const number = clamp(vehicleCompatibilityScore);
    const color = clamp(vehicleColorMatchPercentage);
    const timing = clamp(purchaseDateMatchPercentage);
    const stability = clamp(100 - hiddenConflictsCount * STABILITY_PENALTY_PER_CONFLICT);

    const overallScore = clamp((number + color + timing + stability) / 4);

    return {
        overallScore,
        status: getHarmonyStatus(overallScore),
        breakdown: { number, color, timing, stability },
    };
}
