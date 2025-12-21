"use client";

import { useForm } from "@/context/FormContext";
import { FormTextarea } from "../../FormTextarea";

export default function Step3Offence() {
  const { state, dispatch } = useForm();
  const d = state.formData;

  const updateForm = (data: Partial<typeof d>) => {
    dispatch({
      type: "SET_FORM_DATA",
      payload: data,
    });
  };

  const referenceOptions = [
    "Mil Tfc offence (Auth - Para 48 of SAO 6/S/2001/PM).",
    "Para 463(a) of CMP manual, SAO 9/S/78 and Stn order.",
    "Violation of sec 42(f) of the Army Act 1950.",
  ];

  return (
    <div className="space-y-10 px-6">
      <FormTextarea
        label="Brief Description of Offence (Optional) "
        value={d.offenceOccurenceDetails.description}
        onChange={(e) =>
          updateForm({
            offenceOccurenceDetails: {
              ...d.offenceOccurenceDetails,
              description: e.target.value,
            },
          })
        }
      />
    </div>
  );
}
