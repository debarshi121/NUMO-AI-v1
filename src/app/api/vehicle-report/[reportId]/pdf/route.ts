import { createElement } from "react";
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ProductType } from "@prisma/client";
import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import type { TNewVehicleReportData, TOldVehicleReportData } from "@/types/vehicleReport";
import NewVehicleReportDocument from "@/lib/pdf/NewVehicleReportDocument";
import OldVehicleReportDocument from "@/lib/pdf/OldVehicleReportDocument";

// GET /api/vehicle-report/[reportId]/pdf - Stream the report as a downloadable PDF
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ reportId: string }> },
) {
  const { reportId } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const report = await prisma.report.findUnique({
    where: { id: reportId },
    select: {
      userId: true,
      productType: true,
      reportData: true,
      reportGeneratedAt: true,
      order: { select: { status: true } },
    },
  });

  if (!report || report.userId !== session.user.id) {
    return NextResponse.json({ success: false, error: "Report not found." }, { status: 404 });
  }

  if (report.order?.status !== "COMPLETED") {
    return NextResponse.json(
      { success: false, error: "This report hasn't been unlocked yet." },
      { status: 403 },
    );
  }

  if (!report.reportGeneratedAt || !report.reportData) {
    return NextResponse.json(
      {
        success: false,
        error: "Report is still being generated. Please open it first, then try again.",
      },
      { status: 409 },
    );
  }

  try {
    const isNewVehicle = report.productType === ProductType.NEW_VEHICLE_REPORT;
    const reportUrl = `${req.nextUrl.origin}/report/${reportId}?scrollTo=number-plate-strategy`;
    const document = isNewVehicle
      ? createElement(NewVehicleReportDocument, {
          reportData: report.reportData as unknown as TNewVehicleReportData,
          reportUrl,
        })
      : createElement(OldVehicleReportDocument, {
          reportData: report.reportData as unknown as TOldVehicleReportData,
        });

    // The wrapper components' element type isn't recognized as DocumentProps by
    // react-pdf's typings even though they render a <Document> at their root.
    const buffer = await renderToBuffer(
      document as Parameters<typeof renderToBuffer>[0],
    );

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="numo-ai-${reportId}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("[vehicle-report pdf]", err);
    return NextResponse.json(
      { success: false, error: "Failed to generate PDF." },
      { status: 500 },
    );
  }
}
