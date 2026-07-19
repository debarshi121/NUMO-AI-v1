import {
    calculateBirthNumber,
    calculateDestinyNumber,
    reduceDigits,
} from "../calculators/numerology";
import { planetaryRelationships } from "../data/relationships";
import {
    RELATION_SCORE,
    relationAlign,
    type RelationAlign,
} from "./relationship-utils";

export type RecommendedDate = {
    date: string;
    day: number;
    month: string;
    year: number;
    vibration: number;
    score: number;
    insight: string; // New: Tell the user WHY this date is good
    stars: number; // New: 1-5 star rating for quick visual reference
};

function formatLocalISODate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Classical planetary weekday rulership, keyed by JS Date#getDay() (0 = Sunday).
// Mirrors PLANET_NAMES below: Sunday=Sun(1), Monday=Moon(2), Tuesday=Mars(9),
// Wednesday=Mercury(5), Thursday=Jupiter(3), Friday=Venus(6), Saturday=Saturn(8).
const weekdayPlanets: Record<number, number> = {
    0: 1, 1: 2, 2: 9, 3: 5, 4: 3, 5: 6, 6: 8,
};

/**
 * Maps a {@link scoreDate} total (roughly 0-260) to a 1-5 star rating for
 * quick visual scanning in the recommended-dates list.
 *
 * Thresholds are tuned to the score's natural tiers: a 5-star date typically
 * requires the day vibration to match the Birth Number (100 pts) *and* the
 * weekday to mirror one of the owner's own numbers or align with both
 * (40-50 pts) *and* general friendship bonuses (up to 55 pts) all stacking
 * together, whereas 1 star is just barely clearing the viability bar.
 */
export function getStarRating(score: number): number {
    // Return 0 for scores below our compatibility threshold
    if (score < 70) return 0;

    // 5 Stars: Elite / Peak Energy (Scores: 205 - 260)
    // Occurs when Birth Match, Weekday Match, and Universal Luck align.
    if (score >= 200) return 5;

    // 4 Stars: High Tier - Strong Alignment (Scores: 160 - 195)
    // Occurs with Birth Match and strong secondary support.
    if (score >= 160) return 4;

    // 3 Stars: Favorable Tier (Scores: 130 - 159)
    // Occurs with Birth Match or very high friendship synergy.
    if (score >= 130) return 3;

    // 2 Stars: Balanced Tier (Scores: 100 - 129)
    // Strong friendship synergy without an exact birth match.
    if (score >= 100) return 2;

    // 1 Star: Standard Tier (Scores: 70 - 99)
    // Minimum safe threshold for a purchase.
    return 1;
}

/**
 * Scores a single candidate date for the "best dates to buy" recommendation
 * list, combining the day-of-month vibration with the weekday's ruling
 * planet. See the RULE 1-4 comments inline for the full point breakdown;
 * in short, the day vibration is the primary, veto-capable factor while the
 * weekday planet only ever nudges the score up or down.
 */
