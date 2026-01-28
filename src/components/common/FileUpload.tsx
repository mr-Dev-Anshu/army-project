"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, X, FileText, Image as ImageIcon, Loader2, File } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";

interface FileUploadProps {
    /**
     * Array of file URLs (strings)
     */
    value?: string[];
    /**
     * Callback when files change
     */
    onChange?: (files: string[]) => void;
    /**
     * Button label
     */
    label?: string;
    /**
     * Allowed file types (comma separated)
     * Default: images, pdf, word
     */
    accept?: string;
    /**
     * Allow multiple files selection
     */
    multiple?: boolean;
    /**
     * Endpoint to upload files
     */
    apiEndpoint?: string;
    /**
     * Disabled state
     */
    disabled?: boolean;
    /**
     * Display mode: 'default' (both), 'button' (upload trigger only), 'list' (file list only)
     */
    mode?: "default" | "button" | "list";
}

export const FileUpload: React.FC<FileUploadProps> = ({
    value = [],
    onChange,
    label = "Attach Certificates/Form/Letters",
    accept = "image/*,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    multiple = true,
    apiEndpoint = "/api/uploads",
    disabled = false,
    mode = "default",
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Ensure value is always an array
    const files = Array.isArray(value) ? value : [];

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const uploadFiles = async (fileList: FileList | File[]) => {
        if (!fileList || fileList.length === 0) return;

        setIsUploading(true);
        const newFiles: string[] = [];
        const errors: string[] = [];

        // Convert FileList to array if necessary
        const filesToUpload = Array.isArray(fileList) ? fileList : Array.from(fileList);

        try {
            // Upload in parallel
            const uploadPromises = filesToUpload.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);

                try {
                    const response = await axios.post(apiEndpoint, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });

                    if (response.data && response.data.url) {
                        return response.data.url;
                    } else {
                        throw new Error("Invalid response from server");
                    }
                } catch (error: any) {
                    console.error("Upload failed for file:", file.name, error);
                    errors.push(`${file.name}: ${error.response?.data?.error || error.message}`);
                    return null;
                }
            });

            const results = await Promise.all(uploadPromises);

            results.forEach((url) => {
                if (url) newFiles.push(url);
            });

            if (newFiles.length > 0) {
                if (onChange) {
                    onChange([...files, ...newFiles]);
                }
                toast.success(`Successfully uploaded ${newFiles.length} file(s)`);
            }

            if (errors.length > 0) {
                errors.forEach(err => toast.error(err));
            }

        } catch (error) {
            console.error("Error uploading files:", error);
            toast.error("An unexpected error occurred during upload.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            await uploadFiles(event.target.files);
        }
    };

    const removeFile = (indexToRemove: number) => {
        const updatedFiles = files.filter((_, index) => index !== indexToRemove);
        if (onChange) {
            onChange(updatedFiles);
        }
    };

    const getFileIcon = (url: string) => {
        const ext = url.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
            return <ImageIcon className="w-4 h-4 text-purple-500" />;
        }
        if (ext === 'pdf') {
            return <FileText className="w-4 h-4 text-red-500" />;
        }
        if (['doc', 'docx'].includes(ext || '')) {
            return <FileText className="w-4 h-4 text-blue-500" />;
        }
        return <File className="w-4 h-4 text-gray-500" />;
    };

    const getFileName = (url: string) => {
        return url.split('/').pop() || "Unknown File";
    }

    const showButton = mode === "default" || mode === "button";
    const showList = mode === "default" || mode === "list";

    return (
        <div className="w-full space-y-3">
            {showButton && (
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple={multiple}
                        accept={accept}
                        onChange={handleFileChange}
                        disabled={disabled || isUploading}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleButtonClick}
                        disabled={disabled || isUploading}
                        className="bg-white hover:bg-gray-100 text-black border-gray-200 shadow-sm transition-all h-10 px-4"
                    >
                        {isUploading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Paperclip className="w-4 h-4 mr-2" />
                        )}
                        {isUploading ? "Uploading..." : label}
                    </Button>
                </div>
            )}

            {/* File List */}
            {showList && files.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {files.map((url, index) => (
                        <div
                            key={`${url}-${index}`}
                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 border rounded-md group hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                        >
                            <Link href={url} target="_blank" className="flex items-center gap-2 overflow-hidden flex-1 truncate">
                                <div className="flex-shrink-0">
                                    {getFileIcon(url)}
                                </div>
                                <span className="text-sm text-gray-700 dark:text-gray-300 truncate hover:underline">
                                    {getFileName(url)}
                                </span>
                            </Link>
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                disabled={disabled}
                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                title="Remove file"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
