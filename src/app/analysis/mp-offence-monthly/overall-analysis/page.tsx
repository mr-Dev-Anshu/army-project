"use client";

import React from "react";
import { useRouter } from "next/navigation";
import OverallFormationAnalysisTable from "@/features/mpOffenceAnalysisMonthlyReport/components/OverallFormationAnalysisTable";

export default function OverallAnalysisPage() {
    const router = useRouter();

    return (
        <OverallFormationAnalysisTable
            onBack={() => router.push("/analysis/mp-offence-monthly")}
        />
    );
}
