import { reduceDigits } from "../calculators/numerology";
import { planetaryRelationships } from "../data/relationships";


/**
 * Ranks the registration-plate totals (1-9) a customer should look for when
 * choosing a new plate, best-first, for the "recommended totals" pill list.
 *
 * Starts from every number friendly to the Birth Number, drops any that are
 * an enemy of the Destiny Number (the "road" shouldn't fight the "driver"),
 * and drops the Rahu/Saturn vehicle taboos (4, 8) unless the owner's own
 * Birth or Destiny number is that taboo number. The survivors are then
 * ranked with the owner's own Birth/Destiny number first, followed by
 * numbers also friendly to the Destiny Number. Returns every surviving
 * candidate — callers slice to however many they want to display.
 */
export function getRecommendedTotals(birthNumber: number, destinyNumber: number): number[] {
    const birthRels = planetaryRelationships[birthNumber.toString()];
    const destinyRels = planetaryRelationships[destinyNumber.toString()];

    // 1. Start with numbers friendly to the Birth Number
    let candidates = [...birthRels.friendly];

    // 2. Filter out numbers that are ENEMIES to the Destiny Number
    // We don't want the "Road" to fight the "Driver"
    candidates = candidates.filter(num => !destinyRels.enemy.includes(num));

    // 3. Apply the "Vehicle Taboo" Filter
    // Most people avoid 4 and 8 for vehicles due to accident/delay risk.
    // However, if the user's own Birth or Destiny number is that taboo number,
    // they can handle that energy.
    const vehicleTaboos = [4, 8];
    candidates = candidates.filter(num => {
        if (vehicleTaboos.includes(num)) {
            return birthNumber === num || destinyNumber === num;
        }
        return true;
    });

    // 4. Ranking System
    // Matching the owner's own Birth/Destiny number outranks everything else — a
    // classic auspicious omen — then we prioritize numbers friendly to BOTH Birth and Destiny.
    const ranked = candidates.sort((a, b) => {
        const aIsOwnNumber = a === birthNumber || a === destinyNumber ? 1 : 0;
        const bIsOwnNumber = b === birthNumber || b === destinyNumber ? 1 : 0;
        if (aIsOwnNumber !== bIsOwnNumber) return bIsOwnNumber - aIsOwnNumber;

        const aIsDestinyFriendly = destinyRels.friendly.includes(a) ? 1 : 0;
        const bIsDestinyFriendly = destinyRels.friendly.includes(b) ? 1 : 0;
        return bIsDestinyFriendly - aIsDestinyFriendly;
    });

    // Return every surviving candidate, best-first; the UI decides how many pills to show
    return ranked;
}

export type CompatibilityResult = {
    runningNumber: number;
    status: "STRONG MATCH" | "GOOD MATCH" | "AVERAGE" | "WEAK MATCH";
    title: string; // Dynamic Header: "Why this matches"
    description: string;
    suggestion: string; // Optional suggestion for improvement
};

/**
 * Checks a specific candidate plate against the owner's numbers for the
 * "Compatibility Checker" tool, where the customer types in a plate they're
 * considering and gets an instant verdict.
 *
 * Reduces the plate's last four digits to a single vibration digit, then
 * classifies it as a STRONG match (equals the Birth Number), GOOD (friendly
 * to the Birth Number), NEUTRAL (neither friendly nor an enemy), or WEAK
 * (an enemy of the Birth Number) — before applying a "Destiny veto" that
 * downgrades an otherwise-good result to WEAK if the vibration conflicts
 * with the Destiny Number, since the life path takes precedence over
 * surface-level personality friendliness.
 */
