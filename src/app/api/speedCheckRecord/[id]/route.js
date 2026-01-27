import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { staticSpeedCheckRecordService } from "@/services/speedCheckRecord.service";
import { updateStaticSpeedCheckRecordSchema } from "@/validators/speedCheckRecord.validator";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id || id.length !== 24) {
      return NextResponse.json(
        { error: "Invalid or missing ID" },
        { status: 400 }
      );
    }

    const record = await staticSpeedCheckRecordService.getById(id);

    return NextResponse.json(record);
  } catch (error) {
    console.error("GET static speed check by ID error:", error);
    return NextResponse.json(
      { error: error.message || "Record not found" },
      { status: 404 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id || id.length !== 24) {
      return NextResponse.json(
        { error: "Invalid or missing ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // const { error: validationError, value } = updateStaticSpeedCheckRecordSchema.validate(body, {
    //   abortEarly: false,
    // });

    // if (validationError) {
    //   return NextResponse.json(
    //     { error: "Validation failed", details: validationError.details },
    //     { status: 400 }
    //   );
    // }

    const updated = await staticSpeedCheckRecordService.update(id, body);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT static speed check error:", error);
    return NextResponse.json(
      { error: error.message || "Record not found" },
      { status: 404 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id || id.length !== 24) {
      return NextResponse.json(
        { error: "Invalid or missing ID" },
        { status: 400 }
      );
    }

    const result = await staticSpeedCheckRecordService.delete(id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("DELETE static speed check error:", error);
    return NextResponse.json(
      { error: error.message || "Record not found" },
      { status: 404 }
    );
  }
}