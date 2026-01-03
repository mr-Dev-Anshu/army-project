"use client";

import { FormSection } from "@/common/component/FormSection";
import { useForm } from "@/context/FormContext";
import { FormTextarea } from "@/common/component/FormTextarea";

export default function Step8DetailedOccurrence() {
  const { state, dispatch } = useForm();

  const value = state.formData.mpReport.detailedReport;

  const set = (v: string) =>
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.detailedReport",
      value: v,
    });

  const clear = () =>
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.detailedReport",
      value: "",
    });

  return (
    <FormSection title="8. DETAILED OCCURRENCE REPORT :" onClear={clear}>
      <FormTextarea label="" value={value} onChange={set} />
    </FormSection>
  );
}
