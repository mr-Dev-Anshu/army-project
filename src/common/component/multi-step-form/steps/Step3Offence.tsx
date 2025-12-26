
"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from "../../FormSection";
import CheckboxGroup from "../../CheckboxGroup";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useForm } from "@/context/FormContext";

export default function Step3Offence() {
  const { state, dispatch } = useForm();

  // 🔥 always target TRAFFIC form
  const d = state.formData.traffic;

  // 🔥 safe updater only for TRAFFIC
  const updateForm = (data: Partial<typeof d>) => {
    dispatch({
      type: "SET_FORM_DATA",
      payload: {
        traffic: {
          ...state.formData.traffic,
          ...data,
        },
      },
    });
  };

  const referenceOptions = [
    "Mil Tfc offence (Auth - Para 48 of SAO 6/S/2001/PM).",
    "Para 463(a) of CMP manual, SAO 9/S/78 and Stn order.",
    "Violation of sec 42(f) of the Army Act 1950.",
  ];

  return (
    <div className="space-y-10">
      <FormSection title="Offence Details">
        {/* Select */}
        <div className="space-y-2">
          <Label>Select Offence Type</Label>

          <Select
            value={d.offenceTypes?.[0] ?? ""}
            onValueChange={(v) => updateForm({ offenceTypes: [v] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Offence" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="minor">Minor Offence</SelectItem>
              <SelectItem value="major">Major Offence</SelectItem>
              <SelectItem value="disciplinary">
                Disciplinary Offence
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Checkbox */}
        <div className="space-y-2 mt-4">
          <Label>Reference:</Label>

          <CheckboxGroup
            options={referenceOptions}
            selected={d.offenceCode}
            onChange={(v) => updateForm({ offenceCode: v })}
          />
        </div>

        {/* Textarea */}
        <div className="space-y-2 mt-6">
          <Label>Brief Description of Offence</Label>

          <Textarea
            placeholder="Provide description"
            value={d.offenceOccurenceDetails.description || ""}
            onChange={(e) =>
              updateForm({
                offenceOccurenceDetails: {
                  ...d.offenceOccurenceDetails,
                  description: e.target.value,
                },
              })
            }
            className="min-h-[140px]"
          />
        </div>
      </FormSection>
    </div>
  );
}
