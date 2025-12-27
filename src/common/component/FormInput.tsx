import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

interface FormSelectProps {
  label: string;
  placeholder?: string;
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (v: string) => void;
}

export function FormSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
}: FormSelectProps) {
  return (
    <div className="space-y-1  w-full">
      <Label>{label}</Label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((op: any) => {
            const value = typeof op === "string" ? op : op.value;
            const label = typeof op === "string" ? op : op.label;

            return (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

interface FormInputProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  type?: string;
}

export function FormInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: FormInputProps) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
