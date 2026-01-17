"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ImmediateReportingIncidentTable from "@/features/immediateReportingIncident/components/immediateReportingIncidentTable";
import { ImmediateReportingIncident } from "@/apis/immediateReportingIncident/types";

export default function ImmediateReportingIncidentReportsPage() {
    const router = useRouter();

    const handleAddNew = () => {
        router.push("/create-record/immediate-reporting-incident");
    };

    const handleEdit = (item: ImmediateReportingIncident) => {
        // Assuming the same form is used for editing, passing data via state or ID
        // For now, let's navigate to the create page with a query param or handle it via a dedicated edit route if it exists.
        // Usually, consistent pattern is /create-record/immediate-reporting-incident?id=... or passing state.
        // But the previous form component accepted `initialData`.
        // If the pattern is to reuse the create page:
        // Let's assume we pass the item via some state manager or query param. 
        // For simplicity and common practice in this project (checking others might strictly require more steps), 
        // I'll try to push to the create page with query params or look for an edit page pattern.
        // Checking `VehiclesSecurityPassManagementTable`... it calls `onEdit`.
        // The parent page implementation of `VehiclesSecurityPassManagement` would clarify.
        // For now, I'll navigate to the create page with the ID as a query param.
        // The form page should handle fetching if ID is present or we pass state.
        // Actually, the simplest for now:
        router.push(`/create-record/immediate-reporting-incident?id=${item._id}`);
    };

    return (
        <div className="h-full bg-gray-50 p-6 overflow-hidden flex flex-col">
            <ImmediateReportingIncidentTable
                onAddNew={handleAddNew}
                onEdit={handleEdit}
            />
        </div>
    );
}
