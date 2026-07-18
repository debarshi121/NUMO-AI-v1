import { NextResponse } from "next/server";
import {
    createReportAnalysisModel,
    saveReportAiAnalysis,
} from "@/lib/ai/reportAnalysis";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { reportId, birth, destiny, luckyColors, avoidColors, topDates, preferredTotals } = body;

        const model = createReportAnalysisModel(`
                You are a practical Vedic Numerologist and Vehicle Advisor. 
                Task: Write a 'Deep AI Analysis' paragraph (90-110 words).
                
                CONTEXT DEFINITIONS:
                - Lucky Colors: The recommended exterior body color of the car.
                - Avoid Colors: Exterior body colors that will cause energy friction.
                - Lucky Dates: The best dates to physically purchase and take delivery of the vehicle.
                - Plate Totals: The auspicious numerology sum for the vehicle's registration number.

                STRICT RULES:
                1. DATE FORMAT: Convert all dates to "[Day with suffix] [Month], [Year]" (e.g., 1st June, 2026, 3rd July, 2026).
                2. DATA INTEGRITY: Use ONLY the provided dates, colors, and numbers.
                3. ALL AVOID COLORS: You MUST mention every single color listed in the 'Avoid' category.
                4. TONE: Professional, clear, and encouraging. No complex "sovereign/celestial" jargon.
                5. STRUCTURE: One single, cohesive paragraph. No lists.
            `);

        const prompt = `
            INPUT DATA:
            - User: Birth #${birth}, Destiny #${destiny}
            - Vehicle Body Colors to Suggest: ${luckyColors.join(", ")}
            - Vehicle Body Colors to Avoid: ${avoidColors.join(", ")}
            - Best Buying Dates: ${topDates.join(", ")}
            - Registration Number Totals: ${preferredTotals.join(", ")}

            ANALYSIS GUIDELINE:
            1. Start by connecting their Birth #${birth} and Destiny #${destiny} to their leadership/personality.
            2. Suggest the top 2 vehicle body colors and 2 buying dates from the lists.
            3. Explain that avoiding ALL these colors—${avoidColors.join(", ")}—is vital to prevent path obstructions.
            4. Conclude by noting that a registration number totaling ${preferredTotals.slice(0, 2).join(" or ")} locks in the 'Mobile Sanctuary' energy.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        await saveReportAiAnalysis(reportId, text);

        return NextResponse.json({ analysis: text });
    } catch (error) {
        console.error("[new-vehicle-analysis] Gemini API error:", error);
        return NextResponse.json({ error: "Analysis unavailable." }, { status: 500 });
    }
}