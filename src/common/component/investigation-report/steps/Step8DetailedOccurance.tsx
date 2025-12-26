"use client";

import { FormSection } from "@/common/component/FormSection";
import { useForm } from "@/context/FormContext";
import { FormTextarea } from "@/common/component/FormTextarea";

export default function Step8DetailedOccurrence() {
  const { state, dispatch } = useForm();

  const detailedReport =
    state.formData.mpReport.detailedReport || "";

  // SAVE TO CONTEXT
  const updateReport = (value: string) => {
    dispatch({
      type: "SET_MP_SECTION",
      section: "detailedReport",   // <-- IMPORTANT
      payload: value,
    });
  };

  // CLEAR FORM
  const clearForm = () => {
    dispatch({
      type: "SET_MP_DATA",
      payload: {
        detailedReport: "",
      },
    });
  };

  return (
    <FormSection
      title="8. DETAILED OCCURRENCE REPORT :"
      onClear={clearForm}
    >
      <FormTextarea
        label="Fill Detailed Description of Offence"
        value={detailedReport}
        onChange={updateReport}
      />
    </FormSection>
  );
}
