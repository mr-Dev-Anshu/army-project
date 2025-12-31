

"use client";

import { useForm } from "@/context/FormContext";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { FormSection } from "../../FormSection";

export default function Step4Remarks() {
  const { state, dispatch } = useForm();
  const d = state.formData.traffic;

  const remarkOptions = [
    "The indl committed offence as enumerated under para 3 above.Suitable discription action be initiated against the indl by the unit , and inform to this office within 15 days from issue of this ",
    "The indl committed offence as enumerated under para 3 above.Suitable discription action be initiated against the indl by the unit , and inform to this office within 15 days from issue of this ",
    "The indl committed offence as enumerated under para 3 above.Suitable discription action be initiated against the indl by the unit , and inform to this office within 15 days from issue of this ",
  ];

  const [selected, setSelected] = useState<number | null>(0);

  const set = (value: string) =>
    dispatch({
      type: "SET_PATH",
      path: "formData.traffic.remarks",
      value,
    });

  return (
   <FormSection title="ADD REMARKS">
     <Textarea
        value={d.remarks || ""}
        onChange={(e) => set(e.target.value)}
        className="min-h-[140px]"
      />
      <p className="text-gray-400">Pre Written Remarks</p>
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
   </FormSection>
  );
}
