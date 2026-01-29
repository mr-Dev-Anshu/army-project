import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

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
}

export default function SignedAttachmentsViewer({ attachments = [], record, onAttachMore, onViewFor }: SignedAttachmentsViewerProps) {
    const [activeTab, setActiveTab] = useState<"Certificate" | "Forms" | "Letter">("Certificate");

    // Debug logging
    console.log("SignedAttachmentsViewer received attachments prop:", attachments, "record:", record);

    // Try to extract attachments from a provided record when attachments prop is empty
    const extractAttachmentsFromRecord = (rec: any): Attachment[] => {
        if (!rec || typeof rec !== 'object') return [];

        const candidates: Attachment[] = [];

        const tryPush = (arr: any[], inferredType?: string) => {
            if (!Array.isArray(arr)) return;
            arr.forEach((it) => {
                // Common shapes: { type, name, url, statement }, or { url } or { filename }
                const name = it.name || it.statement || it.filename || (it.url ? String(it.url).split('/').pop() : undefined) || 'Untitled Document';
                const type = (it.type || inferredType || '').toString();
                const url = it.url || it.path || it.file || '';

                candidates.push({ type, name, url });
            });
        };

        // Known keys which often hold attachments
        const keysToCheck = ['certificates', 'attachments', 'documents', 'signedAttachments', 'files', 'evidences', 'signed'];

        for (const k of keysToCheck) {
            if (rec[k]) {
                // Infer type from the key name
                let inferred = 'certificate';
                if (k.toLowerCase().includes('form')) inferred = 'form';
                if (k.toLowerCase().includes('letter')) inferred = 'letter';
                if (k.toLowerCase().includes('attach') || k.toLowerCase().includes('file')) inferred = 'form';

                tryPush(rec[k], inferred);
            }
        }

        // Also inspect top-level keys for mixed shapes (e.g., custom fields)
        Object.keys(rec).forEach((k) => {
            const val = rec[k];
            if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object') {
                // Heuristic: if array items have url or name, treat them as attachments
                if (val[0].url || val[0].name || val[0].filename) {
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

    return (
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-sm p-8 min-h-[400px]">
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
            <div className="space-y-0 divide-y divide-gray-100 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        No {activeTab}s attached yet.
                    </div>
                ) : (
                    filtered.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-4 group">
                            <div className="flex items-center gap-6">
                                <span className="font-bold text-gray-900 w-6">{idx + 1}.</span>
                                <span className="font-bold text-gray-900 text-sm">{item.name}</span>
                            </div>
                            <Button
                                size="icon"
                                className="bg-black text-white hover:bg-gray-800 h-9 w-9 rounded-lg"
                                onClick={() => onViewFor?.(item)}
                            >
                                <FileText className="w-4 h-4" />
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
