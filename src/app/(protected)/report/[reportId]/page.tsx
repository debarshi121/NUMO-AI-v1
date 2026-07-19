import { redirect } from "next/navigation";
import { ProductType } from "@prisma/client";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import {
  NEW_VEHICLE_REPORT_SCHEMA_VERSION,
  OLD_VEHICLE_REPORT_SCHEMA_VERSION,
  TNewVehicleReportData,
  TOldVehicleReportData,
} from "@/types/vehicleReport";
import NewVehicleReport from "./NewVehicleReport";
import OldVehicleReport from "./OldVehicleReport";
import {
  generateNewVehicleReportData,
  generateOldVehicleReportData,
} from "@/lib/reports/generateReportData";

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ reportId?: string }>;
  searchParams: Promise<{ scrollTo?: string }>;
}) {
  const { reportId } = await params;
  const { scrollTo } = await searchParams;

  if (!reportId) redirect("/vehicle-numerology");

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: {
      userId: true,
      orderId: true,
      productType: true,
      dob: true,
      buyingPreferenceMonth: true,
      createdAt: true,
      reportData: true,
      reportGeneratedAt: true,
      purchaseDate: true,
      vehicleColor: true,
      vehicleRegNumber: true,
      user: { select: { name: true } },
      order: { select: { status: true } } as const,
    },
  });

  // Report must exist, belong to this user, and have a completed order

  if (report) {
    if (report.order?.status !== "COMPLETED") {
      redirect(`/unlock-report?reportId=${reportId}`);
    }

    if (report.productType === ProductType.NEW_VEHICLE_REPORT) {
      if (
        report.userId !== session.user.id ||
        !report.orderId ||
        !report.dob ||
        !report.buyingPreferenceMonth ||
        !report.user?.name ||
        !report.createdAt ||
        !report.order
      ) {
        redirect("/vehicle-numerology");
      }
    } else if (report.productType === ProductType.OLD_VEHICLE_REPORT) {
      if (
        report.userId !== session.user.id ||
        !report.orderId ||
        !report.dob ||
        !report.user?.name ||
        !report.createdAt ||
        !report.order ||
        !report.purchaseDate ||
        !report.vehicleColor ||
        !report.vehicleRegNumber
      ) {
        redirect("/vehicle-numerology");
      }
    }
  } else {
    redirect("/vehicle-numerology");
  }

  // if reportGeneratedAt is unset, create the report and store it on db

  if (report.productType === ProductType.NEW_VEHICLE_REPORT) {
    let reportData: TNewVehicleReportData;
    const cachedNewReportData = report.reportData as unknown as
      | TNewVehicleReportData
      | null;
    // Cached reports from an older schema/scoring version are regenerated rather
    // than served stale — see NEW_VEHICLE_REPORT_SCHEMA_VERSION.
    const isNewReportStale =
      !cachedNewReportData ||
      cachedNewReportData.reportSchemaVersion !== NEW_VEHICLE_REPORT_SCHEMA_VERSION;

    if (!report.reportGeneratedAt || isNewReportStale) {
      reportData = generateNewVehicleReportData({
        reportId,
        dob: report.dob,
        buyingPreferenceMonth: report.buyingPreferenceMonth!,
        userName: report.user.name!,
        createdAt: report.createdAt,
      });

      // Update the report with the generated report data and stamp reportGeneratedAt
      await prisma.report.update({
        where: { id: reportId },
        data: {
          reportData,
          reportGeneratedAt: new Date(),
        },
      });
    } else {
      reportData = cachedNewReportData;
    }
    return <NewVehicleReport reportData={reportData} scrollToSection={scrollTo} />;
  } else {
    let reportData: TOldVehicleReportData;
    const cachedReportData = report.reportData as unknown as
      | TOldVehicleReportData
      | null;
    // Cached reports from an older schema/scoring version are regenerated rather
    // than served stale — see OLD_VEHICLE_REPORT_SCHEMA_VERSION.
    const isStale =
      !cachedReportData ||
      cachedReportData.reportSchemaVersion !== OLD_VEHICLE_REPORT_SCHEMA_VERSION;

    if (!report.reportGeneratedAt || isStale) {
      reportData = generateOldVehicleReportData({
        reportId,
        dob: report.dob,
        userName: report.user.name!,
        createdAt: report.createdAt,
        purchaseDate: report.purchaseDate!,
        vehicleRegNumber: report.vehicleRegNumber!,
        vehicleColor: report.vehicleColor!,
      });

      // Update the report with the generated report data and stamp reportGeneratedAt
      await prisma.report.update({
        where: { id: reportId },
        data: {
          reportData,
          reportGeneratedAt: new Date(),
        },
      });
    } else {
      reportData = cachedReportData;
    }
    return <OldVehicleReport reportData={reportData} />;
  }
}