function scoreDate(
    vibration: number,
    currentDate: Date,
    birthNumber: number,
    destinyNumber: number
): { score: number; insight: string } {
    const rels = planetaryRelationships[birthNumber.toString()];
    const destinyRels = planetaryRelationships[destinyNumber.toString()];
    const weekdayPlanet = weekdayPlanets[currentDate.getDay()];

    const vibrationBirthAlign = relationAlign(rels, vibration);
    const vibrationDestinyAlign = relationAlign(destinyRels, vibration);
    const weekdayBirthAlign = relationAlign(rels, weekdayPlanet);
    const weekdayDestinyAlign = relationAlign(destinyRels, weekdayPlanet);

    // RULE 1: STRICT VETO — reserved for the day-of-month vibration, the primary,
    // category-defining factor (mirroring getPurchaseDateAnalysis below). The weekday's
    // ruling planet is only a secondary, muhurta-style factor (RULE 3) and is scored,
    // not vetoed — an absolute weekday veto compounds with the vibration veto and can
    // leave adversarial Birth/Destiny pairs with zero viable dates in any given year.
    if (vibrationBirthAlign === "enemy" || vibrationDestinyAlign === "enemy") {
        return { score: 0, insight: "Avoid: Conflicting planetary vibrations." };
    }

    let score = 0;
    const insights: string[] = [];

    // RULE 2: BIRTH & DESTINY VIBRATION MATCHING
    if (vibration === birthNumber) {
        score += 100;
        insights.push("Perfectly mirrors your personal energy.");
    }
    if (vibration === destinyNumber) {
        score += 30;
        insights.push("Aligns with your destiny path.");
    }

    // RULE 3: WEEKDAY'S RULING PLANET — scored purely by its relationship to THIS
    // person's own numbers, exactly like the day vibration above. A Venus (Friday) or
    // Jupiter (Thursday) date only helps if Venus/Jupiter is actually friendly to this
    // person; a Mars (Tuesday) date only hurts if Mars is actually their enemy — and even
    // then it's a penalty, not a disqualifier, since the day-of-month energy dominates.
    if (weekdayPlanet === birthNumber || weekdayPlanet === destinyNumber) {
        score += 50;
        insights.push(`${PLANET_NAMES[weekdayPlanet]}'s day mirrors your own ruling energy.`);
    } else if (weekdayBirthAlign === "friendly" && weekdayDestinyAlign === "friendly") {
        score += 40;
        insights.push(`${PLANET_NAMES[weekdayPlanet]}'s day supports both your Birth and Destiny paths.`);
    } else if (weekdayBirthAlign === "friendly" || weekdayDestinyAlign === "friendly") {
        score += 25;
        insights.push(`${PLANET_NAMES[weekdayPlanet]}'s day brings supportive energy.`);
    } else if (weekdayBirthAlign === "enemy" || weekdayDestinyAlign === "enemy") {
        score -= 35;
        insights.push(`${PLANET_NAMES[weekdayPlanet]}'s day adds some friction, though it doesn't rule out the date.`);
    }
    // Neutral weekday planets: no bonus, no penalty — genuinely inconsequential for this person.

    // RULE 4: VIBRATION FRIENDSHIP BONUSES
    if (vibrationBirthAlign === "friendly") score += 40;
    if (vibrationDestinyAlign === "friendly") score += 15;

    // Final Insight Construction
    const finalInsight = insights.length > 0
        ? insights.join(" ")
        : "Steady alignment for your path.";

    return { score, insight: finalInsight };
}

export type RecommendedDatesResult = {
    dates: RecommendedDate[];
    // How many score>=70 dates actually fell within the customer's own preferred month,
    // regardless of whether they made the final top-9 cut below.
    preferredMonthMatchCount: number;
    preferredMonthLabel: string;
    // True when no date in the scanned year cleared the score>=70 bar at all, so `dates`
    // falls back to the least-bad options instead of coming back empty. A small fraction
    // of Birth/Destiny pairings are naturally this particular about timing.
    usingBestAvailable: boolean;
};

const TARGET_DATE_COUNT = 9;

/**
 * Scans forward from today (starting at the customer's preferred month) to
 * find up to {@link TARGET_DATE_COUNT} of the best vehicle-purchase dates,
 * scoring every candidate day via {@link scoreDate}.
 *
 * Walks one calendar month at a time, filling the results with that month's
 * qualifying (score >= 70) dates, best first, before moving on to the next
 * month — so the preferred month is never crowded out by a later month's
 * higher-scoring dates. Falls back to the least-bad dates found across the
 * whole year-long scan if no date ever clears the qualifying bar.
 */
