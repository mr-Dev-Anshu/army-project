import { NextResponse } from "next/server";
import { offenderService } from "../../../services/offender.service";
import { connectDB } from "../../../lib/db/mongodb";
import { createOffenderSchema } from "../../../validators/offender.validtor";

export async function GET() {
  try {
    await connectDB();
    const offenders = await offenderService.getAll();
    return NextResponse.json(offenders);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { error, value } = createOffenderSchema.validate(body, {
      abortEarly: false,
    });
    if (error) {
      return NextResponse.json({
        errors: error.details.map((detail) => ({
          path: detail.path,
          message: detail.message,
        })),
      }, { status: 400 });
    }
    const newOffender = await offenderService.create(value);
    return NextResponse.json(newOffender, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}