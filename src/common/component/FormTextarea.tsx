import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
