"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Printer } from "lucide-react";
import ImmediateReportingIncidentTable from "@/features/immediateReportingIncident/components/immediateReportingIncidentTable";
import { ImmediateReportingIncident } from "@/apis/immediateReportingIncident/types";
import ImmediateReportingIncidentReport from "@/components/reports/ImmediateReportingIncident";
import { Button } from "@/components/ui/button";

export default function ImmediateReportingIncidentReportsPage() {
    const router = useRouter();
    const [viewingReport, setViewingReport] = useState<ImmediateReportingIncident | null>(null);
    const [shouldAutoPrint, setShouldAutoPrint] = useState(false);

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

    if (viewingReport) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col relative">
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
