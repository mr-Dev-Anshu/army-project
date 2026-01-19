import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import {
    getImmediateReportingIncidentById,
    updateImmediateReportingIncident,
    deleteImmediateReportingIncident,
} from "@/services/immediateReportingIncident.service";
import { immediateReportingIncidentSchema } from "@/validators/immediateReportingIncident.validator";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const record = await getImmediateReportingIncidentById(id);

        if (!record) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        return NextResponse.json(record);
    } catch (error) {
        console.error("Error fetching immediate reporting incident by id:", error);
        return NextResponse.json(
            { error: "Failed to fetch immediate reporting incident" },
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
        const { error, value } = immediateReportingIncidentSchema.validate(body, {
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

        const updatedRecord = await updateImmediateReportingIncident(id, value);

        if (!updatedRecord) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        return NextResponse.json(updatedRecord);

    } catch (error: any) {
        console.error("Error updating immediate reporting incident:", error);
        return NextResponse.json(
            { error: "Failed to update immediate reporting incident", message: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const result = await deleteImmediateReportingIncident(id);

        if (!result) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error deleting immediate reporting incident:", error);
        return NextResponse.json(
            { error: "Failed to delete immediate reporting incident", message: error.message },
            { status: 500 }
        );
    }
}
