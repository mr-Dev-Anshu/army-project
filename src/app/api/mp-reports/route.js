import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { MPReportService } from "@/services/investigationReport.repo";

import Register from "@/models/Register";
// import { createMPReportSchema } from "@/validators/investigationReport"; // validation commented out
import jwt from "jsonwebtoken";

const service = new MPReportService();

/* ============================================================
   GET MP REPORTS WITH FILTERS
   /api/mp-reports?unit=&fmn=&fromDate=&toDate=
============================================================ */

export async function GET(request) {
  try {
    // 🔥 ALWAYS CONNECT DB IN APP ROUTES
    await connectDB();

    const { searchParams } = new URL(request.url);

    const filters = {};

    const unit = searchParams.get("unit");
    const fmn = searchParams.get("fmn");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const placeOfOffence = searchParams.get("placeOfOffence");

    if (unit) filters.unit = unit;
    if (fmn) filters.fmn = fmn;
    if (fromDate) filters.fromDate = fromDate;
    if (toDate) filters.toDate = toDate;
    if (placeOfOffence) filters.placeOfOffence = placeOfOffence;

    const reports = await service.getAllReports(filters);

    return NextResponse.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.error("MP Reports GET Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* ============================================================
   CREATE MP REPORT
============================================================ */

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    // Validation intentionally bypassed to allow empty/partial submissions.
    const value = body;

    // Build request context from auth token
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
      console.error("POST /api/mp-reports - Failed to read user from token:", err.message);
    }

    const report = await service.createReport(value, requestContext);

    // --- AUTOMATICALLY CREATE REGISTER ENTRY ---
    try {
      const occurrence = report.occurrenceDetails || {};
      const invHead = report.investigationHead || {};
      const primaryIndividual = report.individuals?.[0] || report.individual?.[0] || {};

      // Snapshot relevant details
      const registerDetails = {
        originalReportId: report._id,
        caseNo: report.reportDetails?.reportNumber,
        unitOfOccurrence: occurrence.unit || invHead.unit || "N/A",
        dateOfOccurrence: occurrence.dateOfOccurrence || report.createdAt,
        timeOfOccurrence: occurrence.timeOfOccurrence,
        placeOfOccurrence: occurrence.placeOfOccurrence,
        offenceType: occurrence.offenceType,
        offenceTypes: occurrence.offenceTypes,

        // Person Details
        individual: {
          armyNo: primaryIndividual.armyNumber,
          rank: primaryIndividual.rank,
          name: primaryIndividual.name,
          unit: primaryIndividual.unit,
          ...primaryIndividual
        },

        brief: occurrence.description || occurrence.brief,
        documents: report.documents,

        // Assigned MP
        assignedMP: {
          armyNo: invHead.armyNumber,
          rank: invHead.rank,
          name: invHead.name,
          unit: invHead.unit,
          fmn: invHead.fmn
        }
      };

      await Register.create({
        type: "mp-general-diary-daily-occurrence-book",
        date: occurrence.dateOfOccurrence || new Date(),
        details: registerDetails,
        remark: "",
        status: "pending_out" // Default equivalent
      });

    } catch (regError) {
      console.error("Failed to auto-create register entry:", regError);
      // We do not fail the main request if register creation fails, just log it
    }
    // -------------------------------------------

    return NextResponse.json(
      { success: true, data: report },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create report",
      },
      { status: 400 }
    );
  }
}
