"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormTextareaRHF } from "@/common/component/FormTextarea";
import { useState } from "react";

export default function Step4Remarks() {
  const { control, setValue } = useFormContext();

  const remarkOptions = [
    "The indl committed offence as enumerated under Para 3 above...",
    "Suitable disciplinary action be taken as deemed appropriate...",
    "Unit should ensure strict compliance of traffic rules...",
  ];

  const [selected, setSelected] = useState<number | null>(0);

  // We write to "remarks" field (string)
  const set = (value: string) => setValue("remarks", value, { shouldValidate: true });

  return (
    <div className="space-y-6 px-4">
      <Controller
        control={control}
        name="remarks"
        render={({ field }) => (
          <FormTextareaRHF
            label="ADD REMARKS"
            value={field.value || ""}
            onChange={field.onChange}
            className="min-h-[140px]"
          />
        )}
      />

      <div className="space-y-3">
        <p className="text-sm sm:text-base font-semibold">Pre Written Remarks</p>
        {remarkOptions.map((text, i) => (
          <label key={i} className="flex gap-2 items-start cursor-pointer">
            <Checkbox
              checked={selected === i}
              onCheckedChange={() => {
                setSelected(i);
                set(text);
              }}
            />
            <span className="text-sm sm:text-base">{text}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