export function getRecommendedDates(
    birthNumber: number,
    destinyNumber: number,
    preferredMonth: number
): RecommendedDatesResult {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    const preferredYear = preferredMonth >= currentMonth ? currentYear : currentYear + 1;
    let month = preferredMonth;
    let year = preferredYear;

    const minimumDate = new Date();
    minimumDate.setDate(minimumDate.getDate() + 3);

    const dates: RecommendedDate[] = [];
    const allScored: RecommendedDate[] = [];
    let preferredMonthMatchCount = 0;
    let scannedMonths = 0;

    // Fill month-by-month, starting at the customer's preferred month: take that month's
    // own qualifying dates first, and only move on to the next month if it didn't have
    // enough. This keeps the preferred month front and center instead of letting a later
    // month's higher raw score crowd it out of the results.
    while (dates.length < TARGET_DATE_COUNT && scannedMonths < 12) {
        const daysInMonth = new Date(year, month, 0).getDate();
        const isPreferredMonth = month === preferredMonth && year === preferredYear;
        const monthCandidates: RecommendedDate[] = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month - 1, day);

            // Skip past dates and the +3 day buffer
            if (month === currentMonth && year === currentYear && currentDate < minimumDate) continue;

            const vibration = reduceDigits(day);
            const { score, insight } = scoreDate(vibration, currentDate, birthNumber, destinyNumber);

            // Skip vetoed/wash dates entirely — never worth surfacing even as a fallback.
            if (score <= 0) continue;

            const candidate: RecommendedDate = {
                // Keep `date` aligned with `day` by formatting local calendar date.
                date: formatLocalISODate(currentDate),
                day,
                month: currentDate.toLocaleString("en-US", { month: "short" }).toUpperCase(),
                year,
                vibration,
                score,
                insight,
                stars: getStarRating(score)
            };

            allScored.push(candidate);
            if (score >= 70) monthCandidates.push(candidate);
        }

        // Best dates within this month go first; only take as many as we still need.
        monthCandidates.sort((a, b) => b.score - a.score);
        if (isPreferredMonth) preferredMonthMatchCount = monthCandidates.length;
        dates.push(...monthCandidates.slice(0, TARGET_DATE_COUNT - dates.length));

        month++;
        if (month > 12) { month = 1; year++; }
        scannedMonths++;
    }

    const preferredMonthLabel = new Date(preferredYear, preferredMonth - 1, 1)
        .toLocaleString("en-US", { month: "long", year: "numeric" });

    // Some Birth/Destiny pairings never clear the score>=70 bar in a full year — fall back
    // to the least-bad dates across the whole scan rather than showing nothing.
    const usingBestAvailable = dates.length === 0;
    const finalDates = usingBestAvailable
        ? allScored.sort((a, b) => b.score - a.score).slice(0, TARGET_DATE_COUNT)
        : dates;

    return {
        dates: finalDates,
        preferredMonthMatchCount,
        preferredMonthLabel,
        usingBestAvailable,
    };
}

export type PurchaseDateAnalysisStatus = "HARMONY" | "CONFLICT" | "BALANCED";

export type PurchaseDateAnalysis = {
    dayEnergy: number; // The purchase day-of-month, reduced to a single digit
    matchPercentage: number; // 0-100 alignment score, for consistency with the vehicle/color analyses
    status: PurchaseDateAnalysisStatus;
    title: string;
    description: string;
};

export const PLANET_NAMES: Record<number, string> = {
    1: "Sun", 2: "Moon", 3: "Jupiter", 4: "Rahu", 5: "Mercury",
    6: "Venus", 7: "Ketu", 8: "Saturn", 9: "Mars",
};

// The purchase weekday's ruling planet is a secondary, muhurta-style factor —
// real, but traditionally weighted lighter than the day-of-month's own energy.
const WEEKDAY_RELATION_SCORE: Record<RelationAlign, number> = {
    friendly: 1,
    neutral: 0,
    enemy: -1,
};

function describePurchaseDateEnergy(
    dayEnergy: number,
    fullDateEnergy: number,
    birthNumber: number,
    destinyNumber: number,
    birthAlign: RelationAlign,
    destinyAlign: RelationAlign,
): string {
    const planet = PLANET_NAMES[dayEnergy];
    const leadIn = fullDateEnergy !== dayEnergy
        ? `Although the full date reduces to ${fullDateEnergy}, purchase day energy ${dayEnergy} introduces`
        : `Your purchase day energy ${dayEnergy} carries`;

    // Enemy relationships are the strongest signal and take priority over friendly ones.
    if (destinyAlign === "enemy" || birthAlign === "enemy") {
        const useDestiny = destinyAlign === "enemy";
        const targetLabel = useDestiny ? "destiny" : "birth";
        const targetNumber = useDestiny ? destinyNumber : birthNumber;
        return `${leadIn} heavy ${planet} energy that directly conflicts with your sensitive ${targetLabel} number ${targetNumber} vibration.`;
    }

    if (birthAlign === "friendly" && destinyAlign === "friendly") {
        return `${leadIn} vibrant ${planet} energy that resonates strongly with both your birth number ${birthNumber} and destiny number ${destinyNumber}, amplifying your success on this day.`;
    }

    if (birthAlign === "friendly" || destinyAlign === "friendly") {
        const useDestiny = destinyAlign === "friendly";
        const targetLabel = useDestiny ? "destiny" : "birth";
        const targetNumber = useDestiny ? destinyNumber : birthNumber;
        return `${leadIn} supportive ${planet} energy that resonates well with your ${targetLabel} number ${targetNumber} vibration.`;
    }

    return `${leadIn} steady ${planet} energy that maintains a neutral, balanced relationship with your birth number ${birthNumber} and destiny number ${destinyNumber}.`;
}

