import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import {
  createMTAccidentReport,
  getAllMTAccidentReports,
} from "@/services/mtAccidentReportService";

/* ================= GET ================= */
export async function GET() {
  try {
    console.log("🟢 GET /api/mt-accident-reports");

    await connectDB();

    const reports = await getAllMTAccidentReports();

    return NextResponse.json(reports, { status: 200 });
  } catch (error) {
    console.error("🔥 GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch MT accident reports" },
      { status: 500 }
    );
  }
}

/* ================= POST ================= */
export async function POST(request) {
  try {
    console.log("🟢 POST /api/mt-accident-reports");

    await connectDB();

    const body = await request.json();

    const report = await createMTAccidentReport(body);

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("🔥 POST ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create MT accident report" },
      { status: 500 }
    );
  }
}
