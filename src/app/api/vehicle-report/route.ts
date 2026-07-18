import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { getVehicleReports, createNewVehicleReport, createOldVehicleReport } from "./handlers";

// GET /api/vehicle-report?q=searchTerm - Fetch user's vehicle reports with optional search
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return getVehicleReports(session.user.id, req);
  } catch (err) {
    console.error("[vehicle-report GET]", err);
    return NextResponse.json({ success: false, error: "Failed to fetch reports." }, { status: 500 });
  }
}

// POST /api/vehicle-report - Create a new vehicle report draft
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const userId = session.user.id;

    const report =
      body.vehicleType === "old"
        ? await createOldVehicleReport(userId, body)
        : await createNewVehicleReport(userId, body);

    return NextResponse.json({ success: true, reportId: report.id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: err.issues[0].message },
        { status: 400 }
      );
    }
    console.error("[vehicle-report]", err);
    return NextResponse.json(
      { success: false, error: "Failed to create vehicle report." },
      { status: 500 }
    );
  }
}
