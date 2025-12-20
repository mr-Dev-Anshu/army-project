"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OffenderDynamicForm from "./multi-step-form/steps/forms/OffenderDynamicForm";
import { offenderFormsConfig } from "./multi-step-form/steps/Step1Particulars/config/OffenderConfig";

import { useState } from "react";
import { useForm } from "@/context/FormContext";

export default function OffenderWithoutVehicleForm() {
  const offenderConfig = offenderFormsConfig;

  const [offenderType, setOffenderType] = useState("");

  const { dispatch } = useForm();

  if (!offenderConfig) return null;

  return (
    <div className="border rounded-lg p-6 space-y-6">
      <p className="font-semibold">Who was the Offender ?</p>

      <RadioGroup
        value={offenderType}
        onValueChange={(value) => {
          setOffenderType(value);

          // 1️⃣ STORE OFFENDER
          dispatch({
            type: "SET_OFFENDER_TYPE",
            payload: value,
          });

          // 2️⃣ FIX: FORCE NO VEHICLE MODE
          dispatch({
            type: "SET_FORM_DATA",
            payload: { vehicleInvolved: "no" },
          });

          // 3️⃣ OPTIONAL: CLEAR VEHICLE DETAILS SAFELY
          dispatch({
            type: "SET_VEHICLE_DETAILS",
            payload: {
              category: "",
              vehicleType: "",
              driverType: "",
            },
          });
        }}
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
          fields={
            offenderConfig[offenderType].fields.slice(1) 
          }
          showCoDriver={false}
        />
      )}
    </div>
  );
}
