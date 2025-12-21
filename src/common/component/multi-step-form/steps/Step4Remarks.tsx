
"use client";

import { useForm } from "@/context/FormContext";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export default function Step4Remarks() {
  const { state, dispatch } = useForm();
  const d = state.formData;

  const remarkOptions = [
    "The indl committed offence as enumerated under Para 3 above...",
    "Suitable disciplinary action be taken as deemed appropriate...",
    "Unit should ensure strict compliance of traffic rules...",
  ];

  const [selected, setSelected] = useState<number | null>(0);

  const updateRemarks = (text: string) => {
    dispatch({
      type: "SET_FORM_DATA",
      payload: { remarks: text },
    });
  };

  return (
    <div
      className="
        space-y-6 
        px-4
        w-full
        overflow-y-auto
      "
    >
      {/* ADD REMARKS */}
      <div className="w-full">
        <h3 className="text-lg sm:text-xl font-semibold">
          ADD REMARKS
        </h3>

        <Textarea
          value={d.remarks || ""}
          onChange={(e) => updateRemarks(e.target.value)}
          className="
            mt-2 
            min-h-[120px] 
            sm:min-h-[130px] 
            md:min-h-[150px]
          "
        />
      </div>

      {/* PRE WRITTEN REMARKS */}
      <div className="space-y-3">
        <Label className="text-sm sm:text-base font-semibold">
          Pre Written Remarks
        </Label>

        <div className="space-y-3">
          {remarkOptions.map((text, index) => (
            <label
              key={index}
              className="
                flex gap-2 
                items-start 
                text-sm sm:text-base 
                cursor-pointer
                leading-snug
              "
            >
              <Checkbox
                checked={selected === index}
                onCheckedChange={() => {
                  setSelected(index);
                  updateRemarks(text);
                }}
              />

              <span className="block">
                {text}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
