"use client";

import { FormSection } from "@/common/component/FormSection";
import { useForm } from "@/context/FormContext";
import { FormTextarea } from "@/common/component/FormTextarea";
import { useState } from "react";
import { FileText, X, Paperclip } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import FormAttachmentModal, { AttachedItem } from "@/components/ui/FormAttachmentModal";

export default function Step11Remarks() {
  const { state, dispatch } = useForm();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const remarks = state.formData.mpReport.remarks;
  const attachments = state.formData.mpReport.attachments || [];

  const set = (k: string, v: string) =>
    dispatch({
      type: "SET_PATH",
      path: `formData.mpReport.remarks.${k}`,
      value: v,
    });

  const handleAttachments = (newFiles: any[]) => {
    dispatch({
      type: "SET_PATH",
      path: "formData.mpReport.attachments",
      value: newFiles,
    });
  };

  const removeAttachment = (index: number) => {
    const next = [...attachments];
    next.splice(index, 1);
    handleAttachments(next);
  };

  return (
    <div className="space-y-8">
      {/* ANALYSIS */}
      <div className="mt-2">
        <p className="font-semibold mb-1">ANALYSIS</p>
        <FormTextarea
          label=""
          value={remarks.analysis}
          onChange={(v) => set("analysis", v)}
        />
      </div>

      {/* RECOMMENDATION */}
      <div className="mt-6">
        <p className="font-semibold mb-1">RECOMMENDATION</p>
        <FormTextarea
          label=""
          value={remarks.recommendation}
          onChange={(v) => set("recommendation", v)}
        />
      </div>

      {/* UPLOAD BUTTON */}
      <div className="border-t pt-6">
        <Button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <Paperclip className="w-4 h-4" />
          Upload Supporting Documents (Optional)
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Upload certificates, forms, or letters to attach to this report
        </p>
      </div>

      {/* ATTACHMENTS SECTION - MOVED BELOW REMARKS */}
      <div className="border-t pt-6">
        {attachments.length > 0 && (
          <div className="space-y-2">
            <Label className="font-semibold text-sm text-gray-700">Attached Documents</Label>
            <div className="space-y-2">
              {attachments.map((item: any, index: number) => (
                <div key={index} className="bg-white border rounded-md p-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`
                                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                                  ${item.type?.toLowerCase().includes('certificate') ? 'bg-blue-100 text-blue-600' :
                        item.type?.toLowerCase().includes('forms') ? 'bg-orange-100 text-orange-600' :
                          'bg-green-100 text-green-600'
                      }
                                `}>
                      {(item.type || "F")[0].toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1 rounded">{item.type || "Attachment"}</span>
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

                  <button
                    onClick={() => removeAttachment(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      <FormAttachmentModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSave={(newAttachments: AttachedItem[]) => {
          handleAttachments([...attachments, ...newAttachments]);
        }}
      />
    </div>
  );
}