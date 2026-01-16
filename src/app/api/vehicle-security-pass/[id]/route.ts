import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import {
    getVehiclesSecurityPassById,
    updateVehiclesSecurityPass,
    deleteVehiclesSecurityPass,
} from "@/services/vehiclesSecurityPassManagement.service";
import { updateVehiclesSecurityPassSchema } from "@/validators/vehiclesSecurityPassManagement.validator";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const pass = await getVehiclesSecurityPassById(id);

        if (!pass) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        return NextResponse.json(pass);
    } catch (error) {
        console.error("Error fetching vehicle security pass by id:", error);
        return NextResponse.json(
            { error: "Failed to fetch vehicle security pass" },
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
        const { error, value } = updateVehiclesSecurityPassSchema.validate(body, {
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

        const updatedPass = await updateVehiclesSecurityPass(id, value);

        if (!updatedPass) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        return NextResponse.json(updatedPass);

    } catch (error: any) {
        console.error("Error updating vehicle security pass:", error);
        return NextResponse.json(
            { error: "Failed to update vehicle security pass", message: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const result = await deleteVehiclesSecurityPass(id);

        if (!result) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error deleting vehicle security pass:", error);
        return NextResponse.json(
            { error: "Failed to delete vehicle security pass", message: error.message },
            { status: 500 }
        );
    }
}
