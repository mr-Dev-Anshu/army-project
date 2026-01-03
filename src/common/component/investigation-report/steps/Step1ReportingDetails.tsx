
"use client";

import { FormSection } from "@/common/component/FormSection";
import { FormInput, FormSelect } from "@/common/component/FormInput";
import { useForm } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { SuggestionInput } from "@/common/component/SuggestionInput";

export default function Step1ReportDetails() {
  const { state, dispatch } = useForm();
  const mp = state.formData.mpReport.reportDetails;

  const set = (key: string, value: any) =>
    dispatch({
      type: "SET_PATH",
      path: `formData.mpReport.reportDetails.${key}`,
      value,
    });

  const clearForm = () =>
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.reportDetails",
      value: {
        reportNo: "",
        command: "",
        firNo: "",
        firFile: null,
      },
    });

  return (
    <FormSection title="1. REPORT DETAILS:" onClear={clearForm}>
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

      <div>
        <label className="text-sm font-medium">FIR Number</label>

        <div className="flex gap-2 mt-1">
          <input
            className="border rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-blue-400"
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
