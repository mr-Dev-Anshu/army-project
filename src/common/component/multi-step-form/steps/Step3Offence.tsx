
"use client";

import { useForm } from "@/context/FormContext";
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

export default function Step3Offence() {
  const { state, dispatch } = useForm();
  const d = state.formData.traffic;

  const set = (path: string, value: any) =>
    dispatch({
      type: "SET_PATH",
      path,
      value,
    });

  const referenceOptions = [
    "Mil Tfc offence (Auth - Para 48 of SAO 6/S/2001/PM).",
    "Para 463(a) of CMP manual, SAO 9/S/78 and Stn order.",
    "Violation of sec 42(f) of the Army Act 1950.",
  ];

  return (
    <FormSection title="">
      <Label className="text-xl text-gray-600">Select Offence Type</Label>

      <Select
        value={d.offenceTypes?.[0] ?? ""}
        onValueChange={(v) =>
          set("formData.traffic.offenceTypes", [v])
        }
      >
        <SelectTrigger className="w-full">
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

      <Label className="mt-4">Reference:</Label>

      <CheckboxGroup
        options={referenceOptions}
        selected={d.offenceCode}
        onChange={(v) =>
          set("formData.traffic.offenceCode", v)
        }
      />

      <Label className="mt-6">Brief Description</Label>

      <Textarea
        value={d.offenceOccurenceDetails.description || ""}
        onChange={(e) =>
          set(
            "formData.traffic.offenceOccurenceDetails.description",
            e.target.value
          )
        }
        className="min-h-[140px]"
      />
    </FormSection>
  );
}
