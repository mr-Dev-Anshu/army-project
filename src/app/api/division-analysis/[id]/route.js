import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import {
  getDivisionAnalysisByIdService,
  updateDivisionAnalysisService,
  deleteDivisionAnalysisService,
  divisionAnalysisService,
} from "@/services/divisionAnalysis";
import { divisionAnalysisValidator } from "@/validators/divisionAnalysis";

/* ===================== GET BY ID ===================== */
export async function GET(_req, { params }) {
  try {
    const { id } = await params;
    console.log("[division-analysis][GET] id:", id);
    await connectDB();

    const data = await divisionAnalysisService.getById(id);
    console.log("[division-analysis][GET] db result:", !!data, data?._id);

    if (!data) {
      return NextResponse.json({ message: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[division-analysis][GET] error:", error);
    return NextResponse.json({ message: "Failed to fetch record", error: error.message }, { status: 500 });
  }
}

/* ===================== UPDATE ===================== */
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    console.log("[division-analysis][PUT] id:", id);
    await connectDB();
    const body = await req.json();

    const { error, value } = divisionAnalysisValidator.validate(body);
    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    const data = await divisionAnalysisService.update(id, value);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[division-analysis][PUT] error:", error);
    return NextResponse.json({ message: "Failed to update record", error: error.message }, { status: 500 });
  }
}

/* ===================== DELETE ===================== */
export async function DELETE(_req, { params }) {
  try {
    const { id } = await params;
    console.log("[division-analysis][DELETE] id:", id);
    await connectDB();
    await divisionAnalysisService.delete(id);

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("[division-analysis][DELETE] error:", error);
    return NextResponse.json({ message: "Failed to delete record", error: error.message }, { status: 500 });
  }
}
