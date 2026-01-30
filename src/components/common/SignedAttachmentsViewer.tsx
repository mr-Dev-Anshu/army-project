import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Upload, Download, Printer, Trash2, X } from "lucide-react";

interface Attachment {
    type: string; // "Certificate" | "Forms" | "Letter"
    name: string;
    url?: string;
}

interface SignedAttachmentsViewerProps {
    attachments?: Attachment[];
    /**
     * Optional full record object (report) — when provided the component will
     * attempt to extract attachments from common fields like `certificates`,
     * `attachments`, `documents`, etc. This makes the viewer reusable across
     * different forms without each page having to map fields manually.
     */
    record?: any;
    onAttachMore?: () => void;
    onViewFor?: (attachment: Attachment) => void;
    onDelete?: (attachment: Attachment) => void;
}

export default function SignedAttachmentsViewer({ attachments = [], record, onAttachMore, onViewFor, onDelete }: SignedAttachmentsViewerProps) {
    const [activeTab, setActiveTab] = useState<"Certificate" | "Forms" | "Letter">("Certificate");

    // Debug logging
    console.log("SignedAttachmentsViewer received attachments prop:", attachments, "record:", record);

    // Try to extract attachments from a provided record when attachments prop is empty
    const extractAttachmentsFromRecord = (rec: any): Attachment[] => {
        if (!rec || typeof rec !== 'object') return [];

        const candidates: Attachment[] = [];
        const seenUrls = new Set<string>();

        const tryPush = (arr: any[], inferredType?: string) => {
            if (!Array.isArray(arr)) return;
            arr.forEach((it) => {
                // Common shapes: { type, name, url, statement }, or { url } or { filename }
                const url = it.url || it.path || it.file || '';

                // If we've seen this URL already, skip it to prevent duplicates
                if (url && seenUrls.has(String(url))) return;

                const name = it.name || it.statement || it.filename || (url ? String(url).split('/').pop() : undefined) || 'Untitled Document';
                const type = (it.type || inferredType || '').toString();

                candidates.push({ type, name, url });
                if (url) seenUrls.add(String(url));
            });
        };

        // Known keys which often hold attachments
        const keysToCheck = ['certificates', 'attachments', 'documents', 'signedAttachments', 'files', 'evidences', 'signed'];
        const processedKeys = new Set<string>();

        for (const k of keysToCheck) {
            if (rec[k]) {
                processedKeys.add(k);
                // Infer type from the key name
                let inferred = 'certificate';
                if (k.toLowerCase().includes('form')) inferred = 'form';
                if (k.toLowerCase().includes('letter')) inferred = 'letter';
                if (k.toLowerCase().includes('attach') || k.toLowerCase().includes('file')) inferred = 'form';

                tryPush(rec[k], inferred);
            }
        }

        // Check inside customFields if it exists
        if (rec.customFields && typeof rec.customFields === 'object') {
            for (const k of keysToCheck) {
                if (rec.customFields[k]) {
                    // Infer type from the key name
                    let inferred = 'certificate';
                    if (k.toLowerCase().includes('form')) inferred = 'form';
                    if (k.toLowerCase().includes('letter')) inferred = 'letter';
                    if (k.toLowerCase().includes('attach') || k.toLowerCase().includes('file')) inferred = 'form';

                    tryPush(rec.customFields[k], inferred);
                }
            }
        }

        // Also inspect top-level keys for mixed shapes (e.g., custom fields)
        Object.keys(rec).forEach((k) => {
            if (processedKeys.has(k)) return; // Skip already processed keys

            const val = rec[k];
            if (Array.isArray(val) && val.length > 0 && val[0] && typeof val[0] === 'object') {
                // Heuristic: if array items have url or name, treat them as attachments
                if (val[0]?.url || val[0]?.name || val[0]?.filename) {
                    tryPush(val, k);
                }
            }
        });

        return candidates;
    };

    // Normalize attachment type to match our categories
    const normalizeType = (type: string | undefined): "Certificate" | "Forms" | "Letter" => {
        if (!type) return "Certificate";
        const lowerType = type.toLowerCase().trim();

        // Handle forms (both singular and plural)
        if (lowerType === "form" || lowerType === "forms") return "Forms";

        // Handle letters (both singular and plural)
        if (lowerType === "letter" || lowerType === "letters") return "Letter";

        // Handle certificates (both singular and plural) - this is the default
        if (lowerType === "certificate" || lowerType === "certificates") return "Certificate";

        // Default to Certificate for unknown types
        return "Certificate";
    };

    // Final attachments source: prefer explicit `attachments` prop, otherwise derive from `record`.
    const finalAttachments = useMemo(() => {
        if (attachments && attachments.length > 0) return attachments;
        if (record) return extractAttachmentsFromRecord(record);
        return [] as Attachment[];
    }, [attachments, record]);

    // Categorize attachments with normalized types
    const categorizedAttachments = useMemo(() => {
        return finalAttachments.map(att => ({
            ...att,
            normalizedType: normalizeType(att.type)
        }));
    }, [finalAttachments]);

    // Filter by active tab
    const filtered = useMemo(() => {
        return categorizedAttachments.filter(a => a.normalizedType === activeTab);
    }, [categorizedAttachments, activeTab]);

    // Dynamic counts
    const counts = useMemo(() => {
        return {
            Certificate: categorizedAttachments.filter(a => a.normalizedType === "Certificate").length,
            Forms: categorizedAttachments.filter(a => a.normalizedType === "Forms").length,
            Letter: categorizedAttachments.filter(a => a.normalizedType === "Letter").length,
        };
    }, [categorizedAttachments]);

    const [previewItem, setPreviewItem] = useState<Attachment | null>(null);

    // Helper to check if url is an image
    const isImage = (url?: string) => {
        if (!url) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    };

    const handleView = (item: Attachment) => {
        if (onViewFor) {
            onViewFor(item);
            return;
        }

        if (item.url) {
            if (isImage(item.url)) {
                setPreviewItem(item);
            } else {
                window.open(item.url, "_blank");
            }
        }
    };

    const handleDownload = () => {
        if (previewItem?.url) {
            const a = document.createElement('a');
            a.href = previewItem.url;
            a.download = previewItem.name || 'download';
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    };

    const handlePrint = () => {
        if (previewItem?.url) {
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`<html><head><title>Print ${previewItem.name}</title></head><body style="margin:0; text-align:center;"><img src="${previewItem.url}" style="max-width:100%;" onload="window.print()" /></body></html>`);
                printWindow.document.close();
            }
        }
    };

    return (
        <>
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-sm p-8 min-h-[400px] overflow-hidden">
                <h2 className="text-xl font-bold mb-6 text-black">View Signed Attachments</h2>

                <div className="flex items-center justify-between mb-8 p-1 bg-gray-50 rounded-lg">
                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1">
                        {(["Certificate", "Forms", "Letter"] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setActiveTab(type)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === type ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {type}s
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center ${activeTab === type ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                                    }`}>
                                    {counts[type]}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Attach More */}
                    {onAttachMore && (
                        <Button onClick={onAttachMore} className="bg-black hover:bg-gray-800 text-white gap-2 h-9 px-4 rounded-md mr-1">
                            Attach More <Plus className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* List */}
                <div className="space-y-0 divide-y divide-gray-100 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {filtered.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            No {activeTab}s attached yet.
                        </div>
                    ) : (
                        filtered.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between py-4 group">
                                <div className="flex items-center gap-6">
                                    <span className="font-bold text-gray-900 w-6">{idx + 1}.</span>
                                    <span
                                        className="font-bold text-gray-900 text-sm hover:text-blue-600 hover:underline cursor-pointer transition-colors"
                                        onClick={() => handleView(item)}
                                    >
                                        {item.name}
                                    </span>
                                </div>
                                <Button
                                    size="icon"
                                    className="bg-black text-white hover:bg-gray-800 h-10 w-10 min-w-[2.5rem] rounded-lg shadow-sm"
                                    onClick={() => handleView(item)}
                                >
                                    <FileText className="w-5 h-5" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Image Preview Detail Overlay */}
            {previewItem && (
                <div
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setPreviewItem(null)}
                >
                    {/* Top Header Bar */}
                    <div
                        className="w-full bg-black text-white px-6 py-4 flex items-center justify-between shadow-2xl z-20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-md font-semibold truncate max-w-4xl">{previewItem.name}</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="bg-transparent text-white hover:bg-white/20 rounded-full w-8 h-8"
                            onClick={() => setPreviewItem(null)}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Image Container */}
                    <div
                        className="flex-1 w-full flex items-center justify-center overflow-hidden p-8 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={previewItem.url}
                            alt={previewItem.name}
                            className="max-w-[85%] max-h-[85vh] object-contain shadow-2xl bg-white"
                        />
                    </div>

                    {/* Bottom Action Bar */}
                    <div
                        className="w-full bg-black px-6 py-4 flex items-center justify-center gap-4 shadow-[0_-5px_20px_rgba(0,0,0,0.3)] z-20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button
                            className="bg-white text-black hover:bg-gray-200 h-9 gap-2 font-medium min-w-[120px]"
                            onClick={handleDownload}
                        >
                            Download <Download className="w-4 h-4" />
                        </Button>

                        <Button
                            className="bg-white text-black hover:bg-gray-200 h-9 gap-2 font-medium min-w-[120px]"
                            onClick={handlePrint}
                        >
                            Print <Printer className="w-4 h-4" />
                        </Button>

                        {/* TEMPORARILY COMMENTED OUT - DELETE BUTTON */}
                        {/* <Button
                            className="bg-[#EF4444] text-white hover:bg-red-600 h-9 gap-2 font-medium min-w-[120px]"
                            onClick={() => {
                                if (onDelete && previewItem) {
                                    onDelete(previewItem);
                                    setPreviewItem(null);
                                }
                            }}
                        >
                            Delete <Trash2 className="w-4 h-4" />
                        </Button> */}
                    </div>
                </div>
            )}
        </>
    );
}
