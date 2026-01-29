import React from "react";
import { ArrowLeft, X, Printer, Edit, FileText, FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportViewerWrapperProps {
    title?: string;
    onBack: () => void;
    onPrint?: () => void;
    onEdit?: () => void;
    isDownloading?: boolean;
    downloadType?: "PDF" | "Word" | null;
    onDownloadWord?: () => void;
    onDownloadPdf?: () => void;
    onViewReport?: () => void;
    onViewAttachments?: () => void;
    onViewEvidences?: () => void;
    activeView?: "report" | "attachments" | "evidences";
    children: React.ReactNode;
}

export default function ReportViewerWrapper({
    title = "REPORT PREVIEW",
    onBack,
    onPrint,
    onEdit,
    isDownloading,
    downloadType,
    onDownloadWord,
    onDownloadPdf,
    onViewReport,
    onViewAttachments,
    onViewEvidences,
    activeView = "report",
    children,
}: ReportViewerWrapperProps) {
    return (
        <div className="fixed inset-0 z-50 bg-[#333333] flex flex-col animate-in fade-in duration-200">
            {/* Header */}
            <div className="bg-[#0A0A0A] text-white px-6 py-4 flex items-center justify-between shadow-md print:hidden border-b border-white/10">
                {/* Left: Back + Title */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        className="text-white hover:bg-white/10 hover:text-white rounded-full w-8 h-8"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <span className="font-semibold text-sm tracking-wide uppercase">{title}</span>
                </div>

                {/* Center: View Modes */}
                <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
                    {/* View Final Report */}
                    <Button
                        variant={activeView === "report" ? "default" : "outline"}
                        className={`${activeView === "report" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-transparent border-white/20 text-white hover:bg-white/10"} h-9 px-4 gap-2 rounded text-sm font-medium transition-all`}
                        onClick={onViewReport}
                    >
                        View Final Report <FileText className="w-4 h-4" />
                    </Button>

                    {/* View Signed Attachments */}
                    {onViewAttachments && (
                        <Button
                            variant={activeView === "attachments" ? "default" : "outline"}
                            className={`${activeView === "attachments" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-transparent border-white/20 text-white hover:bg-white/10"} h-9 px-4 gap-2 rounded text-sm font-normal transition-all`}
                            onClick={onViewAttachments}
                        >
                            View Signed Attachments <div className="w-4 h-4 border border-current rounded-[3px] flex items-center justify-center text-[8px]">🔒</div>
                        </Button>
                    )}

                    {/* View Evidences */}
                    {onViewEvidences && (
                        <Button
                            variant={activeView === "evidences" ? "default" : "outline"}
                            className={`${activeView === "evidences" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-transparent border-white/20 text-white hover:bg-white/10"} h-9 px-4 gap-2 rounded text-sm font-normal transition-all`}
                            onClick={onViewEvidences}
                        >
                            View Evidences <div className="w-4 h-4 border border-current rounded-[3px] flex items-center justify-center text-[8px]">🖼️</div>
                        </Button>
                    )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Edit Report */}
                    <Button
                        variant="ghost"
                        className="text-white/70 hover:text-white hover:bg-white/10 h-9 px-3 gap-2 rounded text-sm font-normal transition-all"
                        onClick={onEdit}
                        disabled={!onEdit}
                    >
                        <Edit className="w-4 h-4" />
                    </Button>

                    {/* Print Report */}
                    <Button
                        variant="ghost"
                        className="text-white/70 hover:text-white hover:bg-white/10 h-9 px-3 gap-2 rounded text-sm font-normal transition-all"
                        onClick={() => onPrint ? onPrint() : window.print()}
                    >
                        <Printer className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-white/20 mx-2" />

                    {onDownloadWord && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/70 hover:text-white hover:bg-white/10 w-9 h-9"
                            onClick={onDownloadWord}
                            disabled={isDownloading}
                            title="Download Word"
                        >
                            {isDownloading && downloadType === 'Word' ? <Loader2 className="animate-spin w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </Button>
                    )}

                    {onDownloadPdf && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/70 hover:text-white hover:bg-white/10 w-9 h-9"
                            onClick={onDownloadPdf}
                            disabled={isDownloading}
                            title="Download PDF"
                        >
                            {isDownloading && downloadType === 'PDF' ? <Loader2 className="animate-spin w-4 h-4" /> : <FileDown className="w-4 h-4" />}
                        </Button>
                    )}

                    <div className="w-px h-6 bg-white/20 mx-2" />

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        className="text-white/70 hover:text-white hover:bg-white/10 rounded-full w-8 h-8"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-8 pb-32 flex justify-center relative">
                {/* The child component (Report) should carry its own background (usually white) and shadow */}
                {children}

                {/* FLOATING ACTION BUTTONS */}
                {/* FLOATING ACTION BUTTONS */}
                <div className="fixed bottom-0 left-0 w-full bg-black py-4 flex justify-center items-center gap-4 z-50 print:hidden border-t border-white/10">
                    {onEdit && (
                        <Button
                            className="bg-white text-black hover:bg-gray-200 border border-gray-200 h-10 px-6 rounded font-semibold text-sm transition-all"
                            onClick={onEdit}
                        >
                            Edit Report <Edit className="w-4 h-4 ml-2" />
                        </Button>
                    )}

                    <Button
                        className="bg-white text-black hover:bg-gray-200 border border-gray-200 h-10 px-6 rounded font-semibold text-sm transition-all"
                        onClick={() => onPrint ? onPrint() : window.print()}
                    >
                        Print Report <Printer className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>

            {/* DOWNLOAD LOADER OVERLAY */}
            {isDownloading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center gap-4 min-w-[300px] animate-in zoom-in-95 duration-200">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <div className="text-center">
                            <h3 className="font-semibold text-lg">Generating {downloadType} Report</h3>
                            <p className="text-gray-500 text-sm">Please wait while we prepare your download...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}