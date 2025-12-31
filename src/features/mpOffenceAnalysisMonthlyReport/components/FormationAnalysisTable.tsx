"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChevronLeft,
    Filter,
    MoreVertical,
    Printer,
    Search,
    ArrowUpDown,
    Calendar,
} from "lucide-react";
import { useGetDomesticAnalytics } from "../domesticAnalysis/hooks";

interface FormationAnalysisTableProps {
    formation: {
        groupKey: string;
        subtitle: string;
    };
    onBack: () => void;
}

interface AnalyticsItem {
    offenceType: string;
    total: number;
    actionTaken: number;
    actionPending: number;
    remark?: string;
}

export default function FormationAnalysisTable({
    formation,
    onBack,
}: FormationAnalysisTableProps) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Fetch analytics data
    const { data: analyticsData, isLoading } = useGetDomesticAnalytics({
        month: currentMonth,
        year: currentYear,
    });

    // Map API data directly for dynamic offence types
    const tableData = useMemo(() => {
        if (!analyticsData || !Array.isArray(analyticsData)) return [];

        return analyticsData.map((item: AnalyticsItem, index: number) => ({
            id: index + 1,
            offenceType: item.offenceType || "Unknown",
            totalCase: item.total || 0,
            actionTaken: item.actionTaken || 0,
            actionPending: item.actionPending || 0,
            remark: item.remark || "--",
        }));
    }, [analyticsData]);

    if (isLoading) {
        return <div className="p-8">Loading analysis details...</div>;
    }

    // Extract unique offence types for the filter dropdown
    const uniqueOffenceTypes = Array.from(new Set(tableData.map(d => d.offenceType)));

    return (
        <div className="p-8 space-y-6 min-h-screen bg-transparent font-sans">
            {/* Header / Breadcrumbs */}
            <div className="flex items-center text-sm text-gray-500 mb-2">
                <span
                    className="hover:text-gray-700 cursor-pointer flex items-center"
                    onClick={onBack}
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                </span>
                <span className="mx-2">/</span>
                <span className="hover:text-gray-700 cursor-pointer" onClick={onBack}>
                    MP Offence Analysis Monthly Report
                </span>
                <span className="mx-2">/</span>
                <span className="font-semibold text-gray-900">{formation.groupKey}</span>
            </div>

            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        {formation.groupKey}
                        <span className="text-base font-normal text-gray-500 border-l border-gray-300 pl-3">
                            {formation.subtitle}
                        </span>
                    </h1>
                </div>
                <Button className="bg-black text-white hover:bg-gray-800 gap-2">
                    Download & Print Report
                    <Printer className="w-4 h-4" />
                </Button>
            </div>

            {/* Filters Bar */}
            <div className="flex justify-between items-center gap-4 mb-6">
                <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search by offence type..."
                        className="pl-9 h-10 bg-white border-gray-200 rounded-md"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center">
                        <Select defaultValue="All">
                            <SelectTrigger className="h-10 w-auto min-w-[170px] bg-white border-gray-200 rounded-md text-gray-700 gap-2">
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-500">Offence Type:</span>
                                    <SelectValue />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                {uniqueOffenceTypes.map((t) => (
                                    <SelectItem key={t} value={t}>
                                        {t}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        variant="outline"
                        className="h-10 bg-white border-gray-200 text-gray-700 font-normal rounded-md px-3 gap-2"
                    >
                        <span className="text-gray-500">Date:</span>
                        <span>06/12/2025</span>
                        <Calendar className="w-4 h-4 text-gray-400 ml-1" />
                    </Button>

                    <Button variant="outline" size="icon" className="h-10 w-10 bg-white border-gray-200 rounded-md">
                        <Filter className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 bg-white border-gray-200 rounded-md">
                        <ArrowUpDown className="w-4 h-4 text-gray-500" />
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#F9FAFB] text-gray-900 font-semibold border-b border-gray-200">
                        <tr>
                            <th className="py-3 px-4 w-16">Sr no.</th>
                            <th className="py-3 px-4">Offence Type</th>
                            <th className="py-3 px-4">Total Case</th>
                            <th className="py-3 px-4">Action Taken</th>
                            <th className="py-3 px-4">Action Pending</th>
                            <th className="py-3 px-4">Remark</th>
                            <th className="py-3 px-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {tableData.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-500">{row.id}</td>
                                <td className="py-3 px-4 font-medium text-gray-900">{row.offenceType}</td>
                                <td className="py-3 px-4">
                                    {row.totalCase > 0 ? (
                                        <span className="font-semibold">{String(row.totalCase).padStart(2, '0')}</span>
                                    ) : (
                                        <span className="text-gray-400">--</span>
                                    )}
                                </td>
                                <td className="py-3 px-4">
                                    {row.actionTaken > 0 ? (
                                        <span className="font-semibold">{String(row.actionTaken).padStart(2, '0')}</span>
                                    ) : (
                                        <span className="text-gray-400">--</span>
                                    )}
                                </td>
                                <td className="py-3 px-4">
                                    {row.actionPending > 0 ? (
                                        <span className="font-semibold">{String(row.actionPending).padStart(2, '0')}</span>
                                    ) : (
                                        <span className="text-gray-400">--</span>
                                    )}
                                </td>
                                <td className="py-3 px-4">
                                    {row.remark !== "--" ? row.remark : <span className="text-gray-400">--</span>}
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="w-4 h-4 text-gray-400" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
