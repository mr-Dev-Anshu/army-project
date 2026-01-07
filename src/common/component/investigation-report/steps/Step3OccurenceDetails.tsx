
"use client";

import { FormSection } from "@/common/component/FormSection";
import { FormInput } from "@/common/component/FormInput";
import { FormTextarea } from "@/common/component/FormTextarea";
import { useForm } from "@/context/FormContext";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import OffencesSection from "@/features/offence-references/components/OffenceSection";

export default function Step3OccurrenceDetails() {
  const { state, dispatch } = useForm();

  const mp = state.formData.mpReport.occurrenceDetails;

  /* ===== UNIVERSAL UPDATE ===== */
  const set = (key: string, value: any) =>
    dispatch({
      type: "SET_PATH",
      path: `formData.mpReport.occurrenceDetails.${key}`,
      value,
    });

  /* ===== CLEAR ===== */
  const clearForm = () =>
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.occurrenceDetails",
      value: {
        offenceType: "",
        offenceTypes: [],
        offenceTypeReference: [],
        place: "",
        date: "",
        time: "",
        description: "",
      },
    });

  const setOffenceTypes = (action: React.SetStateAction<string[]>) => {
    const current = mp.offenceTypes || [];
    let newValue;
    if (typeof action === "function") {
      newValue = action(current);
    } else {
      newValue = action;
    }
    set("offenceTypes", newValue);
  };

  const setOffenceReferences = (action: React.SetStateAction<string[]>) => {
    const current = mp.offenceTypeReference || [];
    let newValue;
    if (typeof action === "function") {
      newValue = action(current);
    } else {
      newValue = action;
    }
    set("offenceTypeReference", newValue);
  };

  return (
    <FormSection title="3. OCCURRENCE DETAILS:" onClear={clearForm}>
      {/* OFFENCE TYPE with REUSABLE COMPONENT */}
      <OffencesSection
        selectedOffences={mp.offenceTypes || []}
        setSelectedOffences={setOffenceTypes}
        selectedReferences={mp.offenceTypeReference || []}
        setSelectedReferences={setOffenceReferences}
      />

      {/* PLACE */}
      <SuggestionInput
        label="Place of Occurrence"
        placeholder="Location"
        value={mp.place}
        onChange={(v) => set("place", v)}
        fieldType="placeOfOccurrence"
      />

      {/* DATE + TIME */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Date of Occurrence"
          type="date"
          value={mp.date}
          onChange={(v) => set("date", v)}
        />

        <FormInput
          label="Time of Occurrence (Approx)"
          type="time"
          value={mp.time}
          onChange={(v) => set("time", v)}
        />
      </div>

      {/* DESCRIPTION */}
      <FormTextarea
        label="Fill Description of Offence"
        description="Provide a detailed description of the offence, including what happened and how it occurred."
        value={mp.description}
        onChange={(v) => set("description", v)}
      />
    </FormSection>
  );
}
