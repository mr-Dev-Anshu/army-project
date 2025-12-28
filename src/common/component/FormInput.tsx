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
  options: any[];
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
  const normalizedOptions = options.map((op, index) => {
    if (typeof op === "string") {
      return { label: op, value: op };
    }

    return {
      label: typeof op?.label === "object"
        ? String(op?.label?.label ?? op?.label?.value ?? `Option ${index}`)
        : String(op?.label ?? op?.value ?? `Option ${index}`),

      value: String(op?.value ?? op?.label ?? index),
    };
  });

  return (
    <div className="space-y-1 w-full">
      <Label>{label}</Label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {normalizedOptions.map((op, index) => (
            <SelectItem key={`${op.value}-${index}`} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
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
  inputClassName?: string;
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
