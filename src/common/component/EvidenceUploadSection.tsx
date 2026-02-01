"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { uploadFile } from "@/lib/uploadFile";
import { toast } from "react-toastify";

export interface EvidenceField {
  label: string;
  key: string;
  multiple?: boolean;
  accept?: string;
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
  const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({});

  const handleUpload = async (key: string, multiple: boolean, files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadingState((prev) => ({ ...prev, [key]: true }));

    try {
      if (multiple) {
        const uploadedFiles = [];
        for (let i = 0; i < files.length; i++) {
          const res = await uploadFile(files[i]);
          uploadedFiles.push({
            url: res.url,
            name: files[i].name,
            type: files[i].type,
          });
        }
        // Append to existing if needed, or just set new
        // For now, let's just REPLACE or APPEND? 
        // Logic says usually we want to ADD to existing evidence, 
        // but simple logic is replace for now or let parent handle?
        // Let's passed expected structure: Array of objects

        // Let's assume parent handles append if they passed current values, 
        // but here we are just triggering onChange

        // Actually, better to pass what we got.
        // If "values" has existing, we might want to append?
        // Let's just pass the NEWLY uploaded ones combined with existing?
        // Simplify: Just pass the result of this upload session. 
        // But wait, the parent `set` function usually replaces. 

        // Let's check parent logic in Step6:
        // const set = (k, v) => dispatch(...)
        // So we need to pass the FULL updated array if we want preservation.

        const existing = values[key] || [];
        onChange(key, [...existing, ...uploadedFiles]);
        toast.success(`Uploaded ${uploadedFiles.length} files`);
      } else {
        // Single File
        const file = files[0];
        const res = await uploadFile(file);
        onChange(key, {
          url: res.url,
          name: file.name,
          type: file.type,
        });
        toast.success("File uploaded successfully");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploadingState((prev) => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="space-y-5 max-w-sm">
      {title && <h3 className="font-semibold">{title}</h3>}

      {fields.map((field) => {
        const inputRef = useRef<HTMLInputElement | null>(null);
        const isUploading = uploadingState[field.key];
        const currentVal = values?.[field.key];

        return (
          <div key={field.key} className="flex flex-col gap-1">
            <p className="text-sm font-medium">{field.label}</p>

            {/* Hidden Input */}
            <input
              ref={inputRef}
              type="file"
              multiple={field.multiple}
              accept={field.accept}
              className="hidden"
              onChange={(e) => handleUpload(field.key, !!field.multiple, e.target.files)}
            />

            {/* Upload Button */}
            <Button
              size="sm"
              className="bg-black text-white flex gap-2 w-32 justify-center"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : <><Upload size={14} /> Upload</>}
            </Button>

            {/* Selected File Preview */}
            <div className="text-xs text-gray-500 mt-1">
              {currentVal ? (
                field.multiple ? (
                  <div className="space-y-1">
                    {Array.isArray(currentVal) && currentVal.map((f: any, i: number) => (
                      <div key={i} className="truncate max-w-xs text-blue-600 underline cursor-pointer" onClick={() => window.open(f.url, "_blank")}>
                        {f.name || `File ${i + 1}`}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="truncate max-w-xs text-blue-600 underline cursor-pointer" onClick={() => window.open(currentVal.url, "_blank")}>
                    {currentVal.name || "View File"}
                  </div>
                )
              ) : (
                <span className="text-gray-400">No file selected</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
