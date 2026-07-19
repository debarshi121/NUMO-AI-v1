"use client";

import CreatingVehicleReport from '@/components/CreatingVehicleReport';
import NewVehicleInsightsForm from '@/components/NewVehicleInsightsForm';
import Show from '@/components/Show';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'nextjs-toploader/app';
import { useCallback, useRef, useState } from 'react';

export default function NewVehicleAnalysisPage() {
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

    const handleSubmitInsightsForm = async ({ dob, purchaseMonth }: { dob: string; purchaseMonth: string }) => {
        apiDone.current = false;
        animationDone.current = false;
        reportIdRef.current = null;
        setCreatingReport(true);

        try {
            const { data } = await axios.post("/api/vehicle-report", { vehicleType: 'new', dob, purchaseMonth });
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
        <main className="pb-32 pt-8">
            <Show when={creatingReport}>
                <CreatingVehicleReport onComplete={handleAnimationComplete} />
            </Show>
            <Show when={!creatingReport}>
                <NewVehicleInsightsForm onSubmit={handleSubmitInsightsForm} />
            </Show>
        </main>
    );
}
