"use client";

import React, { use, useEffect } from "react";
import ImmediateReportingIncidentReport from "@/components/reports/ImmediateReportingIncident";
import { useGetImmediateReportingIncidentById } from "@/features/immediateReportingIncident/hooks";
import { Loader2 } from "lucide-react";

export default function PrintImmediateReportingIncidentPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const { data, isLoading } = useGetImmediateReportingIncidentById(id);
    useEffect(() => {
        if (data) {
            const timer = setTimeout(() => {
                window.print();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [data]);

    useEffect(() => {
        if (data) {
            const timer = setTimeout(() => {
                window.print();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [data]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex h-screen w-full items-center justify-center text-red-500">
                Report not found
            </div>
        );
    }

    return (
        <div id="print-container" className="min-h-screen bg-white p-0">
            <div id="report-content">
                <ImmediateReportingIncidentReport data={data} />
            </div>
        </div>
    );
}
