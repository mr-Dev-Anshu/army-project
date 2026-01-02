"use client";

import { FormSection } from "@/common/component/FormSection";
import { FormInput } from "@/common/component/FormInput";
import { FormTextarea } from "@/common/component/FormTextarea";
import { useForm } from "@/context/FormContext";
import { SuggestionInput } from "@/common/component/SuggestionInput";

export default function Step3OccurrenceDetails() {
  const { state, dispatch } = useForm();

  const mp = state.formData.mpReport.occurrenceDetails;

  const set = (key: string, value: any) =>
    dispatch({
      type: "SET_PATH",
      path: `formData.mpReport.occurrenceDetails.${key}`,
      value,
    });

  const clearForm = () =>
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.occurrenceDetails",
      value: {
        offenceType: "",
        place: "",
        date: "",
        time: "",
        description: "",
      },
    });

  return (
    <FormSection title="" >
      {/*  OFFENCE TYPE — NOW SUGGESTION INPUT */}
      <div className="mb-4">
        <SuggestionInput
          label="Offence Type"
          placeholder="Enter / Select Offence Type"
          value={mp.offenceType}
          onChange={(v) => set("offenceType", v)}
          fieldType="offenceType"
          defaultOptions={[
            "Theft",
            "Assault",
            "Traffic Violation",
            "Misconduct",
          ]}
        />
      </div>

      {/* PLACE */}
      <div className="mb-4">
        <SuggestionInput
          label="Place of Occurrence"
          placeholder="Location"
          value={mp.place}
          onChange={(v) => set("place", v)}
          fieldType="placeOfOccurrence"
        />
      </div>
      {/*  DATE + TIME */}
      <div className="grid  mb-6 grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* ⭐ DESCRIPTION */}
      <FormTextarea
        label="Fill Description of Offence"
        description="Provide a detailed description of the offence, including what happened and how it occurred."
        value={mp.description}
        onChange={(v) => set("description", v)}
      />
    </FormSection>
  );
}