function describeWeekdayNuance(
    weekdayPlanet: number,
    weekdayBirthAlign: RelationAlign,
    weekdayDestinyAlign: RelationAlign,
    dayHadEnemy: boolean,
): string {
    const weekdayHasEnemy =
        weekdayBirthAlign === "enemy" || weekdayDestinyAlign === "enemy";
    const weekdayHasFriendly =
        weekdayBirthAlign === "friendly" || weekdayDestinyAlign === "friendly";
    const weekdayPlanetName = PLANET_NAMES[weekdayPlanet];

    if (weekdayHasEnemy && !dayHadEnemy) {
        return ` The purchase also fell on a ${weekdayPlanetName}-ruled day, adding a mild undercurrent of friction worth noting.`;
    }
    if (weekdayHasFriendly && dayHadEnemy) {
        return ` On the brighter side, the purchase fell on a ${weekdayPlanetName}-ruled day, softening the day energy's friction somewhat.`;
    }
    if (weekdayHasFriendly && !dayHadEnemy) {
        return ` The ${weekdayPlanetName}-ruled purchase day adds a further layer of support.`;
    }
    return "";
}

/**
 * Analyzes how the purchase date's day-of-month energy relates to the
 * owner's birth and destiny numbers, flagging harmony or conflict.
 */
export function getPurchaseDateAnalysis(
    purchaseDate: Date,
    birthNumber: number,
    destinyNumber: number,
): PurchaseDateAnalysis {
    const date = new Date(purchaseDate);
    const dayEnergy = calculateBirthNumber(date);
    const fullDateEnergy = calculateDestinyNumber(date);

    const birthRel = planetaryRelationships[birthNumber.toString()];
    const destinyRel = planetaryRelationships[destinyNumber.toString()];

    const birthAlign = relationAlign(birthRel, dayEnergy);
    const destinyAlign = relationAlign(destinyRel, dayEnergy);

    const score = RELATION_SCORE[destinyAlign] + RELATION_SCORE[birthAlign];

    // The day-of-month energy stays the primary, category-defining factor (unchanged
    // thresholds below); the purchase weekday's ruling planet is folded in only as a
    // secondary refinement to the percentage, mirroring how getRecommendedDates already
    // treats weekday as a real but lighter-weighted muhurta-style consideration.
    const weekdayPlanet = weekdayPlanets[date.getDay()];
    const weekdayBirthAlign = relationAlign(birthRel, weekdayPlanet);
    const weekdayDestinyAlign = relationAlign(destinyRel, weekdayPlanet);
    const weekdayScore =
        WEEKDAY_RELATION_SCORE[weekdayDestinyAlign] +
        WEEKDAY_RELATION_SCORE[weekdayBirthAlign];

    const matchPercentage = Math.max(
        0,
        Math.min(100, Math.round(50 + score * 10 + weekdayScore * 5)),
    );

    // An enemy alignment on EITHER number is a strict veto to CONFLICT, mirroring
    // scoreDate's "RULE 1" veto above and describePurchaseDateEnergy's own enemy-first
    // priority below — otherwise a birth-friendly/destiny-enemy day could net to a
    // "BALANCED" score while its own description text still reads as a direct clash.
    const status: PurchaseDateAnalysisStatus =
        birthAlign === "enemy" || destinyAlign === "enemy"
            ? "CONFLICT"
            : score >= 2
                ? "HARMONY"
                : "BALANCED";

    const title =
        status === "CONFLICT"
            ? "Conflict Detected"
            : status === "HARMONY"
                ? "Harmony Detected"
                : "Balanced Energy";

    const dayHadEnemy = birthAlign === "enemy" || destinyAlign === "enemy";
    const description =
        describePurchaseDateEnergy(
            dayEnergy,
            fullDateEnergy,
            birthNumber,
            destinyNumber,
            birthAlign,
            destinyAlign,
        ) +
        describeWeekdayNuance(
            weekdayPlanet,
            weekdayBirthAlign,
            weekdayDestinyAlign,
            dayHadEnemy,
        );

    return { dayEnergy, matchPercentage, status, title, description };
}