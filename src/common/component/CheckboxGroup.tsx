"use client";

import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxGroupProps {
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}

export default function CheckboxGroup({
  options,
  selected,
  onChange,
}: CheckboxGroupProps) {
  return (
    <div className="space-y-3">
      {options.map((opt) => (
        <label key={opt} className="flex gap-2 items-start text-sm">
          <Checkbox
            checked={selected.includes(opt)}
            onCheckedChange={(checked) =>
              checked
                ? onChange([...selected, opt])
                : onChange(selected.filter((x) => x !== opt))
            }
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}
