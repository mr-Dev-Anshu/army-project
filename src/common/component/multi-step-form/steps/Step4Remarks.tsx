"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  formData: any;
  setFormData: (data: any) => void;
}

export default function Step4Remarks({ formData, setFormData }: Props) {
  const remarkOptions = [
    "The indl committed offence as enumerated under Para 3 above. Suitable discp action be initiated against the indl by the unit, and inform to this office within 15 days from issue of this",
    "The indl committed offence as enumerated under Para 3 above. Suitable discp action be initiated against the indl by the unit, and inform to this office within 15 days from issue of this",
    "The indl committed offence as enumerated under Para 3 above. Suitable discp action be initiated against the indl by the unit, and inform to this office within 15 days from issue of this",
  ];

  const [selected, setSelected] = useState<number | null>(0);
  const [remarks, setRemarks] = useState(remarkOptions[0]);

  const handleCheck = (index: number) => {
    setSelected(index);
    setRemarks(remarkOptions[index]);
    setFormData({ ...formData, remarks: remarkOptions[index] });
  };

  return (
    <div className="space-y-6">
      {/* ADD REMARKS */}
      <div>
        <h3 className="text-lg font-semibold">ADD REMARKS</h3>

        <Textarea
          value={remarks}
          onChange={(e) => {
            setRemarks(e.target.value);
            setFormData({ ...formData, remarks: e.target.value });
          }}
          className="mt-2 min-h-[130px]"
        />
      </div>

      {/* PRE WRITTEN REMARKS */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">
          Pre Written Remarks
        </Label>

        {remarkOptions.map((text, index) => (
          <label
            key={index}
            className="flex gap-2 items-start text-sm cursor-pointer"
          >
            <Checkbox
              checked={selected === index}
              onCheckedChange={() => handleCheck(index)}
            />
            <span>{text}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
