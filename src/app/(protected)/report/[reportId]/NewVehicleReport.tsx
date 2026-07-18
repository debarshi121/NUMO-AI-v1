"use client";
import { motion, type Variants } from "framer-motion";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";

import { darkenHex } from "@/lib/utils";
import AiDeepAnalysis from "@/components/vehicleReport/AiDeepAnalysis";
import { TNewVehicleReportData } from "@/types/vehicleReport";
import NumberChecker from "@/components/vehicleReport/NumberChecker";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const MONTH_NAMES = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export default function NewVehicleReport({
  reportData,
}: {
  reportData: TNewVehicleReportData;
}) {
  const createdAtDate = new Date(reportData.createdAt);
  const createdAtStr = createdAtDate.toLocaleString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  // Convert month number to short name (e.g., 12 -> 'DEC')
  const preferredMonth = reportData.buyingPreferenceMonth
    .toString()
    .padStart(2, "0")
    .slice(-2); // Extract month from YYYYMM format
  const buyingMonthName = MONTH_NAMES[parseInt(preferredMonth, 10) - 1] || "-";

  return (
    <div className="min-h-screen bg-background text-on-surface font-body pb-32 selection:bg-primary/30">
      {/* Header */}
      <Header />

      <main className="mt-8 px-container-margin space-y-stack-gap-lg max-w-md mx-auto">
        {/* Report Meta */}
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
            Guidance Report
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

        {/* Hero Profile Card */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="glass-card relative overflow-hidden rounded-xl p-6 border-primary/20"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, rgba(242,202,80,0.15) 0%, transparent 70%)",
            }}
          />
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-headline  font-semibold text-on-surface">
                Your Vehicle <br /> Profile
              </h2>
            </div>
            <div className="bg-primary/10 border border-primary/20 px-2 py-1 rounded-full">
              <span className="text-primary  text-label-caps">
                Cosmic Alignment Analysis
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center space-y-1">
              <p className="text-label-caps text-on-surface-variant">BIRTH</p>
              <p className="font-numeral text-data-numeral text-primary leading-none">
                #{reportData?.birthNumber}
              </p>
            </div>
            <div className="text-center space-y-1 border-x border-white/10">
              <p className="text-label-caps text-on-surface-variant">DESTINY</p>
              <p className="font-numeral text-data-numeral text-primary leading-none">
                #{reportData?.destinyNumber}
              </p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-label-caps text-on-surface-variant">MONTH</p>
              <p className="font-headline text-headline-sm text-on-surface mt-2 uppercase tracking-tighter">
                {buyingMonthName}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 py-1.5 rounded-lg text-primary">
              <span className="material-symbols-outlined text-[18px]">
                verified
              </span>
              <span className="text-label-caps">
                {reportData?.vehicleProfileTitle}
              </span>
            </div>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              {reportData?.vehicleProfileText}
            </p>
          </div>
        </motion.section>

        {/* Lucky Vehicle Colors */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="space-y-stack-gap-md"
        >
          <motion.h3
            variants={fadeUp}
            className="font-headline text-headline-sm font-semibold flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-primary">
              palette
            </span>
            Lucky Vehicle Colors
          </motion.h3>
          <div className="flex flex-col gap-stack-gap-md">
            {reportData?.recommendedColors.map((c, i) => (
              <motion.div
                key={c.color}
                variants={fadeUp}
                className={`glass-card rounded-xl p-4 flex items-center gap-4 transition-all`}
              >
                <div
                  className={`w-16 h-16 rounded-lg shadow-inner border shrink-0`}
                  style={{
                    backgroundColor: c.hex,
                    borderColor: darkenHex(c.hex, 50),
                  }}
                />
                <div>
                  <h4 className="text-label-caps text-on-surface uppercase">
                    #{i + 1} {c.color}
                  </h4>
                  <p
                    className={`text-[11px] font-bold ${c.category === "primary" ? "text-primary" : "text-on-surface-variant"}`}
                  >
                    {c.category === "primary"
                      ? "STRONG MATCH"
                      : "BALANCED MATCH"}
                  </p>
                  <p className="text-body-sm text-on-surface-variant mt-1">
                    {c.reason}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Avoid colors */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="glass-card rounded-xl p-5 border-[#ffb4ab]/20"
        >
          <motion.h3
            variants={fadeUp}
            className="font-headline text-body-lg font-semibold text-on-surface flex items-center gap-2 mb-4"
          >
            <span className="material-symbols-outlined text-[#ffb4ab] text-headline-sm">
              warning
            </span>
            Avoid Colors
          </motion.h3>
          <ul className="flex flex-col gap-3">
            {reportData?.avoidColors.map((item) => (
              <motion.li
                key={item.color}
                variants={fadeUp}
                className="flex items-center gap-2 text-body-sm text-on-surface-variant"
              >
                <div
                  className={`w-8 h-8 rounded shadow-inner border shrink-0`}
                  style={{
                    backgroundColor: item.hex,
                    borderColor: darkenHex(item.hex, 10),
                  }}
                />
                <div>
                  <div>{item.color}</div>
                  <div className="text-label-caps">{item.reason}</div>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* Recommended Dates */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="space-y-stack-gap-md"
        >
          <motion.h3
            variants={fadeUp}
            className="font-headline text-headline-sm font-semibold flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-primary">
              calendar_month
            </span>
            Recommended Dates
          </motion.h3>
          {reportData?.recommendedDatesNote && (
            <motion.div
              variants={fadeUp}
              className="flex items-start gap-2 rounded-xl border border-[#ffb4ab]/20 bg-[#ffb4ab]/10 p-3"
            >
              <span className="material-symbols-outlined text-[#ffb4ab] text-[18px] mt-0.5 shrink-0">
                info
              </span>
              <p className="text-body-sm text-on-surface-variant">
                {reportData.recommendedDatesNote}
              </p>
            </motion.div>
          )}
          <div className="grid grid-cols-3 gap-2 pb-4">
            {reportData?.recommendedDates.map((d, i) => {
              // Convert to a Date object to get the weekday
              const monthIndex = MONTH_NAMES.indexOf(d.month);
              const dateObj = new Date(
                Number(d.year),
                monthIndex,
                Number(d.day),
              );
              const weekday = dateObj.toLocaleDateString("en-US", {
                weekday: "long",
              });
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className={`glass-card shrink-0 flex flex-col justify-end w-full rounded-xl p-4 text-center snap-center border-primary/40`}
                  style={
                    d.stars === 5
                      ? {
                          background:
                            "radial-gradient(circle at 50% 50%, #ffc8001d 0%, #ffc8000d 40%, #ffc8000a 70%, transparent 100%)",
                        }
                      : {}
                  }
                >
                  <div className="flex justify-center">
                    {d.stars === 5 && (
                      <div className="text-primary border px-1 rounded border-primary text-[10px] whitespace-nowrap">
                        STRONG MATCH
                      </div>
                    )}

                    {d.stars === 4 && (
                      <div className="text-primary/70 border px-1 rounded border-primary/70 text-[10px] whitespace-nowrap">
                        GOOD MATCH
                      </div>
                    )}
                  </div>
                  <div>
                    <p
                      className={`font-numeral text-data-numeral my-1 text-primary space-x-2`}
                    >
                      <span className="text-lg">{d.day}</span>
                      <span className="text-lg">{d.month}</span>
                    </p>
                    <p className={`text-label-caps text-on-surface-variant`}>
                      {d.year}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {weekday}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Number Plate Strategy */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="space-y-stack-gap-md"
        >
          <h3 className="font-headline text-headline-sm font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">pin</span>
            Number Plate Strategy
          </h3>
        </motion.section>

        {/* Vehicle Number Compatibility Checker */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="glass-card rounded-xl p-5 border-outline-variant"
        >
          <NumberChecker reportData={reportData} />
        </motion.section>

        {/* Avoid Patterns */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="glass-card rounded-xl p-5 border-[#ffb4ab]/20"
        >
          <motion.h3
            variants={fadeUp}
            className="font-headline text-body-lg font-semibold text-on-surface flex items-center gap-2 mb-4"
          >
            <span className="material-symbols-outlined text-[#ffb4ab] text-headline-sm">
              warning
            </span>
            Avoid Patterns
          </motion.h3>
          <ul className="flex flex-col gap-3">
            {reportData?.avoidPatterns.map((item) => (
              <motion.li
                key={item}
                variants={fadeUp}
                className="flex items-center gap-2 text-body-sm text-on-surface-variant"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/60 shrink-0" />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* AI Deep Analysis */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="glass-card rounded-xl p-6 border-primary/10"
        >
          <AiDeepAnalysis reportData={reportData} />
        </motion.section>

        {/* Action Buttons */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="flex flex-col gap-stack-gap-md pb-12"
        >
          <button className="cursor-pointer bg-primary hover:opacity-90 active:scale-[0.98] transition-all text-on-primary text-headline-sm h-14 rounded-xl flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(242,202,80,0.3)]">
            <span className="material-symbols-outlined">download</span>
            Download PDF Report
          </button>
          <button className="cursor-pointer glass-card hover:bg-white/10 active:scale-[0.98] transition-all text-on-surface text-headline-sm h-14 rounded-xl flex items-center justify-center gap-3">
            <span className="material-symbols-outlined">share</span>
            Share Guidance Report
          </button>
        </motion.section>
      </main>

      {/* Sticky Bottom Bar */}
      <MobileNav active="reports" />
    </div>
  );
}
