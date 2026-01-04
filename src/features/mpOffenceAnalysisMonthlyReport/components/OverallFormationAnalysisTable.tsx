"use client";

import React, { useMemo, useState } from "react";
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
    Search,
    Calendar,
    Printer,
    ArrowUpDown,
    MoreVertical,
    Download,
    ListFilter
} from "lucide-react";
import { useGetDivisionAnalysis } from "../hooks/useDivisionAnalysis";
import { useGetDomesticAnalytics } from "../domesticAnalysis/hooks";

interface OverallFormationAnalysisTableProps {
    onBack: () => void;
}

export default function OverallFormationAnalysisTable({ onBack }: OverallFormationAnalysisTableProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOffenceType, setSelectedOffenceType] = useState("All");
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const dateInputRef = React.useRef<HTMLInputElement>(null);

    // Formations order as per design image preference
    const FORMATION_ORDER = [
        "HQ 21 CORPS",
        "HQ 36 RAPID Division",
        "HQ 31 ARRMD DIVISION",
        "HQ 41 Arty Division",
        "HQ 54 Inf Division"
    ];

    // Fetch Division Data (for the divisions)
    const { data: divisionData, isLoading: isDivisionLoading } = useGetDivisionAnalysis({
        groupBy: "all",
        monthYear: selectedDate
    });

    // Fetch HQ 21 CORPS Data (Domestic Analytics) separately as it comes from a different API source currently
    // The design shows "HQ 21 CORPS" as the first column.
    // In the current setup, "HQ 21 CORPS" data comes from `useGetDomesticAnalytics`.
    // We need to fetch that too, or ensure the backend `division-analysis` also returns it if possible.
    // Assuming for now `division-analysis` is for the *other* formations and domestic is for HQ 21 Corps.
    // We will need to merge them.

    const { data: hq21Data, isLoading: isHq21Loading } = useGetDomesticAnalytics({
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
        groupBy: "offence", // Group by offence to map easily
    });

    const processedData = useMemo(() => {
        if (!divisionData) return [];

        // 1. Collect all unique offence types from all sources
        const allOffences = new Set<string>();

        // From Division Data
        divisionData.forEach((div: any) => {
            if (div.offencesStats) {
                div.offencesStats.forEach((stat: any) => {
                    if (stat.offenceName) allOffences.add(stat.offenceName);
                });
            }
        });

        // From HQ 21 Data
        if (Array.isArray(hq21Data)) {
            hq21Data.forEach((item: any) => {
                if (item.offenceType) allOffences.add(item.offenceType);
            });
        }

        // 2. Create rows for each offence
        const rows = Array.from(allOffences).map(offenceType => {
            const row: any = { offenceType };

            // Fill HQ 21 CORPS Data
            const hq21Match = Array.isArray(hq21Data) ? hq21Data.find((d: any) => d.offenceType === offenceType) : null;
            row["HQ 21 CORPS"] = {
                total: hq21Match?.total || 0,
                taken: hq21Match?.actionTaken || 0,
                pending: hq21Match?.actionPending || 0
            };

            // Fill Other Formations Data
            divisionData.forEach((div: any) => {
                const stat = div.offencesStats?.find((s: any) => s.offenceName === offenceType);
                row[div.divisionName] = {
                    total: stat?.totalCases || 0,
                    taken: stat?.actionTaken || 0,
                    pending: stat?.actionPending || 0
                };
            });

            // Ensure all preferred columns exist even if 0
            FORMATION_ORDER.forEach(fmt => {
                if (!row[fmt]) {
                    row[fmt] = { total: 0, taken: 0, pending: 0 };
                }
            });

            return row;
        });

        return rows;
    }, [divisionData, hq21Data, FORMATION_ORDER]);

    const filteredData = useMemo(() => {
        let data = [...processedData];

        if (searchQuery) {
            data = data.filter(item =>
                item.offenceType.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedOffenceType !== "All") {
            data = data.filter(item => item.offenceType === selectedOffenceType);
        }

        // Optional: Implement sorting if needed, e.g., by offence name
        data.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.offenceType.localeCompare(b.offenceType);
            } else {
                return b.offenceType.localeCompare(a.offenceType);
            }
        });

        return data;
    }, [processedData, searchQuery, selectedOffenceType, sortOrder]);

    const uniqueOffenceTypes = useMemo(() => {
        return Array.from(new Set(processedData.map(d => d.offenceType))).sort();
    }, [processedData]);


    const isFilterActive = searchQuery !== "" ||
        selectedOffenceType !== "All" ||
        sortOrder !== "desc" ||
        (selectedDate.getMonth() !== new Date().getMonth() || selectedDate.getFullYear() !== new Date().getFullYear());


    const handleResetFilters = () => {
        setSearchQuery("");
        setSelectedOffenceType("All");
        setSelectedDate(new Date());
        setSortOrder("desc");
    };

    return (
        <div className="space-y-6 min-h-screen bg-transparent font-sans">
            {/* Header / Breadcrumbs */}
            <div className="flex justify-start items-center text-sm text-[#404040] mb-6 w-full border-b border-gray-300 pb-4">
                <div className="flex items-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                        <path d="M2 2V14H14" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.6641 6L9.33073 9.33333L6.66406 6.66667L4.66406 8.66667" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="h-4 w-px bg-[#E5E5E5] mr-3"></div>
                    <span
                        className="text-[#404040] hover:text-gray-700 cursor-pointer transition-colors"
                        onClick={onBack}
                    >
                        Reports & Analysis
                    </span>
                    <span className="mx-2 text-gray-400">›</span>
                    <span
                        className="text-[#404040] hover:text-gray-700 cursor-pointer transition-colors"
                        onClick={onBack}
                    >
                        MP Offence Analysis Monthly Report
                    </span>
                    <span className="mx-2 text-gray-400">›</span>
                    <span className="font-bold text-[#0A0A0A]">View Overall Formation Analysis</span>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-[#404040]">
                    View Overall Formation Analysis
                </h1>
                <Button className="bg-[#0A0A0A] text-white font-medium hover:bg-gray-800 gap-2 px-6 cursor-pointer rounded-md">
                    Download & Print Report
                    <Printer className="w-4 h-4 ml-1" />
                </Button>
            </div>

            {/* Filters Bar */}
            <div className="flex justify-between items-center gap-4 mb-6">
                <div className="relative w-80" title="Search by offence type">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${searchQuery ? "text-blue-500" : "text-gray-400"}`} />
                    <Input
                        placeholder="Search by offence type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`pl-9 h-10 rounded-md transition-colors ${searchQuery ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-200" : "bg-white border-gray-300"
                            }`}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center" title="Filter by Offence Type">
                        <Select value={selectedOffenceType} onValueChange={setSelectedOffenceType}>
                            <SelectTrigger className={`h-10 min-w-[230px] max-w-[230px] rounded-md text-gray-700 gap-2 overflow-hidden transition-colors ${selectedOffenceType !== "All" ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-200" : "bg-white border-gray-300"
                                }`}>
                                <div className="flex items-center gap-1">
                                    <span className={selectedOffenceType !== "All" ? "text-blue-700" : "text-[#404040]"}>Offence Type:</span>
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

                    <div className="relative" title="Filter by Month & Year">
                        <Button
                            variant="outline"
                            onClick={() => dateInputRef.current?.showPicker()}
                            className={`h-10 text-gray-700 font-normal rounded-md px-3 gap-2 ${(selectedDate.getMonth() !== new Date().getMonth() || selectedDate.getFullYear() !== new Date().getFullYear())
                                ? "border-blue-500 bg-blue-50/50 text-blue-700 ring-1 ring-blue-200"
                                : "bg-white border-gray-300"
                                }`}
                        >
                            <span className={(selectedDate.getMonth() !== new Date().getMonth() || selectedDate.getFullYear() !== new Date().getFullYear()) ? "text-blue-700" : "text-gray-500"}>Date:</span>
                            <span>{selectedDate.toLocaleDateString('en-GB', { month: '2-digit', year: 'numeric' })}</span>
                            <Calendar className={`w-4 h-4 ml-1 ${(selectedDate.getMonth() !== new Date().getMonth() || selectedDate.getFullYear() !== new Date().getFullYear()) ? "text-blue-500" : "text-gray-400"}`} />
                        </Button>
                        <input
                            ref={dateInputRef}
                            type="month"
                            value={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`}
                            className="invisible absolute top-0 left-0"
                            onChange={(e) => {
                                if (e.target.value) {
                                    // Value format is YYYY-MM
                                    const [year, month] = e.target.value.split('-').map(Number);
                                    // Create a date for the 1st of that month
                                    const newDate = new Date(year, month - 1, 1);
                                    setSelectedDate(newDate);
                                }
                            }}
                        />
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleResetFilters}
                        className={`h-10 w-10 rounded-md transition-colors ${isFilterActive ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300" : "bg-white border-gray-300 text-gray-500"
                            }`}
                        title="Reset Filters"
                    >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 11.125C9.41421 11.125 9.75 11.4608 9.75 11.875C9.75 12.2892 9.41421 12.625 9 12.625H6C5.58579 12.625 5.25 12.2892 5.25 11.875C5.25 11.4608 5.58579 11.125 6 11.125H9ZM11.25 6.625C11.6642 6.625 12 6.96079 12 7.375C12 7.78921 11.6642 8.125 11.25 8.125H3.75C3.33579 8.125 3 7.78921 3 7.375C3 6.96079 3.33579 6.625 3.75 6.625H11.25ZM14.25 2.125C14.6642 2.125 15 2.46079 15 2.875C15 3.28921 14.6642 3.625 14.25 3.625H0.75C0.335786 3.625 0 3.28921 0 2.875C0 2.46079 0.335786 2.125 0.75 2.125H14.25Z" fill="#0A0A0A" />
                        </svg>

                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                        className={`h-10 w-10 rounded-md transition-colors ${sortOrder === 'asc' ? "border-blue-500 bg-blue-50 text-blue-600" : "bg-white border-gray-300 text-gray-500"
                            }`}
                        title={`Sort by Total Cases ${sortOrder === 'asc' ? '(Ascending)' : '(Descending)'}`}
                    >
                        <ArrowUpDown className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Custom Table Implementation */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto shadow-sm">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="text-xs text-[#0A0A0A] uppercase bg-[#E5E5E5] font-bold">
                        <tr>
                            <th scope="col" className="px-4 py-3 border border-gray-300 w-16 text-center sticky left-0 z-20 bg-[#E5E5E5]" rowSpan={2}>
                                Sr no.
                            </th>
                            <th scope="col" className="px-4 py-3 border border-gray-300 sticky left-16 z-20 bg-[#E5E5E5] w-60" rowSpan={2}>
                                Offence Type
                            </th>
                            {FORMATION_ORDER.map((formation) => (
                                <th key={formation} scope="col" className="px-4 py-2 border border-gray-300 text-center" colSpan={3}>
                                    {formation}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            {FORMATION_ORDER.map((formation) => (
                                <React.Fragment key={`${formation}-subs`}>
                                    <th className="px-2 py-2 border border-gray-300 text-center w-20 bg-[#F5F5F5] font-semibold text-[10px] leading-tight text-gray-700">Total Cases</th>
                                    <th className="px-2 py-2 border border-gray-300 text-center w-20 bg-[#F5F5F5] font-semibold text-[10px] leading-tight text-gray-700">Action Taken</th>
                                    <th className="px-2 py-2 border border-gray-300 text-center w-20 bg-[#F5F5F5] font-semibold text-[10px] leading-tight text-gray-700">Action Pending</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {filteredData.length > 0 ? (
                            filteredData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50 border-b border-gray-200 text-gray-700">
                                    <td className="px-4 py-3 border-r border-gray-200 text-center font-medium sticky left-0 bg-white z-10 w-16">
                                        {String(index + 1).padStart(2, '0')}
                                    </td>
                                    <td className="px-4 py-3 border-r border-gray-200 font-medium sticky left-16 bg-white z-10 w-60 truncate" title={row.offenceType}>
                                        {row.offenceType}
                                    </td>
                                    {FORMATION_ORDER.map((formation) => {
                                        const data = row[formation] || { total: 0, taken: 0, pending: 0 };
                                        return (
                                            <React.Fragment key={`${index}-${formation}`}>
                                                <td className="px-2 py-3 border-r border-gray-100 text-center font-semibold">
                                                    {String(data.total || 0).padStart(2, '0')}
                                                </td>
                                                <td className="px-2 py-3 border-r border-gray-100 text-center font-medium text-gray-600">
                                                    {String(data.taken || 0).padStart(2, '0')}
                                                </td>
                                                <td className="px-2 py-3 border-r border-gray-200 text-center font-medium text-gray-600">
                                                    {String(data.pending || 0).padStart(2, '0')}
                                                </td>
                                            </React.Fragment>
                                        );
                                    })}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2 + (FORMATION_ORDER.length * 3) + 1} className="px-6 py-12 text-center text-gray-500">
                                    No data available for the selected filters
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
