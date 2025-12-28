

"use client";

import { useForm } from "@/context/FormContext";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export default function Step4Remarks() {
  const { state, dispatch } = useForm();
  const d = state.formData.traffic;

  const remarkOptions = [
    "The indl committed offence...",
    "Suitable disciplinary action...",
    "Unit should ensure traffic compliance...",
  ];

  const [selected, setSelected] = useState<number | null>(0);

  const set = (value: string) =>
    dispatch({
      type: "SET_PATH",
      path: "formData.traffic.remarks",
      value,
    });

  return (
    <div className="space-y-6 px-4">
      <Textarea
        value={d.remarks || ""}
        onChange={(e) => set(e.target.value)}
        className="min-h-[140px]"
      />

      {remarkOptions.map((text, i) => (
        <label key={i} className="flex gap-2">
          <Checkbox
            checked={selected === i}
            onCheckedChange={() => {
              setSelected(i);
              set(text);
            }}
          />
          {text}
        </label>
      ))}
    </div>
  );
}
