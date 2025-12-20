import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { staticSpeedCheckRecordService } from "@/services/speedCheckRecord.service";
import { createStaticSpeedCheckRecordSchema } from "@/validators/speedCheckRecord.validator";


export async function GET() {
  try {
    await connectDB();
    const records = await staticSpeedCheckRecordService.getAll();
    return NextResponse.json(records);
  } catch (error) {
    console.error("GET static speed checks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const { error, value } = createStaticSpeedCheckRecordSchema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      return NextResponse.json(
        { error: "Validation failed", details: error.details },
        { status: 400 }
      );
    }

    const newRecord = await staticSpeedCheckRecordService.create(value);
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error("POST static speed check error:", error);
    return NextResponse.json(
      { error: "Failed to create record" },
      { status: 500 }
    );
  }
}