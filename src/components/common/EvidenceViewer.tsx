import React, { useState, useMemo, useEffect } from "react";
import { FileText, Image as ImageIcon, Video, Upload, Download, Printer, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EvidenceItem {
    type: string; // "Evidence" | "Eye Sketch" | "Photo" | "Video"
    url?: string;
    description?: string;
    customFields?: any;
}

interface EvidenceViewerProps {
    evidences?: EvidenceItem[];
    onDelete?: (item: EvidenceItem) => void;
}

export default function EvidenceViewer({ evidences = [], onDelete }: EvidenceViewerProps) {
    const [previewItem, setPreviewItem] = useState<EvidenceItem | null>(null);
    const [activeTab, setActiveTab] = useState<string>("Photos");

    // Categorization Logic
    const categorized = useMemo(() => {
        const cats = {
            "Other Evidences": [] as EvidenceItem[],
            "Eye Sketch": [] as EvidenceItem[],
            "Photos": [] as EvidenceItem[],
            "Videos": [] as EvidenceItem[]
        };

        evidences.forEach(item => {
            const t = (item.type || "").toLowerCase();
            if (t.includes("video")) {
                cats["Videos"].push(item);
            } else if (t.includes("sketch")) {
                cats["Eye Sketch"].push(item);
            } else if (t.includes("photo") || t.includes("image")) {
                cats["Photos"].push(item);
            } else {
                cats["Other Evidences"].push(item);
            }
        });
        return cats;
    }, [evidences]);

    // Set initial active tab
    useEffect(() => {
        if (categorized["Photos"].length === 0) {
            if (categorized["Videos"].length > 0) setActiveTab("Videos");
            else if (categorized["Eye Sketch"].length > 0) setActiveTab("Eye Sketch");
            else if (categorized["Other Evidences"].length > 0) setActiveTab("Other Evidences");
        }
    }, [categorized]);

    const activeItems = categorized[activeTab as keyof typeof categorized] || [];

    const handleView = (item: EvidenceItem) => {
        if (item.url) {
            setPreviewItem(item);
        }
    };

    const handleDownload = () => {
        if (previewItem?.url) {
            const a = document.createElement('a');
            a.href = previewItem.url;
            a.download = previewItem.description || 'evidence-download';
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
                const isVideo = previewItem.type.toLowerCase().includes("video") || /\.(mp4|webm|ogg)$/i.test(previewItem.url);

                if (isVideo) {
                    printWindow.document.write(`<html><head><title>Print ${previewItem.description || 'Evidence'}</title></head><body style="margin:0; text-align:center;"><h1>Video Evidence: ${previewItem.description || 'Untitled'}</h1><p>Cannot print video content directly.</p></body></html>`);
                } else {
                    printWindow.document.write(`<html><head><title>Print ${previewItem.description || 'Evidence'}</title></head><body style="margin:0; text-align:center;"><img src="${previewItem.url}" style="max-width:100%;" onload="window.print()" /></body></html>`);
                }
                printWindow.document.close();
            }
        }
    };

    // Helper to render center content based on type
    const renderOverlayContent = (item: EvidenceItem) => {
        if (!item.url) return <div className="text-white">No URL found</div>;

        const t = item.type.toLowerCase();
        const isVideo = t.includes("video") || /\.(mp4|webm|ogg)$/i.test(item.url);

        if (isVideo) {
            return (
                <video
                    src={item.url}
                    controls
                    autoPlay
                    className="max-w-[85%] max-h-[85vh] shadow-2xl bg-black"
                />
            );
        }

        // Image default
        return (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
                src={item.url}
                alt={item.description || "Evidence"}
                className="max-w-[85%] max-h-[85vh] object-contain shadow-2xl bg-white"
            />
        );
    };

    return (
        <>
            <div className="w-full max-w-5xl min-h-full bg-white rounded-xl shadow-sm p-8 overflow-hidden">
                <h2 className="text-xl font-bold mb-6 text-black">View Evidences</h2>

                {/* Tabs */}
                <div className="flex flex-wrap items-center gap-2 mb-8 bg-gray-100 p-1.5 rounded-lg w-full">
                    {Object.keys(categorized).map((cat) => {
                        const count = categorized[cat as keyof typeof categorized].length;
                        const isActive = activeTab === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${isActive ? "bg-black text-white shadow-sm" : "text-gray-500 hover:text-black hover:bg-gray-200"
                                    }`}
                            >
                                {cat}
                                <span className={`text-[10px] w-5 h-5 flex items-center justify-center rounded-full ${isActive ? "bg-white text-black" : "bg-gray-200 text-gray-600"
                                    }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Grid */}
                {activeItems.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        No items in {activeTab}.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {activeItems.map((item, index) => (
                            <div key={index} className="group cursor-pointer" onClick={() => handleView(item)}>
                                {/* Preview Image Box */}
                                <div className="aspect-[4/3] bg-gray-100 rounded-md overflow-hidden relative mb-3">
                                    {renderPreview(item)}
                                </div>

                                {/* Title */}
                                <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">
                                    {item.description || item.type}
                                </h3>
                                <p className="text-xs text-gray-500 line-clamp-1">
                                    {item.type}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Evidence Preview Overlay */}
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
                        <h2 className="text-md font-semibold truncate max-w-4xl">{previewItem.description || previewItem.type}</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="bg-transparent text-white hover:bg-white/20 rounded-full w-8 h-8"
                            onClick={() => setPreviewItem(null)}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Content Container */}
                    <div
                        className="flex-1 w-full flex items-center justify-center overflow-hidden p-8 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {renderOverlayContent(previewItem)}
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
