import { NextResponse } from "next/server";
import {
    getUserByIdService,
    updateUserService,
    deleteUserService
} from "@/services/user.service";
import { connectDB } from "@/lib/db/mongodb";

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const user = await getUserByIdService(id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();
        const updatedUser = await updateUserService(id, body);
        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("User Update Route Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        await deleteUserService(id);
        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
