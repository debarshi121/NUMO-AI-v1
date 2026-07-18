/**
 * Static narrative profile data for the "new vehicle" flow (a customer who
 * hasn't purchased yet, so there's no plate/color/date to score against —
 * just their Birth and Destiny numbers). Consulted by
 * {@link getNewVehicleAlignment} in ../calculators/others.
 *
 * `birthNumbers` describes surface-level personality (core energy, traits,
 * ready-to-use tone phrases); `destinyNumbers` describes the broader
 * long-term life-path influences. Both are keyed by root number (1-9).
 */
export const divineData =
{
    "birthNumbers": {
        "1": {
            "coreEnergy": "Independence",
            "alignment": "Leadership and ambition",
            "traits": [
                "independent",
                "ambitious",
                "creative",
                "confident",
                "determined"
            ],
            "tonePhrases": [
                "You are independent, confident, and ambitious, naturally inspiring others with your leadership and creativity.",
                "Your determination and self-reliance drive you to pioneer new paths and achieve success."
            ]
        },
        "2": {
            "coreEnergy": "Harmony",
            "alignment": "Partnership and empathy",
            "traits": [
                "empathetic",
                "supportive",
                "intuitive",
                "patient",
                "diplomatic"
            ],
            "tonePhrases": [
                "You bring balance and understanding to every relationship, using empathy and insight to build harmony.",
                "Your compassionate nature and cooperative spirit make you a natural peacemaker and supportive team member."
            ]
        },
        "3": {
            "coreEnergy": "Creativity",
            "alignment": "Expression and joy",
            "traits": [
                "creative",
                "expressive",
                "optimistic",
                "sociable",
                "imaginative"
            ],
            "tonePhrases": [
                "Your creativity and joyful expression inspire others, making communication and artistry a hallmark of your character.",
                "You infuse positivity and imagination into your surroundings, naturally drawing people in with your enthusiasm."
            ]
        },
        "4": {
            "coreEnergy": "Stability",
            "alignment": "Structure and practicality",
            "traits": [
                "practical",
                "disciplined",
                "reliable",
                "organized",
                "dependable"
            ],
            "tonePhrases": [
                "You are the steady foundation that others rely on, building success through discipline, reliability, and hard work.",
                "Your practical approach and strong sense of responsibility ensure that you excel in structured environments."
            ]
        },
        "5": {
            "coreEnergy": "Freedom",
            "alignment": "Adventure and adaptability",
            "traits": [
                "adventurous",
                "adaptable",
                "curious",
                "dynamic",
                "versatile"
            ],
            "tonePhrases": [
                "You thrive on change and new experiences, embracing freedom and variety with enthusiasm.",
                "Your love of adventure and flexibility allows you to adapt easily and stay energized by life’s possibilities."
            ]
        },
        "6": {
            "coreEnergy": "Nurturing",
            "alignment": "Responsibility and care",
            "traits": [
                "caring",
                "compassionate",
                "responsible",
                "supportive",
                "family-minded"
            ],
            "tonePhrases": [
                "Your compassionate nature and sense of responsibility create a harmonious home and support system for others.",
                "You naturally care for people and bring stability through your nurturing and dependable personality."
            ]
        },
        "7": {
            "coreEnergy": "Introspection",
            "alignment": "Wisdom and insight",
            "traits": [
                "analytical",
                "introspective",
                "wise",
                "thoughtful",
                "inquiring"
            ],
            "tonePhrases": [
                "You seek deeper meaning and use your analytical mind to gain insight, making you thoughtful and insightful.",
                "Your reflective nature and love of knowledge guide you to thoughtful conclusions and personal growth."
            ]
        },
        "8": {
            "coreEnergy": "Ambition",
            "alignment": "Power and success",
            "traits": [
                "ambitious",
                "determined",
                "disciplined",
                "authoritative",
                "goal-oriented"
            ],
            "tonePhrases": [
                "You are driven and focused on success, combining vision with discipline to achieve your goals.",
                "Your ambition and leadership qualities draw you to positions of authority and enable you to pursue great achievements."
            ]
        },
        "9": {
            "coreEnergy": "Compassion",
            "alignment": "Humanitarianism and completion",
            "traits": [
                "compassionate",
                "generous",
                "altruistic",
                "idealistic",
                "empathic"
            ],
            "tonePhrases": [
                "Your deep compassion and generosity inspire others, as you naturally focus on the greater good.",
                "You are driven by purpose and empathy, using your wisdom to make a positive difference in the world."
            ]
        }
    },
    "destinyNumbers": {
        "1": {
            "influences": [
                "confidence",
                "independence",
                "leadership"
            ],
            "keywords": [
                "ambitious",
                "pioneering",
                "innovative"
            ],
            "tonePhrases": [
                "You are confident, independent, and ambitious.",
                "You prefer to take initiative and lead others toward success."
            ]
        },
        "2": {
            "influences": [
                "empathy",
                "cooperation",
                "sensitivity"
            ],
            "keywords": [
                "supportive",
                "diplomatic",
                "nurturing"
            ],
            "tonePhrases": [
                "You are emotional, cooperative, and sensitive.",
                "You value harmony and naturally bring people together."
            ]
        },
        "3": {
            "influences": [
                "creativity",
                "expression",
                "enthusiasm"
            ],
            "keywords": [
                "expressive",
                "artistic",
                "communicative"
            ],
            "tonePhrases": [
                "You are expressive, artistic, and full of ideas.",
                "Communication comes naturally to you and you inspire others with your creativity."
            ]
        },
        "4": {
            "influences": [
                "discipline",
                "practicality",
                "stability"
            ],
            "keywords": [
                "practical",
                "disciplined",
                "organized"
            ],
            "tonePhrases": [
                "You are practical, disciplined, and hardworking.",
                "You believe in stability and build success through careful planning."
            ]
        },
        "5": {
            "influences": [
                "freedom",
                "adaptability",
                "adventure"
            ],
            "keywords": [
                "adaptable",
                "adventurous",
                "curious"
            ],
            "tonePhrases": [
                "You love freedom, change, and new experiences.",
                "You adapt easily to different situations and keep life exciting."
            ]
        },
        "6": {
            "influences": [
                "responsibility",
                "nurturing",
                "service"
            ],
            "keywords": [
                "responsible",
                "nurturing",
                "supportive"
            ],
            "tonePhrases": [
                "You are responsible, nurturing, and family-oriented.",
                "You naturally support others and create harmony around you."
            ]
        },
        "7": {
            "influences": [
                "introspection",
                "analysis",
                "wisdom"
            ],
            "keywords": [
                "analytical",
                "introspective",
                "thoughtful"
            ],
            "tonePhrases": [
                "You are analytical, introspective, and thoughtful.",
                "You seek deeper meaning in life through careful reflection."
            ]
        },
        "8": {
            "influences": [
                "ambition",
                "power",
                "achievement"
            ],
            "keywords": [
                "ambitious",
                "determined",
                "authoritative"
            ],
            "tonePhrases": [
                "You are ambitious, determined, and focused on success.",
                "You aim for power and stability in everything you do."
            ]
        },
        "9": {
            "influences": [
                "compassion",
                "vision",
                "humanitarianism"
            ],
            "keywords": [
                "compassionate",
                "generous",
                "altruistic"
            ],
            "tonePhrases": [
                "You are compassionate, generous, and driven by purpose.",
                "You care deeply about making a positive difference in the world."
            ]
        }
    },
    "templates": [
        "Your profile combines the energy of {{birth_coreEnergy}} with traits of a {{destiny_influences}}, creating a powerful blend of drive and compassion.",
        "With {{birth_alignment}} at your core and {{destiny_influences}}, you are uniquely equipped for leadership that uplifts and inspires.",
        "Your Divine Alignment reflects a harmony of {{traits}} and {{destiny_keywords}}, highlighting a path of success and service."
    ],
    "meta": {
        "sourceSummary": [
            "Indian numerology articles",
            "Astrology and numerology reference sites",
            "Educational numerology resources"
        ],
        "generatedAt": "2026-05-24T00:40:35+05:30",
        "notes": "Synthesized from authoritative numerology resources focusing on personality traits and life path qualities."
    }
}