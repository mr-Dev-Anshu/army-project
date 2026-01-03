


"use client";

import { useForm } from "@/context/FormContext";
import { FormTextarea } from "../../FormTextarea";

export default function Step3Offence() {
  const { state, dispatch } = useForm();

  const staticData = state.formData.staticSpeed;
  const offence = staticData?.offenceOccurenceDetails || {};

  const updateOffence = (value: any) => {
    dispatch({
      type: "SET_STATIC_SPEED_DATA",
      payload: {
        offenceOccurenceDetails: {
          ...offence,
          ...value,
        },
      },
    });
  };

  return (
    <div className="space-y-10 px-6">
      <FormTextarea
        label="Brief Description of Offence (Optional)"
        value={offence.description || ""}
        onChange={(v) => updateOffence({ description: v })}
      />
    </div>
  );
}
