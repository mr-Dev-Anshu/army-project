import React from "react";
import { Copy, FileText, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EvidenceItem {
    type: string; // "Evidence" | "Eye Sketch" | "Photo" | "Video"
    url?: string;
    description?: string;
    customFields?: any;
}

interface EvidenceViewerProps {
    evidences?: EvidenceItem[];
}

export default function EvidenceViewer({ evidences = [] }: EvidenceViewerProps) {
    if (!evidences || evidences.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                <div className="bg-gray-100 p-4 rounded-full mb-3">
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                </div>
                <p>No evidence items attached to this report.</p>
            </div>
        );
    }

    // Categorize for easier viewing if needed, but a simple grid works well.

    return (
        <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-8 min-h-[400px]">
            <h2 className="text-xl font-bold mb-6 text-black">Evidence Gallery</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {evidences.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
                        {/* Preview Section */}
                        <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                            {renderPreview(item)}
                        </div>

                        {/* Info Section */}
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                {getIcon(item.type)}
                                <span className="font-semibold text-sm text-gray-700">{item.type}</span>
                            </div>

                            {item.description && (
                                <p className="text-sm text-gray-500 line-clamp-2 mb-3 min-h-[40px]">
                                    {item.description}
                                </p>
                            )}

                            {item.url && (
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                                >
                                    View Full Size
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function getIcon(type: string) {
    const t = type.toLowerCase();
    if (t.includes("video")) return <Video className="w-4 h-4 text-purple-500" />;
    if (t.includes("photo") || t.includes("sketch")) return <ImageIcon className="w-4 h-4 text-blue-500" />;
    return <FileText className="w-4 h-4 text-gray-500" />;
}

function renderPreview(item: EvidenceItem) {
    if (!item.url) {
        return <span className="text-xs text-gray-400">No URL</span>;
    }

    const t = item.type.toLowerCase();

    // Images
    if (t.includes("photo") || t.includes("sketch") || /\.(jpg|jpeg|png|gif|webp)$/i.test(item.url)) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={item.url}
                alt={item.description || item.type}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
        );
    }

    // Videos (Simple video tag for preview, or icon)
    if (t.includes("video") || /\.(mp4|webm|ogg)$/i.test(item.url)) {
        return (
            <div className="relative w-full h-full bg-black flex items-center justify-center">
                <video
                    src={item.url}
                    className="w-full h-full object-cover opacity-80"
                    muted
                    playsInline
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                        <Video className="w-8 h-8 text-white" />
                    </div>
                </div>
            </div>
        );
    }

    // Fallback
    return (
        <div className="flex flex-col items-center gap-2 text-gray-400">
            <FileText className="w-12 h-12" />
            <span className="text-xs">Document File</span>
        </div>
    );
}
