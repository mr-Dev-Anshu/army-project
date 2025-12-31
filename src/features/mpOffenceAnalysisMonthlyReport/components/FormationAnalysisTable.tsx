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
    Search,
    ArrowUpDown,
    Calendar,
    ChevronRight,
    LineChart,
    Filter,
    MoreVertical,
    Printer,
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
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedOffenceType, setSelectedOffenceType] = React.useState("All");
    const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
    const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
    const dateInputRef = React.useRef<HTMLInputElement>(null);

    const currentMonth = selectedDate.getMonth() + 1;
    const currentYear = selectedDate.getFullYear();

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

    // Extract unique offence types BEFORE filtering to keep dropdown consistent
    const uniqueOffenceTypes = useMemo(() => {
        return Array.from(new Set(tableData.map(d => d.offenceType)));
    }, [tableData]);

    const filteredTableData = useMemo(() => {
        let data = [...tableData];

        if (searchQuery) {
            data = data.filter(item =>
                item.offenceType.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedOffenceType !== "All") {
            data = data.filter(item => item.offenceType === selectedOffenceType);
        }

        data.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.totalCase - b.totalCase;
            } else {
                return b.totalCase - a.totalCase;
            }
        });

        // Re-assign IDs after sorting/filtering? Usually IDs should persist or be re-indexed.
        // Keeping original IDs relative to the fetch is better for traceability, but for display "Sr no." usually implies row number.
        // Let's re-index for display purposes if that's the desired behavior, OR keep original ID.
        // Assuming "Sr no" is just row index.
        return data.map((item, index) => ({ ...item, displayId: index + 1 }));
    }, [tableData, searchQuery, selectedOffenceType, sortOrder]);



    const isFilterActive = searchQuery !== "" ||
        selectedOffenceType !== "All" ||
        selectedDate.getMonth() !== new Date().getMonth() ||
        selectedDate.getFullYear() !== new Date().getFullYear();

    const handleResetFilters = () => {
        setSearchQuery("");
        setSelectedOffenceType("All");
        setSortOrder("desc");
        setSelectedDate(new Date());
    };

    return (
        <div className="space-y-6 min-h-screen ">
            {/* Header / Breadcrumbs */}
            <div className="flex items-center text-sm text-gray-500 mb-6 w-full border-b border-gray-300 pb-4">
                <LineChart className="w-5 h-5 text-gray-500 mr-3" />
                <div className="h-4 w-px bg-gray-300 mr-3"></div>
                <span className="text-gray-500">Reports & Analysis</span>
                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                <span
                    className="hover:text-gray-700 cursor-pointer transition-colors"
                    onClick={onBack}
                >
                    MP Offence Analysis Monthly Report
                </span>
                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                <span className="font-semibold text-gray-900">{formation.groupKey}</span>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-gray-900">
                        {formation.groupKey}
                    </h1>
                    <div className="h-5 w-px bg-gray-400"></div>
                    <span className="text-gray-600">
                        {formation.subtitle}
                    </span>
                </div>
                <Button className="bg-black text-white hover:bg-gray-800 gap-2 px-6">
                    Download & Print Report
                    <Printer className="w-4 h-4" />
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
                                    <span className={selectedOffenceType !== "All" ? "text-blue-700" : "text-gray-500"}>Offence Type:</span>
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
                        <Filter className="w-4 h-4" />
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

            {/* Table Container with scroll */}
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm flex flex-col">
                <div className="overflow-auto max-h-[460px] relative no-scrollbar">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-[#F9FAFB] text-gray-900 font-semibold border-b border-gray-300 sticky top-0 z-40">
                            <tr>
                                <th className="py-3 px-4 w-18 border-r border-gray-300 sticky left-0 z-50 bg-[#F9FAFB]">Sr no.</th>
                                <th className="py-3 px-4 border-r border-gray-300 whitespace-nowrap min-w-[200px]">Offence Type</th>
                                <th className="py-3 px-4 border-r border-gray-300 whitespace-nowrap min-w-[120px]">Total Case</th>
                                <th className="py-3 px-4 border-r border-gray-300 whitespace-nowrap min-w-[130px]">Action Taken</th>
                                <th className="py-3 px-4 border-r border-gray-300 whitespace-nowrap min-w-[140px]">Action Pending</th>
                                <th className="py-3 px-4 border-r border-gray-300 min-w-[200px]">Remark</th>
                                <th className="py-3 px-4 w-14 sticky right-0 z-50 bg-[#F9FAFB] border-l border-gray-300"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                            <p className="text-sm text-gray-500">Loading data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredTableData.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-gray-500">
                                        No records found
                                    </td>
                                </tr>
                            ) : (
                                filteredTableData.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50 group">
                                        <td className="py-3 px-4 text-center text-gray-500 border-r border-gray-300 sticky left-0 z-30 bg-white group-hover:bg-gray-50">{row.displayId}</td>

                                        <td className="py-3 px-4 font-medium text-gray-900 border-r border-gray-300">{row.offenceType}</td>
                                        <td className="py-3 px-4 border-r border-gray-300">
                                            {row.totalCase > 0 ? (
                                                <span className="font-semibold">{String(row.totalCase).padStart(2, '0')}</span>
                                            ) : (
                                                <span className="text-gray-400">--</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 border-r border-gray-300">
                                            {row.actionTaken > 0 ? (
                                                <span className="font-semibold">{String(row.actionTaken).padStart(2, '0')}</span>
                                            ) : (
                                                <span className="text-gray-400">--</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 border-r border-gray-300">
                                            {row.actionPending > 0 ? (
                                                <span className="font-semibold">{String(row.actionPending).padStart(2, '0')}</span>
                                            ) : (
                                                <span className="text-gray-400">--</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 border-r border-gray-300">
                                            {row.remark !== "--" ? row.remark : <span className="text-gray-400">--</span>}
                                        </td>
                                        <td className="py-3 px-4 text-center sticky right-0 z-30 bg-white group-hover:bg-gray-50 border-l border-gray-300 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="w-4 h-4 text-gray-400" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
