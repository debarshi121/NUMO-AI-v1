import { NextRequest, NextResponse } from "next/server";
import { ProductType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { createReportWithUniqueId } from "@/lib/reports/createReport";
import { newVehicleSchema, oldVehicleSchema } from "./schemas";

export async function getVehicleReports(userId: string, req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.toLowerCase().trim() ?? "";

  const reports = await prisma.report.findMany({
    where: { userId, reportGeneratedAt: { not: null } },
    orderBy: { createdAt: "desc" },
    select: { id: true, createdAt: true, reportData: true },
  });

  const mapped = reports.map((r) => {
    const data = r.reportData as Record<string, unknown> | null;
    return {
      id: r.id,
      createdAt: r.createdAt,
      title: (data?.vehicleProfileTitle as string) ?? "Vehicle Report",
      referenceId: r.id,
    };
  });

  const result = q
    ? mapped.filter(
      (r) => r.title.toLowerCase().includes(q) || r.referenceId.toLowerCase().includes(q)
    )
    : mapped;

  return NextResponse.json({ success: true, reports: result });
}

export async function createNewVehicleReport(userId: string, body: unknown) {
  const { dob, purchaseMonth } = newVehicleSchema.parse(body);
  const productType = ProductType.NEW_VEHICLE_REPORT;

  const [year, monthIndex] = purchaseMonth.split("-").map(Number);
  // Store as YYYYMM integer (convert 0-indexed month to 1-indexed)
  const buyingPreferenceMonth = year * 100 + (monthIndex + 1);
  const dobDate = new Date(dob);

  // If a draft report (orderId: null) already exists for this user with the same
  // product type, DOB, and buying month, update it instead of creating a duplicate.
  // This handles the case where the user re-submits the form before completing payment.
  return prisma.$transaction(async (tx) => {
    const existing = await tx.report.findFirst({
      where: { userId, productType, dob: dobDate, buyingPreferenceMonth, orderId: null },
    });

    if (existing) {
      return tx.report.update({
        where: { id: existing.id },
        data: { updatedAt: new Date() },
      });
    }

    return createReportWithUniqueId((id) =>
      tx.report.create({
        data: { id, userId, productType, dob: dobDate, buyingPreferenceMonth },
      })
    );
  });
}

export async function createOldVehicleReport(userId: string, body: unknown) {
  const { dob, vehicleRegNumber, vehicleColor, purchaseDate } =
    oldVehicleSchema.parse(body);
  const productType = ProductType.OLD_VEHICLE_REPORT;

  const dobDate = new Date(dob);
  const purchaseDateObj = new Date(purchaseDate);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.report.findFirst({
      where: { userId, productType, dob: dobDate, vehicleRegNumber, orderId: null },
    });

    if (existing) {
      return tx.report.update({
        where: { id: existing.id },
        data: { vehicleColor, purchaseDate: purchaseDateObj, updatedAt: new Date() },
      });
    }

    return createReportWithUniqueId((id) =>
      tx.report.create({
        data: {
          id,
          userId,
          productType,
          dob: dobDate,
          vehicleRegNumber,
          vehicleColor,
          purchaseDate: purchaseDateObj,
        },
      })
    );
  });
}
