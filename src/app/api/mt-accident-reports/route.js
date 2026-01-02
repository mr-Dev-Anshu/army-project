// app/api/mt-accident-reports/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { createMTAccidentReportSchema } from "@/validators/mtAccidentReportValidation";
import {
  createMTAccidentReport,
  getAllMTAccidentReports,
} from "@/services/mtAccidentReportService";

export async function GET() {
  try {
    await connectDB();
    const reports = await getAllMTAccidentReports();
    console.log("GET /api/mt-accident-reports - Found reports:", reports?.length || 0, reports);
    return NextResponse.json(reports);
  } catch (error) {
    console.error("GET error:", error.message, error);
    return NextResponse.json(
      { 
        error: "Failed to fetch accident reports",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    console.log("POST body:", JSON.stringify(body, null, 2));

    const { error, value } = createMTAccidentReportSchema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      console.error("Validation errors:", error.details);
      const errors = error.details.reduce((acc, curr) => {
        acc[curr.path.join(".")] = curr.message;
        return acc;
      }, {});
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const report = await createMTAccidentReport(value);
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("POST error:", error.message, error);
    return NextResponse.json(
      { 
        error: "Failed to create accident report",
        details: error.message 
      },
      { status: 500 }
    );
  }
}