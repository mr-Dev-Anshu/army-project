import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import jwt from "jsonwebtoken";
import { loginUserService } from "@/services/user.service";
export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await loginUserService(username, password);

    const payload = {
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: user._id.toString(),
        username: user.username,
        role: user.role,
      },
    });

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    const isAuthError = error.message.includes("Invalid");
    return NextResponse.json(
      {
        success: false,
        error: isAuthError
          ? "Invalid username or password"
          : "Internal server error",
      },
      { status: isAuthError ? 401 : 500 }
    );
  }
}