"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ImmediateReportingIncidentForm } from "@/features/immediateReportingIncident/components/form";
import { useGetImmediateReportingIncidentById } from "@/features/immediateReportingIncident/hooks";
import { Loader2 } from "lucide-react";

export default function CreateImmediateReportingIncidentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const { data: initialData, isLoading } = useGetImmediateReportingIncidentById(id || "");

    const handleCancel = () => {
        router.back();
    };

    const handleSuccess = () => {
        router.push("/reports/immediate-reporting-incident");
    };

    if (id && isLoading) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
        );
    }

    return (
        <div className="h-full bg-gray-50">
            <ImmediateReportingIncidentForm
                onCancel={handleCancel}
                onSuccess={handleSuccess}
                initialData={initialData}
            />
        </div>
    );
}
