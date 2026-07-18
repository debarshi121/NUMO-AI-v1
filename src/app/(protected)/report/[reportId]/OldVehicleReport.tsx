"use client";
import { motion, type Variants } from "framer-motion";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import { getAllUniqueColors } from "@/lib/numerology/engine/color-engine";
import AiOldVehicleAnalysis from "@/components/vehicleReport/AiOldVehicleAnalysis";
import { TOldVehicleReportData } from "@/types/vehicleReport";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function OldVehicleReport({
  reportData,
}: {
  reportData: TOldVehicleReportData;
}) {
  const vehicleColorHex =
    getAllUniqueColors().find(
      (c) => c.color.toLowerCase() === reportData.vehicleColor.toLowerCase(),
    )?.hex ?? "#cccccc";
  const purchaseDateObj = new Date(reportData.purchaseDate);
  const purchaseDay = String(purchaseDateObj.getDate()).padStart(2, "0");
  const purchaseMonthShort = purchaseDateObj
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase();
  const purchaseYear = purchaseDateObj.getFullYear();
  const purchasedOnStr = `${purchaseDay} ${purchaseMonthShort} ${purchaseYear}`;
  const purchaseDateNumeric = `${purchaseDay}-${String(
    purchaseDateObj.getMonth() + 1,
  ).padStart(2, "0")}-${purchaseYear}`;
  const isPurchaseDateConflict = reportData.purchaseDateStatus === "CONFLICT";
  const harmonyCircumference = 2 * Math.PI * 88;

  const createdAtDate = new Date(reportData.createdAt);
  const createdAtStr = createdAtDate.toLocaleString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background text-on-surface font-body pb-32 selection:bg-primary/30">
      <Header />

      <main className="mt-8 px-container-margin space-y-stack-gap-lg max-w-md mx-auto">
        {/* Header Section */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="text-center py-6"
        >
          <h1 className="font-headline text-headline-md font-semibold text-primary mb-2 leading-tight">
            Complete Vehicle
            <br />
            Energy Report
          </h1>
          <div className="flex flex-col items-center gap-1 opacity-70">
            <p className="text-label-caps uppercase tracking-widest text-on-surface-variant">
              Generated for: {reportData?.userName}
            </p>
            <p className="text-body-sm text-on-surface">
              {createdAtStr} • Reference ID: {reportData?.reportId}
            </p>
          </div>
        </motion.section>

        {/* Section 1: Current Vehicle Compatibility */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="glass-card rounded-[20px] p-6 relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <h3 className="font-headline text-headline-sm font-semibold mb-6">
              Vehicle Profile
            </h3>
            <span className="bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-label-caps text-primary uppercase">
              Energy Analysis
            </span>
          </div>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, rgba(242,202,80,0.15) 0%, transparent 70%)",
            }}
          />

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Birth #", value: reportData.birthNumber },
              { label: "Destiny #", value: reportData.destinyNumber },
              { label: "Vehicle #", value: reportData.vehicleNumerologyNumber },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
              >
                <p className="text-label-caps text-on-surface-variant uppercase mb-1">
                  {item.label}
                </p>
                <p className="font-numeral text-data-numeral text-primary">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-3 bg-primary/5 rounded-xl p-4 border border-primary/10">
            <span className="material-symbols-outlined text-primary text-[28px] mt-0.5">
              swap_calls
            </span>
            <div>
              <p className="text-body-lg font-semibold text-primary mb-1">
                {reportData.vehicleProfileTitle}
              </p>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                {reportData.vehicleProfileText}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Section 2: Vehicle Number Analysis */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="glass-card rounded-[20px] p-6"
        >
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-headline text-headline-sm font-semibold whitespace-nowrap">
              Vehicle Number Analysis
            </h3>
          </div>
          {/* Number Plate */}
          <div
            className="w-full relative py-3 rounded-lg border-2 border-gray-400/40 flex justify-center items-center gap-4 mb-6"
            style={{
              background: "linear-gradient(180deg, #FFFFFF 0%, #E5E2E1 100%)",
              boxShadow:
                "inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.5)",
            }}
          >
            <span className="font-mono text-2xl font-bold text-black tracking-widest">
              {reportData.vehicleRegNumber}
            </span>
            <span className="text-2xl text-gray-500">→</span>
            <span className="font-mono text-3xl font-extrabold text-on-primary">
              {reportData.vehicleNumerologyNumber}
            </span>
            <span
              className={`bg-primary absolute right-1 -top-4 px-2 py-1 rounded-sm font-semibold text-[10px] whitespace-nowrap ${
                reportData.vehicleAnalysisMatchType === "POOR"
                  ? "text-[#920f00]"
                  : "text-on-primary"
              }`}
            >
              {reportData.vehicleAnalysisMatchType} MATCH
            </span>
          </div>
          <div className="text-center mb-6">
            <p className="font-numeral text-data-numeral text-primary">
              {reportData.vehicleCompatibilityScore}{" "}
              <span className="text-headline-sm font-normal opacity-50">
                / 100
              </span>
            </p>
            <p className="text-label-caps text-on-surface-variant uppercase tracking-widest">
              Compatibility Score
            </p>
          </div>
          <p className="text-body-sm text-on-surface-variant text-center mb-6 px-2">
            {reportData.vehicleAnalysisDescription}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {reportData.vehicleAnalysisTraits.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 border border-primary/40 rounded-full text-label-caps text-[11px] text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Section 3: Color Analysis */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="glass-card rounded-[20px] p-6 overflow-hidden"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline text-headline-sm font-semibold">
              Color Analysis
            </h3>
            <span
              className={`border text-label-caps text-[10px] px-2 py-1 rounded-sm ${
                reportData.vehicleColorMatchStatus === "UNLUCKY"
                  ? "bg-[#ffb4ab]/20 text-[#ffb4ab] border-[#ffb4ab]/30"
                  : "bg-primary/20 text-primary border-primary/30"
              }`}
            >
              {reportData.vehicleColorMatchStatus} COLOR
            </span>
          </div>
          <div className="flex items-center gap-6 mb-6">
            <div
              className="w-24 h-24 rounded-2xl border border-white/20 shadow-xl relative overflow-hidden shrink-0"
              style={{
                background: `linear-gradient(135deg, ${vehicleColorHex} 0%, ${vehicleColorHex} 100%)`,
              }}
            >
              <div className="absolute inset-0 bg-white/20 blur-sm" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-black/20 text-4xl">
                  flare
                </span>
              </div>
            </div>
            <div>
              <p className="font-headline text-headline-sm text-primary mb-1">
                {reportData.vehicleColor}
              </p>
              <p className="font-numeral text-[28px] text-on-surface">
                {reportData.vehicleColorMatchPercentage}%{" "}
                <span className="text-sm opacity-50 font-normal">Match</span>
              </p>
            </div>
          </div>
          <p className="text-body-sm text-on-surface-variant leading-relaxed">
            {reportData.vehicleColorMatchReason}
          </p>
        </motion.div>

        {/* Section 4: Purchase Date Energy */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="glass-card rounded-[20px] p-6"
        >
          <h3 className="font-headline text-headline-sm font-semibold mb-6">
            Purchase Date Energy
          </h3>
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10 w-full">
              <p className="text-label-caps text-on-surface-variant uppercase mb-2">
                Purchased On
              </p>
              <p className="font-headline text-headline-sm text-on-surface">
                {purchasedOnStr}
              </p>
            </div>
            <div className="flex items-center gap-4 text-primary">
              <span className="font-numeral text-xl">
                {purchaseDateNumeric}
              </span>
              <span className="material-symbols-outlined">trending_flat</span>
              <span className="font-numeral text-xl bg-primary/20 px-3 py-1 rounded-lg">
                {reportData.purchaseDateNumerologyNumber}
              </span>
            </div>
          </div>
          <div className="flex justify-around mb-6">
            <div className="text-center">
              <p className="text-label-caps text-on-surface-variant uppercase">
                Day Energy
              </p>
              <p className="font-headline text-headline-sm text-primary">
                {reportData.purchaseDayEnergy}
              </p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-label-caps text-on-surface-variant uppercase">
                Full Date
              </p>
              <p className="font-headline text-headline-sm text-primary">
                {reportData.purchaseDateNumerologyNumber}
              </p>
            </div>
          </div>
          <div
            className={`rounded-xl p-4 flex gap-3 border ${
              isPurchaseDateConflict
                ? "bg-[#ffb4ab]/10 border-[#ffb4ab]/20"
                : "bg-primary/10 border-primary/20"
            }`}
          >
            <span
              className={`material-symbols-outlined ${
                isPurchaseDateConflict ? "text-[#ffb4ab]" : "text-primary"
              }`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isPurchaseDateConflict ? "warning" : "check_circle"}
            </span>
            <div>
              <p
                className={`text-label-caps uppercase mb-1 ${
                  isPurchaseDateConflict ? "text-[#ffb4ab]" : "text-primary"
                }`}
              >
                {reportData.purchaseDateTitle}
              </p>
              <p className="text-body-sm text-on-surface-variant">
                {reportData.purchaseDateDescription}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section 5: Hidden Conflict Detection */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="glass-card rounded-[20px] p-6"
          style={{
            background: "linear-gradient(135deg, #0A0A0A 0%, #1a0a0a 100%)",
          }}
        >
          <motion.h3
            variants={fadeUp}
            className="font-headline text-headline-sm font-semibold mb-6"
          >
            Hidden Conflict Detection
          </motion.h3>
          {reportData.conflicts.length > 0 ? (
            <ul className="space-y-4">
              {reportData.conflicts.map((text, i) => (
                <motion.li key={i} variants={fadeUp} className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#ffb4ab] mt-0.5 shrink-0">
                    error_outline
                  </span>
                  <p className="text-body-sm text-on-surface-variant">
                    {text}
                  </p>
                </motion.li>
              ))}
            </ul>
          ) : (
            <motion.div variants={fadeUp} className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary mt-0.5 shrink-0">
                check_circle
              </span>
              <p className="text-body-sm text-on-surface-variant">
                No hidden conflicts detected — your vehicle number, purchase
                date, and color choice are free of numerology friction.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Section 6: Recommended Remedies */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="glass-card rounded-[20px] p-6 border-primary/20"
        >
          <motion.h3
            variants={fadeUp}
            className="font-headline text-headline-sm font-semibold mb-6"
          >
            Recommended Remedies
          </motion.h3>
          {reportData.remedies.length > 0 ? (
            <div className="space-y-3">
              {reportData.remedies.map((item) => (
                <motion.div
                  key={item.icon}
                  variants={fadeUp}
                  className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5"
                >
                  <span className="material-symbols-outlined text-primary">
                    {item.icon}
                  </span>
                  <p className="text-body-sm text-on-surface">{item.text}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5"
            >
              <span className="material-symbols-outlined text-primary">
                check_circle
              </span>
              <p className="text-body-sm text-on-surface">
                No remedies needed — your numbers are already in balance.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Section 7: Overall Vehicle Harmony Score */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="glass-card rounded-[20px] p-8 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/5 -z-10 blur-3xl rounded-full scale-75" />
          <h3 className="font-headline text-headline-sm font-semibold mb-8">
            Overall Vehicle Harmony Score
          </h3>
          <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="8"
                className="text-white/10"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={harmonyCircumference}
                strokeDashoffset={
                  harmonyCircumference *
                  (1 - reportData.vehicleHarmonyScore / 100)
                }
                strokeLinecap="round"
                className="text-primary"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <p className="font-numeral text-[40px] font-bold text-on-surface leading-none">
                {reportData.vehicleHarmonyScore}%
              </p>
              <p className="text-label-caps text-primary mt-2 uppercase tracking-widest">
                {reportData.vehicleHarmonyStatus}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-left">
            {[
              {
                label: "Number",
                value: reportData.vehicleHarmonyBreakdown.number,
              },
              {
                label: "Color",
                value: reportData.vehicleHarmonyBreakdown.color,
              },
              {
                label: "Timing",
                value: reportData.vehicleHarmonyBreakdown.timing,
              },
              {
                label: "Stability",
                value: reportData.vehicleHarmonyBreakdown.stability,
              },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-label-caps text-[10px] text-on-surface-variant uppercase">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                  <div
                    className={`${
                      item.value < 50 ? "bg-[#ffb4ab]" : "bg-primary"
                    } h-full rounded-full`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 8: AI Deep Analysis */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="glass-card rounded-[20px] p-6 border-l-4 border-l-primary"
        >
          <AiOldVehicleAnalysis reportData={reportData} />
        </motion.div>

        {/* Action Buttons */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="flex flex-col gap-stack-gap-md pb-12"
        >
          <button
            className="w-full cursor-pointer bg-primary text-on-primary py-4 rounded-xl font-headline text-headline-sm flex items-center justify-center gap-2 active:scale-95 transition-transform duration-200"
            style={{ boxShadow: "0 0 20px rgba(229,193,77,0.15)" }}
          >
            <span className="material-symbols-outlined">download</span>
            Download PDF Report
          </button>
          <button className="w-full cursor-pointer glass-card hover:bg-white/10 active:scale-95 transition-all text-on-surface py-4 rounded-xl font-headline text-headline-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">share</span>
            Share Analysis Report
          </button>
        </motion.section>
      </main>

      <MobileNav active="reports" />
    </div>
  );
}
