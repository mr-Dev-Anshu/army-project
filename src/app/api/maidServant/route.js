// app/api/maid-servant-passes/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { createMaidServantSecurityPassSchema } from "@/validators/maidServant.validator";
import {
  createMaidServantSecurityPass,
  getAllMaidServantSecurityPasses,
} from "@/services/maidServant.service";

export async function GET() {
  try {
    await connectDB();
    const passes = await getAllMaidServantSecurityPasses();
    return NextResponse.json(passes);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch passes" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const { error, value } = createMaidServantSecurityPassSchema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.reduce((acc, curr) => {
        acc[curr.path.join(".")] = curr.message;
        return acc;
      }, {});
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const pass = await createMaidServantSecurityPass(value);
    return NextResponse.json(pass, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to create pass" },
      { status: 500 }
    );
  }
}