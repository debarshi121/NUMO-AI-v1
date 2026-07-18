/**
 * Per-number personality and vehicle-preference profile, keyed by root
 * number (1-9), used for the "old vehicle" flow's narrative copy (see
 * {@link getOldVehicleAlignment} and {@link getVehicleProfile} in
 * ../calculators/others). Each entry pairs a number's ruling planet with the
 * traits and vehicle styles that planet's energy is traditionally
 * associated with.
 */
export const energyData = {
    1: {
        planet: "Sun",
        keywords: ["Leadership", "Authority", "Status"],
        traits: ["growth", "achievement", "command"],
        vehiclePreference: ["premium", "bold", "high-status"]
    },
    2: {
        planet: "Moon",
        keywords: ["Harmony", "Peace", "Grace"],
        traits: ["stability", "emotional balance", "serenity"],
        vehiclePreference: ["comfortable", "smooth", "family-oriented"]
    },
    3: {
        planet: "Jupiter",
        keywords: ["Wisdom", "Expansion", "Prosperity"],
        traits: ["prosperity", "optimism", "abundance"],
        vehiclePreference: ["stylish", "luxury", "expansive"]
    },
    4: {
        planet: "Rahu",
        keywords: ["Innovation", "Structure", "Stability"],
        traits: ["security", "unconventionality", "practicality"],
        vehiclePreference: ["reliable", "robust", "tech-forward"]
    },
    5: {
        planet: "Mercury",
        keywords: ["Agility", "Intelligence", "Speed"],
        traits: ["freedom", "versatility", "dynamic movement"],
        vehiclePreference: ["fast", "aerodynamic", "modern"]
    },
    6: {
        planet: "Venus",
        keywords: ["Luxury", "Elegance", "Comfort"],
        traits: ["refined taste", "prosperity", "harmony"],
        vehiclePreference: ["premium", "aesthetic", "comfortable"]
    },
    7: {
        planet: "Ketu",
        keywords: ["Wisdom", "Analysis", "Intuition"],
        traits: ["reflection", "depth", "quiet power"],
        vehiclePreference: ["minimalist", "refined", "discrete"]
    },
    8: {
        planet: "Saturn",
        keywords: ["Power", "Discipline", "Longevity"],
        traits: ["long-term growth", "endurance", "authority"],
        vehiclePreference: ["executive", "durable", "imposing"]
    },
    9: {
        planet: "Mars",
        keywords: ["Courage", "Energy", "Action"],
        traits: ["drive", "strength", "performance"],
        vehiclePreference: ["sporty", "high-performance", "bold"]
    }
} as const;