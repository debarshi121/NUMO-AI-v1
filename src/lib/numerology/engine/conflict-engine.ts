import { getVehicleColorAnalysis } from "./color-engine";
import { PLANET_NAMES } from "./date-engine";
import { isEnemyOf } from "./relationship-utils";

/**
 * Checks a single report factor (vehicle number, purchase date, etc.) for a
 * direct planetary-enemy clash against the owner's Destiny or Birth number,
 * returning a ready-to-display sentence if one exists, or `null` if the
 * factor is clear. Destiny is checked first since it carries more weight
 * throughout the rest of the report.
 */
function describeFactorVsPersonConflict(
    factorLabel: string,
    factorNumber: number,
    birthNumber: number,
    destinyNumber: number,
    tailPhrase: string,
): string | null {
    const factorPlanet = PLANET_NAMES[factorNumber];

    // Destiny takes priority — it carries the same extra weight it does throughout the other analyses.
    if (isEnemyOf(destinyNumber, factorNumber)) {
        return `${factorLabel} carries ${factorPlanet} energy that clashes with your Destiny Number ${destinyNumber}'s ${PLANET_NAMES[destinyNumber]} path, ${tailPhrase}`;
    }
    if (isEnemyOf(birthNumber, factorNumber)) {
        return `${factorLabel} carries ${factorPlanet} energy that clashes with your Birth Number ${birthNumber}'s ${PLANET_NAMES[birthNumber]} nature, ${tailPhrase}`;
    }
    return null;
}

/**
 * Surfaces subtler numerology conflicts between the vehicle number, purchase
 * date, and color choice — including friction between those factors
 * themselves — that the dedicated vehicle/color/date analyses don't already
 * call out on their own.
 */
export function getHiddenConflicts(
    birthNumber: number,
    destinyNumber: number,
    vehicleNumerologyNumber: number,
    vehicleColor: string,
    purchaseDateNumerologyNumber: number,
    purchaseDate?: Date,
): string[] {
    const conflicts: string[] = [];

    const vehicleConflict = describeFactorVsPersonConflict(
        "Vehicle number",
        vehicleNumerologyNumber,
        birthNumber,
        destinyNumber,
        "creating subtle friction during day-to-day drives.",
    );
    if (vehicleConflict) conflicts.push(vehicleConflict);

    const purchaseDateConflict = describeFactorVsPersonConflict(
        "Purchase date",
        purchaseDateNumerologyNumber,
        birthNumber,
        destinyNumber,
        "a long-term dissonance that can affect resale value.",
    );
    if (purchaseDateConflict) conflicts.push(purchaseDateConflict);

    const colorAnalysis = getVehicleColorAnalysis(
        birthNumber,
        destinyNumber,
        vehicleColor,
    );
    if (colorAnalysis.status === "UNLUCKY") {
        conflicts.push(
            `Your current ${vehicleColor} color choice weakens emotional balance and may amplify stress during long commutes.`,
        );
    }

    // Friction between the vehicle number and purchase date themselves — invisible to any single-factor check.
    if (
        isEnemyOf(vehicleNumerologyNumber, purchaseDateNumerologyNumber) ||
        isEnemyOf(purchaseDateNumerologyNumber, vehicleNumerologyNumber)
    ) {
        conflicts.push(
            `Vehicle number and purchase timing amplify each other's ${PLANET_NAMES[vehicleNumerologyNumber]}-${PLANET_NAMES[purchaseDateNumerologyNumber]} friction, a clash invisible when looking at either factor alone.`,
        );
    }

    // Tuesday (Mars-ruled) purchases add a restless edge unless the owner's own numbers are Mars-friendly.
    if (purchaseDate && purchaseDate.getDay() === 2 && birthNumber !== 9) {
        conflicts.push(
            "Purchase falls on a Mars-ruled Tuesday, adding a restless, accident-prone edge that your Birth Number doesn't temper.",
        );
    }

    if (conflicts.length >= 2) {
        conflicts.push(
            "Stability vibration is reduced due to timing-number dissonance stacking across multiple factors.",
        );
    }

    return conflicts;
}
