// app/api/offences/[id]/route.ts
import { NextResponse } from "next/server";
import { generalTrafficOffenceService } from "@/services/generalTrafficOffence.service";
import { updateGeneralTrafficOffenceSchema } from "@/validators/generalTrafficOffence.validator";
import { connectDB } from "../../../../lib/db/mongodb";

export async function GET(request, { params }) {
  try {
    await connectDB();
    // 1. Unwrapping params
    const { id } = await params; 
     console.log(id)
    const offence = await generalTrafficOffenceService.getById(id);
    
    if (!offence) {
      return NextResponse.json({ error: "Offence not found" }, { status: 404 });
    }

    return NextResponse.json(offence);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to fetch offence" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    // 1. Unwrapping params
    const { id } = await params;
    const body = await request.json();
    

    const { error, value } = updateGeneralTrafficOffenceSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: error.details.map(d => ({ path: d.path, message: d.message }))
      }, { status: 400 });
    }

    // 2. Using the unwrapped id
    const updatedOffence = await generalTrafficOffenceService.update(id,body);

    if (!updatedOffence) {
      return NextResponse.json({ error: "Offence not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOffence);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update offence" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    // 1. Unwrapping params
    const { id } = await params;
    
    const result = await generalTrafficOffenceService.delete(id);

    if (!result) {
       return NextResponse.json({ error: "Offence not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete offence" }, { status: 500 });
  }
}