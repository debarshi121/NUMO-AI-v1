import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TNewVehicleReportData } from "@/types/vehicleReport";

const AiDeepAnalysis = ({
  reportData,
}: {
  reportData: TNewVehicleReportData;
}) => {
  const [aiExpanded, setAiExpanded] = useState(true);
  const [analysis, setAnalysis] = useState<string>("");
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);

  const fetchedAnalysisRef = React.useRef(false);

  const fetchAnalysis = async () => {
    try {
      setAiAnalysisLoading(true);
      const response = await fetch("/api/ai/new-vehicle-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: reportData.reportId,
          birth: reportData?.birthNumber,
          destiny: reportData?.destinyNumber,
          luckyColors:
            reportData?.recommendedColors
              ?.sort((a, b) => b.score - a.score)
              .map((c) => c.color) || [],
          avoidColors: reportData?.avoidColors?.map((c) => c.color) || [],
          topDates:
            reportData?.recommendedDates
              ?.sort((a, b) => b.score - a.score)
              ?.slice(0, 9)
              .map((d) => `${d.date}`) || [],
          preferredTotals: reportData?.recommendedTotals,
        }),
      });
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      setAnalysis(
        "AI analysis is currently unavailable. Please try again later.",
      );
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadAnalysis = async () => {
      if (!fetchedAnalysisRef.current) {
        fetchedAnalysisRef.current = true;
        if (!reportData?.aiAnalysis) {
          await fetchAnalysis();
        } else {
          if (isMounted) {
            setAnalysis(reportData.aiAnalysis);
          }
        }
      }
    };

    loadAnalysis();

    return () => {
      isMounted = false;
    };
  }, [reportData]);
  return (
    <>
      <button
        className="flex w-full cursor-pointer justify-between items-center mb-4"
        onClick={() => setAiExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            psychology
          </span>
          <h3 className="font-headline text-headline-sm font-semibold">
            AI Deep Analysis
          </h3>
        </div>
        <span
          className={`material-symbols-outlined text-on-surface-variant transition-transform ${aiExpanded ? "rotate-180" : ""}`}
        >
          expand_more
        </span>
      </button>
      <AnimatePresence initial={false}>
        {aiExpanded && (aiAnalysisLoading || analysis) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {aiAnalysisLoading ? (
              <div className="space-y-3" aria-live="polite" aria-busy="true">
                <div className="flex items-center gap-2 text-body-sm text-primary/80">
                  <span className="inline-flex gap-1">
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        className="h-2 w-2 rounded-full bg-primary"
                        animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
                        transition={{
                          duration: 0.9,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: dot * 0.12,
                        }}
                      />
                    ))}
                  </span>
                  Generating your AI insights...
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded-full bg-white/8" />
                  <div className="h-4 w-11/12 rounded-full bg-white/8" />
                  <div className="h-4 w-4/5 rounded-full bg-white/8" />
                </div>
              </div>
            ) : (
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                {analysis}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiDeepAnalysis;
