"use client";

import { useFormContext, Controller } from "react-hook-form";
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
  const { control, formState: { errors } } = useFormContext();

  const referenceOptions = [
    "Mil Tfc offence (Auth - Para 48 of SAO 6/S/2001/PM).",
    "Para 463(a) of CMP manual, SAO 9/S/78 and Stn order.",
    "Violation of sec 42(f) of the Army Act 1950.",
  ];

  return (
    <FormSection title="Offence Details">
      <div className="space-y-4">
        {/* Offence Type Select */}
        <div>
          <Label>Select Offence Type</Label>
          <Controller
            control={control}
            name="offenceTypes"
            render={({ field }) => (
              <Select
                value={field.value?.[0] ?? ""}
                onValueChange={(v) => field.onChange([v])}
              >
                <SelectTrigger className={errors.offenceTypes ? "border-red-500" : ""}>
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
            )}
          />
          {errors.offenceTypes && (
            <p className="text-red-500 text-sm mt-1">{errors.offenceTypes.message as string}</p>
          )}
        </div>

        {/* Reference Checkbox */}
        <div className="mt-4">
          <Label>Reference:</Label>
          <Controller
            control={control}
            name="offenceCode"
            render={({ field }) => (
              <CheckboxGroup
                options={referenceOptions}
                selected={field.value || []}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        {/* Description Textarea */}
        <div className="mt-6">
          <Label>Brief Description</Label>
          <Controller
            control={control}
            name="offenceOccurenceDetails.description"
            render={({ field }) => (
              <Textarea
                {...field}
                value={field.value || ""}
                onChange={field.onChange}
                className={`min-h-[140px] ${(errors.offenceOccurenceDetails as any)?.description
                    ? "border-red-500"
                    : ""
                  }`}
              />
            )}
          />
          {(errors.offenceOccurenceDetails as any)?.description && (
            <p className="text-red-500 text-sm mt-1">
              {(errors.offenceOccurenceDetails as any)?.description?.message}
            </p>
          )}
        </div>
      </div>
    </FormSection>
  );
}
