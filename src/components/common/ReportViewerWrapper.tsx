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
    onDownloadPdf,
    onViewReport,
    onViewAttachments,
    onViewEvidences,
    activeView = "report",
    children,
}: ReportViewerWrapperProps) {
    return (
        <div className="fixed inset-0 z-50 bg-[#333333] flex flex-col animate-in fade-in duration-200">
            <div className="bg-black text-white px-6 py-4 flex items-center justify-between shadow-md print:hidden border-b border-white/10 h-16">
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
                    <span className="font-semibold text-sm tracking-wide uppercase text-white">{title}</span>
                </div>

                {/* Center: View Modes */}
                <div className="flex items-center gap-3 absolute left-1/2 transform -translate-x-1/2">
                    {/* View Final Report */}
                    <Button
                        variant={activeView === "report" ? "default" : "secondary"}
                        className={`${activeView === "report" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white text-black hover:bg-gray-100"} h-9 px-4 gap-2 rounded text-sm font-medium transition-all border-none`}
                        onClick={onViewReport}
                    >
                        View Final Report <FileText className="w-4 h-4" />
                    </Button>

                    {/* View Signed Attachments */}
                    {onViewAttachments && (
                        <Button
                            variant={activeView === "attachments" ? "default" : "secondary"}
                            className={`${activeView === "attachments" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white text-black hover:bg-gray-100"} h-9 px-4 gap-2 rounded text-sm font-medium transition-all border-none`}
                            onClick={onViewAttachments}
                        >
                            View Signed Attachments <div className="w-4 h-4 border border-current rounded-[3px] flex items-center justify-center text-[8px] font-bold">A</div>
                        </Button>
                    )}

                    {/* View Evidences */}
                    {onViewEvidences && (
                        <Button
                            variant={activeView === "evidences" ? "default" : "secondary"}
                            className={`${activeView === "evidences" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white text-black hover:bg-gray-100"} h-9 px-4 gap-2 rounded text-sm font-medium transition-all border-none`}
                            onClick={onViewEvidences}
                        >
                            View Evidences <div className="w-4 h-4 border border-current rounded-[3px] flex items-center justify-center text-[8px] font-bold">E</div>
                        </Button>
                    )}
                </div>

                {/* Right: Download PDF + Close Button */}
                <div className="flex items-center gap-2">
                    {onDownloadPdf && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onDownloadPdf}
                            disabled={isDownloading}
                            className="bg-white text-black hover:bg-gray-200 rounded w-8 h-8 flex items-center justify-center"
                            title="Download PDF"
                        >
                            <FileDown className="w-5 h-5" />
                        </Button>
                    )}

                    {/* Divider */}
                    {onDownloadPdf && (
                        <div className="h-6 w-px bg-white/20 mx-1" />
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        className="bg-white text-black hover:bg-gray-200 rounded text-black w-8 h-8 flex items-center justify-center"
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