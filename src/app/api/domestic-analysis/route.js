import { connectDB } from "@/lib/db/mongodb";
import { getDomesticAnalytics } from "@/services/analysis/domestic.service";
import { NextResponse } from "next/server";
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const offenceType = searchParams.get("offenceType"); 
    const analytics = await getDomesticAnalytics({
      month,
      year,
      offenceType: offenceType || undefined,
    });
    return NextResponse.json(analytics);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
