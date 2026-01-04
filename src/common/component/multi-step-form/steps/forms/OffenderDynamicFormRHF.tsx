"use client";

import { useFormContext, Controller } from "react-hook-form";
import { FormSelect, FormInputRHF } from "@/common/component/FormInput";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface OffenderDynamicFormRHFProps {
    title: string;
    helperText?: string;
    fields: any[];
    showCoDriver?: boolean;
    basePath: string; // e.g. "driverDetails"
}

export default function OffenderDynamicFormRHF({
    title,
    helperText,
    fields,
    showCoDriver = false,
    basePath,
}: OffenderDynamicFormRHFProps) {
    const { control, watch, setValue } = useFormContext();

    return (
        <div className="space-y-6 mt-4 border border-gray-200 rounded-xl bg-white p-6 shadow-sm">
            <p className="font-semibold text-lg">{title}</p>

            {helperText && (
                <p className="text-sm text-gray-500">{helperText}</p>
            )}

            {/* DRIVER FORM */}
            <div className="grid grid-cols-2 gap-4">
                {fields.map((f: any, i: number) => {
                    const fieldName = `${basePath}.${f.label}`;
                    const isSuggestion = [
                        "Unit", "FMN", "Command", "Select Rank", "Trade",
                        "Place of QTR.", "Place of Work", "Place of Stay", "Address", "Department"
                    ].includes(f.label);

                    if (isSuggestion) {
                        return (
                            <Controller
                                key={i}
                                control={control}
                                name={fieldName}
                                render={({ field }) => (
                                    <SuggestionInput
                                        label={f.label}
                                        placeholder={f.placeholder}
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        fieldType={
                                            f.label === "Select Rank" ? "rank" :
                                                f.label.toLowerCase()
                                        }
                                        defaultOptions={
                                            f.label.includes("Rank")
                                                ? ["Pvt", "L/Nk", "Nk", "Hav", "Subedar"]
                                                : f.label === "Unit"
                                                    ? ["11 Engr Regt", "MP 12", "HQ Unit"]
                                                    : f.label === "FMN"
                                                        ? ["Central Command", "Western Command", "Northern Command"]
                                                        : f.label === "Command"
                                                            ? ["Command A", "Command B", "Command C"]
                                                            : []
                                        }
                                        className={cn(
                                            "transition-all",
                                            field.value
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-300"
                                        )}
                                    />
                                )}
                            />
                        );
                    }

                    return f.type === "input" ? (
                        <FormInputRHF
                            key={i}
                            label={f.label}
                            placeholder={f.placeholder}
                            {...control.register(fieldName)}
                        />
                    ) : (
                        <Controller
                            key={i}
                            control={control}
                            name={fieldName}
                            render={({ field }) => (
                                <FormSelect
                                    label={f.label}
                                    placeholder={f.placeholder}
                                    value={field.value || ""}
                                    options={f.options || []}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    );
                })}
            </div>


            {/* CO DRIVER */}
            {
                showCoDriver && (
                    <>
                        <div className="mt-6 flex items-start gap-2">
                            <Controller
                                control={control}
                                name="coDriverOrPillion"
                                render={({ field }) => (
                                    <Checkbox
                                        checked={Boolean(field.value)}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                            <p className="text-sm">
                                Was there a <b>Co-Driver / Pillion Rider</b>?
                            </p>
                        </div>

                        {watch("coDriverOrPillion") && (
                            <div className="mt-6 border rounded-xl bg-gray-50 p-6 space-y-5">
                                <Controller
                                    control={control}
                                    name="coDriverType"
                                    render={({ field }) => (
                                        <RadioGroup
                                            className="grid grid-cols-2 gap-3"
                                            value={field.value || ""}
                                            onValueChange={field.onChange}
                                        >
                                            {[
                                                "Military Person",
                                                "Civilian",
                                                "Employee",
                                                "Servant/Maid",
                                                "Shop Keeper",
                                                "Temporary Hired Worker",
                                            ].map((x) => (
                                                <label
                                                    key={x}
                                                    className="border rounded-lg px-4 py-2 flex gap-2 cursor-pointer bg-white"
                                                >
                                                    <RadioGroupItem value={x} />
                                                    {x}
                                                </label>
                                            ))}
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                        )}
                    </>
                )
            }
        </div >
    );
}
