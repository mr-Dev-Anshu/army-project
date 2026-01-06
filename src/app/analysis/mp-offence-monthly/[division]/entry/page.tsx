"use client";

import React, { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DivisionForm from "@/features/mpOffenceAnalysisMonthlyReport/components/DivisionForm";
import { FORMATIONS_LIST, MAIN_FORMATION } from "@/features/mpOffenceAnalysisMonthlyReport/constants";
import { useGetDivisionAnalysis } from "@/features/mpOffenceAnalysisMonthlyReport/hooks/useDivisionAnalysis";

export default function EntryPage({ params }: { params: Promise<{ division: string }> }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("id");

    // Unwrap params
    const resolvedParams = React.use(params);
    const decodedDivision = React.useMemo(() => {
        try {
            return decodeURIComponent(resolvedParams.division);
        } catch (e) {
            return resolvedParams.division;
        }
    }, [resolvedParams.division]);

    const formation = useMemo(() => {
        if (decodedDivision === MAIN_FORMATION.slug || decodedDivision === MAIN_FORMATION.groupKey) {
            return MAIN_FORMATION;
        }
        return FORMATIONS_LIST.find(f => f.slug === decodedDivision || f.groupKey === decodedDivision);
    }, [decodedDivision]);

    // If editing, we need to fetch the data to pass as initialData
    // We can reuse the hook that fetches all and find the one we need
    // Ideally we would have a useGetDivisionAnalysisById but filtering is fine for now as per current repo structure
    const { data: analysisData, isLoading } = useGetDivisionAnalysis({
        divisionName: formation?.groupKey || ""
    });

    const initialData = useMemo(() => {
        if (!editId || !analysisData || !Array.isArray(analysisData)) return null;
        return analysisData.find((item: any) => item._id === editId) || null;
    }, [analysisData, editId]);

    const handleClose = () => {
        router.back();
    };

    if (!formation) {
        return <div>Formation not found</div>;
    }

    if (isLoading && editId) {
        return <div className="flex items-center justify-center p-8">Loading entry data...</div>;
    }

    if (editId && !initialData && analysisData) {
        // Data loaded but ID not found
        return <div>Entry not found</div>;
    }

    return (
        <DivisionForm
            formation={formation}
            onClose={handleClose}
            initialData={initialData}
        />
    );
}
