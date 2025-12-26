"use client";

import { FormSection } from "@/common/component/FormSection";
import { FormInput, FormSelect } from "@/common/component/FormInput";
import { useForm } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function Step1ReportDetails() {
  const { state, dispatch } = useForm();

  const mp = state.formData.mpReport;

  const handleChange = (key: string, value: any) => {
    dispatch({
      type: "SET_MP_SECTION",
      section: "reportDetails",
      payload: { [key]: value },
    });
  };

  return (
    <FormSection title="1. REPORT DETAILS:" onClear={() => {
      dispatch({
        type: "SET_MP_SECTION",
        section: "reportDetails",
        payload: {
          reportNo: "",
          command: "",
          firNo: "",
          firFile: null,
        },
      });
    }}>
      
      {/* REPORT NUMBER */}
      <FormInput
        label="Report No. : PRO/21 CPU/"
        placeholder="eg. PRO/21CPU/00082/106/25"
        value={mp.reportDetails.reportNo}
        onChange={(v) => handleChange("reportNo", v)}
      />

      {/* COMMAND */}
      <FormSelect
        label="Command:"
        placeholder="Select Origin"
        options={[
          { label: "Central Command", value: "central" },
          { label: "Western Command", value: "western" },
          { label: "Eastern Command", value: "eastern" },
          { label: "Northern Command", value: "northern" },
        ]}
        value={mp.reportDetails.command}
        onChange={(v) => handleChange("command", v)}
      />

      {/* FIR BLOCK */}
      <div className="w-full">
        <label className="text-sm font-medium">FIR Number</label>

        <div className="flex gap-2 mt-1">
          <input
            className="
              border rounded-lg px-3 py-2 w-full outline-none
              focus:ring-2 focus:ring-blue-400
            "
            placeholder="Enter FIR Number"
            value={mp.reportDetails.firNo}
            onChange={(e) => handleChange("firNo", e.target.value)}
          />

          <Button className="bg-black text-white flex gap-2">
            <Upload size={16} /> Upload FIR
          </Button>
        </div>
      </div>

    </FormSection>
  );
}
