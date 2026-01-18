"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Printer, Download } from "lucide-react";
import ImmediateReportingIncidentTable from "@/features/immediateReportingIncident/components/immediateReportingIncidentTable";
import { ImmediateReportingIncident } from "@/apis/immediateReportingIncident/types";
import ImmediateReportingIncidentReport from "@/components/reports/ImmediateReportingIncident";
import { Button } from "@/components/ui/button";
import { generateImmediateIncidentWordReport } from "@/utils/generateImmediateIncidentWordReport";

export default function ImmediateReportingIncidentReportsPage() {
    const router = useRouter();
    const [viewingReport, setViewingReport] = useState<ImmediateReportingIncident | null>(null);
    const [shouldAutoPrint, setShouldAutoPrint] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadType, setDownloadType] = useState<"PDF" | "Word" | null>(null);

    const handleAddNew = () => {
        router.push("/create-record/immediate-reporting-incident");
    };

    const handleEdit = (item: ImmediateReportingIncident) => {
        router.push(`/create-record/immediate-reporting-incident?id=${item._id}`);
    };

    /* ================= AUTO PRINT ================= */
    useEffect(() => {
        if (viewingReport && shouldAutoPrint) {
            const t = setTimeout(() => {
                window.print();
                setShouldAutoPrint(false);
            }, 500);
            return () => clearTimeout(t);
        }
    }, [viewingReport, shouldAutoPrint]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadWord = async () => {
        if (!viewingReport) return;
        setIsDownloading(true);
        setDownloadType("Word");
        try {
            await generateImmediateIncidentWordReport(viewingReport);
        } catch (error) {
            console.error("Failed to generate Word report:", error);
            alert("Failed to generate Word report");
        } finally {
            setIsDownloading(false);
            setDownloadType(null);
        }
    };

    const handleDownloadPdf = async () => {
        if (!viewingReport?._id) return;
        setIsDownloading(true);
        setDownloadType("PDF");
        try {
            const response = await fetch(`/api/immediate-reporting-incident/pdf/${viewingReport._id}`);
            if (!response.ok) throw new Error("Failed to generate PDF");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Incident_Report_${viewingReport._id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Failed to generate PDF report");
        } finally {
            setIsDownloading(false);
            setDownloadType(null);
        }
    };

    if (viewingReport) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col relative">
                {/* DOWNLOAD LOADER MODAL */}
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

                <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 print:hidden">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setViewingReport(null);
                            setShouldAutoPrint(false);
                        }}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Reports
                    </Button>
                    <h1 className="text-lg font-semibold text-gray-800">
                        Immediate Reporting Of Incident
                    </h1>
                    <div className="ml-auto flex gap-2">
                        <Button
                            onClick={handleDownloadWord}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            disabled={isDownloading}
                        >
                            <Download className="w-4 h-4" />
                            Download Word
                        </Button>
                        <Button
                            onClick={handleDownloadPdf}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            disabled={isDownloading}
                        >
                            <Download className="w-4 h-4" />
                            Download PDF
                        </Button>
                        <Button
                            onClick={handlePrint}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                        >
                            <Printer className="w-4 h-4" />
                            Print Report
                        </Button>
                    </div>
                </div>
                <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-500/10">
                    <ImmediateReportingIncidentReport data={viewingReport} />
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-gray-50 p-6 overflow-hidden flex flex-col">
            <ImmediateReportingIncidentTable
                onAddNew={handleAddNew}
                onEdit={handleEdit}
                onView={setViewingReport}
            />
        </div>
    );
}
