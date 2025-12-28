

"use client";

import { useForm } from "@/context/FormContext";
import { FormTextarea } from "../../FormTextarea";
import { OffenceOccurenceDetails } from "@/common/types/form.types";

export default function Step3Offence() {
  const { state, dispatch } = useForm();

  const staticData = state.formData.staticSpeed;
  const offence: OffenceOccurenceDetails = staticData.offenceBlock;

  // --- STRICTLY TYPED UPDATER ---
  const updateOffence = <K extends keyof OffenceOccurenceDetails>(
    key: K,
    value: OffenceOccurenceDetails[K]
  ) => {
    dispatch({
      type: "SET_PATH",
      path: `formData.staticSpeed.offenceBlock.${key}`,
      value,
    });
  };

  return (
    <div className="space-y-10 px-6">
      <FormTextarea
        label="Brief Description of Offence (Optional)"
        value={offence.description || ""}
        onChange={(value) => updateOffence("description", value)}
      />
    </div>
  );
}
