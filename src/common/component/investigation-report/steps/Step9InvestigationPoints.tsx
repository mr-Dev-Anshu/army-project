

"use client";
import { FormSection } from "@/common/component/FormSection";
import { useForm } from "@/context/FormContext";
import { FormTextarea } from "@/common/component/FormTextarea";

export default function Step9InvestigationPoints() {
  const { state, dispatch } = useForm();

  const value = state.formData.mpReport.investigationPoints;

  const set = (v: string) =>
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.investigationPoints",
      value: v,
    });

  const clear = () =>
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.investigationPoints",
      value: "",
    });

  return (
    <FormSection title="" >
      <FormTextarea label="List down all the Findings in points " value={value} onChange={set} />
    </FormSection>
  );
}
