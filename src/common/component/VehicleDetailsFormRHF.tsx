"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OffenderDynamicFormRHF from "./multi-step-form/steps/forms/OffenderDynamicFormRHF";
import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { cn } from "@/lib/utils";

export default function VehicleDetailsFormRHF() {
    const { control, watch } = useFormContext();

    const category = watch("vehicleDetails.category");
    const vehicleType = watch("vehicleDetails.vehicleType");
    const driverType = watch("vehicleDetails.driverType");
    const coDriverType = watch("coDriverType");

    return (
        <div className="border rounded-lg bg-white p-4 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* VEHICLE CATEGORY */}
            <div>
                <p className="font-semibold mb-2">Select Vehicle Category</p>

                <Controller
                    control={control}
                    name="vehicleDetails.category"
                    render={({ field }) => (
                        <RadioGroup
                            value={field.value || ""}
                            onValueChange={field.onChange}
                            className="grid sm:grid-cols-2 gap-3"
                        >
                            <label
                                className={cn(
                                    "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer transition-all",
                                    field.value === "2w"
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300"
                                )}
                            >
                                <RadioGroupItem value="2w" /> 2-Wheeler
                            </label>

                            <label
                                className={cn(
                                    "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer transition-all",
                                    field.value === "4w"
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300"
                                )}
                            >
                                <RadioGroupItem value="4w" /> 4-Wheeler
                            </label>
                        </RadioGroup>
                    )}
                />
            </div>

            {/* VEHICLE TYPE */}
            <div>
                <p className="font-semibold mb-2">
                    Which Type Of Vehicle Was Involved?
                </p>

                <Controller
                    control={control}
                    name="vehicleDetails.vehicleType"
                    render={({ field }) => (
                        <RadioGroup
                            value={field.value || ""}
                            onValueChange={field.onChange}
                            className="grid sm:grid-cols-2 gap-3"
                        >
                            <label
                                className={cn(
                                    "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer transition-all",
                                    field.value === "civilian"
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300"
                                )}
                            >
                                <RadioGroupItem value="civilian" /> Civilian Vehicle
                            </label>

                            <label
                                className={cn(
                                    "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer transition-all",
                                    field.value === "dd"
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300"
                                )}
                            >
                                <RadioGroupItem value="dd" /> DD Vehicle
                            </label>
                        </RadioGroup>
                    )}
                />
            </div>

            {/* CIVILIAN VEHICLE */}
            {vehicleType === "civilian" && (
                <div>
                    <p className="font-semibold mb-2">Fill Vehicle Identification</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <Label className="mb-3">Civil Vehicle Registration Number</Label>
                            <Controller
                                control={control}
                                name="vehicleDetails.vehicleNumber"
                                render={({ field }) => (
                                    <SuggestionInput
                                        placeholder="e.g. MP04 AB 1234"
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        fieldType="vehicleNumber"
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <Label className="mb-3">
                                Make & Type <span className="text-gray-500">(Vehicle Name)</span>
                            </Label>
                            <Controller
                                control={control}
                                name="vehicleDetails.vehicleName"
                                render={({ field }) => (
                                    <SuggestionInput
                                        placeholder="e.g. Honda CB Hornet"
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        fieldType="vehicleName"
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* DD VEHICLE */}
            {vehicleType === "dd" && (
                <div>
                    <p className="font-semibold mb-2">Fill Vehicle Identification</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <Label className="mb-3">DD Vehicle BA Number</Label>
                            <Controller
                                control={control}
                                name="vehicleDetails.vehicleNumber"
                                render={({ field }) => (
                                    <SuggestionInput
                                        placeholder="e.g. 12A 345678Z"
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        fieldType="vehicleNumber"
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <Label className="mb-3">
                                Make & Type <span className="text-gray-500">(Vehicle Name)</span>
                            </Label>
                            <Controller
                                control={control}
                                name="vehicleDetails.vehicleName"
                                render={({ field }) => (
                                    <SuggestionInput
                                        placeholder="e.g. ALS W/B"
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        fieldType="vehicleName"
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* DRIVER TYPE */}
            <div>
                <p className="font-semibold mb-2">Select Who was the Driver/Rider?</p>

                <Controller
                    control={control}
                    name="vehicleDetails.driverType"
                    render={({ field }) => (
                        <RadioGroup
                            value={field.value || ""}
                            onValueChange={field.onChange}
                            className="grid sm:grid-cols-2 gap-3"
                        >
                            {[
                                "Military Person",
                                "Civilian",
                                "Employee",
                                "Servant/Maid",
                                "Shop Keeper",
                                "Temporary Hired Worker",
                            ].map((item) => (
                                <label
                                    key={item}
                                    className={cn(
                                        "border rounded-lg px-4 py-2 flex gap-2 cursor-pointer transition-all",
                                        field.value === item
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-300"
                                    )}
                                >
                                    <RadioGroupItem value={item} />
                                    {item}
                                </label>
                            ))}
                        </RadioGroup>
                    )}
                />
            </div>

            {/* DYNAMIC FORM */}
            {driverType && offenderFormsConfig[driverType] && (
                <OffenderDynamicFormRHF
                    title={offenderFormsConfig[driverType].title}
                    helperText={offenderFormsConfig[driverType].helperText}
                    fields={offenderFormsConfig[driverType].fields}
                    showCoDriver={true}
                    basePath="driverDetails"
                />
            )}

            {/* CO DRIVER FORM */}
            {coDriverType && offenderFormsConfig[coDriverType] && (
                <OffenderDynamicFormRHF
                    title={`Co-Driver Details (${coDriverType})`}
                    fields={offenderFormsConfig[coDriverType].fields}
                    showCoDriver={false}
                    basePath="coDriverDetails"
                />
            )}
        </div>
    );
}
