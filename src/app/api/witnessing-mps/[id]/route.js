import { NextResponse } from "next/server";
import { onDutyWitnessingMpService } from "@/services/onDutyWitnessingMp.service";
import { connectDB } from "@/lib/db/mongodb";
import {
  updateOnDutyWitnessingMpSchema,
} from "@/validators/onDutyWitnessingMp.validator";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const witness = await onDutyWitnessingMpService.getById(params.id);
    return NextResponse.json(witness);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();

    const { error, value } = updateOnDutyWitnessingMpSchema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      return NextResponse.json(
        { error: "Validation failed", details: error.details },
        { status: 400 }
      );
    }

    const updated = await onDutyWitnessingMpService.update(params.id, value);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const result = await onDutyWitnessingMpService.delete(params.id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}