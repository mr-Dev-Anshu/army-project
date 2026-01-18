import { NextRequest, NextResponse } from "next/server";
import { RegisterService } from "@/services/register.service";
import { updateRegisterSchema } from "@/validators/register.validator";
import { connectDB } from "@/lib/db/mongodb";

const service = new RegisterService();

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await connectDB();
        const register = await service.getRegisterById(params.id);
        return NextResponse.json(register);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Register entry not found" },
            { status: 404 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await connectDB();
        const body = await req.json();
        const { error, value } = updateRegisterSchema.validate(body);
        if (error) {
            return NextResponse.json(
                { error: error.details[0].message },
                { status: 400 }
            );
        }

        const updated = await service.updateRegister(params.id, value);
        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to update register entry" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await connectDB();
        await service.deleteRegister(params.id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to delete register entry" },
            { status: 500 }
        );
    }
}
