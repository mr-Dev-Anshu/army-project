import { connectDB } from "@/lib/db/mongodb";
import { createTemporaryHiredWorker, getAllTemporaryHiredWorkers } from "@/services/TemporaryHiredWorker.service";
import { createTemporaryHiredWorkerSchema } from "@/validators/temporaryHiredWorker.validator";

export async function GET() {
  try {
    await connectDB();

    const workers = await getAllTemporaryHiredWorkers();
    return NextResponse.json(workers);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch workers" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const { error, value } = createTemporaryHiredWorkerSchema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.reduce((acc, curr) => {
        acc[curr.path.join(".")] = curr.message;
        return acc;
      }, {});
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const worker = await createTemporaryHiredWorker(value);
    return NextResponse.json(worker, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to create worker" },
      { status: 500 }
    );
  }
}
