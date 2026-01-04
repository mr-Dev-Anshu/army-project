"use client";

import { FormSection } from "@/common/component/FormSection";
import { useForm } from "@/context/FormContext";
import { FormTextarea } from "@/common/component/FormTextarea";

export default function Step9InvestigationPoints() {
  const { state, dispatch } = useForm();

  const raw = state.formData.mpReport.investigationPoints;

  // ✅ SAFE DISPLAY VALUE
  const value = Array.isArray(raw)
    ? raw.join("\n")
    : typeof raw === "string"
    ? raw
    : "";

  const set = (v: string) =>
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.investigationPoints",
      value: v
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean), // ✅ ALWAYS ARRAY
    });

  return (
    <FormSection title="">
      <FormTextarea
        label="List down all the Findings in points"
        value={value}
        onChange={set}
      />
    </FormSection>
  );
}
