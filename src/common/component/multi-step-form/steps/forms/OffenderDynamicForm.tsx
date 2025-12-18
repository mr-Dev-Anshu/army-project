"use client";

import { FormInput, FormSelect } from "@/common/component/FormInput";
import { Checkbox } from "@/components/ui/checkbox";


interface Field {
  type: "input" | "select";
  label: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

export default function OffenderDynamicForm({
  title,
  helperText,
  fields,
  showCoDriver = true,
}: {
  title: string;
  helperText?: string;
  fields: Field[];
  showCoDriver?: boolean;
}) {
  return (
    <div className="space-y-5 mt-4">

      <p className="font-semibold">{title}</p>

      {helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}

      {/* LOOP FIELDS */}
      <div className="grid grid-cols-2 gap-4">
        {fields.map((f, i) =>
          f.type === "input" ? (
            <FormInput
              key={i}
              label={f.label}
              placeholder={f.placeholder}
            />
          ) : (
            <FormSelect
              key={i}
              label={f.label}
              placeholder={f.placeholder}
              options={f.options || []}
            />
          )
        )}
      </div>

      {/* Co Driver Checkbox */}
      {showCoDriver && (
        <label className="flex gap-2 items-start text-sm">
          <Checkbox />
          <span>
            Was there a
            <span className="font-semibold">
              {" "}Co-Driver or Pillion Rider{" "}
            </span>
            with the driver/rider?
          </span>
        </label>
      )}
    </div>
  );
}
