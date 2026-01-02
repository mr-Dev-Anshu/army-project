"use client";
import { FormSection } from "@/common/component/FormSection";
import { useForm } from "@/context/FormContext";
import EvidenceUploadSection from "@/common/component/EvidenceUploadSection";

export default function Step6Evidence() {
  const { state, dispatch } = useForm();
  const evidence = state.formData.mpReport.evidence;

  const set = (k: string, v: any) =>
    dispatch({
      type: "SET_PATH",
      path: `formData.mpReport.evidence.${k}`,
      value: v,
    });

  const clear = () =>
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.evidence",
      value: {
        attachEvidence: null,
        eyeSketch: null,
        photos: [],
        videos: [],
      },
    });

  return (
    <FormSection title="">
      <EvidenceUploadSection
        title="Upload evidence"
        values={evidence}
        onChange={set}
        fields={[
          { label: "Attach Evidence", key: "attachEvidence" },
          { label: "Eye Sketch", key: "eyeSketch" },
          { label: "Photos", key: "photos", multiple: true },
          { label: "Videos", key: "videos", multiple: true },
        ]}
      />
    </FormSection>
  );
}
