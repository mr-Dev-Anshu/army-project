import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import {
    getUnitMasterListById,
    updateUnitMasterList,
    deleteUnitMasterList,
} from "@/services/unitMasterList.service";
import { updateUnitMasterListSchema } from "@/validators/unitMasterList.validator";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const result = await getUnitMasterListById(id);

        if (!result) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching unit master list by id:", error);
        return NextResponse.json(
            { error: "Failed to fetch unit master list" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        // Validate
        const { error, value } = updateUnitMasterListSchema.validate(body, {
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

        const updatedResult = await updateUnitMasterList(id, value);

        if (!updatedResult) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        return NextResponse.json(updatedResult);

    } catch (error: any) {
        console.error("Error updating unit master list:", error);
        return NextResponse.json(
            { error: "Failed to update unit master list", message: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const result = await deleteUnitMasterList(id);

        if (!result) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error deleting unit master list:", error);
        return NextResponse.json(
            { error: "Failed to delete unit master list", message: error.message },
            { status: 500 }
        );
    }
}
