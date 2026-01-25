import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { CertificateService } from "@/services/certificateAndForm.service";
// import { createCertificateValidator } from "@/validators/certificateAndForm";


export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    // const { error, value } = createCertificateValidator.validate(body, {
    //   abortEarly: false,
    // });

    // if (error) {
    //   const errors = error.details.reduce((acc, curr) => {
    //     acc[curr.path.join(".")] = curr.message;
    //     return acc;
    //   }, {});
    //   return NextResponse.json({ error: errors }, { status: 400 });
    // }

    const data = await CertificateService.create(body);

    return NextResponse.json(
      {
        message: "created successfully",
        data,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ message: error.message || "something went wrong"}, { status: 400 });
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

