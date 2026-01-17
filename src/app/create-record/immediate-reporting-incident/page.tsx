"use client";

import { useRouter } from "next/navigation";
import { ImmediateReportingIncidentForm } from "@/features/immediateReportingIncident/components/form";

export default function CreateImmediateReportingIncidentPage() {
    const router = useRouter();

    const handleCancel = () => {
        router.back();
    };

    const handleSuccess = () => {
        router.push("/dashboard");
        // Or wherever you want to redirect, maybe a list view or detail view.
        // Assuming dashboard for now or back to list.
    };

    return (
        <div className="h-full bg-gray-50">
            <ImmediateReportingIncidentForm
                onCancel={handleCancel}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
