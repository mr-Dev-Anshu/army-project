import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import {
    createRankMasterList,
    getAllRankMasterLists
} from "@/services/rankMasterList.service";
import { createRankMasterListSchema } from "@/validators/rankMasterList.validator";

export async function GET(request: Request) {
    try {
        await connectDB();
        const data = await getAllRankMasterLists();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching rank master lists:", error);
        return NextResponse.json(
            { error: "Failed to fetch rank master lists" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const { error, value } = createRankMasterListSchema.validate(body, {
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

        const newData = await createRankMasterList(value);
        return NextResponse.json(newData, { status: 201 });

    } catch (error: any) {
        console.error("Error creating rank master list:", error);
        return NextResponse.json(
            { error: "Failed to create rank master list", message: error.message },
            { status: 500 }
        );
    }
}
