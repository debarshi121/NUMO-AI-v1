import { TNewVehicleReportData } from "@/types/vehicleReport";
import React, { useState } from "react";
import CompatibilityButton from "../CompatibilityButton";

const NumberChecker = ({
  reportData,
}: {
  reportData: TNewVehicleReportData;
}) => {
  const recommendedTotalsText =
    reportData?.recommendedTotals.length > 2
      ? `${reportData.recommendedTotals.slice(0, -1).join(", ")} or ${reportData?.recommendedTotals[reportData.recommendedTotals.length - 1]}`
      : reportData?.recommendedTotals.join(", ");

  // Vehicle Number Compatibility Checker state
  const [vehicleNumber, setVehicleNumber] = useState("");

  const [result, setResult] = useState<null | {
    vehicleNumber: string;
    finalNumber: number;
    matchType: string;
    reason: string;
    title: string;
    suggestion: string;
  }>(null);

  function getMatchTypeBadgeClasses(matchType: string): string {
    switch (matchType) {
      case "STRONG MATCH":
        return "text-primary border-primary";
      case "GOOD MATCH":
        return "text-primary/70 border-primary/70";
      case "AVERAGE":
        return "text-white/70 border-white/50";
      case "WEAK MATCH":
        return "text-[#ffb4ab] border-[#ffb4ab]/70";
      default:
        return "text-primary/80 border-primary/70";
    }
  }

  function handleReset() {
    setVehicleNumber("");
    setResult(null);
  }
  return (
    <>
      {/* Preferred totals */}
      <div>
        <p className="text-label-caps text-on-surface-variant mb-3">
          YOUR PREFERRED TOTALS:
        </p>
        <div className="flex gap-2 mb-3">
          {reportData?.recommendedTotals.map((n) => (
            <span
              key={n}
              className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center font-numeral text-sm font-bold text-primary"
            >
              {n}
            </span>
          ))}
        </div>
        <p className="text-label-caps text-outline mb-8">
          Choose dealer-available numbers reducing to {recommendedTotalsText}
        </p>
      </div>

      <h4 className="text-label-caps text-primary mb-2 font-semibold">
        ENTER VEHICLE NUMBER
      </h4>
      <div className="bg-black/60 rounded-lg flex items-center px-4 py-3 mb-3 border border-outline-variant">
        <span className="material-symbols-outlined text-primary mr-3">
          directions_car
        </span>
        <input
          type="text"
          className="bg-transparent outline-none w-full text-headline-md tracking-widest font-mono text-on-surface placeholder:text-outline/30"
          placeholder="AS01GP7597"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
          maxLength={10}
        />
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary text-body-lg!">
          auto_awesome
        </span>
        <span className="text-xs text-on-surface-variant">
          We automatically extract and calculate the vibration.
        </span>
      </div>
      <CompatibilityButton
        plateData={{
          vehicleNumber,
          birthNumber: reportData?.birthNumber,
          destinyNumber: reportData?.destinyNumber,
        }}
        onResult={(compatibilityResult) => {
          setResult({
            vehicleNumber,
            finalNumber: compatibilityResult.runningNumber,
            matchType: compatibilityResult.status,
            reason: compatibilityResult.description,
            title: compatibilityResult.title,
            suggestion: compatibilityResult.suggestion,
          });
        }}
      />
      {result && (
        <div className="rounded-full text-primary bg-black/40 border border-primary/30 px-2 py-2 mb-4 text-body-sm flex flex-col items-center justify-center">
          <div>
            <span className="font-mono tracking-widest">
              {result.vehicleNumber} →{" "}
            </span>{" "}
            <span className="tracking-normal whitespace-nowrap">
              Final Number: {result.finalNumber}
            </span>
          </div>
          <div
            className={`ml-2 font-bold border rounded max-w-min whitespace-nowrap px-2 mt-1 text-label-caps transition-shadow ${getMatchTypeBadgeClasses(result.matchType)} ${
              result.matchType === "STRONG MATCH"
                ? "shadow-[0_0_0_1px_rgba(242,202,80,0.9),0_0_12px_rgba(242,202,80,0.65),0_0_24px_rgba(242,202,80,0.35)]"
                : ""
            }`}
          >
            {result.matchType}
          </div>
        </div>
      )}
      {result && (
        <div
          className="glass-card rounded-lg p-4 mb-4"
          style={
            result.matchType === "WEAK MATCH"
              ? { background: "linear-gradient(135deg, #0A0A0A 0%, #1a0a0a 100%)" }
              : undefined
          }
        >
          <h5 className="text-label-caps text-outline mb-2">{result.title}</h5>
          <p className="text-body-sm text-on-surface-variant mb-3">
            {result.reason}
          </p>
          <p className="text-sm text-primary font-medium">
            {result.suggestion}
          </p>
        </div>
      )}
      <button
        className="w-full cursor-pointer glass-card hover:bg-white/10 active:scale-[0.98] transition-all text-on-surface text-sm font-semibold h-12 rounded-xl flex items-center justify-center gap-2 mt-2"
        onClick={handleReset}
      >
        <span className="material-symbols-outlined">refresh</span> Check New
        Number
      </button>
    </>
  );
};

export default NumberChecker;
