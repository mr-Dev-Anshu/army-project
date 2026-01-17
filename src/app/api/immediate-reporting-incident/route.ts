import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import {
    createImmediateReportingIncident,
    getAllImmediateReportingIncidents
} from "@/services/immediateReportingIncident.service";
import { immediateReportingIncidentSchema } from "@/validators/immediateReportingIncident.validator";

export async function GET(request: Request) {
    try {
        await connectDB();
        const data = await getAllImmediateReportingIncidents();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching immediate reporting incidents:", error);
        return NextResponse.json(
            { error: "Failed to fetch immediate reporting incidents" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

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

        const newRecord = await createImmediateReportingIncident(value);
        return NextResponse.json(newRecord, { status: 201 });

    } catch (error: any) {
        console.error("Error creating immediate reporting incident:", error);
        return NextResponse.json(
            { error: "Failed to create immediate reporting incident", message: error.message },
            { status: 500 }
        );
    }
}
