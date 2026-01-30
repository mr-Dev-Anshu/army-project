"use client";

import { useEffect, useState } from "react";
import Modal from "@/common/ui/Modal";
import FileDropZone from "@/components/ui/FileDropZone";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/lib/uploadFile";
import {
  useCreateDocument,
  useUpdateDocument,
} from "@/features/certificateAndForm/hook";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  onClose: () => void;
  type: "certificate" | "letter" | "form";
mode: "create" | "rename" | "reupload";
  document?: {
    _id: string;
    name: string;
    url: string;
  };
}

export default function AddDocumentModal({
  open,
  onClose,
  type,
  mode,
  document,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [uploading, setUploading] = useState(false);

  const isRename = mode === "rename";
  const isReupload = mode === "reupload";

  const { mutate: createDocument } = useCreateDocument();
  const { mutate: updateDocument } = useUpdateDocument();

  // Prefill data in rename mode
  useEffect(() => {
    if (isRename && document) {
      setName(document.name);
      setFile(null);
    }

    if (isReupload && document) {
      setName(document.name);
      setFile(null);
    }

    if (!open) {
      setName("");
      setFile(null);
      setUploading(false);
    }
  }, [isRename, isReupload, document, open]);

  const handleSave = async () => {
    if (uploading) return;

    try {
      setUploading(true);

      // 🔁 RENAME MODE
      if (isRename && document) {
        updateDocument(
          {
            id: document._id,
            name,
          },
          {
            onSuccess: () => {
              toast.success("Document renamed successfully");
              onClose();
            },
          }
        );
        return;
      }

      // 🔁 REUPLOAD MODE
      if (isReupload && document) {
        if (!file) {
          toast.error("Please select a file to re-upload");
          return;
        }

        const uploadRes = await uploadFile(file);

        updateDocument(
          {
            id: document._id,
            url: uploadRes.url,
            oldUrl: document.url,
          } as any,
          {
            onSuccess: () => {
              toast.success(`${type} re-uploaded successfully`);
              onClose();
            },
          }
        );

        return;
      }

      // ➕ CREATE MODE
      if (!file) return;

      const uploadRes = await uploadFile(file);

      createDocument(
        {
          name,
          url: uploadRes.url,
          type,
        },
        {
          onSuccess: () => {
            toast.success(`${type} added successfully`);
            onClose();
          },
        }
      );
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    } finally {
      setUploading(false);
    }
  };

  const modalTitle = isRename
  ? "Rename Document"
  : isReupload
  ? `Re-upload ${type}`
  : `Add New ${type}`;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={modalTitle}
      maxWidth="md"
      disableBackdropClose={true}
    >
      <div className="space-y-5">
        {/* File upload ONLY in create mode */}
        {!isRename && <FileDropZone onFileSelect={setFile} />}

        {!isRename && file && (
          <p className="text-xs text-gray-500">
            Selected: {file.name}
          </p>
        )}

        <div>
          <label className="text-sm font-medium text-gray-700">
            Name of {type}
          </label>
          <input
            type="text"
            placeholder={`Enter ${type} name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isReupload}
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isReupload ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div className="flex justify-between gap-3 pt-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>

            <Button
            className="bg-[#188FFA]"
              size="sm"
              disabled={
                uploading ||
                (isRename ? !name : isReupload ? !file : !file || !name)
              }
              onClick={handleSave}
            >
              {uploading
                ? "Saving..."
                : isRename
                ? "Rename"
                : isReupload
                ? `Re-upload ${type}`
                : `Save ${type}`}
            </Button>
        </div>
      </div>
    </Modal>
  );
}
