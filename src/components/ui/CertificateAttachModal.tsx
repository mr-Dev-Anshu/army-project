"use client";

import { useState } from "react";
import Modal from "@/common/ui/Modal";
import { Button } from "@/components/ui/button";
import FileDropZone from "./FileDropZone";
import clsx from "clsx";
import { uploadMultipleFiles } from "@/lib/uploadFile";
import { useUpdateMPReport } from "@/features/mpReports/hooks";
import { useUpdateTrafficOffence } from "@/features/generalTraficOffence/hooks";
import { useUpdateStaticSpeedRecord } from "@/features/staticSpeed/hooks";
import { toast } from "react-toastify";

type AttachmentType = "certificate" | "forms" | "letter";

type ReportType = "mp" | "traffic" | "speed";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (payload: {
    type: AttachmentType;
    file: File;
  }) => void;
   reportId: string;
   reportType:ReportType
}

export default function AttachCertificateModal({
  isOpen,
  onClose,
  reportId,
  reportType,
  onSave,
}: Props) {
  const [selectedType, setSelectedType] =
    useState<AttachmentType>("certificate");
const [files, setFiles] = useState<File[]>([]);

  const { mutateAsync: updateReport, isPending } = useUpdateMPReport();
  const { mutateAsync: updateTrafficReport, isPending:Pendings } = useUpdateTrafficOffence();
  const { mutateAsync: updateSpeedReport, isPending:Pendingss } = useUpdateStaticSpeedRecord();




const handleSave = async () => {
  if (!files.length) {
    toast.error("Please select at least one file");
    return;
  }

  try {
    const uploadResults = await uploadMultipleFiles(files);

    const attachments = uploadResults.map((res, idx) => ({
      type: selectedType,
      url: res.url,
      // Prefer original filename if available, otherwise use server filename or url basename
      name: files[idx]?.name || res.filename || (res.url ? String(res.url).split('/').pop() : 'Untitled Document'),
    }));

    // ✅ Conditional API call
    if (reportType === "mp") {
      await updateReport({
        id: reportId,
        data: { certificates: attachments },
      });
    }

    if (reportType === "traffic") {
      await updateTrafficReport({
        id: reportId,
        data: { certificates: attachments },
      });
    }

    if (reportType === "speed") {
      await updateSpeedReport({
        id: reportId,
        data: { certificates: attachments },
      });
    }

    toast.success("Attachments saved successfully");
    setFiles([]);
    onClose();
  } catch (error: any) {
    toast.error(error.message || "Failed to attach files");
  }
};



  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Attach  Signed Certificates/Form/Letters"
      maxWidth="xl"
      disableBackdropClose
    >
      <div className="space-y-6">
        {/* 🔹 Attachment Type */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">
            Select Attachment Type
          </p>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Certificate", value: "certificate" },
              { label: "Forms", value: "forms" },
              { label: "Letter", value: "letter" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() =>
                  setSelectedType(item.value as AttachmentType)
                }
                className={clsx(
                  "flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition",
                  selectedType === item.value
                    ? "border-black bg-gray-50 text-black"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                )}
              >
                <span
                  className={clsx(
                    "w-4 h-4 rounded-full border flex items-center justify-center",
                    selectedType === item.value
                      ? "border-black"
                      : "border-gray-300"
                  )}
                >
                  {selectedType === item.value && (
                    <span className="w-2 h-2 bg-black rounded-full" />
                  )}
                </span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 🔹 Dropzone */}
        <div className="border border-dashed border-gray-300 rounded-xl p-10">
          <div className="flex flex-col items-center justify-center gap-3">
            <FileDropZone onFileSelect={setFiles} />
          </div>
        </div>

        {/* 🔹 Selected file preview */}
       {files.length > 0 && (
  <div className="space-y-2">
    {files.map((file, index) => (
      <div
        key={index}
        className="flex items-center justify-between border rounded-lg px-4 py-2 bg-gray-50"
      >
        <span className="text-sm text-gray-700 truncate">
          {file.name}
        </span>
        <button
          className="text-xs text-red-500 hover:underline"
          onClick={() =>
            setFiles((prev) => prev.filter((_, i) => i !== index))
          }
        >
          Remove
        </button>
      </div>
    ))}
  </div>
)}


        {/* 🔹 Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            disabled={!files.length}
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
