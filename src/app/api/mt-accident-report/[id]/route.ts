import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import {
    getMTAccidentReportById,
    updateMTAccidentReport,
    deleteMTAccidentReport,
} from "@/services/mtAccidentReportService";
import { createMTAccidentReportSchema } from "@/validators/mtAccidentReportValidation";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const record = await getMTAccidentReportById(id);

        if (!record) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        return NextResponse.json(record);
    } catch (error) {
        console.error("Error fetching MT Accident Report by id:", error);
        return NextResponse.json(
            { error: "Failed to fetch MT Accident Report" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        // Validate
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

        const updatedRecord = await updateMTAccidentReport(id, value);

        if (!updatedRecord) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        return NextResponse.json(updatedRecord);

    } catch (error: any) {
        console.error("Error updating MT Accident Report:", error);
        return NextResponse.json(
            { error: "Failed to update MT Accident Report", message: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const result = await deleteMTAccidentReport(id);

        if (!result) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error deleting MT Accident Report:", error);
        return NextResponse.json(
            { error: "Failed to delete MT Accident Report", message: error.message },
            { status: 500 }
        );
    }
}
