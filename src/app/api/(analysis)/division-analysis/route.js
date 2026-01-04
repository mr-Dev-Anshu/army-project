import { NextResponse } from "next/server";
import { divisionAnalysisService } from "@/services/divisionAnalysis";
import { divisionAnalysisValidator } from "@/validators/divisionAnalysis";
import { connectDB } from "@/lib/db/mongodb";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const groupBy = searchParams.get("groupBy");

    /* ===================== GROUPED AGGREGATION ===================== */
    if (groupBy === "division") {
      const queryParams = {
        divisionName: searchParams.get("divisionName"),
        offence: searchParams.get("offence"),
        monthYear: searchParams.get("monthYear"),
      };

      // remove empty params
      Object.keys(queryParams).forEach((key) => {
        if (!queryParams[key]) delete queryParams[key];
      });

      const groupedData =
        await divisionAnalysisService.getGroupedByDivision(queryParams);

      return NextResponse.json(groupedData);
    }

    if (groupBy === "offence") {
      const queryParams = {
        offence: searchParams.get("offence"),
        divisionName: searchParams.get("divisionName"),
      };

      Object.keys(queryParams).forEach((key) => {
        if (!queryParams[key]) delete queryParams[key];
      });

      const groupedData =
        await divisionAnalysisService.getGroupedByOffence(queryParams);

      return NextResponse.json(groupedData);
    }

    /* ===================== DEFAULT GET ALL ===================== */
    const filters = {};
    const divisionName = searchParams.get("divisionName");
    const monthYear = searchParams.get("monthYear");

    if (divisionName) filters.divisionName = divisionName;
    if (monthYear) filters.monthYear = monthYear; // Note: exact match on string or date object might be needed depending on DB schema

    const data = await divisionAnalysisService.getAll(filters);
    return NextResponse.json(data);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch division analysis data" },
      { status: 500 }
    );
  }
}

/* ===================== CREATE ===================== */
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const { error, value } = divisionAnalysisValidator.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.details.map((d) => ({
            path: d.path,
            message: d.message,
          })),
        },
        { status: 400 }
      );
    }

    const created =
      await divisionAnalysisService.create(value);

    return NextResponse.json(created, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Failed to create division analysis",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
