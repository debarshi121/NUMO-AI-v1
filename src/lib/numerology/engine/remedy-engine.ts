import { getVehicleNumberAnalysis } from "../calculators/others";
import { getHiddenConflicts } from "./conflict-engine";
import { getLuckyVehicleColors, getVehicleColorAnalysis } from "./color-engine";
import { PLANET_NAMES, getPurchaseDateAnalysis } from "./date-engine";
import { isEnemyOf } from "./relationship-utils";

export type RecommendedRemedy = {
    icon: string;
    text: string;
};

// Classical Vedic "Navaratna" gemstone associated with each ruling planet
const PLANET_GEMSTONES: Record<number, string> = {
    1: "Ruby", 2: "Pearl", 3: "Yellow Sapphire", 4: "Hessonite (Gomed)",
    5: "Emerald", 6: "Diamond", 7: "Cat's Eye", 8: "Blue Sapphire", 9: "Red Coral",
};

// Classical planetary weekday rulership; Rahu (4) and Ketu (7) are shadow points with no dedicated day
const PLANET_WEEKDAYS: Partial<Record<number, string>> = {
    1: "Sundays", 2: "Mondays", 3: "Thursdays", 5: "Wednesdays",
    6: "Fridays", 8: "Saturdays", 9: "Tuesdays",
};

/**
 * Recommends numerology remedies when the vehicle number, purchase date, or
 * color energy mismatches the owner's birth/destiny numbers. Returns an
 * empty array once everything is already in harmony.
 */
export function getRecommendedRemedies(
    birthNumber: number,
    destinyNumber: number,
    vehicleNumerologyNumber: number,
    vehicleColor: string,
    purchaseDateNumerologyNumber: number,
    purchaseDate: Date,
): RecommendedRemedy[] {
    const remedies: RecommendedRemedy[] = [];

    const { matchType: vehicleMatchType } = getVehicleNumberAnalysis(
        vehicleNumerologyNumber,
        birthNumber,
        destinyNumber,
    );
    const { status: colorStatus } = getVehicleColorAnalysis(
        birthNumber,
        destinyNumber,
        vehicleColor,
    );
    const { status: dateStatus } = getPurchaseDateAnalysis(
        purchaseDate,
        birthNumber,
        destinyNumber,
    );
    const hiddenConflicts = getHiddenConflicts(
        birthNumber,
        destinyNumber,
        vehicleNumerologyNumber,
        vehicleColor,
        purchaseDateNumerologyNumber,
        purchaseDate,
    );

    // Vehicle number clash: the classical Vedic remedy is the gemstone of whichever of the
    // owner's own numbers is actually afflicted — destiny takes priority, matching the
    // weighting used throughout the rest of the report — falling back to the birth number's
    // stone when the "POOR" verdict comes from the vehicle-taboo caution rather than a
    // direct enemy relation.
    if (vehicleMatchType === "POOR") {
        const afflictedNumber = isEnemyOf(destinyNumber, vehicleNumerologyNumber)
            ? destinyNumber
            : isEnemyOf(birthNumber, vehicleNumerologyNumber)
                ? birthNumber
                : birthNumber;
        const gemstone = PLANET_GEMSTONES[afflictedNumber];
        const vehiclePlanet = PLANET_NAMES[vehicleNumerologyNumber];
        remedies.push({
            icon: "diamond",
            text: `Your registration number carries ${vehiclePlanet} energy that doesn't sit well with your own numbers. Keeping a small ${gemstone} (or a clear quartz crystal, if that's easier to find) somewhere in the car — like the glovebox or dashboard — helps soften that clash.`,
        });
    }

    // Purchase date clash: avoid driving on the weekday ruled by the conflicting planet.
    if (dateStatus === "CONFLICT") {
        const conflictPlanet = PLANET_NAMES[purchaseDateNumerologyNumber];
        const weekday = PLANET_WEEKDAYS[purchaseDateNumerologyNumber];
        remedies.push({
            icon: "event_busy",
            text: weekday
                ? `The date you bought this vehicle carries ${conflictPlanet} energy, which doesn't blend well with your numbers. Try to avoid scheduling long drives or big trips on ${weekday}, when this clash tends to show up most.`
                : "The date you bought this vehicle carries an energy that doesn't blend well with your numbers. Rather than one specific day to avoid, just stay a little extra cautious on long drives or important trips involving this vehicle.",
        });
    }

    // Color clash: surface the birth number's actual lucky color instead of a generic suggestion.
    if (colorStatus === "UNLUCKY") {
        const { recommended } = getLuckyVehicleColors(birthNumber, destinyNumber);
        const luckyColor = recommended[0]?.color ?? "White";
        remedies.push({
            icon: "auto_fix_high",
            text: `Your car's current color doesn't sit well with your personal numbers. Adding small ${luckyColor} touches inside the cabin — like a seat cover, steering wheel cover, or air freshener — helps bring the car's energy more in line with yours.`,
        });
    }

    // General anchor remedy: only worth suggesting once something is actually off.
    if (remedies.length > 0 || hiddenConflicts.length > 0) {
        remedies.push({
            icon: "key",
            text: `A few things about this vehicle don't naturally match your numbers. Carrying a small reminder of your own number, ${birthNumber} — like a keychain, charm, or sticker — keeps your personal energy present every time you drive.`,
        });
    }

    return remedies;
}
