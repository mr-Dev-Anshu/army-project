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
                    <Label className="text-gray-800 mb-3 block font-medium text-base">
                        Select Attachment Type
                    </Label>

                    <div className="flex gap-3">
                        {(["Certificate", "Forms", "Letter"] as AttachmentType[]).map((item) => (
                            <button
                                key={item}
                                onClick={() => setSelectedType(item)}
                                className={clsx(
                                    "flex items-center gap-2.5 px-5 py-2.5 rounded-full border-2 text-sm font-medium transition-all",
                                    selectedType === item
                                        ? "border-black bg-white text-black"
                                        : "border-gray-300 text-gray-600 hover:border-gray-400 bg-white"
                                )}
                            >
                                <div
                                    className={clsx(
                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                        selectedType === item ? "border-black bg-black" : "border-gray-400"
                                    )}
                                >
                                    {selectedType === item && (
                                        <div className="w-2 h-2 bg-white rounded-full" />
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

                {/* 🔹 Name of Attachment - Always visible */}
                <div>
                    <Label className="text-gray-800 mb-2 block font-medium text-base">
                        Name of Attachment
                    </Label>
                    <Input
                        placeholder="Enter Name"
                        value={prefixName}
                        onChange={(e) => setPrefixName(e.target.value)}
                        className="h-12 text-sm text-gray-900 border-gray-300"
                    />
                </div>

                {/* 🔹 Selected file preview - Only when files exist */}
                {files.length > 0 && (
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
                )}

                {/* 🔹 Footer */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                        onClick={handleClose}
                        disabled={isUploading}
                        className="border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-6 h-11"
                    >
                        Cancel
                    </Button>

                    <Button
                        disabled={!files.length || isUploading}
                        onClick={handleSave}
                        className="bg-blue-500 hover:bg-blue-600 text-white min-w-[100px] px-6 h-11"
                    >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
