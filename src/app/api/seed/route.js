import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { User } from "@/models/user";

export async function GET() {
    try {
        await connectDB();

        const superAdminExists = await User.findOne({ role: "superadmin" });
        if (superAdminExists) {
            return NextResponse.json({ message: "Superadmin already exists." });
        }

        const superAdmin = await User.create({
            username: "Superadmin",
            password: "admin@123", // In a real app, hash this!
            role: "superadmin",
            email: "superadmin@army.nic.in",
            armyNo: "SA-001",
            rank: "General",
            unit: "HQ"
        });

        return NextResponse.json({ message: "Superadmin created successfully", user: superAdmin });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
