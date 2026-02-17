"use client";

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

  return (
    <div className="space-y-6">
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
    </div>
  );
}