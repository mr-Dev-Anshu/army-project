import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import {
  createOnDutyWitnessingMpSchema,
} from "@/validators/onDutyWitnessingMp.validator";
import { onDutyWitnessingMpService } from "@/services/onDutyWitnessingMp.service";

export async function GET() {
  try {
    await connectDB();
    const witnesses = await onDutyWitnessingMpService.getAll();
    return NextResponse.json(witnesses);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const { error, value } = createOnDutyWitnessingMpSchema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      return NextResponse.json(
        { error: "Validation failed", details: error.details },
        { status: 400 }
      );
    }

    const newWitness = await onDutyWitnessingMpService.create(value);
    return NextResponse.json(newWitness, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}