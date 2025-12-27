import React from "react";
import { X, FileText } from "lucide-react";
import MilitaryPoliceReport, { MilitaryPoliceReportProps } from "@/components/reports/MilitaryPoliceReport";

interface ReportPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: MilitaryPoliceReportProps | null;
}

export default function ReportPreviewModal({
    isOpen,
    onClose,
    data
}: ReportPreviewModalProps) {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Report Preview</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 bg-white flex justify-center">
                    <MilitaryPoliceReport {...data} className="shadow-none border-none min-h-full" />
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-white flex items-center justify-end gap-3 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
