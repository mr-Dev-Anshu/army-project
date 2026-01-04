"use client";

import { useFormContext, Controller } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OffenderDynamicFormRHF from "./multi-step-form/steps/forms/OffenderDynamicFormRHF";
import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";

export default function OffenderWithoutVehicleFormRHF() {
    const { control, watch, setValue } = useFormContext();
    const offenderType = watch("offenderWithoutVehicle.offenderType");

    return (
        <div className="border rounded-lg p-6 space-y-6">
            <p className="font-semibold">Who was the Offender ?</p>

            <Controller
                control={control}
                name="offenderWithoutVehicle.offenderType"
                render={({ field }) => (
                    <RadioGroup
                        value={field.value || ""}
                        onValueChange={(value) => {
                            field.onChange(value);
                            // Also enforce no vehicle? Already handled by parent state 'vehicleInvolved'='no'
                        }}
                        className="grid grid-cols-2 gap-3"
                    >
                        {Object.keys(offenderFormsConfig).map((item) => (
                            <label
                                key={item}
                                className="border rounded-lg px-4 py-2 flex gap-2 cursor-pointer"
                            >
                                <RadioGroupItem value={item} />
                                {item}
                            </label>
                        ))}
                    </RadioGroup>
                )}
            />

            {offenderType && offenderFormsConfig[offenderType] && (
                <OffenderDynamicFormRHF
                    title={offenderFormsConfig[offenderType].title}
                    helperText={offenderFormsConfig[offenderType].helperText}
                    fields={offenderFormsConfig[offenderType].fields.slice(1)} // Slice 1 matching original logic?
                    showCoDriver={false}
                    basePath="driverDetails"
                />
            )}
        </div>
    );
}
