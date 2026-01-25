import { NextResponse } from "next/server";
import { createUserService, getAllUsersService } from "@/services/user.service";
import { connectDB } from "@/lib/db/mongodb";

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const newUser = await createUserService(body);
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await connectDB();
        const users = await getAllUsersService();
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
