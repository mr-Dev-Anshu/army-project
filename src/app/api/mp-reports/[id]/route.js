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
    console.log(body);
    

    const { error, value } = updateMPReportSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true, 
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

    const updated = await service.updateReport(id, body);
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