import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import {
    createVehiclesSecurityPass,
    getAllVehiclesSecurityPasses
} from "@/services/vehiclesSecurityPassManagement.service";
import { createVehiclesSecurityPassSchema } from "@/validators/vehiclesSecurityPassManagement.validator";

export async function GET(request: Request) {
    try {
        await connectDB();
        const data = await getAllVehiclesSecurityPasses();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching vehicle security passes:", error);
        return NextResponse.json(
            { error: "Failed to fetch vehicle security passes" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        // const { error, value } = createVehiclesSecurityPassSchema.validate(body, {
        //     abortEarly: false,
        //     stripUnknown: true,
        // });

        // if (error) {
        //     return NextResponse.json(
        //         {
        //             error: "Validation failed",
        //             details: error.details.map((d: any) => ({
        //                 path: d.path,
        //                 message: d.message,
        //             })),
        //         },
        //         { status: 400 }
        //     );
        // }

        const newPass = await createVehiclesSecurityPass(body);
        return NextResponse.json(newPass, { status: 201 });

    } catch (error: any) {
        console.error("Error creating vehicle security pass:", error);
        return NextResponse.json(
            { error: "Failed to create vehicle security pass", message: error.message },
            { status: 500 }
        );
    }
}
