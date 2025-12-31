import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, ChevronRight } from "lucide-react";

import { useGetDomesticAnalytics } from "./domesticAnalysis/hooks";
import { useMemo } from "react";

export default function MpOffenceAnalysisMonthlyReport() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const { data: analyticsData, isLoading } = useGetDomesticAnalytics({
        month: currentMonth,
        year: currentYear,
        groupBy: "formation",
    });

    const { mainFormation, otherFormations } = useMemo(() => {
        if (!analyticsData) return { mainFormation: null, otherFormations: [] };

        // Normalize to upper case for comparison
        const target = "HQ 21 CORPS";
        const main = analyticsData.find(
            (d: any) => d.groupKey?.toUpperCase() === target
        );
        const others = analyticsData.filter(
            (d: any) => d.groupKey?.toUpperCase() !== target
        );

        // If main not found, maybe just take the first one? 
        // For now, let's strictly look for it, or fallback if empty
        return {
            mainFormation: main || others[0] || null,
            otherFormations: main ? others : others.slice(1)
        };
    }, [analyticsData]);

    /* Static Data for UI matching */
    const STATIC_OTHER_FORMATIONS = [
        {
            groupKey: "HQ 36 RAPID Division",
            subtitle: "36 RAPID PRO UNIT",
            total: 148,
            actionPending: 26,
            severity: "High Risk",
        },
        {
            groupKey: "HQ 31 ARRMD DIVISION",
            subtitle: "31 ARMD Division PRO Unit",
            total: 148,
            actionPending: 26,
            severity: "High Risk",
        },
        {
            groupKey: "HQ 41 Arty Division",
            subtitle: "41 Arty Division PRO unit",
            total: 148,
            actionPending: 26,
            severity: "High Risk",
        },
        {
            groupKey: "HQ 54 Inf Division",
            subtitle: "54 Inf Division PRO unit",
            total: 148,
            actionPending: 26,
            severity: "High Risk",
        },
    ];

    if (isLoading) return <div className="p-8">Loading analysis data...</div>;

    return (
        <div className="p-8 space-y-8 min-h-screen bg-transparent font-sans">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <div className="flex items-center text-sm text-gray-500">
                    <BarChart3 className="w-5 h-5 mr-3 text-gray-400" />
                    <span className="hover:text-gray-700 cursor-pointer">Reports & Analysis</span>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="font-semibold text-gray-900">
                        MP Offence Analysis Monthly Report
                    </span>
                </div>
                <Button className="bg-[#007AFF] hover:bg-blue-600 text-white gap-2 rounded-md px-4 font-medium">
                    View Overall Formation Analysis
                    <BarChart3 className="w-4 h-4 ml-1" />
                </Button>
            </div>

            {/* Main Formation Section */}
            <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900">
                    Formations(HQ 21 CORPS) Analysis Data:
                </h2>

                {/* Command Info Bar */}
                <div className="bg-black text-white py-4 px-6 rounded-md flex flex-wrap items-center gap-x-8 gap-y-2 text-sm shadow-md">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-light">Command:</span>
                        <span className="font-semibold">Central Command</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-light">Formation:</span>
                        <span className="font-semibold">21 Corps</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-light">Unit:</span>
                        <span className="font-semibold">Provost Unit</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-light">C/O:</span>
                        <span className="font-semibold">56 APO</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-light">Station:</span>
                        <span className="font-semibold">Bhopal</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-light">State:</span>
                        <span className="font-semibold">Madhya Pradesh</span>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm w-full max-w-[340px] hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="mb-8">
                        <h3 className="font-bold text-xl text-gray-900">HQ 21 CORPS</h3>
                        <p className="text-gray-500 text-sm font-bold mt-1">
                            21 Corps Provost Unit
                        </p>
                    </div>

                    <div className="space-y-3 text-base text-gray-500">
                        <div className="flex justify-between items-center">
                            <span>Total Offence</span>
                            <span className="font-semibold text-gray-900">148</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Pending Cases</span>
                            <span className="font-semibold text-gray-900">26</span>
                        </div>
                        <div className="flex justify-between items-center relative">
                            <span>Severity</span>
                            <span className="font-semibold text-gray-900">High Risk</span>

                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Button
                            size="icon"
                            className="bg-[#007AFF] hover:bg-blue-600 rounded-lg w-10 h-10 shadow-sm"
                        >
                            <ArrowRight className="w-5 h-5 text-white" />
                        </Button>
                    </div>
                </div>            </div>

            {/* Other Formations Section */}
            <div className="space-y-6 pt-4">
                <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                    <h2 className="text-lg font-bold text-gray-900">
                        Other Formations Analysis Data:
                    </h2>
                    <span className="text-sm font-bold text-gray-900">04 Divisions</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {STATIC_OTHER_FORMATIONS.map((formation: any, index: number) => (
                        <FormationCard
                            key={index}
                            title={formation.groupKey}
                            subtitle={formation.subtitle}
                            totalOffence={formation.total}
                            pendingCases={formation.actionPending}
                            severity={formation.severity}
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
}: {
    title: string;
    subtitle: string;
    totalOffence: number;
    pendingCases: number;
    severity: string;
}) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
                <div className="mb-6">
                    <h3 className="font-bold text-base text-gray-900">{title}</h3>
                    <p className="text-gray-500 text-sm font-medium mt-1">{subtitle}</p>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between items-center">
                        <span>Total Offence</span>
                        <span className="font-bold text-gray-900">{totalOffence}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Pending Cases</span>
                        <span className="font-bold text-gray-900">{pendingCases}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Severity</span>
                        <span className="font-bold text-gray-900">{severity}</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <Button
                    size="icon"
                    className="bg-black hover:bg-gray-800 rounded-lg w-10 h-10 shadow-sm"
                >
                    <ArrowRight className="w-5 h-5 text-white" />
                </Button>
            </div>
        </div>
    );
}
