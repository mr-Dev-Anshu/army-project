// app/api/mt-accident-reports/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
 import { mtAccidentSchema } from "@/validators/mtAccidentReportValidation";
import {
  getMTAccidentReportById,
  updateMTAccidentReport,
  deleteMTAccidentReport,
} from "@/services/mtAccidentReportService";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const report = await getMTAccidentReportById(id);
    if (!report) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(report);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const body = await request.json();
    const { id } = await params;

    const { error, value } = updateMTAccidentReportSchema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.reduce((acc, curr) => {
        acc[curr.path.join(".")] = curr.message;
        return acc;
      }, {});
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const report = await updateMTAccidentReport(id, value);
    if (!report) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const report = await deleteMTAccidentReport(id);
    if (!report) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete report" },
      { status: 500 }
    );
  }
}