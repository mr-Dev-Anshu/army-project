import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";

import { OffenceReferenceService } from "@/services/offenceReference.service";
import { updateOffenceReferenceSchema } from "@/validators/offenceReference";

const service = new OffenceReferenceService();

/* ===========================
   GET BY ID
=========================== */
export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = params;

    const data = await service.getById(id);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 404 }
    );
  }
}

/* ===========================
   UPDATE (PATCH)
=========================== */
export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const body = await req.json();

    // Joi validation
    const { error, value } = updateOffenceReferenceSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: error.details.map(d => ({
            field: d.path.join("."),
            message: d.message,
          })),
        },
        { status: 400 }
      );
    }

    const updated = await service.update(id, value);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 404 }
    );
  }
}

/* ===========================
   DELETE
=========================== */
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = params;

    await service.delete(id);

    return NextResponse.json({
      success: true,
      message: "Offence reference deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 404 }
    );
  }
}
