
import { z } from "zod";

// --- 1. Vehicle Details (Made stricter, but controlled by conditional trigger) ---
export const vehicleDetailsSchema = z.object({
    category: z.string().min(1, "Category is required"),
    vehicleType: z.string().min(1, "Vehicle Type is required"),
    driverType: z.string().min(1, "Driver Type is required"),
    // These depend on vehicleType (Civilian vs DD), so we keep them somewhat loose or handle in UI? 
    // Best to make them optional-ish in schema and refine, OR just required and we rely on conditional render.
    // For now, let's keep them string/min(1) and we only trigger them if relevant.
    vehicleName: z.string().optional(),
    vehicleNumber: z.string().optional(),
});

// --- 2. On Duty Details ---
export const onDutyDetailsSchema = z.object({
    dateOfDuty: z.string().min(1, "Date of Duty is required"),
    startTime: z.string().min(1, "Start Time is required"),
    endTime: z.string().min(1, "End Time is required"),
    dutyLocation: z.string().min(1, "Place of Duty is required"),
    dutyType: z.string().min(1, "Type of Duty is required"),
});

// --- 3. MP Reporting ---
export const onDutyDetailsMPReportingSchema = z.object({
    nameReportingMP: z.string().min(2, "Name is required"),
    rank: z.string().min(1, "Rank is required"),
    unit: z.string().min(1, "Unit is required"),
    armyNumber: z.string().min(1, "Army Number is required"),
    contactNumber: z.string().optional(),
});

// --- 4. Offence Occurrence ---
export const offenceOccurenceDetailsSchema = z.object({
    timeOfOffence: z.string().min(1, "Time of Offence is required"),
    incidentLocation: z.string().min(1, "Place of Offence is required"),
    description: z.string().min(1, "Description is required"),
});

// --- 5. Witness ---
export const witnessSchema = z.object({
    reportingBlock: z.object({
        rank: z.string(),
        nameReportingMP: z.string(),
        armyNumber: z.string(),
        unit: z.string(),
    }),
    contactNumber: z.string().optional(),
});

// --- MAIN SCHEMA ---
export const generalTrafficOffenceSchema = z.object({
    // Step 1
    vehicleInvolved: z.enum(["yes", "no"]),

    vehicleDetails: vehicleDetailsSchema.optional(), // Parent object optional, but children strict

    offenderWithoutVehicle: z.object({
        offenderType: z.string().min(1, "Offender Type is required"),
    }).optional(),

    // Driver/CoDriver (Dynamic) - kept loose as "record" but we can enforce presence in code
    driverDetails: z.record(z.any()).optional(),
    coDriverDetails: z.record(z.any()).optional(),
    coDriverOrPillion: z.boolean().optional(),
    coDriverType: z.string().optional(),

    // Step 2 & 3
    onDutyDetails: onDutyDetailsSchema,
    onDutyDetailsMPReporting: onDutyDetailsMPReportingSchema,
    offenceOccurenceDetails: offenceOccurenceDetailsSchema,

    witnesses: z.array(witnessSchema).optional(),
    selectedWitness: z.any().optional(),

    // Step 3
    offenceTypes: z.array(z.string()).min(1, "At least one offence type is required"),
    offenceCode: z.array(z.string()).optional(),

    // Step 4
    remarks: z.string().optional(),
});

export type GeneralTrafficOffenceFormValues = z.infer<typeof generalTrafficOffenceSchema>;
