import { NextRequest, NextResponse } from "next/server";
import { RegisterService } from "@/services/register.service";
import { createRegisterSchema } from "@/validators/register.validator";
import { connectDB } from "@/lib/db/mongodb";

const service = new RegisterService();

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        const filters: any = {};
        if (type) filters.type = type;

        // Add other filters as needed (e.g. date range)
        const date = searchParams.get("date");
        if (date) filters.date = date;

        const data = await service.getAllRegisters(filters, { page, limit });
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch registers" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const { error, value } = createRegisterSchema.validate(body);
        if (error) {
            return NextResponse.json(
                { error: error.details[0].message },
                { status: 400 }
            );
        }

        const newRegister = await service.createRegister(value);
        return NextResponse.json(newRegister, { status: 201 });
    } catch (error: any) {
        console.error("Register creation error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create register entry", details: error.toString() },
            { status: 500 }
        );
    }
}
