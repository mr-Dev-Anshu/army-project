"use client";

import { FormSection } from "@/common/component/FormSection";
import { FormInput, FormSelect } from "@/common/component/FormInput";
import { FormTextarea } from "@/common/component/FormTextarea";
import { useForm } from "@/context/FormContext";

export default function Step3OccurrenceDetails() {
  const { state, dispatch } = useForm();

  const mp = state.formData.mpReport.occurrenceDetails;

  const handleChange = (key: string, value: any) => {
    dispatch({
      type: "SET_MP_SECTION",
      section: "occurrenceDetails",
      payload: { [key]: value },
    });
  };

  const clearForm = () => {
    dispatch({
      type: "SET_MP_SECTION",
      section: "occurrenceDetails",
      payload: {
        offenceType: "",
        placeOfOccurrence: "",
        date: "",
        time: "",
        description: "",
      },
    });
  };

  return (
    <FormSection title="3. OCCURRENCE DETAILS:" onClear={clearForm}>
      {/* OFFENCE TYPE */}
      <FormSelect
        label="Select Offence Type"
        placeholder="Select Offences"
        options={[
          { label: "Theft", value: "theft" },
          { label: "Assault", value: "assault" },
          { label: "Traffic Violation", value: "traffic" },
          { label: "Misconduct", value: "misconduct" },
        ]}
        value={mp.offenceType}
        onChange={(v) => handleChange("offenceType", v)}
      />

      {/* PLACE */}
      <FormInput
        label="Place of Occurrence"
        placeholder="Location"
        value={mp.placeOfOccurrence}
        onChange={(v) => handleChange("place", v)}
      />

      {/* DATE + TIME */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Date of Occurrence"
          type="date"
          placeholder="Pick a date"
          value={mp.date}
          onChange={(v) => handleChange("date", v)}
        />

        <FormInput
          label="Time of Occurrence (Approx)"
          type="time"
          value={mp.time}
          onChange={(v) => handleChange("time", v)}
        />
      </div>

      {/* DESCRIPTION */}
      <FormTextarea
        label="Fill Description of Offence"
        description="Provide a detailed description of the offence, including what happened and how it occurred."
        value={mp.description}
        onChange={(v) => handleChange("description", v)}
      />
    </FormSection>
  );
}
