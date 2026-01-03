


"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { uploadFile } from "@/lib/uploadFile";

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
  onChange: (key: string, value: any) => void;
}) {
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const handleUpload = async (
    field: EvidenceField,
    files: FileList | null
  ) => {
    if (!files || files.length === 0) return;

    setLoadingKey(field.key);

    try {
      const uploaded: any[] = [];

      for (const file of Array.from(files)) {
        const { url } = await uploadFile(file);

        uploaded.push({
          type: field.label,   // 🔥 LABEL = TYPE
          url,
          description: file.name,
        });
      }

      if (field.multiple) {
        onChange(field.key, [...(values[field.key] || []), ...uploaded]);
      } else {
        onChange(field.key, uploaded[0]);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Upload failed");
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div className="space-y-5 max-w-sm">
      {title && <h3 className="font-semibold">{title}</h3>}

      {fields.map((field) => {
        const inputRef = useRef<HTMLInputElement | null>(null);

        return (
          <div key={field.key} className="flex flex-col gap-1">
            <p className="text-sm font-medium">{field.label}</p>

            {/* Hidden input */}
            <input
              ref={inputRef}
              type="file"
              multiple={field.multiple}
              className="hidden"
              onChange={(e) => handleUpload(field, e.target.files)}
            />

            {/* Upload button */}
            <Button
              size="sm"
              className="bg-black text-white flex gap-2 w-28 justify-center"
              onClick={() => inputRef.current?.click()}
              disabled={loadingKey === field.key}
            >
              {loadingKey === field.key ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <Upload size={14} />
              )}
              Upload
            </Button>

            {/* Preview */}
            {values?.[field.key] && (
              <p className="text-xs text-gray-500">
                {Array.isArray(values[field.key])
                  ? `${values[field.key].length} file(s) uploaded`
                  : values[field.key]?.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
