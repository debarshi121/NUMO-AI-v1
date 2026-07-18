"use client";

import { motion, type Variants } from "framer-motion";
import PaymentButton from "@/components/payments/payment-button";
import type { OldVehicleAlignmentResult } from "@/lib/numerology/calculators/others";

const CHECKLIST_ITEMS = [
  "Vehicle number analyzed",
  "Color compatibility checked",
  "Purchase date evaluated",
  "Hidden insights detected",
];

const UNLOCK_ITEMS = [
  { icon: "palette", label: "Is your vehicle color lucky?" },
  { icon: "calendar_month", label: "Is your purchase date auspicious?" },
  { icon: "grid_view", label: "Is your vehicle number aligned?" },
  { icon: "healing", label: "Personalized remedies to improve luck!" },
  { icon: "picture_as_pdf", label: "Premium PDF report!" },
];

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

type Props = {
  birthNumber: number;
  destinyNumber: number;
  vehicleNumerologyNumber: number;
  vehicleRegNumber: string;
  profile: OldVehicleAlignmentResult;
  reportId: string;
  user: {
    name: string | null;
    email: string | null;
    mobile: string | null;
  } | null;
};

export default function UnlockOldReportCard({
  birthNumber,
  destinyNumber,
  vehicleNumerologyNumber,
  vehicleRegNumber,
  profile,
  reportId,
  user,
}: Props) {
  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="contents">
      {/* Vehicle Buying Profile Card */}
      <motion.div variants={fadeUp} className="relative rounded-2xl border border-outline-variant bg-[#161510]/40 p-5 mb-4">
        <p className="text-[13px] flex justify-between font-semibold tracking-widest text-primary uppercase mb-4">
          <span>Vehicle Profile</span>
          <span className="text-accent-foreground">{vehicleRegNumber}</span>
        </p>

        {/* Stats row */}
        <motion.div variants={stagger} className="flex gap-3 mb-4">
          <motion.div variants={fadeUp} className="flex-1 rounded-xl border border-outline-variant bg-[#161510]/40 p-3">
            <p className="text-[10px] text-center tracking-widest text-outline uppercase mb-2">
              Birth #
            </p>
            <p className="font-mono text-center text-data-numeral font-medium text-primary leading-none">
              {birthNumber}
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="flex-1 rounded-xl border border-outline-variant bg-[#161510]/40 p-3">
            <p className="text-[10px] text-center tracking-widest text-outline uppercase mb-2">
              Destiny #
            </p>
            <p className="font-mono text-center text-data-numeral font-medium text-primary leading-none">
              {destinyNumber}
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="flex-1 rounded-xl border border-outline-variant bg-[#161510]/40 p-3">
            <p className="text-[10px] text-center tracking-widest text-outline uppercase mb-2">
              Vehicle #
            </p>
            <p className="font-mono text-center text-data-numeral font-medium text-primary leading-none">
              {vehicleNumerologyNumber}
            </p>
          </motion.div>
        </motion.div>

        {/* Alignment banner */}
        <motion.div variants={fadeUp} className="rounded-xl border border-primary/30 bg-[#161510]/40 px-4 py-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary">
              auto_awesome
            </span>
            <p className="text-[10px] font-bold tracking-widest text-primary uppercase">
              {profile.title}
            </p>
          </div>
          <p className="text-label-caps text-on-surface-variant leading-relaxed break-words">
            {profile.text}{" "}
            <span className="px-2 rounded bg-on-surface-variant/10 blur-[4px] align-middle">
              Unlock to view the full report Unlock to view the full report
              Unlock to view the full report Unlock to view the full report
              Unlock to view the full report Unlock to view the full report
              Unlock to view the full report Unlock to view the full report
            </span>
          </p>
        </motion.div>
      </motion.div>

      {/* Analysis Progress Card */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-outline-variant bg-[#161510]/40 px-5 py-4 mb-4">
        <p className="text-[10px] tracking-widest text-outline uppercase mb-3">
          Preliminary Analysis
        </p>
        <div className="h-2 w-full rounded-full bg-surface-container-high overflow-hidden mb-2">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-primary-container to-primary" />
        </div>

        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-right text-label-caps text-primary">
            Analysis Completed
          </span>
          <span className="shrink-0 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />
            Premium report ready
          </span>
        </div>

        <ul className="flex flex-col gap-2">
          {CHECKLIST_ITEMS.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-body-sm text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[18px]! text-primary">
                check_circle
              </span>
              {item}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* What You'll Unlock Card */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-outline-variant bg-[#161510]/40 p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-body-lg font-medium text-on-surface">
            What You&apos;ll Unlock
          </h3>
        </div>
        <ul className="flex flex-col gap-3">
          {UNLOCK_ITEMS.map(({ icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2 text-body-sm text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[18px]! text-primary">
                {icon}
              </span>
              {label}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* CTA / Paywall Card */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-outline-variant bg-[#161510]/40 p-6 text-center relative mt-8">
        {/* Lock icon */}
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-[#161510] border border-primary">
          <span className="material-symbols-outlined text-[28px] text-primary [font-variation-settings:'FILL'_1]">
            lock
          </span>
        </div>

        <h2 className="text-headline-sm font-medium font-headline text-on-surface mt-4 mb-2">
          Unlock Your Complete <br /> Vehicle Insights
        </h2>

        <p className="text-[13px] text-outline mb-5 leading-relaxed">
          We&apos;ve completed your numerology analysis. Unlock your full
          personalized vehicle insights report.
        </p>

        <p className="text-display-lg font-medium font-mono text-primary mb-5 leading-none">
          ₹99
        </p>

        <div className="flex items-start justify-center">
          <ul className="flex flex-col gap-2 mb-5 max-w-min">
            {[
              "Personalized for your DOB",
              "AI + Numerology based analysis",
              "Downloadable premium PDF report",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-1 text-label-caps text-on-surface-variant whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[14px]! text-primary">
                  check_circle
                </span>
                <span className="leading-[14px]">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <motion.div variants={fadeUp}>
          <PaymentButton
            productType="OLD_VEHICLE_REPORT"
            referenceId={reportId}
            label={
              <>
                BUY NOW
              </>
            }
            prefill={{
              name: user?.name ?? "",
              email: user?.email ?? "",
              contact: user?.mobile ?? "",
            }}
            className="w-full cursor-pointer rounded-xl bg-primary py-4 text-[15px] font-bold text-on-primary tracking-wide hover:bg-primary-container active:scale-[0.98] transition-all h-auto"
          />
        </motion.div>

        {/* Trust badges */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-body-lg! text-outline">
              lock
            </span>
            <span className="text-[10px] tracking-wider text-outline uppercase">
              Secure
              <br />
              Payment
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-body-lg! text-outline">
              bolt
            </span>
            <span className="text-[10px] tracking-wider text-outline uppercase">
              Instant
              <br />
              Access
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-body-lg! text-outline">
              description
            </span>
            <span className="text-[10px] tracking-wider text-outline uppercase">
              PDF
              <br />
              Included
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
