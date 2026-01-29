"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

import { AttachmentItem } from "@/common/types/form.types";
import { X, FileText } from "lucide-react";

interface Step4RemarksProps {
  value?: string;
  onChange?: (value: string) => void;
  files?: string[];
  attachments?: AttachmentItem[];
  onFilesChange?: (files: string[]) => void;
  onAttachmentsChange?: (items: AttachmentItem[]) => void;
}

export default function Step4Remarks({
  value,
  onChange,
  files = [],
  attachments = [],
  onFilesChange,
  onAttachmentsChange
}: Step4RemarksProps) {
  const remarkOptions = [
    "The indl committed offence as enumerated under Para 3 above...",
    "Suitable disciplinary action be taken as deemed appropriate...",
    "Unit should ensure strict compliance of traffic rules...",
  ];

  const [selected, setSelected] = useState<number | null>(0);

  const set = (text: string) => {
    if (onChange) onChange(text);
  };

  const handleDelete = (index: number) => {
    if (onAttachmentsChange) {
      const newItems = [...attachments];
      newItems.splice(index, 1);
      onAttachmentsChange(newItems);
    }
  };

  return (
    <div className="space-y-6 px-1">

      <div>
        <Label className="font-semibold text-lg mb-2 block">ADD REMARKS</Label>
        <Textarea
          value={value || ""}
          onChange={(e) => set(e.target.value)}
          className="min-h-[140px]"
          placeholder="Enter remarks..."
        />
      </div>

      <div className="pt-4 border-t">
        <Label className="text-sm font-semibold mb-3 block">Pre-Written Remarks</Label>
        <div className="space-y-3">
          {remarkOptions.map((text, i) => (
            <label key={i} className="flex gap-2 items-start cursor-pointer text-sm text-gray-700">
              <Checkbox
                checked={selected === i}
                onCheckedChange={() => {
                  setSelected(i);
                  set(text);
                }}
                className="mt-0.5"
              />
              <span>{text}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ATTACHMENTS LIST - MOVED BELOW */}
      {(attachments.length > 0) && (
        <div className="space-y-2 pt-4 border-t">
          <Label className="font-semibold text-sm text-gray-700">Attached Documents</Label>
          <div className="space-y-2">
            {attachments.map((item, index) => (
              <div key={index} className="bg-white border rounded-md p-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                                ${item.type === 'Certificate' ? 'bg-blue-100 text-blue-600' :
                      item.type === 'Forms' ? 'bg-orange-100 text-orange-600' :
                        'bg-green-100 text-green-600'
                    }
                              `}>
                    {item.type[0]}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1 rounded">{item.type}</span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" /> View
                      </a>
                    </div>
                  </div>
                </div>

                {onAttachmentsChange && (
                  <button onClick={() => handleDelete(index)} className="text-gray-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )
      }

    </div>
  );
}
