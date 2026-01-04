import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React from "react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

/* ================== OLDER COMPONENTS (CUSTOM ONCHANGE) ================== */

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

/* ================== RHF COMPATIBLE COMPONENTS ================== */

interface FormInputRHFProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const FormInputRHF = React.forwardRef<HTMLInputElement, FormInputRHFProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1 w-full">
        {label && <Label>{label}</Label>}
        <Input ref={ref} className={cn(error && "border-red-500", className)} {...props} />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);
FormInputRHF.displayName = "FormInputRHF";
