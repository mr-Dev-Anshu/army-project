// app/api/shopkeeper-passes/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { updateShopkeeperSecurityPassSchema } from "@/validators/shopkeeper.validator";
import {
  getShopkeeperSecurityPassById,
  updateShopkeeperSecurityPass,
  deleteShopkeeperSecurityPass,
} from "@/services/shopkeeper.service";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const pass = await getShopkeeperSecurityPassById(id);
    if (!pass) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(pass);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pass" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const body = await request.json();
    const { id } = await params;

    const { error, value } = updateShopkeeperSecurityPassSchema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.reduce((acc, curr) => {
        acc[curr.path.join(".")] = curr.message;
        return acc;
      }, {});
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const pass = await updateShopkeeperSecurityPass(id, value);
    if (!pass) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(pass);
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update pass" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const pass = await deleteShopkeeperSecurityPass(id);
    if (!pass) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete pass" },
      { status: 500 }
    );
  }
}