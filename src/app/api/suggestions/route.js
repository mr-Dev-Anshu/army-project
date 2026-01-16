import { FieldSuggestion } from "@/models/FiledSuggestion";
import OffenceReference from "@/models/offenceReference";
import { connectDB } from "@/lib/db/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const fieldType = searchParams.get("fieldType");
    const query = searchParams.get("query")?.trim() || "";

    if (!fieldType) {
      return NextResponse.json(
        { success: false, message: "fieldType is required" },
        { status: 400 }
      );
    }

    const searchRegex = new RegExp(query, "i");

    // Special handling for Offence Types: Fetch directly from OffenceReference collection
    if (fieldType === "offenceType") {
      const suggestions = await OffenceReference.aggregate([
        { $match: { offenceType: { $regex: searchRegex } } },
        { $group: { _id: "$offenceType" } },
        { $project: { _id: 0, value: "$_id", count: { $literal: 1 } } },
        { $sort: { value: 1 } },
        { $limit: 10 }
      ]);

      return NextResponse.json({
        success: true,
        data: suggestions,
        metadata: {
          fieldType: fieldType.trim(),
          query,
          total: suggestions.length,
        },
      });
    }

    const suggestions = await FieldSuggestion.find({
      fieldType: fieldType.trim(),
      value: { $regex: searchRegex },
    })
      .sort({ count: -1, lastUsed: -1 })
      .limit(10)
      .select("value count")
      .lean();

    return NextResponse.json({
      success: true,
      data: suggestions,
      metadata: {
        fieldType: fieldType.trim(),
        query,
        total: suggestions.length,
      },
    });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}
