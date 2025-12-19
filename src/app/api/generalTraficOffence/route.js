import { NextResponse } from "next/server";
import { generalTrafficOffenceService } from "@/services/generalTrafficOffence.service";
import { createGeneralTrafficOffenceSchema } from "@/validators/generalTrafficOffence.validator";
import { connectDB } from "@/lib/db/mongodb";

export async function GET() {
  try {
    await connectDB();
    const offences = await generalTrafficOffenceService.getAll();
    return NextResponse.json(offences);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch offences" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const { error, value } = createGeneralTrafficOffenceSchema.validate(body, {
      abortEarly: false, 
      stripUnknown: true, 
    });

    if (error) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: error.details.map(d => ({
            path: d.path,
            message: d.message
          }))
        },
        { status: 400 }
      );
    }

    const newOffence = await generalTrafficOffenceService.create(value);

    return NextResponse.json(newOffence, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create offence", message: error.message },
      { status: 500 }
    );
  }
}