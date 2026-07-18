"use client";

import { useState } from "react";
import { toast } from "sonner";

interface DownloadReportPdfButtonProps {
  reportId: string;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  loadingLabel?: string;
  iconClassName?: string;
}

export default function DownloadReportPdfButton({
  reportId,
  className,
  style,
  label = "Download PDF Report",
  loadingLabel = "Preparing PDF…",
  iconClassName = "material-symbols-outlined",
}: DownloadReportPdfButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/vehicle-report/${reportId}/pdf`);

      if (!res.ok) {
        let message = "Failed to download PDF. Please try again.";
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          // response wasn't JSON — keep the default message
        }
        toast.error(message);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `numo-ai-${reportId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className={className}
      style={style}
    >
      <span className={loading ? `${iconClassName} animate-spin` : iconClassName}>
        {loading ? "progress_activity" : "download"}
      </span>
      {loading ? loadingLabel : label}
    </button>
  );
}
