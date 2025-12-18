"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FormSection } from "../../FormSection";
import CheckboxGroup from "../../CheckboxGroup";



export default function Step3Offence() {
  const [offenceType, setOffenceType] = useState("");
  const [references, setReferences] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  const referenceOptions = [
    "Mil Tfc offence (Auth - Para 48 of SAO 6/S/2001/PM).",
    "Para 463(a) of CMP manual, SAO 9/S/78 and Stn order.",
    "Violation of sec 42(f) of the Army Act 1950.",
  ];

  return (
    <div className="space-y-10">
      {/* MAIN SECTION */}
      <FormSection title="Offence Details">
        
        {/* Select */}
        <div className="space-y-2">
          <Label>Select Offence Type</Label>

          <Select onValueChange={setOffenceType}>
            <SelectTrigger>
              <SelectValue placeholder="Select Offences" />
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
            selected={references}
            onChange={setReferences}
          />
        </div>

        {/* Textarea */}
        <div className="space-y-2 mt-6">
          <Label>Brief Description of Offence</Label>

          <Textarea
            placeholder="Provide a detailed description of the offence, including what happened and how it occurred."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[140px]"
          />
        </div>
      </FormSection>
    </div>
  );
}
