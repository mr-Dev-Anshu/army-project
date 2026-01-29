"use client";

import { useState, useRef } from "react";
import Modal from "@/common/ui/Modal";
import { Button } from "@/components/ui/button";
import FileDropZone from "@/components/ui/FileDropZone";
import clsx from "clsx";
import { uploadMultipleFiles } from "@/lib/uploadFile";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";

export type AttachmentType = "Certificate" | "Forms" | "Letter";

export interface AttachedItem {
    type: AttachmentType;
    name: string;
    url: string;
    uploadedAt: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (items: AttachedItem[]) => void;
}

export default function FormAttachmentModal({
    isOpen,
    onClose,
    onSave,
}: Props) {
    const [selectedType, setSelectedType] = useState<AttachmentType>("Certificate");
    const [files, setFiles] = useState<File[]>([]);
    const [prefixName, setPrefixName] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // Reset state on close
    const handleClose = () => {
        setFiles([]);
        setPrefixName("");
        setSelectedType("Certificate");
        onClose();
    };

    const handleSave = async () => {
        if (!files.length) {
            toast.error("Please select at least one file");
            return;
        }

        try {
            setIsUploading(true);
            const uploadResults = await uploadMultipleFiles(files);

            const attachments: AttachedItem[] = uploadResults.map((res, idx) => {
                // Construct name: Prefix + (index+1) OR Original Filename
                let finalName = files[idx].name;
                if (prefixName.trim()) {
                    finalName = files.length > 1
                        ? `${prefixName} ${idx + 1}`
                        : prefixName;
                }

                return {
                    type: selectedType,
                    url: res.url,
                    name: finalName,
                    uploadedAt: new Date().toISOString()
                };
            });

            onSave(attachments); // Pass back to parent
            handleClose();
            toast.success("Attached successfully");
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to upload files");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Attach Signed Certificates/Form/Letters"
            maxWidth="lg"
            disableBackdropClose
        >
            <div className="space-y-6">
                {/* 🔹 Attachment Type */}
                <div>
                    <Label className="text-gray-700 mb-3 block">
                        Select Attachment Type
                    </Label>

                    <div className="flex gap-4">
                        {(["Certificate", "Forms", "Letter"] as AttachmentType[]).map((item) => (
                            <button
                                key={item}
                                onClick={() => setSelectedType(item)}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition",
                                    selectedType === item
                                        ? "border-black bg-white text-black ring-1 ring-black"
                                        : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                                )}
                            >
                                <div
                                    className={clsx(
                                        "w-4 h-4 rounded-full border flex items-center justify-center",
                                        selectedType === item ? "border-black" : "border-gray-300"
                                    )}
                                >
                                    {selectedType === item && (
                                        <div className="w-2 h-2 bg-black rounded-full" />
                                    )}
                                </div>
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 🔹 Dropzone */}
                <div className="rounded-xl">
                    <FileDropZone onFileSelect={(newFiles) => setFiles((prev) => [...prev, ...newFiles])} />
                </div>

                {/* 🔹 Selected file preview & Naming */}
                {files.length > 0 && (
                    <div className="space-y-4">
                        {/* Name Prefix Input - Only show if files are selected, as per user flow intuition */}
                        <div>
                            <Label className="text-gray-700 mb-1 block">
                                Name of Attachment (Prefix)
                            </Label>
                            <Input
                                placeholder="Enter Name e.g. 'Leave Certificate'"
                                value={prefixName}
                                onChange={(e) => setPrefixName(e.target.value)}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                If multiple files, sequential numbers will be appended.
                            </p>
                        </div>

                        <div className="max-h-[150px] overflow-y-auto space-y-2 pr-1">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between border rounded-lg px-3 py-2 bg-gray-50 text-sm"
                                >
                                    <span className="text-gray-700 truncate max-w-[80%]">
                                        {file.name}
                                    </span>
                                    <button
                                        onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 🔹 Footer */}
                <div className="flex items-center justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={handleClose} disabled={isUploading}>
                        Cancel
                    </Button>

                    <Button
                        disabled={!files.length || isUploading}
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700 min-w-[100px]"
                    >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
