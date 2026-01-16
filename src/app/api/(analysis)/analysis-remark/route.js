import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import {
  createAnalysisRemark,
  getAllAnalysisRemarks,
} from "@/services/analysisRemark.service";
import { createAnalysisRemarkSchema } from "@/validators/analysisRemark";

export async function GET() {
  try {
    await connectDB();
    const remarks = await getAllAnalysisRemarks();
    return NextResponse.json(remarks);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch remarks" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { error, value } = createAnalysisRemarkSchema.validate(body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.reduce((acc, curr) => {
        acc[curr.path.join(".")] = curr.message;
        return acc;
      }, {});
      return NextResponse.json({ error: errors }, { status: 400 });
    }
    const remark = await createAnalysisRemark(value);
    return NextResponse.json(remark, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to create remark" },
      { status: 500 }
    );
  }
}