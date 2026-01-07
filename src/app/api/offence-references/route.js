import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { OffenceReferenceService } from "@/services/offenceReference.service";

const service = new OffenceReferenceService();

/* =====================
   GET (QUERY BASED)
===================== */
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const query = {
      offenceType: searchParams.get("offenceType"),
      search: searchParams.get("search"),
      groupBy: searchParams.get("groupBy"),
    };

    const data = await service.getAll(query);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* =====================
   POST (CREATE FIRST)
===================== */
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const created = await service.create(body);

    return NextResponse.json(
      { success: true, data: created },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
