/**
 * Vehicle exterior color guidance per root number (1-9): colors that
 * amplify a number's ruling-planet energy (primary), colors that support it
 * more mildly (secondary), and colors whose clashing planetary energy
 * should be avoided. Consulted by ./engine/color-engine for both the
 * "lucky colors to choose from" recommendation list and the "how well does
 * my current color match" analysis.
 */
export const vehicleColorRecommendations: Record<string, {
    planet: string;
    primary: { color: string; hex: string; reason: string }[];
    secondary: { color: string; hex: string; reason: string }[];
    avoid: { color: string; hex: string; reason: string }[];
}> = {
    "1": {
        "planet": "Sun",
        "primary": [
            { color: "Gold", hex: "#FFD700", reason: "Directly aligns with the Sun's royal energy for ultimate status." },
            { color: "White", hex: "#FFFFFF", reason: "Represents the total spectrum of light, ensuring clarity and power." },
            { color: "Orange", hex: "#FFA500", reason: "Invokes vitality and ensures the owner stands out as a leader." }
        ],
        "secondary": [
            { color: "Copper", hex: "#B87333", reason: "Aligns with the Sun's metal, providing a strong protective shield." },
            { color: "Cream", hex: "#FFFDD0", reason: "Offers a balanced, dignified vibration for professional growth." },
            { color: "Yellow", hex: "#FFFF00", reason: "Attracts positivity and keeps the driver’s spirit optimistic." }
        ],
        "avoid": [
            { color: "Black", hex: "#000000", reason: "Represents Saturn, the Sun's arch-enemy; can lead to delays and ego clashes." },
            { color: "Blue", hex: "#0000FF", reason: "Dampens the Sun's fire, leading to hidden obstacles and loss of authority." },
            { color: "Brown", hex: "#964B00", reason: "Muddies the Sun's brilliance, causing stagnation in personal progress." }
        ],
    },
    "2": {
        "planet": "Moon",
        "primary": [
            { color: "White", hex: "#FFFFFF", reason: "Vibrates with the Moon's purity, ensuring emotional calm while driving." },
            { color: "Silver", hex: "#C0C0C0", reason: "Facilitates a smooth 'flow' in travel and personal life." },
            { color: "Cream", hex: "#FFFDD0", reason: "Provides a soothing environment that reduces road stress and anxiety." }
        ],
        "secondary": [
            { color: "Blue", hex: "#0000FF", reason: "Enhances intuition and ensures a harmonious atmosphere for passengers." },
            { color: "Turquoise", hex: "#40E0D0", reason: "Brings a sense of freshness and mental renewal during journeys." },
            { color: "White", hex: "#FFFFFF", reason: "Maintains a steady, peaceful vibration for daily commuting." }
        ],
        "avoid": [
            { color: "Red", hex: "#FF0000", reason: "Mars's fire disrupts the Moon's water energy, causing mental agitation." },
            { color: "Black", hex: "#000000", reason: "Creates a heavy, gloomy aura that can lead to depression or isolation." },
            { color: "Brown", hex: "#964B00", reason: "Represents heavy Earth energy that can lead to physical fatigue." }
        ]
    },
    "3": {
        "planet": "Jupiter",
        "primary": [
            { color: "Yellow", hex: "#FFFF00", reason: "The color of Guru; attracts divine grace and financial abundance." },
            { color: "Gold", hex: "#FFD700", reason: "Reflects expansion and the high social standing Jupiter provides." },
            { color: "Orange", hex: "#FFA500", reason: "Encourages spiritual protection and high ethical success." }
        ],
        "secondary": [
            { color: "Cream", hex: "#FFFDD0", reason: "Softens the intensity of Jupiter while keeping the energy auspicious." },
            { color: "Beige", hex: "#F5F5DC", reason: "A grounded color that ensures steady growth and family safety." },
            { color: "Orange", hex: "#FFA500", reason: "Promotes creative thinking and joyful social connections." }
        ],
        "avoid": [
            { color: "Blue", hex: "#0000FF", reason: "Conflict between Jupiter and Rahu/Saturn can cause legal or technical hurdles." },
            { color: "Black", hex: "#000000", reason: "Oppresses the wisdom of Jupiter, leading to a loss of respect." },
            { color: "Grey", hex: "#808080", reason: "Creates confusion and prevents clear decision-making." }
        ]
    },
    "4": {
        "planet": "Rahu",
        "primary": [
            { color: "Cyan", hex: "#00FFFF", reason: "Channels Rahu’s unconventional energy into innovative success." },
            { color: "Grey", hex: "#808080", reason: "Provides the necessary grounding for a planet that is purely shadow." },
            { color: "Blue", hex: "#0000FF", reason: "Ensures stability and protects against sudden, unexpected mishaps." }
        ],
        "secondary": [
            { color: "Silver", hex: "#C0C0C0", reason: "Helps the driver adapt quickly to sudden changes in traffic or life." },
            { color: "Blue", hex: "#0000FF", reason: "Maintains a modern, tech-forward vibe that suits Number 4." },
            { color: "Grey", hex: "#808080", reason: "Adds a layer of clarity to Rahu's often foggy energy." }
        ],
        "avoid": [
            { color: "Red", hex: "#FF0000", reason: "Increases Rahu's erratic nature, potentially leading to impulsive risks." },
            { color: "Yellow", hex: "#FFFF00", reason: "Sun/Jupiter colors conflict with Rahu, creating internal friction." },
            { color: "White", hex: "#FFFFFF", reason: "Often too 'bright' for Rahu, leading to lack of focus." }
        ]
    },
    "5": {
        "planet": "Mercury",
        "primary": [
            { color: "Teal", hex: "#008080", reason: "Aligns with the 'Prince' planet for sharp business logic and wit." },
            { color: "Green", hex: "#008000", reason: "Promotes mental flexibility and keeps the driver energized." },
            { color: "Silver", hex: "#C0C0C0", reason: "Mercury is a fast-moving planet; silver supports its speed and agility." }
        ],
        "secondary": [
            { color: "Turquoise", hex: "#40E0D0", reason: "Encourages better communication and networking while traveling." },
            { color: "Grey", hex: "#808080", reason: "Provides a neutral, efficient energy for city driving." },
            { color: "White", hex: "#FFFFFF", reason: "Clears the intellectual path and helps in multitasking." }
        ],
        "avoid": [
            { color: "Red", hex: "#FF0000", reason: "Mars is the bitter enemy of Mercury; causes mental friction and road rage." },
            { color: "Maroon", hex: "#800000", reason: "Can lead to poor financial decisions or business losses via the vehicle." },
            { color: "Brown", hex: "#964B00", reason: "Dulls the quick-thinking nature of Mercury, causing sluggishness." }
        ]
    },
    "6": {
        "planet": "Venus",
        "primary": [
            { color: "White", hex: "#FFFFFF", reason: "Venus loves brilliance; this attracts maximum luxury and comfort." },
            { color: "Blue", hex: "#0000FF", reason: "Invites artistic inspiration and pleasant, romantic journeys." },
            { color: "Pink", hex: "#FFC0CB", reason: "Directly vibrates with Venusian charm, beauty, and wealth." }
        ],
        "secondary": [
            { color: "Silver", hex: "#C0C0C0", reason: "Provides a sophisticated aura that commands social admiration." },
            { color: "Cream", hex: "#FFFDD0", reason: "Enhances harmony in relationships and internal cabin peace." },
            { color: "Beige", hex: "#F5F5DC", reason: "Attracts material comforts and a sense of 'high-living'." }
        ],
        "avoid": [
            { color: "Black", hex: "#000000", reason: "Dampens the vibrant joy of Venus, leading to uninspired travel." },
            { color: "Brown", hex: "#964B00", reason: "A muddy color that blocks the aesthetic and financial flow of Venus." },
            { color: "Purple", hex: "#800080", reason: "Can create an overly emotional or heavy atmosphere for the driver." }
        ]
    },
    "7": {
        "planet": "Ketu",
        "primary": [
            { color: "White", hex: "#FFFFFF", reason: "Offers the purest spiritual protection for a headless planet like Ketu." },
            { color: "Green", hex: "#008000", reason: "Brings balance and calm to Ketu’s otherwise detached energy." },
            { color: "Grey", hex: "#808080", reason: "Helps in maintaining a unique and focused driving identity." }
        ],
        "secondary": [
            { color: "Grey", hex: "#808080", reason: "Blends perfectly with Ketu's shadow nature to avoid negative attention." },
            { color: "Blue", hex: "#0000FF", reason: "Promotes deep thinking and a meditative driving experience." },
            { color: "White", hex: "#FFFFFF", reason: "Ketu thrives on multi-tonal or unique, non-solid looks." }
        ],
        "avoid": [
            { color: "Red", hex: "#FF0000", reason: "Mars’s intensity is too harsh for Ketu, leading to overheating or accidents." },
            { color: "Yellow", hex: "#FFFF00", reason: "Jupiter's expansion is at odds with Ketu's path of detachment." },
            { color: "Black", hex: "#000000", reason: "Can lead to excessive secrecy or feeling 'lost' on your path." }
        ]
    },
    "8": {
        "planet": "Saturn",
        "primary": [
            { color: "Black", hex: "#000000", reason: "Saturn's own color; ensures the highest durability and endurance." },
            { color: "Blue", hex: "#0000FF", reason: "Reflects discipline, justice, and long-term professional success." },
            { color: "Grey", hex: "#808080", reason: "Provides a solid, grounded vibration for hard-earned achievements." }
        ],
        "secondary": [
            { color: "Grey", hex: "#808080", reason: "Strengthens the vehicle's mechanical life and reliability." },
            { color: "Blue", hex: "#0000FF", reason: "Ensures a steady, authoritative presence on the road." },
            { color: "Purple", hex: "#800080", reason: "Supports deep focus and long-distance driving endurance." }
        ],
        "avoid": [
            { color: "Red", hex: "#FF0000", reason: "Saturn and Mars are explosive together; a major indicator of accidents." },
            { color: "Yellow", hex: "#FFFF00", reason: "The light of the Sun/Jupiter conflicts with Saturn's darkness." },
            { color: "Beige", hex: "#F5F5DC", reason: "Represents a hierarchy that Saturn often challenges, leading to friction." }
        ]
    },
    "9": {
        "planet": "Mars",
        "primary": [
            { color: "Red", hex: "#FF0000", reason: "Aligns with the 'Commander' planet for maximum energy and protection." },
            { color: "Maroon", hex: "#800000", reason: "Provides a more grounded, powerful version of Mars’s warrior strength." },
            { color: "Burgundy", hex: "#800020", reason: "Drives the courage and protective instincts of the driver." }
        ],
        "secondary": [
            { color: "Orange", hex: "#FFA500", reason: "Maintains high enthusiasm and ensures the driver remains alert." },
            { color: "White", hex: "#FFFFFF", reason: "Essential for Number 9 to cool the temper and prevent road rage." },
            { color: "Silver", hex: "#C0C0C0", reason: "Acts as a 'cooling metal' to balance the fire of Mars." }
        ],
        "avoid": [
            { color: "Black", hex: "#000000", reason: "Saturn/Rahu energy here can lead to frequent mechanical failures." },
            { color: "Green", hex: "#008000", reason: "Mercury/Mars conflict creates a 'confused' energy on the road." },
            { color: "Blue", hex: "#0000FF", reason: "Can drain the natural energy and drive of the Mars individual." }
        ]
    }
};
