"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "./FileUpload";
import { AttachmentItem } from "@/common/types/form.types";
import { toast } from "react-toastify";
import { Loader2, Plus, X } from "lucide-react";

interface AttachDocumentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (items: AttachmentItem[]) => void;
}

export const AttachDocumentDialog: React.FC<AttachDocumentDialogProps> = ({
    open,
    onOpenChange,
    onSave,
}) => {
    const [type, setType] = useState<"Certificate" | "Forms" | "Letter">("Certificate");
    const [name, setName] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

    // Reset when opening? Handled by component mount usually, but let's clear on save

    const handleSave = () => {
        if (uploadedFiles.length === 0) {
            toast.error("Please upload at least one file");
            return;
        }
        if (!name.trim()) {
            toast.error("Please enter a name for the attachment(s)");
            return;
        }

        // Create an item for each uploaded file
        const newItems: AttachmentItem[] = uploadedFiles.map((url, index) => {
            // If multiple files, we could append index to name to differentiate, or just use the same name.
            // Let's use same name, but maybe user wants "Doc (1)", "Doc (2)" etc.
            // For now, simple Name is fine. The URL is unique.
            const distinctName = uploadedFiles.length > 1 ? `${name} (${index + 1})` : name;

            return {
                type,
                name: distinctName,
                url
            };
        });

        onSave(newItems);

        // Reset and close
        setUploadedFiles([]);
        setName("");
        setType("Certificate");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-white text-black">
                <DialogHeader>
                    <div className="flex justify-between items-center">
                        <DialogTitle className="text-xl font-bold">Attach Signed Certificates/Form/Letters</DialogTitle>
                        {/* <X className="h-4 w-4 cursor-pointer" onClick={() => onOpenChange(false)} /> */}
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* TYPE SELECTION */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700">Select Attachment Type</Label>
                        <RadioGroup
                            value={type}
                            onValueChange={(v) => setType(v as any)}
                            className="flex gap-4"
                        >
                            <label className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer border-gray-200 transition-all
                                ${type === "Certificate" ? "ring-1 ring-black border-black" : ""}
                            `}>
                                <RadioGroupItem value="Certificate" id="r-cert" />
                                <span className="text-sm">Certificate</span>
                            </label>

                            <label className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer border-gray-200 transition-all
                                ${type === "Forms" ? "ring-1 ring-black border-black" : ""}
                            `}>
                                <RadioGroupItem value="Forms" id="r-forms" />
                                <span className="text-sm">Forms</span>
                            </label>

                            <label className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer border-gray-200 transition-all
                                ${type === "Letter" ? "ring-1 ring-black border-black" : ""}
                            `}>
                                <RadioGroupItem value="Letter" id="r-letter" />
                                <span className="text-sm">Letter</span>
                            </label>
                        </RadioGroup>
                    </div>

                    {/* UPLOAD AREA */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 min-h-[200px]">
                        {uploadedFiles.length === 0 ? (
                            <div className="w-full flex flex-col items-center">
                                <FileUpload
                                    value={[]}
                                    onChange={setUploadedFiles}
                                    maxFiles={20}
                                    label="Select Files (Max 20)"
                                    mode="button"
                                />
                                <p className="mt-4 text-sm text-gray-500 font-medium">Upload Images, Word or PDF</p>
                                <p className="text-xs text-gray-400 mt-1">or drop files</p>
                            </div>
                        ) : (
                            <div className="w-full">
                                <div className="max-h-[150px] overflow-y-auto mb-4 space-y-2 pr-2 custom-scrollbar">
                                    {uploadedFiles.map((f, i) => (
                                        <div key={i} className="flex items-center justify-between bg-white p-2 rounded border shadow-sm">
                                            <span className="truncate max-w-[80%] text-sm text-blue-600 underline">
                                                {f.split('/').pop()}
                                            </span>
                                            <button onClick={() => {
                                                const n = [...uploadedFiles];
                                                n.splice(i, 1);
                                                setUploadedFiles(n);
                                            }}>
                                                <X className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-center">
                                    <FileUpload
                                        value={uploadedFiles}
                                        onChange={setUploadedFiles}
                                        maxFiles={20}
                                        label="Add More"
                                        mode="button"
                                    />
                                </div>
                                <p className="text-green-600 text-sm font-medium mt-2">{uploadedFiles.length} File(s) Selected</p>
                            </div>
                        )}
                    </div>

                    {/* NAME INPUT */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">Name of Attachment (Prefix)</Label>
                        <Input
                            placeholder="Enter Name e.g. 'Leave Certificate'"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                        />
                        <p className="text-xs text-gray-400">If multiple files, sequential numbers will be appended.</p>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-300">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-[#0088FF] hover:bg-blue-600 text-white px-8">
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
