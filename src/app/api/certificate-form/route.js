import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { CertificateService } from "@/services/certificateAndForm.service";
import { certificateValidator } from "@/validators/certificateAndForm";



export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    // ✅ Validate request body
    const { error, value } = certificateValidator.validate(body, { abortEarly: false });
    if (error) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.details.map(e => e.message) },
        { status: 400 }
      );
    }

    const data = await CertificateService.create(value);

    return NextResponse.json(
      { message: "Created successfully", data },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 400 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json(
        { message: "type query param is required" },
        { status: 400 },
      );
    }

    const data = await CertificateService.getCertificateByType(type);

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

