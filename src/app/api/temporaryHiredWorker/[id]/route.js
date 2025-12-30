import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { deleteTemporaryHiredWorker, getTemporaryHiredWorkerById, updateTemporaryHiredWorker } from "@/services/TemporaryHiredWorker.service";
import { updateTemporaryHiredWorkerSchema } from "@/validators/temporaryHiredWorker.validator";


export async function GET(request, { params }) {
  try {
    await connectDB()
    const { id } = await params;

    const worker = await getTemporaryHiredWorkerById(id);
    if (!worker) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(worker);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch worker" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB()

    const body = await request.json();

    const { id } = await params;
    const { error, value } = updateTemporaryHiredWorkerSchema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.reduce((acc, curr) => {
        acc[curr.path.join(".")] = curr.message;
        return acc;
      }, {});
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const worker = await updateTemporaryHiredWorker(id, value);
    if (!worker) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(worker);
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update worker" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const { id } = await params;
    const worker = await deleteTemporaryHiredWorker(id);
    if (!worker) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete worker" },
      { status: 500 }
    );
  }
}