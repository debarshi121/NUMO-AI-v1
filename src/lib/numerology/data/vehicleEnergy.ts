/**
 * The energetic traits a *vehicle's* numerology number (from
 * {@link calculateVehicleNumerologyNumber}) is said to carry, keyed by root
 * number (1-9). Distinct from {@link energyData}, which describes a
 * *person's* Birth/Destiny number traits — this table is consulted whenever
 * the report needs to describe what the vehicle itself brings to the
 * relationship (see {@link getVehicleNumberAnalysis} and
 * {@link getOldVehicleAlignment} in ../calculators/others).
 */
export const vehicleEnergy = {
    1: [
        "Leadership",
        "Authority",
        "Ambition",
        "Confidence",
        "Independence"
    ],

    2: [
        "Harmony",
        "Emotional Balance",
        "Peace",
        "Sensitivity",
        "Support"
    ],

    3: [
        "Expansion",
        "Wisdom",
        "Growth",
        "Luck",
        "Guidance"
    ],

    4: [
        "Discipline",
        "Structure",
        "Stability",
        "Innovation",
        "Persistence"
    ],

    5: [
        "Speed",
        "Travel",
        "Adaptability",
        "Freedom",
        "Movement"
    ],

    6: [
        "Luxury",
        "Comfort",
        "Beauty",
        "Family Protection",
        "Prosperity"
    ],

    7: [
        "Intuition",
        "Spiritual Protection",
        "Reflection",
        "Inner Strength",
        "Awareness"
    ],

    8: [
        "Power",
        "Discipline",
        "Endurance",
        "Stability",
        "Responsibility"
    ],

    9: [
        "Courage",
        "Aggression",
        "Energy",
        "Protection",
        "Victory"
    ]
};