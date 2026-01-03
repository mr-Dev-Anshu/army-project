import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { updateAnalysisRemarkSchema } from "@/validators/analysisRemark";
import {
  getAnalysisRemarkById,
  updateAnalysisRemark,
  deleteAnalysisRemark,
} from "@/services/analysisRemark.service";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const remark = await getAnalysisRemarkById(id);
    if (!remark) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(remark);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch remark" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const body = await request.json();
    const { id } = await params;

    const { error, value } = updateAnalysisRemarkSchema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.reduce((acc, curr) => {
        acc[curr.path.join(".")] = curr.message;
        return acc;
      }, {});
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const remark = await updateAnalysisRemark(id, value);
    if (!remark) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(remark);
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update remark" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const remark = await deleteAnalysisRemark(id);
    if (!remark) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete remark" },
      { status: 500 }
    );
  }
}