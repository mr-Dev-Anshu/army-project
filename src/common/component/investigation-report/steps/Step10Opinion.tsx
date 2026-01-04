

"use client";
import { FormSection } from "@/common/component/FormSection";
import { useForm } from "@/context/FormContext";
import { FormTextarea } from "@/common/component/FormTextarea";

export default function Step10Opinion() {
  const { state, dispatch } = useForm();

  const value = state.formData.mpReport.opinion;

  const set = (v: string) =>
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.opinion",
      value: v,
    });

  const clear = () =>
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.opinion",
      value: "",
    });

  return (
    <FormSection title="" >
      <FormTextarea label="List down Opinion  in Points " value={value} onChange={set} />
    </FormSection>
  );
}