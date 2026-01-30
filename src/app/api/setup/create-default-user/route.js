import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { createUserService } from "@/services/user.service.js";

export async function POST() {
  try {
    await connectDB();

    // Create a default test user
    const defaultUser = {
      username: "admin",
      password: "admin123",
      email: "admin@army.gov.in",
      armyNo: "SN-000001",
      unit: "21 Corps HQ",
      rank: "Colonel",
      role: "superadmin"
    };

    const user = await createUserService(defaultUser);

    return NextResponse.json({
      success: true,
      message: "Default user created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        armyNo: user.armyNo,
        unit: user.unit,
        rank: user.rank,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Error creating default user:", error);
    
    if (error.message.includes("Username already taken")) {
      return NextResponse.json({
        success: false,
        error: "Default user already exists"
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error.message || "Failed to create default user"
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      success: true,
      message: "Default user credentials",
      credentials: {
        username: "admin",
        password: "admin123"
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
