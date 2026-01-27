import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    // Temporary bypass - return mock user data
    return NextResponse.json({
      success: true,
      user: {
        id: '000000000000000000000000',
        username: 'admin',
        role: 'superadmin',
      },
    });
  } catch (error) {
    console.error("Auth verification error:", error);
    return NextResponse.json(
      { success: false, error: "Invalid token" },
      { status: 401 }
    );
  }
}