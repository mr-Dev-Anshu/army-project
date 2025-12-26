"use client";

import { FormSection } from "@/common/component/FormSection";
import { useForm } from "@/context/FormContext";
import { FormTextarea } from "@/common/component/FormTextarea";

export default function Step11Remarks() {
  const { state, dispatch } = useForm();

  const remarks = state.formData.mpReport.remarks || {
    analysis: "",
    recommendation: "",
  };

  /* ===== UPDATE CONTEXT ===== */
  const updateRemarks = (key: "analysis" | "recommendation", value: string) => {
    dispatch({
      type: "SET_MP_SECTION",
      section: "remarks",
      payload: {
        [key]: value,
      },
    });
  };

  /* ===== CLEAR FORM ===== */
  const clearForm = () => {
    dispatch({
      type: "SET_MP_SECTION",
      section: "remarks",
      payload: {
        analysis: "",
        recommendation: "",
      },
    });
  };

  return (
    <FormSection title="11. REMARKS OF CO/21C PROVOST UNIT :" onClear={clearForm}>
      
      {/* ANALYSIS */}
      <div className="mt-2">
        <p className="font-semibold mb-1">ANALYSIS</p>
        <FormTextarea
          label=""
          value={remarks.analysis}
          onChange={(v) => updateRemarks("analysis", v)}
        />
      </div>

      {/* RECOMMENDATION */}
      <div className="mt-6">
        <p className="font-semibold mb-1">RECOMMENDATION</p>
        <FormTextarea
          label=""
          value={remarks.recommendation}
          onChange={(v) => updateRemarks("recommendation", v)}
        />
      </div>

    </FormSection>
  );
}
