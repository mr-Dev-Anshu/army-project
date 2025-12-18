"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from "../../FormSection";

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
      <Label>{label}</Label>
      <Input type={type} placeholder={placeholder} />
    </div>
  );
}

export default function Step2Statement() {
  const [witnesses, setWitnesses] = useState([1]);

  return (
    <div className="space-y-8">
      {/* ---------------- 1️ ON DUTY DETAILS ---------------- */}
      <FormSection title="On-Duty Details">
        <p className="text-sm text-gray-500">
          Enter when and where the witness was on duty while reporting the offence.
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
          <Field label="Rank" placeholder="Select rank" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Unit" placeholder="Select unit" />
          <Field label="Army No." placeholder="Enter" />
        </div>
      </FormSection>

      <Button
        variant="link"
        className="text-blue-600"
        onClick={() => setWitnesses([...witnesses, witnesses.length + 1])}
      >
        + Add More Witnesses
      </Button>

      {/* ---------------- 4️ OFFENCE OCCURRENCE ---------------- */}
      <FormSection title="Offence Occurrence Details">
        <p className="text-sm text-gray-500">
          Enter the exact date and time when the incident occurred.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Time of Offence" placeholder="00:00" type="time" />
          <Field label="Incident Location" placeholder="Location" />
        </div>

        <div>
          <Label>Full Description of Offence</Label>
          <Textarea
            placeholder="Provide detailed description including what happened & how it occurred"
          />
        </div>
      </FormSection>
    </div>
  );
}
