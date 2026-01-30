"use client";

import React, { useRef, useState } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadMultipleFiles } from "@/lib/uploadFile";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

interface FileUploadProps {
    value: string[];
    onChange: (files: string[]) => void;
    label?: string;
    maxFiles?: number;
    accept?: string;
    disabled?: boolean;
    mode?: "button" | "list";
}

export const FileUpload: React.FC<FileUploadProps> = ({
    value = [],
    onChange,
    label = "Upload Files",
    maxFiles = 20, // Increased limit
    accept = "image/*,.pdf,.doc,.docx",
    disabled = false,
    mode = "button", // 'button' = just the trigger button, 'list' = the file list
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    // TRIGGER UPLOAD
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    // HANDLE FILE CHANGE
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            if (value.length + e.target.files.length > maxFiles) {
                toast.error(`You can only upload up to ${maxFiles} files`);
                return;
            }

            setIsUploading(true);
            try {
                const files = Array.from(e.target.files);
                // Assuming uploadMultipleFiles returns { url: string, ... }[]
                const results = await uploadMultipleFiles(files);
                const newUrls = results.map((res) => res.url);
                onChange([...value, ...newUrls]);
                toast.success("Files uploaded successfully");
            } catch (error) {
                console.error("Upload failed", error);
                toast.error("Failed to upload files");
            } finally {
                setIsUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""; // Reset input
                }
            }
        }
    };

    // DELETE FILE
    const handleDelete = (index: number) => {
        const newFiles = [...value];
        newFiles.splice(index, 1);
        onChange(newFiles);
    };

    // EXTRACT FILE NAME
    const getFileName = (url: string) => {
        try {
            // Decode URL to handle spaces/special chars
            const decoded = decodeURIComponent(url);
            // Split by '/' to get the last segment
            const parts = decoded.split('/');
            const lastPart = parts[parts.length - 1];

            // Remove UUID prefix if present (assuming standard uuid-filename format)
            // If your upload logic appends UUIDs differently, adjust regex
            // Example: 123e4567-e89b-...-filename.pdf
            const cleanName = lastPart.replace(/^[a-f0-9-]{36}-/i, "");

            // If name is too long, truncate it? Or just CSS
            return cleanName;
        } catch {
            return "Unknown File";
        }
    };

    /* ================= RENDER: BUTTON MODE ================= */
    if (mode === "button") {
        return (
            <div className="w-full">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept={accept}
                    onChange={handleFileChange}
                    disabled={disabled || isUploading}
                />
                <Button
                    type="button"
                    onClick={handleUploadClick}
                    disabled={disabled || isUploading}
                    className={cn(
                        "w-full bg-white text-black hover:bg-gray-200 flex items-center justify-center gap-2 text-sm sm:text-base",
                        isUploading && "opacity-70 cursor-not-allowed"
                    )}
                >
                    {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Upload className="w-4 h-4" />
                    )}
                    {isUploading ? "Uploading..." : label}
                </Button>
            </div>
        );
    }

    /* ================= RENDER: LIST MODE ================= */
    return (
        <div className="space-y-2">
            {value.length === 0 && (
                <p className="text-gray-400 text-sm italic">No documents attached.</p>
            )}

            {value.map((url, index) => (
                <div
                    key={index}
                    className="bg-white border rounded-md p-3 flex items-center justify-between shadow-sm"
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-gray-700 hover:underline truncate max-w-[200px]"
                        >
                            {getFileName(url)}
                        </a>
                    </div>

                    {!disabled && (
                        <button
                            type="button"
                            onClick={() => handleDelete(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};
