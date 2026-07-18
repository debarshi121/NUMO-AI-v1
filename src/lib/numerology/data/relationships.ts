/**
 * Classical Vedic planetary friendship table, keyed by root number (1-9).
 *
 * Each ruling planet's relationship to every other root number is fixed by
 * tradition into three buckets — friendly, neutral, or enemy — and this
 * table is the single source of truth every engine in this app consults
 * (via {@link relationAlign} in ./engine/relationship-utils) to score how
 * well two numbers (e.g. a Birth Number and a vehicle number) get along.
 * A number is always "friendly" with itself, representing a doubled,
 * amplified version of its own energy.
 */
export const planetaryRelationships: Record<string, {
    friendly: number[];
    neutral: number[];
    enemy: number[];
}> = {
    "1": {
        "friendly": [1, 2, 3, 5, 9], // Sun + Sun = Double Authority
        "neutral": [4, 7],
        "enemy": [6, 8]
    },
    "2": {
        "friendly": [1, 2, 3], // Moon + Moon = Double Calm
        "neutral": [5, 7, 9],
        "enemy": [4, 6, 8]
    },
    "3": {
        "friendly": [1, 2, 3, 9], // Jupiter + Jupiter = Double Wisdom
        "neutral": [5, 7],
        "enemy": [4, 6, 8]
    },
    "4": {
        "friendly": [4, 5, 6, 8], // Rahu + Rahu = Double Innovation
        "neutral": [7],
        "enemy": [1, 2, 3, 9]
    },
    "5": {
        "friendly": [1, 4, 5, 6], // Mercury + Mercury = Double Speed
        "neutral": [2, 3, 7, 8],
        "enemy": [9]
    },
    "6": {
        "friendly": [4, 5, 6, 8], // Venus + Venus = Double Luxury
        "neutral": [3, 7],
        "enemy": [1, 2, 9]
    },
    "7": {
        "friendly": [1, 2, 3, 5, 7], // Ketu + Ketu = Double Intuition
        "neutral": [4, 8, 9],
        "enemy": [6]
    },
    "8": {
        "friendly": [4, 5, 6, 8], // Saturn + Saturn = Double Stability
        "neutral": [3, 7],
        "enemy": [1, 2, 9]
    },
    "9": {
        "friendly": [1, 2, 3, 9], // Mars + Mars = Double Energy
        "neutral": [4, 6, 7, 8],
        "enemy": [5]
    }
};