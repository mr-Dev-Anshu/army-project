import { MPReportService } from "@/services/investigationReport.repo";
import { updateMPReportSchema } from "@/validators/investigationReport";
import { NextResponse } from "next/server";

const service = new MPReportService();

export async function GET(request, { params }) {
  try {
    const { id } = await  params;
    const report = await service.getReportById(id);
    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 404 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await  params;
    const body = await request.json();

    // Validation intentionally bypassed to allow empty/partial submissions.
    const value = body;

    const updated = await service.updateReport(id, value);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Update failed" },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await  params;
    await service.deleteReport(id);
    return NextResponse.json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 404 }
    );
  }
}