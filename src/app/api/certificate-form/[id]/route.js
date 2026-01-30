import { connectDB } from "@/lib/db/mongodb";
import { CertificateService } from "@/services/certificateAndForm.service";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await CertificateService.getCertificateById(id);
    return NextResponse.json(
      data,
      { message: "Certificate fetched successfully" },
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 404 });
  }
}


export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const data =await  req.json();
    // console.log("this",data);
    

    const updatedData = await CertificateService.updateCertificate(id, data);

    return NextResponse.json({
      message: "Updated successfully",
      updatedData,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(req,{params}) {
    try {
        await connectDB();
        const {id} = await params;
        await CertificateService.deleteCertificate(id);
        return NextResponse.json({message:"Certificate Deleted"});
    } catch (error) {
            return NextResponse.json({ message: error.message }, { status: 400 });

    }
}
