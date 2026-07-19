"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import Show from "@/components/Show";
import axios from "axios";
import dayjs from "dayjs";
import { useDebounce } from "@/hooks/useDebounce";
import DownloadReportPdfButton from "@/components/vehicleReport/DownloadReportPdfButton";

type Report = {
  id: string;
  createdAt: string;
  title: string;
  referenceId: string;
  vehicleType: string;
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const fetchReports = async (q: string) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/vehicle-report", {
        params: q ? { q } : {},
      });
      if (res.data.success) {
        setReports(res.data.reports);
      }
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-on-surface antialiased pb-28">
      {/* Ambient glows */}
      <div className="fixed top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <Header />

      <main className="mt-8 px-container-margin space-y-stack-gap-lg max-w-md mx-auto">
        {/* Header Section */}
        <section className="mb-8">
          <h2 className="font-headline text-[20px] font-semibold leading-7 text-on-surface mb-1">
            My Reports
          </h2>
          <p className="text-body-sm text-on-surface-variant">
            Access your previously generated vehicle guidance reports
          </p>
        </section>

        {/* Search */}
        <div className="mb-4 relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search report ID or Date"
            className="w-full bg-[#050505] border border-outline-variant rounded-xl pl-11 pr-4 py-3 text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Reports List */}
        <Show when={loading}>
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="glass-card rounded-xl p-4 h-44 animate-pulse bg-surface-container-low"
              />
            ))}
          </div>
        </Show>

        <Show when={!loading && !!reports.length}>
          <motion.div
            className="flex flex-col gap-4"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {reports.map((report) => (
              <motion.div
                key={report.id}
                variants={fadeUp}
                whileHover={{ y: -2 }}
                className="glass-card rounded-xl p-4 flex flex-col gap-4 border border-primary/20 bg-surface-container-lowest active:scale-[0.98] transition-transform"
              >
                {/* Top row: badge + status */}
                <div className="flex justify-between items-center">
                  <span
                    className="px-2 py-1 rounded text-[10px] font-bold tracking-wider text-primary"
                    style={{
                      background: "rgba(242,202,80,0.1)",
                      border: "1px solid rgba(242,202,80,0.2)",
                    }}
                  >
                    VEHICLE GUIDANCE REPORT
                  </span>
                  <span
                    className="px-2 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold tracking-wider text-green-400"
                    style={{
                      background: "rgba(34,197,94,0.1)",
                      border: "1px solid rgba(34,197,94,0.2)",
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-[12px]!"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    COMPLETED
                  </span>
                </div>

                {/* Report info */}
                <div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px]!">
                        calendar_today
                      </span>
                      <span className="text-body-sm">
                        Generated:{" "}
                        {dayjs(report.createdAt).format("MMM DD, YYYY")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px]!">
                        fingerprint
                      </span>
                      <span className="font-numeral text-[12px]! tracking-normal">
                        Report ID: {report.referenceId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => router.push(`/report/${report.id}`)}
                    className="bg-primary text-on-primary text-[12px] font-bold tracking-[0.05em] py-3 rounded-lg flex items-center justify-center gap-2 inner-glow active:scale-95 transition-transform cursor-pointer"
                  >
                    VIEW REPORT
                  </button>
                  <DownloadReportPdfButton
                    reportId={report.id}
                    label="PDF"
                    loadingLabel="PDF…"
                    iconClassName="material-symbols-outlined text-[18px]"
                    className="border border-primary/40 text-primary text-[12px] font-bold tracking-[0.05em] py-3 rounded-lg flex items-center justify-center gap-2 active:bg-primary/10 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Show>

        <Show when={!loading && !reports.length}>
          {/* Empty state */}
          <div className="mt-8 text-center p-8">
            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
              <span className="material-symbols-outlined text-primary text-[30px]">
                auto_awesome
              </span>
            </div>
            <p className="text-body-sm text-on-surface-variant">
              {debouncedSearch ? (
                "No reports match your search."
              ) : (
                <>
                  Looking for a specific vehicle?
                  <br />
                  Generate a new analysis in the Divine tab.
                </>
              )}
            </p>
          </div>
        </Show>
      </main>

      <MobileNav active="reports" />
    </div>
  );
}
