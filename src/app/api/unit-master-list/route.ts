import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import {
    createUnitMasterList,
    getAllUnitMasterLists
} from "@/services/unitMasterList.service";
import { createUnitMasterListSchema } from "@/validators/unitMasterList.validator";

export async function GET(request: Request) {
    try {
        await connectDB();
        const data = await getAllUnitMasterLists();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching unit master lists:", error);
        return NextResponse.json(
            { error: "Failed to fetch unit master lists" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const { error, value } = createUnitMasterListSchema.validate(body, {
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

        const newData = await createUnitMasterList(value);
        return NextResponse.json(newData, { status: 201 });

    } catch (error: any) {
        console.error("Error creating unit master list:", error);
        return NextResponse.json(
            { error: "Failed to create unit master list", message: error.message },
            { status: 500 }
        );
    }
}
