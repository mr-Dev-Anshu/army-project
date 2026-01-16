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

/* =====================
   DELETE
===================== */
export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = {
      offenceType: searchParams.get("offenceType"),
      id: searchParams.get("id"),
    };

    await service.delete(query);

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* =====================
   PUT (UPDATE / REPLACE)
===================== */
export async function PUT(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { offenceType, references } = body;

    if (!offenceType || !references) {
      return NextResponse.json(
        { success: false, message: "Missing offenceType or references" },
        { status: 400 }
      );
    }

    // Call service update method (which does replace)
    const updated = await service.updateReferences(offenceType, references);

    return NextResponse.json(
      { success: true, data: updated, message: "Updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
