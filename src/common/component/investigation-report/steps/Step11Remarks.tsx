"use client";

import { FormSection } from "@/common/component/FormSection";
import { useForm } from "@/context/FormContext";
import { FormTextarea } from "@/common/component/FormTextarea";

export default function Step11Remarks() {
  const { state, dispatch } = useForm();

  const remarks = state.formData.mpReport.remarks;

  const set = (k: string, v: string) =>
    dispatch({
      type: "SET_PATH",
      path: `formData.mpReport.remarks.${k}`,
      value: v,
    });

  const clear = () =>
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.remarks",
      value: { analysis: "", recommendation: "" },
    });

  return (
    <FormSection title="">
      <div className="mt-2">
        <p className="font-semibold mb-1">ANALYSIS</p>
        <FormTextarea
          label=""
          value={remarks.analysis}
          onChange={(v) => set("analysis", v)}
        />
      </div>

      <div className="mt-6">
        <p className="font-semibold mb-1">RECOMMENDATION</p>
        <FormTextarea
          label=""
          value={remarks.recommendation}
          onChange={(v) => set("recommendation", v)}
        />
      </div>
    </FormSection>
  );
}