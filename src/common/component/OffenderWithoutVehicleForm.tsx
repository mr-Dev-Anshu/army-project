"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";
import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";

import { useState } from "react";

export default function OffenderWithoutVehicleForm() {
  const offenderConfig = offenderFormsConfig;   // ⭐ SAME CONFIG USE HO RHA

  const [offenderType, setOffenderType] = useState("");

  if (!offenderConfig) return null;  // ❌ NULL SAFE

  return (
    <div className="border rounded-lg p-6 space-y-6">
      
      <p className="font-semibold">Who was the Offender ?</p>

      <RadioGroup
        value={offenderType}
        onValueChange={setOffenderType}
        className="grid grid-cols-2 gap-3"
      >
        {Object.keys(offenderConfig).map((item) => (
          <label
            key={item}
            className="border rounded-lg px-4 py-2 flex gap-2 cursor-pointer"
          >
            <RadioGroupItem value={item} />
            {item}
          </label>
        ))}
      </RadioGroup>

      {offenderType && offenderConfig[offenderType] && (
        <OffenderDynamicForm
          title={offenderConfig[offenderType].title}
          helperText={offenderConfig[offenderType].helperText}
          fields={offenderConfig[offenderType].fields}
        />
      )}
    </div>
  );
}
