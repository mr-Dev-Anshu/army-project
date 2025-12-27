import { FieldSuggestion } from "@/models/FiledSuggestion";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
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
