import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const GEMINI_MODEL_ID = "gemini-3-flash-preview";
const GEMINI_TEMPERATURE = 0.6;

/**
 * Creates the Gemini model used for both the new- and old-vehicle "AI Deep
 * Analysis" report sections. Model id and temperature are shared across both
 * flows — only the system instruction (persona + rules) and the per-request
 * prompt differ, so callers just supply their own instruction text.
 */
export function createReportAnalysisModel(systemInstruction: string) {
  return genAI.getGenerativeModel({
    model: GEMINI_MODEL_ID,
    systemInstruction,
    generationConfig: {
      temperature: GEMINI_TEMPERATURE,
    },
  });
}

/**
 * Merges a freshly generated AI analysis paragraph into a report's stored
 * `reportData` JSON blob, preserving every other already-computed field.
 * Both vehicle-analysis routes call this immediately after generating text
 * so the analysis is cached and doesn't need to be regenerated on revisit.
 */
export async function saveReportAiAnalysis(
  reportId: string,
  analysis: string,
): Promise<void> {
  const existing = await prisma.report.findUnique({
    where: { id: reportId },
    select: { reportData: true },
  });

  await prisma.report.update({
    where: { id: reportId },
    data: {
      reportData: {
        ...((existing?.reportData as object) ?? {}),
        aiAnalysis: analysis,
      },
    },
  });
}
