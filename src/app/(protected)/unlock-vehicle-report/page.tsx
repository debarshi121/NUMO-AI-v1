import { redirect } from "next/navigation";
import { ProductType } from "@prisma/client";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import {
  calculateBirthNumber,
  calculateDestinyNumber,
  calculateVehicleNumerologyNumber,
} from "@/lib/numerology/calculators/numerology";
import {
  getNewVehicleAlignment,
  getOldVehicleAlignment,
} from "@/lib/numerology/calculators/others";
import { getVehicleColorAnalysis } from "@/lib/numerology/engine/color-engine";
import { getHiddenConflicts } from "@/lib/numerology/engine/conflict-engine";
import UnlockOldReportCard from "./UnlockOldReportCard";
import UnlockNewReportCard from "./UnlockNewReportCard";

export default async function UnlockReportPage({
  searchParams,
}: {
  searchParams: Promise<{ reportId?: string }>;
}) {
  const { reportId } = await searchParams;

  if (!reportId) redirect("/vehicle-numerology");

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: {
      userId: true,
      productType: true,
      buyingPreferenceMonth: true,
      dob: true,
      vehicleRegNumber: true,
      purchaseDate: true,
      vehicleColor: true,
    },
  });

  if (!report || report.userId !== session.user.id)
    redirect("/vehicle-numerology");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, mobile: true },
  });

  const birthNumber = calculateBirthNumber(report.dob);
  const destinyNumber = calculateDestinyNumber(report.dob);

  // Each branch below computes and renders its own card so that the profile
  // shape (NewVehicleAlignmentResult vs. OldVehicleAlignmentResult) stays
  // correctly narrowed to the matching report type, instead of collapsing
  // into a loosely-typed shared variable.
  let unlockCard: React.ReactNode;

  if (report.productType === ProductType.NEW_VEHICLE_REPORT) {
    const profile = getNewVehicleAlignment(birthNumber, destinyNumber);
    const yyyymm = report.buyingPreferenceMonth;
    const buyingMonthLabel = yyyymm
      ? new Date(
          Math.floor(yyyymm / 100),
          (yyyymm % 100) - 1,
          1,
        ).toLocaleString("default", { month: "long", year: "numeric" })
      : null;

    unlockCard = (
      <UnlockNewReportCard
        birthNumber={birthNumber}
        destinyNumber={destinyNumber}
        buyingMonthLabel={buyingMonthLabel}
        profile={profile}
        reportId={reportId}
        user={user}
      />
    );
  } else if (report.productType === ProductType.OLD_VEHICLE_REPORT) {
    const vehicleNumerologyNumber = calculateVehicleNumerologyNumber(
      report.vehicleRegNumber!,
    );
    const purchaseDateNumerologyNumber = calculateDestinyNumber(
      report.purchaseDate!,
    );
    const { status: colorMatchStatus } = getVehicleColorAnalysis(
      birthNumber,
      destinyNumber,
      report.vehicleColor!,
    );
    const conflicts = getHiddenConflicts(
      birthNumber,
      destinyNumber,
      vehicleNumerologyNumber,
      report.vehicleColor!,
      purchaseDateNumerologyNumber,
      report.purchaseDate!,
    );
    const profile = getOldVehicleAlignment(
      birthNumber,
      destinyNumber,
      vehicleNumerologyNumber,
      colorMatchStatus,
      conflicts.length,
    );
    // Teaser copy: show only the first sentence until the report is unlocked.
    profile.text = profile.text.slice(0, profile.text.indexOf("."));

    unlockCard = (
      <UnlockOldReportCard
        birthNumber={birthNumber}
        destinyNumber={destinyNumber}
        vehicleNumerologyNumber={vehicleNumerologyNumber}
        vehicleRegNumber={report.vehicleRegNumber!}
        profile={profile}
        reportId={reportId}
        user={user}
      />
    );
  } else {
    redirect("/vehicle-numerology");
  }

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#e5e2e1] antialiased">
      <Header />

      <main className="mx-auto max-w-md px-5 pb-32 pt-2 flex flex-col gap-4">
        {unlockCard}
      </main>

      <MobileNav active="divine" />
    </div>
  );
}
