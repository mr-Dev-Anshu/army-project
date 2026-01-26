import { NextResponse } from "next/server";
import { generalTrafficOffenceService } from "@/services/generalTrafficOffence.service";
import { createGeneralTrafficOffenceSchema } from "@/validators/generalTrafficOffence.validator";
import { connectDB } from "@/lib/db/mongodb";

export async function GET(request) {
  try {
    await connectDB();

    // Get query parameters from URL
    const { searchParams } = new URL(request.url);
    const groupBy = searchParams.get('groupBy');

    // If groupBy=offenceType, return grouped aggregation
    if (groupBy === 'offenceType') {
      const queryParams = {
        offenceType: searchParams.get('offenceType'),
        status: searchParams.get('status'),
        vehicleType: searchParams.get('vehicleType'),
        vehicleCategory: searchParams.get('vehicleCategory'),
        isVehicleInvolved: searchParams.get('isVehicleInvolved'),


        fromDate: searchParams.get("fromDate"),
        toDate: searchParams.get("toDate"),

        date: searchParams.get('date'),
        unit: searchParams.get('unit'),
        fmn: searchParams.get('fmn'),
        placeOfOffence: searchParams.get('placeOfOffence'),
      };

      // Remove null/undefined values
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === null || queryParams[key] === undefined) {
          delete queryParams[key];
        }
      });

      const groupedOffences = await generalTrafficOffenceService.getGroupedByOffenceType(queryParams);
      return NextResponse.json(groupedOffences);
    }

    // Default: return all offences
    const offences = await generalTrafficOffenceService.getAll();
    return NextResponse.json(offences);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch offences" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // const { error, value } = createGeneralTrafficOffenceSchema.validate(body, {
    //   abortEarly: false,
    //   stripUnknown: true,
    // });

    // if (error) {
    //   return NextResponse.json(
    //     {
    //       error: "Validation failed",
    //       details: error.details.map(d => ({
    //         path: d.path,
    //         message: d.message
    //       }))
    //     },
    //     { status: 400 }
    //   );
    // }

    const newOffence = await generalTrafficOffenceService.create(body);

    return NextResponse.json(newOffence, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create offence", message: error.message },
      { status: 500 }
    );
  }
}