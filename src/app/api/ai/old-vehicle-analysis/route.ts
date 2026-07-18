import { NextResponse } from "next/server";
import {
    createReportAnalysisModel,
    saveReportAiAnalysis,
} from "@/lib/ai/reportAnalysis";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            reportId,
            birthNumber,
            destinyNumber,
            vehicleRegNumber,
            vehicleNumerologyNumber,
            vehicleAnalysisMatchType,
            vehicleAnalysisDescription,
            vehicleColor,
            vehicleColorMatchStatus,
            vehicleColorMatchReason,
            purchaseDateNumerologyNumber,
            purchaseDateStatus,
            purchaseDateDescription,
            conflicts,
            remedies,
            vehicleHarmonyScore,
            vehicleHarmonyStatus,
        } = body;

        const model = createReportAnalysisModel(`
                You are a practical Vedic Numerologist and Vehicle Advisor.
                Task: Write a 'Deep AI Analysis' for a vehicle the owner ALREADY owns, in 2-3 short paragraphs (110-160 words total).

                CONTEXT DEFINITIONS:
                - Vehicle Number: the registration plate reduced to a single numerology digit.
                - Match Type: how well the Vehicle Number aligns with the owner's Birth/Destiny numbers (PERFECT/GOOD/BALANCED/POOR).
                - Color Status: whether the current exterior color is LUCKY/BALANCED/UNLUCKY for the owner.
                - Purchase Date Status: whether the purchase date's energy is in HARMONY/BALANCED/CONFLICT with the owner.
                - Hidden Conflicts: subtler frictions between the vehicle number, purchase date, and color that were already detected elsewhere in the report.
                - Remedies: numerology fixes already recommended elsewhere in the report — reference them briefly, do NOT invent new ones.
                - Harmony Score: an overall 0-100 alignment score with a status label, already computed.

                STRICT RULES:
                1. DATA INTEGRITY: Use ONLY the facts provided below. Do not invent new colors, dates, numbers, gemstones, or planets.
                2. Mention the vehicle registration number and its reduced Vehicle Number explicitly.
                3. Reference the purchase date's numerology status.
                4. If hidden conflicts are listed, acknowledge at least one briefly; if none, say so positively.
                5. If remedies are listed, reference them briefly by theme (e.g. "the suggested gemstone and color remedies") without re-deriving new ones.
                6. Close with a verdict tied to the Harmony Score/status.
                7. TONE: professional, clear, and encouraging. No "sovereign/celestial" jargon.
                8. STRUCTURE: 2-3 short paragraphs. No lists, no markdown headers.
            `);

        const prompt = `
            INPUT DATA:
            - User: Birth #${birthNumber}, Destiny #${destinyNumber}
            - Vehicle Registration: ${vehicleRegNumber} → Vehicle Number ${vehicleNumerologyNumber} (${vehicleAnalysisMatchType} match)
            - Vehicle Number Analysis: ${vehicleAnalysisDescription}
            - Current Color: ${vehicleColor} (${vehicleColorMatchStatus} match) — ${vehicleColorMatchReason}
            - Purchase Date Numerology: ${purchaseDateNumerologyNumber} (${purchaseDateStatus}) — ${purchaseDateDescription}
            - Hidden Conflicts (${conflicts?.length ?? 0}): ${conflicts?.length ? conflicts.join(" | ") : "None detected."}
            - Recommended Remedies (${remedies?.length ?? 0}): ${remedies?.length ? remedies.map((r: { text: string }) => r.text).join(" | ") : "None needed."}
            - Overall Vehicle Harmony Score: ${vehicleHarmonyScore}% (${vehicleHarmonyStatus})

            ANALYSIS GUIDELINE:
            1. Open by connecting the vehicle's registration number ${vehicleRegNumber} and its Vehicle Number ${vehicleNumerologyNumber} to the owner's Birth #${birthNumber} and Destiny #${destinyNumber}, using the ${vehicleAnalysisMatchType} match verdict.
            2. Weave in how the current color (${vehicleColor}) and the purchase date's ${purchaseDateStatus} status support or work against that energy, briefly touching on any hidden conflicts and the remedies already suggested.
            3. Close with an overall verdict grounded in the ${vehicleHarmonyScore}% ${vehicleHarmonyStatus} Harmony Score.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        await saveReportAiAnalysis(reportId, text);

        return NextResponse.json({ analysis: text });
    } catch (error) {
        console.error("[old-vehicle-analysis] Gemini API error:", error);
        return NextResponse.json({ error: "Analysis unavailable." }, { status: 500 });
    }
}
