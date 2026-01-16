import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { MPReportService } from "@/services/investigationReport.repo";
import { createMPReportSchema } from "@/validators/investigationReport";

const service = new MPReportService();

/* ============================================================
   GET MP REPORTS WITH FILTERS
   /api/mp-reports?unit=&fmn=&fromDate=&toDate=
============================================================ */

export async function GET(request) {
  try {
    // 🔥 ALWAYS CONNECT DB IN APP ROUTES
    await connectDB();

    const { searchParams } = new URL(request.url);

    const filters = {};

    const unit = searchParams.get("unit");
    const fmn = searchParams.get("fmn");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const placeOfOffence = searchParams.get("placeOfOffence");

    if (unit) filters.unit = unit;
    if (fmn) filters.fmn = fmn;
    if (fromDate) filters.fromDate = fromDate;
    if (toDate) filters.toDate = toDate;
    if (placeOfOffence) filters.placeOfOffence = placeOfOffence;

    const reports = await service.getAllReports(filters);

    return NextResponse.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.error("MP Reports GET Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* ============================================================
   CREATE MP REPORT
============================================================ */

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const { error, value } = createMPReportSchema.validate(body, {
      abortEarly: false,
      stripUnknown: false,
    });

    if (error) {
      const errors = error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message,
      }));

      return NextResponse.json(
        { success: false, message: "Validation failed", errors },
        { status: 400 }
      );
    }

    const report = await service.createReport(value);

    return NextResponse.json(
      { success: true, data: report },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create report",
      },
      { status: 400 }
    );
  }
}
