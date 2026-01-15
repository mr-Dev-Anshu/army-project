"use client";
import React from "react";
import { useForm } from "@/context/FormContext";
import { FormTextarea } from "../../FormTextarea";
import OffencesSection from "@/features/offence-references/components/OffenceSection";

export default function Step3Offence() {
  const { state, dispatch } = useForm();

  const staticData = state.formData.staticSpeed;
  const offence = staticData?.offenceBlock || {};

  const updateOffence = (value: any) => {
    dispatch({
      type: "SET_PATH",
      path: "formData.staticSpeed.offenceBlock",
      value: {
        ...offence,
        ...value,
      },
    });
  };

  const setOffenceTypes = (action: React.SetStateAction<string[]>) => {
    const current = offence.offenceTypes || [];
    let newValue;
    if (typeof action === "function") {
      newValue = action(current);
    } else {
      newValue = action;
    }
    updateOffence({ offenceTypes: newValue });
  };

  const setOffenceReferences = (action: React.SetStateAction<string[]>) => {
    const current = offence.offenceTypeReference || [];
    let newValue;
    if (typeof action === "function") {
      newValue = action(current);
    } else {
      newValue = action;
    }
    updateOffence({ offenceTypeReference: newValue });
  };

  return (
    <div className="space-y-6">
      <OffencesSection
        selectedOffences={offence.offenceTypes || []}
        setSelectedOffences={setOffenceTypes}
        selectedReferences={offence.offenceTypeReference || []}
        setSelectedReferences={setOffenceReferences}
      />

      <div className="w-full">
        <FormTextarea
          label="Brief Description of Offence (Optional)"
          value={offence.briefDescription || ""}
          onChange={(val) => updateOffence({ briefDescription: val })}
        />
      </div>
    </div>
  );
}
