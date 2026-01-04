import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import React from "react";
import { cn } from "@/lib/utils";

/* ================== OLD COMPONENT ================== */
interface FormTextareaProps {
  label: string;
  description?: string;
  value?: string;
  onChange?: (v: string) => void;
}

export function FormTextarea({
  label,
  description,
  value,
  onChange,
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}

      <Textarea
        className="min-h-[200px]"   //  Default height increased
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}

/* ================== RHF COMPATIBLE ================== */

interface FormTextareaRHFProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
}

export const FormTextareaRHF = React.forwardRef<HTMLTextAreaElement, FormTextareaRHFProps>(
  ({ label, description, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && <Label>{label}</Label>}
        {description && <p className="text-sm text-gray-500">{description}</p>}
        <Textarea
          ref={ref}
          className={cn("min-h-[200px]", error && "border-red-500", className)}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);
FormTextareaRHF.displayName = "FormTextareaRHF";
