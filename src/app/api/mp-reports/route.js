import { MPReportService } from "@/services/investigationReport.repo";
import { createMPReportSchema } from "@/validators/investigationReport";
import { NextResponse } from "next/server";

const service = new MPReportService();

export async function GET() {
  try {
    const reports = await service.getAllReports();
    return NextResponse.json({ success: true, data: reports });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Joi Validation
    const { error, value } = createMPReportSchema.validate(body, {
      abortEarly: false,     // all errors collect kar
      stripUnknown: false,  // extra fields allow (customFields ke liye)
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));
      return NextResponse.json(
        { success: false, message: "Validation failed", errors },
        { status: 400 }
      );
    }

    const report = await service.createReport(value);
    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create report" },
      { status: 400 }
    );
  }
}