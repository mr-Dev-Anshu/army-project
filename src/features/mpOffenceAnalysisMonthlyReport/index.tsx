"use client";
import React from "react";


import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, ChevronRight } from "lucide-react";

import { useGetDomesticAnalytics } from "./domesticAnalysis/hooks";
import { useGetDivisionAnalysis } from "./hooks/useDivisionAnalysis";
import { useMemo, useState } from "react";
import FormationAnalysisTable from "./components/FormationAnalysisTable";
import Hq36RapidDivisionTable from "./components/DivisionTable";

export default function MpOffenceAnalysisMonthlyReport() {
    const [selectedFormation, setSelectedFormation] = useState<{
        groupKey: string;
        subtitle: string;
    } | null>(null);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const { data: analyticsData, isLoading } = useGetDomesticAnalytics({
        month: currentMonth,
        year: currentYear,
        groupBy: "formation",
    });

    const { totalOffences, totalPending, severity } = useMemo(() => {
        if (!analyticsData || !Array.isArray(analyticsData)) {
            return { totalOffences: 0, totalPending: 0, severity: "Low Risk" };
        }

        const total = analyticsData.reduce((acc: number, curr: any) => acc + (curr.total || 0), 0);
        const pending = analyticsData.reduce((acc: number, curr: any) => acc + (curr.actionPending || 0), 0);

        let risk = "Low Risk";
        if (pending > 20) risk = "High Risk";
        else if (pending > 10) risk = "Medium Risk";

        return { totalOffences: total, totalPending: pending, severity: risk };
    }, [analyticsData]);

    const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1).toISOString();

    // Fetch Division Analysis (Grouped) for Other Formations
    const { data: divisionData, isLoading: isDivisionLoading } = useGetDivisionAnalysis({
        groupBy: "all"
    });

    /* Static Data for UI matching - merged with dynamic data */
    const FORMATIONS_LIST = [
        {
            groupKey: "HQ 36 RAPID Division",
            subtitle: "36 RAPID PRO UNIT",
        },
        {
            groupKey: "HQ 31 ARRMD DIVISION",
            subtitle: "31 ARMD Division PRO Unit",
        },
        {
            groupKey: "HQ 41 Arty Division",
            subtitle: "41 Arty Division PRO unit",
        },
        {
            groupKey: "HQ 54 Inf Division",
            subtitle: "54 Inf Division PRO unit",
        },
    ];

    const formationsWithData = useMemo(() => {
        if (!divisionData || !Array.isArray(divisionData)) {
            // Return static list with 0s if no data
            return FORMATIONS_LIST.map(f => ({
                ...f,
                total: 0,
                actionPending: 0,
                severity: "Low Risk"
            }));
        }

        return FORMATIONS_LIST.map(f => {
            const match = divisionData.find((d: any) => d.divisionName === f.groupKey);
            // Use offenceCount as "Total Offence" as requested to show count of entries/offences
            const total = match ? (match.offenceCount || 0) : 0;
            const pending = match ? (match.totalActionPending || 0) : 0;
            let risk = "Low Risk";
            if (pending > 20) risk = "High Risk";
            else if (pending > 10) risk = "Medium Risk";

            return {
                ...f,
                total,
                actionPending: pending,
                severity: risk
            };
        });
    }, [divisionData]);



    if (isLoading) return <div className="p-8">Loading analysis data...</div>;

    if (selectedFormation) {
        if (selectedFormation.groupKey === "HQ 21 CORPS") {
            return (
                <FormationAnalysisTable
                    formation={selectedFormation}
                    onBack={() => setSelectedFormation(null)}
                />
            );
        }
        return (
            <Hq36RapidDivisionTable
                formation={selectedFormation}
                onBack={() => setSelectedFormation(null)}
            />
        );
    }

    return (
        <div className="p-2 space-y-8 min-h-screen bg-transparent font-sans">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-300">
                <div className="flex items-center text-sm text-[#404040]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 2V14H14" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.6641 6L9.33073 9.33333L6.66406 6.66667L4.66406 8.66667" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="h-4 w-px bg-[#E5E5E5] mx-2"></div>
                    <span className="hover:text-gray-700 cursor-pointer ml-2 ">Reports & Analysis</span>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="font-semibold text-[#0A0A0A]">
                        MP Offence Analysis Monthly Report
                    </span>
                </div>
                <Button className="bg-[#0088FF] hover:bg-blue-600 text-white gap-2 rounded-md px-4 font-medium cursor-pointer">
                    View Overall Formation Analysis
                    <BarChart3 className="w-4 h-4 ml-1" />
                </Button>
            </div>

            {/* Main Formation Section */}
            <div className="space-y-6">
                <h2 className="text-lg font-bold text-[#0A0A0A]">
                    Formations (HQ 21 CORPS) Analysis Data:
                </h2>

                {/* Command Info Bar */}
                <div className="bg-black text-white py-4 px-6 rounded-md flex flex-wrap items-center justify-between gap-x-8 gap-y-2 text-sm shadow-md">
                    <div className="flex items-center gap-2">
                        <span className="text-[#E5E5E5] font-medium">Command:</span>
                        <span className="font-semibold text-[#FFFFFF]">Central Command</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[#E5E5E5] font-medium">Formation:</span>
                        <span className="font-semibold text-[#FFFFFF]">21 Corps</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[#E5E5E5] font-medium">Unit:</span>
                        <span className="font-semibold text-[#FFFFFF]">Provost Unit</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[#E5E5E5] font-medium">C/O:</span>
                        <span className="font-semibold text-[#FFFFFF]">56 APO</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[#E5E5E5] font-medium">Station:</span>
                        <span className="font-semibold text-[#FFFFFF]">Bhopal</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[#E5E5E5] font-medium">State:</span>
                        <span className="font-semibold text-[#FFFFFF]">Madhya Pradesh</span>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-5  shadow-sm w-full max-w-[340px] hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="mb-8">
                        <h3 className="font-bold text-xl text-[#0A0A0A]">HQ 21 CORPS</h3>
                        <p className="text-[#737373] text-sm font-bold mt-1">
                            21 Corps Provost Unit
                        </p>
                    </div>

                    <div className="space-y-4 text-base text-[#737373]">
                        <div className="flex justify-between items-center">
                            <span>Total Offence</span>
                            <span className="font-normal text-[#0A0A0A]">{totalOffences}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Pending Cases</span>
                            <span className="font-normal text-[#0A0A0A]">{totalPending}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Severity</span>
                            <span className={`font-normal ${severity === 'High Risk' ? 'text-red-600' : severity === 'Medium Risk' ? 'text-amber-600' : 'text-green-600'}`}>
                                {severity}
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Button
                            size="icon"
                            className="bg-[#0088FF] hover:bg-blue-600 rounded-lg w-10 h-10 shadow-sm cursor-pointer"
                            onClick={() =>
                                setSelectedFormation({
                                    groupKey: "HQ 21 CORPS",
                                    subtitle: "21 Corps Provost Unit",
                                })
                            }
                        >
                            <ArrowRight className="w-5 h-5 text-white" />
                        </Button>
                    </div>
                </div>            </div>

            {/* Other Formations Section */}
            <div className="space-y-6 pt-4">
                <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                    <h2 className="text-lg font-bold text-[#0A0A0A]">
                        Other Formations Analysis Data:
                    </h2>
                    <span className="text-sm font-bold text-[#0A0A0A]">04 Divisions</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {formationsWithData.map((formation: any, index: number) => (
                        <FormationCard
                            key={index}
                            title={formation.groupKey}
                            subtitle={formation.subtitle}
                            totalOffence={formation.total}
                            pendingCases={formation.actionPending}
                            severity={formation.severity}
                            onClick={() => setSelectedFormation(formation)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function FormationCard({
    title,
    subtitle,
    totalOffence,
    pendingCases,
    severity,
    onClick,
}: {
    title: string;
    subtitle: string;
    totalOffence: number;
    pendingCases: number;
    severity: string;
    onClick: () => void;
}) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="mb-4">
                <h3 className="font-bold text-lg text-[#0A0A0A] break-words">{title}</h3>
                <p className="text-gray-500 text-xs font-medium uppercase mt-1">
                    {subtitle}
                </p>
            </div>

            <div className="space-y-2 text-sm text-[#737373]">
                <div className="flex justify-between items-center">
                    <span>Total Offence</span>
                    <span className="font-normal text-[#0A0A0A]">{totalOffence}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Pending Cases</span>
                    <span className="font-normal text-[#0A0A0A]">{pendingCases}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Severity</span>
                    <span className="font-normal text-[#0A0A0A]">{severity}</span>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <Button
                    size="icon"
                    variant="secondary"
                    className="bg-black hover:bg-gray-800 text-white rounded-lg w-10 h-10 cursor-pointer"
                    onClick={onClick}
                >
                    <ArrowRight className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
