"use client";

import { FormSection } from "@/common/component/FormSection";
import { useForm } from "@/context/FormContext";
import { FormTextarea } from "@/common/component/FormTextarea";

export default function Step10Opinion() {
  const { state, dispatch } = useForm();

  const opinion = state.formData.mpReport.opinion || "";

  /* ===== UPDATE CONTEXT ===== */
  const updateOpinion = (value: string) => {
    dispatch({
      type: "SET_MP_DATA",
      payload: {
        opinion: value,
      },
    });
  };

  /* ===== CLEAR FORM ===== */
  const clearForm = () => {
    dispatch({
      type: "SET_MP_DATA",
      payload: {
        opinion: "",
      },
    });
  };

  return (
    <FormSection title="10. OPINION :" onClear={clearForm}>
      <FormTextarea
        label="List down Opinion in Points"
        value={opinion}
        onChange={updateOpinion}
      />
    </FormSection>
  );
}
