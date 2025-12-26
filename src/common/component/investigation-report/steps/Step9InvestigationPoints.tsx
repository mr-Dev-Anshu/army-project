"use client";

import { FormSection } from "@/common/component/FormSection";
import { useForm } from "@/context/FormContext";
import { FormTextarea } from "@/common/component/FormTextarea";

export default function Step9InvestigationPoints() {
  const { state, dispatch } = useForm();

  const investigationPoints =
    state.formData.mpReport.investigationPoints || "";

  /* ===== SAVE TO CONTEXT ===== */
  const updatePoints = (value: string) => {
    dispatch({
      type: "SET_MP_DATA",
      payload: {
        investigationPoints: value,
      },
    });
  };

  /* ===== CLEAR FORM ===== */
  const clearForm = () => {
    dispatch({
      type: "SET_MP_DATA",
      payload: {
        investigationPoints: "",
      },
    });
  };

  return (
    <FormSection
      title="9. POINTS FIND OUT DURING INVESTIGATION :"
      onClear={clearForm}
    >
      <FormTextarea
        label="List down all the Findings in points"
        description=""
        value={investigationPoints}
        onChange={updatePoints}
      />
    </FormSection>
  );
}
