import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import {
    getRankMasterListById,
    updateRankMasterList,
    deleteRankMasterList,
} from "@/services/rankMasterList.service";
import { updateRankMasterListSchema } from "@/validators/rankMasterList.validator";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const result = await getRankMasterListById(id);

        if (!result) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching rank master list by id:", error);
        return NextResponse.json(
            { error: "Failed to fetch rank master list" },
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
        const { error, value } = updateRankMasterListSchema.validate(body, {
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

        const updatedResult = await updateRankMasterList(id, value);

        if (!updatedResult) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        return NextResponse.json(updatedResult);

    } catch (error: any) {
        console.error("Error updating rank master list:", error);
        return NextResponse.json(
            { error: "Failed to update rank master list", message: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const result = await deleteRankMasterList(id);

        if (!result) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error deleting rank master list:", error);
        return NextResponse.json(
            { error: "Failed to delete rank master list", message: error.message },
            { status: 500 }
        );
    }
}
