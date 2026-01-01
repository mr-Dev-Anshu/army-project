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

      {description && <p className="text-sm text-gray-500">{description}</p>}

      <Textarea
        className={`min-h-[400px] ${
          value && value.toString().trim() !== ""
            ? "!border-blue-500  focus-visible:ring-offset-0"
            : ""
        }`}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
