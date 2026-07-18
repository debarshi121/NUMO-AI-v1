"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import OldVehicleInsightsForm from "@/components/OldVehicleInsightsForm";
import Show from "@/components/Show";
import CreatingVehicleReport from "@/components/CreatingVehicleReport";

export default function ExistingVehicleAnalysisPage() {
    const router = useRouter();
    const [creatingReport, setCreatingReport] = useState(false);

    const apiDone = useRef(false);
    const animationDone = useRef(false);
    const reportIdRef = useRef<string | null>(null);

    const tryRedirect = useCallback(() => {
        if (apiDone.current && animationDone.current) {
            const path = reportIdRef.current
                ? `/unlock-vehicle-report?reportId=${reportIdRef.current}`
                : null;
            if (path) router.push(path);
        }
    }, [router]);

    const handleAnimationComplete = useCallback(() => {
        animationDone.current = true;
        tryRedirect();
    }, [tryRedirect]);

    const handleSubmitInsightsForm = async ({ dob, vehicleRegNumber, vehicleColor, purchaseDate }: { dob: string; vehicleRegNumber: string; vehicleColor: string; purchaseDate: string }) => {
        apiDone.current = false;
        animationDone.current = false;
        reportIdRef.current = null;
        setCreatingReport(true);

        try {
            const { data } = await axios.post("/api/vehicle-report", { vehicleType: 'old', dob, vehicleRegNumber, vehicleColor, purchaseDate });
            if (data.reportId) reportIdRef.current = data.reportId;
            apiDone.current = true;
            tryRedirect();
        } catch (err) {
            const message = axios.isAxiosError(err)
                ? (err.response?.data?.error ?? "Failed to create report. Please try again.")
                : "Failed to create report. Please try again.";
            setCreatingReport(false);
            toast.error(message);
        }
    };

    return (
        <main className="pb-32 pt-8 px-container-margin space-y-stack-gap-lg max-w-md mx-auto">
            <Show when={creatingReport}>
                <CreatingVehicleReport onComplete={handleAnimationComplete} />
            </Show>
            <Show when={!creatingReport}>
                <OldVehicleInsightsForm onSubmit={handleSubmitInsightsForm} />
            </Show>
        </main>
    );
}
