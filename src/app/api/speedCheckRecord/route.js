import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { staticSpeedCheckRecordService } from "@/services/speedCheckRecord.service";
import { createStaticSpeedCheckRecordSchema } from "@/validators/speedCheckRecord.validator";
import jwt from "jsonwebtoken";

/* ========================= GET ========================= */

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    let records;

    // ✅ Date range filter
    if (fromDate || toDate) {
      records = await staticSpeedCheckRecordService.getByDateRange({
        fromDate,
        toDate,
      });
    } else {
      records = await staticSpeedCheckRecordService.getAll();
    }

    return NextResponse.json(records);

  } catch (error) {
    console.error("GET speed check error:", error);
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}

/* ========================= POST ========================= */

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    // const { error, value } = createStaticSpeedCheckRecordSchema.validate(body, {
    //   abortEarly: false,
    // });

    // if (error) {
    //   return NextResponse.json(
    //     { error: "Validation failed", details: error.details },
    //     { status: 400 }
    //   );
    // }

    // Build request context from auth token, similar to other routes
    let requestContext = { userId: null, userRole: null };
    try {
      const token = request.cookies.get("auth_token")?.value;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        requestContext = {
          userId: decoded.userId,
          userRole: decoded.role,
        };
      }
    } catch (err) {
      console.error("POST /api/speedCheckRecord - Failed to read user from token:", err.message);
    }

    const newRecord = await staticSpeedCheckRecordService.create(
      value,
      requestContext
    );
    return NextResponse.json(newRecord, { status: 201 });

  } catch (error) {
    console.error("POST speed check error:", error);
    return NextResponse.json(
      { error: "Failed to create record" },
      { status: 500 }
    );
  }
}
