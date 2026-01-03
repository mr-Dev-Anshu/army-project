"use client";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export interface EvidenceField {
  label: string;
  key: string;
  multiple?: boolean;
}

export default function EvidenceUploadSection({
  title,
  fields,
  values = {},
  onChange,
}: {
  title: string;
  fields: EvidenceField[];
  values?: Record<string, any>;
  onChange: (key: string, file: File | File[] | null) => void;
}) {
  return (
    <div className="space-y-5 max-w-sm">
      {title && <h3 className="font-semibold">{title}</h3>}

      {fields.map((field) => {
        const inputRef = useRef<HTMLInputElement | null>(null);

        return (
          <div key={field.key} className="flex flex-col gap-1">
            <p className="text-sm font-medium">{field.label}</p>

            {/* Hidden Input */}
            <input
              ref={inputRef}
              type="file"
              multiple={field.multiple}
              className="hidden"
              onChange={(e) => {
                const files = e.target.files;
                if (!files) return;

                onChange(
                  field.key,
                  field.multiple ? Array.from(files) : files[0]
                );
              }}
            />

            {/* Upload Button */}
            <Button
              size="sm"
              className="bg-black text-white flex gap-2 w-28 justify-center"
              onClick={() => inputRef.current?.click()}
            >
              <Upload size={14} />
              Upload
            </Button>

            {/* Selected File Preview */}
            {values?.[field.key] && (
              <p className="text-xs text-gray-500">
                {field.multiple
                  ? `${values[field.key]?.length} file(s) selected`
                  : values[field.key]?.name}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
