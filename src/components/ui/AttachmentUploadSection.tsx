"use client";

import { useState } from "react";
import FormAttachmentModal, { AttachedItem } from "./FormAttachmentModal";
import { Button } from "./button";
import { Paperclip, FileText, Trash2 } from "lucide-react";

interface AttachmentUploadSectionProps {
    attachments: any[];
    onAttachmentsChange: (attachments: any[]) => void;
}

/**
 * Reusable component for uploading attachments (certificates, forms, letters)
 * Can be used in any form's last step
 * 
 * @example
 * <AttachmentUploadSection
 *   attachments={state.formData.mpReport.attachments || []}
 *   onAttachmentsChange={(updated) => dispatch({
 *     type: "SET_PATH",
 *     path: "formData.mpReport.attachments",
 *     value: updated
 *   })}
 * />
 */
export default function AttachmentUploadSection({
    attachments,
    onAttachmentsChange,
}: AttachmentUploadSectionProps) {
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);

    const handleSaveAttachments = (newAttachments: AttachedItem[]) => {
        onAttachmentsChange([...attachments, ...newAttachments]);
    };

    const handleRemoveAttachment = (index: number) => {
        const updated = attachments.filter((_: any, i: number) => i !== index);
        onAttachmentsChange(updated);
    };

    return (
        <div className="mt-6 border-t pt-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="font-semibold">SUPPORTING DOCUMENTS (Optional)</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Upload certificates, forms, or letters if needed
                    </p>
                </div>
                <Button
                    type="button"
                    onClick={() => setShowAttachmentModal(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                >
                    <Paperclip className="w-4 h-4" />
                    Upload Documents
                </Button>
            </div>

            {/* Display uploaded attachments */}
            {attachments.length > 0 && (
                <div className="space-y-2">
                    {(attachments as any[]).map((att: any, idx: number) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between border rounded-lg px-4 py-3 bg-gray-50"
                        >
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{att.title}</p>
                                    <p className="text-xs text-gray-500">
                                        {att.signedLetterType?.toUpperCase()} • {att.originalFileName}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveAttachment(idx)}
                                className="text-red-500 hover:text-red-700 p-2"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {attachments.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4 border border-dashed rounded-lg">
                    No documents uploaded yet
                </p>
            )}

            {/* Attachment Modal */}
            <FormAttachmentModal
                isOpen={showAttachmentModal}
                onClose={() => setShowAttachmentModal(false)}
                onSave={handleSaveAttachments}
            />
        </div>
    );
}
