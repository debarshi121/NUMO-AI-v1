"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { calculateVehicleCompatibility, type CompatibilityResult } from "@/lib/numerology/engine/number-engine";

type PlateData = {
    vehicleNumber: string;
    birthNumber: number;
    destinyNumber: number;
};

type CompatibilityButtonProps = {
    plateData: PlateData;
    onResult: (result: CompatibilityResult) => void;
};

export default function CompatibilityButton({ plateData, onResult }: CompatibilityButtonProps) {
    const [lastStatus, setLastStatus] = useState<CompatibilityResult["status"] | null>(null);

    const isStrongMatch = lastStatus === "STRONG MATCH";

    function handleClick() {
        // A plate with no digits at all reduces to a vibration of 0, which isn't a real
        // numerology digit (1-9) — bail out instead of showing a misleadingly plausible verdict.
        if (!plateData.vehicleNumber || !/\d/.test(plateData.vehicleNumber)) return;

        const compatibilityResult = calculateVehicleCompatibility(
            plateData.vehicleNumber,
            plateData.birthNumber,
            plateData.destinyNumber
        );

        setLastStatus(compatibilityResult.status);
        onResult(compatibilityResult);
    }

    return (
        <div className="mb-4">
            <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={handleClick}
                className={`w-full cursor-pointer transition-all text-on-primary text-sm font-semibold h-12 rounded-xl flex items-center justify-center gap-2 ${isStrongMatch
                        ? "bg-linear-to-r from-[#f6dd88] via-[#f2ca50] to-[#d8a928] shadow-[0_6px_24px_rgba(242,202,80,0.35)]"
                        : "bg-primary hover:opacity-90"
                    }`}
            >
                Check Compatibility <span className="material-symbols-outlined">bolt</span>
            </motion.button>
        </div>
    );
}