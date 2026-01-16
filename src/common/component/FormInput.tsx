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


interface FormSelectProps {
  label: string;
  placeholder?: string;
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (v: string) => void;
}

export function FormSelect({
  label,
  placeholder = "Select option",
  options,
  value,
  onChange,
}: FormSelectProps) {
  return (
    <div className="space-y-1 w-full">
      <Label>{label}</Label>

      {/* 🔥 KEY + CONDITIONAL VALUE = FIX */}
      <Select
        key={value || "empty"}               // force remount
        value={value ? value : undefined}    // 👈 IMPORTANT
        onValueChange={onChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((op: any) => {
            const val = typeof op === "string" ? op : op.value;
            const lab = typeof op === "string" ? op : op.label;

            return (
              <SelectItem key={val} value={val}>
                {lab}
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
  error?: string;
}

export function FormInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
}: FormInputProps) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>

      <Input
        type={type}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className={`
          ${value ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          ${error ? "border-red-500 bg-red-50" : ""}
          focus-visible:ring-0
          focus-visible:ring-offset-0
        `}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

