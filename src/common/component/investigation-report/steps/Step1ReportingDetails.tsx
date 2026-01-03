


"use client";

import { FormSection } from "@/common/component/FormSection";
import { FormInput } from "@/common/component/FormInput";
import { useForm } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";   // ⭐ ADD THIS

export default function Step1ReportDetails() {
  const { state, dispatch } = useForm();
  const mp = state.formData.mpReport.reportDetails;

  const set = (key: string, value: any) =>
    dispatch({
      type: "SET_PATH",
      path: `formData.mpReport.reportDetails.${key}`,
      value,
    });

 

  return (
    <FormSection title="">
      <FormInput
        label="Report No : PRO/21 CPU/"
        placeholder="PRO/21CPU/00082/106/25"
        value={mp.reportNo}
        onChange={(v) => set("reportNo", v)}
      />

      <SuggestionInput
        label="Command:"
        placeholder="Select Origin"
        value={mp.command}
        onChange={(v) => set("command", v)}
        fieldType="command"
        defaultOptions={[
          "Central Command",
          "Western Command",
          "Eastern Command",
          "Northern Command",
        ]}
      />

      {/* ⭐ FIR NUMBER FIXED TO MATCH UI ⭐ */}
      <div className="mt-4">
        <Label className="text-sm font-medium">FIR Number</Label>

        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Enter FIR Number"
            value={mp.firNo}
            onChange={(e) => set("firNo", e.target.value)}
          />

          <Button className="bg-black text-white flex gap-2">
            <Upload size={16} /> Upload FIR
          </Button>
        </div>
      </div>
    </FormSection>
  );
}
