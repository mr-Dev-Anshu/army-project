"use client";

import { useReducer } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from "../../FormSection";
import { FormSelect } from "../../FormInput";

/* -------- REUSABLE: FIELD ---------- */
function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <Label className="mb-3">{label}</Label>
      <Input type={type} placeholder={placeholder} />
    </div>
  );
}

/* ---------------- REDUCER ---------------- */
const initialState = {
  witnesses: [1],
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "ADD_WITNESS":
      return {
        ...state,
        witnesses: [...state.witnesses, state.witnesses.length + 1],
      };

    default:
      return state;
  }
}

export default function Step2Statement() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="space-y-8">
      {/* ---------------- 1️ ON DUTY DETAILS ---------------- */}
      <FormSection title="On-Duty Details">
        <p className="text-sm text-gray-500">
          Enter when and where the witness was on duty while reporting the
          offence.
        </p>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Date of Duty" placeholder="Pick a date" type="date" />
          <Field label="Start Time" placeholder="00:00" type="time" />
          <Field label="End Time" placeholder="00:00" type="time" />
        </div>

        <Field label="Duty Location" placeholder="Location" />
        <Field label="Duty Type" placeholder="e.g Mobile Duty" />
      </FormSection>

      {/* ---------------- 2️ REPORTING MP ---------------- */}
      <FormSection title="On-Duty Details of MP Reporting">
        <p className="text-sm text-gray-500">Enter Details</p>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Name of Reporting MP" placeholder="e.g Sanjay Kumar" />

          {/* ⭐️ RANK DROPDOWN ADDED HERE */}
          <FormSelect
            label="Rank"
            placeholder="Select rank"
            options={[
              { label: "Lieutenant", value: "lt" },
              { label: "Captain", value: "captain" },
              { label: "Major", value: "major" },
              { label: "Colonel", value: "colonel" },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Unit"
              placeholder="Select unit"
              options={[
                { label: "Unit 1", value: "u1" },
                { label: "Unit 2", value: "u2" },
                { label: "Unit 3", value: "u3" },
              ]}
            />
          </div>

          <Field label="Army No." placeholder="Enter" />
        </div>
      </FormSection>

      {/* ADD MORE (Reducer Based) */}
      <Button
        variant="link"
        className="text-blue-600"
        onClick={() => dispatch({ type: "ADD_WITNESS" })}
      >
        + Add More Witnesses ({state.witnesses.length})
      </Button>

      {/* ---------------- 3️ OFFENCE OCCURRENCE ---------------- */}
      <FormSection title="Offence Occurrence Details">
        <p className="text-sm text-gray-500">
          Enter the exact date and time when the incident occurred.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Time of Offence" placeholder="00:00" type="time" />
          <Field label="Incident Location" placeholder="Location" />
        </div>

        <div>
          <Label className="mb-4">Full Description of Offence</Label>
          <Textarea placeholder="Provide detailed description including what happened & how it occurred" />
        </div>
      </FormSection>
    </div>
  );
}
