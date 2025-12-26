"use client";

import { FormSection } from "@/common/component/FormSection";
import { useForm } from "@/context/FormContext";
import EvidenceUploadSection from "@/common/component/EvidenceUploadSection";

export default function Step6Evidence() {
  const { state, dispatch } = useForm();

  const evidence = state.formData.mpReport.evidence;

  const handleChange = (key: string, file: any) => {
    dispatch({
      type: "SET_MP_SECTION",
      section: "evidence",
      payload: { [key]: file },
    });
  };

  const clearForm = () => {
    dispatch({
      type: "SET_MP_SECTION",
      section: "evidence",
      payload: {
        generalEvidence: null,
        sketch: null,
        photos: [],
        videos: [],
      },
    });
  };

  return (
    <FormSection title="6. EVIDENCE:" onClear={clearForm}>
      <EvidenceUploadSection
        title=""
        values={evidence}
        onChange={handleChange}
        fields={[
          { label: "Attach Evidence", key: "generalEvidence" },
          { label: "Eye Sketch", key: "sketch" },
          { label: "Photos", key: "photos", multiple: true },
          { label: "Videos", key: "videos", multiple: true },
        ]}
      />
    </FormSection>
  );
}