export function calculateVehicleCompatibility(
    plate: string,
    birthNumber: number,
    destinyNumber: number
): CompatibilityResult {
    // 1. Extract and calculate Vibration
    const digitsOnly = plate.replace(/\D/g, "");
    const lastFour = digitsOnly.slice(-4);
    const runningSum = lastFour.split("").reduce((acc, digit) => acc + parseInt(digit), 0);
    const vibration = reduceDigits(runningSum);

    const rels = planetaryRelationships[birthNumber.toString()];
    const destinyRels = planetaryRelationships[destinyNumber.toString()];

    // 2. Response Configuration Map
    const responseMap = {
        STRONG: {
            title: "Exceptional Synergy",
            status: "STRONG MATCH" as const,
            desc: `The vibration of ${vibration} perfectly mirrors your Birth Number. This creates a powerful resonance where the vehicle feels like a natural extension of your own energy.`,
            suggestion: "This plate is an excellent choice! Embrace the connection and enjoy the harmonious journeys ahead."
        },
        GOOD: {
            title: "Auspicious Alignment",
            status: "GOOD MATCH" as const,
            desc: `This number is highly compatible with your profile. It promotes a harmonious flow of energy, making your journeys smoother and more supportive.`,
            suggestion: "This plate is a solid choice that can enhance your driving experience. Consider it a good companion for your travels."
        },
        NEUTRAL: {
            title: "Balanced Influence",
            status: "AVERAGE" as const,
            desc: `This number has a stable, neutral vibration. While it doesn't offer a direct personal boost, it doesn't conflict with your core path either.`,
            suggestion: "This plate is a safe choice that won't cause friction, but it may not provide the extra harmony or support that more compatible numbers could offer."
        },
        WEAK: {
            title: "Vibrational Conflict",
            status: "WEAK MATCH" as const,
            desc: `This vehicle number doesn't optimally align with your numerology profile. Such a gap can lead to minor hurdles or a lack of connection with the machine.`,
            suggestion: "Consider choosing a plate with a more compatible vibration to enhance your driving experience."
        }
    };

    type CompatibilityResponse = (typeof responseMap)[keyof typeof responseMap];
    let result: CompatibilityResponse = responseMap.NEUTRAL;

    // 3. Evaluation Logic
    if (vibration === birthNumber) {
        result = responseMap.STRONG;
    } else if (rels.friendly.includes(vibration)) {
        result = responseMap.GOOD;
    } else if (rels.enemy.includes(vibration)) {
        result = responseMap.WEAK;
    }

    // 4. Destiny Veto Logic (Downgrades if it conflicts with the life path)
    if (result.status !== "WEAK MATCH" && destinyRels.enemy.includes(vibration)) {
        result = {
            ...responseMap.WEAK,
            title: "Path Misalignment",
            desc: `While friendly to your birth number, this total conflicts with your Destiny path, which may lead to unexpected external hurdles.`,
            suggestion: "Consider choosing a plate with a vibration that supports both your Birth and Destiny numbers for optimal harmony."
        };
    }

    return {
        runningNumber: vibration,
        status: result.status,
        title: result.title,
        description: result.desc,
        suggestion: result.suggestion
    };
}


/**
 * Logic to determine which vehicle final numbers a user should stay away from.
 * Combines Universal Taboos, Birth Conflicts, and Destiny Path blocks.
 */
export function getAvoidPatterns(birthNumber: number, destinyNumber: number): string[] {
    const patterns: string[] = [];

    // 1. Check for Universal Taboos (4: Rahu, 8: Saturn)
    // Exempt only the SPECIFIC taboo number that matches the user's own Birth/Destiny —
    // e.g. a Birth Number 4 owner is still cautioned against 8, not blanket-exempted from both.
    const unprotectedTaboos = [4, 8].filter(
        (taboo) => birthNumber !== taboo && destinyNumber !== taboo,
    );

    if (unprotectedTaboos.length > 0) {
        patterns.push(`Avoid final number reducing to ${unprotectedTaboos.join(" or ")}`);
    }

    // 2. Fetch Planetary Enemies (using string keys for the Record)
    const birthEnemies = planetaryRelationships[birthNumber.toString()].enemy;
    const destinyEnemies = planetaryRelationships[destinyNumber.toString()].enemy;

    // 3. Filter Birth Enemies
    // Exclude 4 and 8 to avoid redundancy with the universal rule.
    const specificBirthEnemies = birthEnemies.filter(n => n !== 4 && n !== 8);
    if (specificBirthEnemies.length > 0) {
        const numbers = specificBirthEnemies.join(", ");
        patterns.push(`Avoid final number ${numbers} (Clashes with Birth Number)`);
    }

    // 4. Filter Destiny Enemies
    // Exclude 4, 8, and anything already mentioned in the Birth enemies.
    const uniqueDestinyEnemies = destinyEnemies.filter(
        n => n !== 4 && n !== 8 && !specificBirthEnemies.includes(n)
    );
    if (uniqueDestinyEnemies.length > 0) {
        const numbers = uniqueDestinyEnemies.join(", ");
        patterns.push(`Avoid final number ${numbers} (Conflicts with Destiny path)`);
    }

    // 5. Structural/Symbolic Advice
    patterns.push("Avoid descending patterns (e.g., 9876) or excessive zeros");

    return patterns;
}