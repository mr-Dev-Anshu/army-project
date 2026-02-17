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

    </div>
  );
}