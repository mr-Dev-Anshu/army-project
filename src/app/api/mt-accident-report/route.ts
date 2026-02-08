import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import {
    createMTAccidentReport,
    getAllMTAccidentReports
} from "@/services/mtAccidentReportService";
import { createMTAccidentReportSchema } from "@/validators/mtAccidentReportValidation";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const filters: any = {};

        const search = searchParams.get('search');
        if (search) filters.search = search;

        const fromDate = searchParams.get('fromDate');
        if (fromDate) filters.fromDate = fromDate;

        const toDate = searchParams.get('toDate');
        if (toDate) filters.toDate = toDate;

        const data = await getAllMTAccidentReports(filters);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching MT Accident Reports:", error);
        return NextResponse.json(
            { error: "Failed to fetch MT Accident Reports" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const { error, value } = createMTAccidentReportSchema.validate(body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: error.details.map((d: any) => ({
                        path: d.path,
                        message: d.message,
                    })),
                },
                { status: 400 }
            );
        }

        const newRecord = await createMTAccidentReport(value);
        return NextResponse.json(newRecord, { status: 201 });

    } catch (error: any) {
        console.error("Error creating MT Accident Report:", error);
        return NextResponse.json(
            { error: "Failed to create MT Accident Report", message: error.message },
            { status: 500 }
        );
    }
}
