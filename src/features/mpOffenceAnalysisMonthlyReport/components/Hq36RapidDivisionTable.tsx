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
    Calendar,
    Printer,
    Edit,
    Plus,
    MoreVertical,
    Trash2,
} from "lucide-react";
import { useGetDivisionAnalysis, useDeleteDivisionAnalysis } from "../hooks/useDivisionAnalysis";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import { DynamicTable, Column } from "@/components/common/DynamicTable";

import Hq36RapidDivisionForm from "./Hq36RapidDivisionForm";

interface Hq36RapidDivisionTableProps {
    formation: {
        groupKey: string;
        subtitle: string;
    };
    onBack: () => void;
}

export default function Hq36RapidDivisionTable({
    formation,
    onBack,
}: Hq36RapidDivisionTableProps) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editingEntry, setEditingEntry] = React.useState<any>(null);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedOffenceType, setSelectedOffenceType] = React.useState("All");
    const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
    const dateInputRef = React.useRef<HTMLInputElement>(null);

    const currentMonth = selectedDate.getMonth() + 1;
    const currentYear = selectedDate.getFullYear();

    // Fetch data from new API
    // We fetch all and filter client side as per current backend implementation
    const { data: analysisData, isLoading, refetch } = useGetDivisionAnalysis({
        divisionName: formation.groupKey
    });

    const { mutate: deleteEntry } = useDeleteDivisionAnalysis();

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this entry?")) {
            deleteEntry(id, {
                onSuccess: () => toast.success("Entry deleted"),
                onError: () => toast.error("Failed to delete entry")
            });
        }
    };

    // Mock data for specific MT Accident fields
    const getMockAccidentData = (offenceType: string) => {
        if (offenceType === "MT Accident") {
            return {
                injuredCiv: 1,
                injuredMil: 1,
                diedCiv: 0,
                diedMil: 0,
            };
        }
        return {
            injuredCiv: 0,
            injuredMil: 0,
            diedCiv: 0,
            diedMil: 0,
        };
    };

    const tableData = useMemo(() => {
        if (!analysisData || !Array.isArray(analysisData)) return [];

        // Filter by date and formation
        const filtered = analysisData.filter((item: any) => {
            if (!item.monthYear) return false;
            const d = new Date(item.monthYear);
            return d.getMonth() === selectedDate.getMonth() &&
                d.getFullYear() === selectedDate.getFullYear() &&
                item.divisionName === formation.groupKey;
        });

        return filtered.map((item: any, index: number) => {
            const accidentData = getMockAccidentData(item.offence || "Unknown");

            return {
                id: index + 1,
                _id: item._id, // Keep _id for deletion
                monthYear: item.monthYear, // Needed for edit
                offenceType: item.offence || "Unknown",
                totalCase: item.totalNumberOfCases || 0,
                actionTaken: item.actionTaken || 0,
                actionPending: item.actionPending || 0,
                remark: item.remark || "--",
                ...accidentData
            };
        });
    }, [analysisData, selectedDate, formation.groupKey]);

    const uniqueOffenceTypes = useMemo(() => {
        return Array.from(new Set(tableData.map(d => d.offenceType)));
    }, [tableData]);

    const filteredData = useMemo(() => {
        let data = [...tableData];

        if (searchQuery) {
            data = data.filter(item =>
                item.offenceType.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedOffenceType !== "All") {
            data = data.filter(item => item.offenceType === selectedOffenceType);
        }

        return data;
    }, [tableData, searchQuery, selectedOffenceType]);

    // Split data into General and MT Accident
    const generalOffences = filteredData.filter(d => d.offenceType !== "MT Accident");
    const mtAccidentOffences = filteredData.filter(d => d.offenceType === "MT Accident");

    const generalColumns: Column<typeof tableData[0]>[] = [
        {
            header: "Sr no.",
            accessorKey: "id",
            cell: (item) => <span className="text-gray-500">{item.id}</span>,
            className: "w-16 text-center border-r border-gray-100",
            headerClassName: "w-16 text-center border-r border-gray-200"
        },
        {
            header: "Offence Type",
            accessorKey: "offenceType",
            className: "font-medium text-gray-900 border-r border-gray-100",
            headerClassName: "border-r border-gray-200"
        },
        {
            header: "Total Case",
            accessorKey: "totalCase",
            cell: (item) => item.totalCase > 0 ? String(item.totalCase).padStart(2, '0') : "--",
            className: "w-32 border-r border-gray-100",
            headerClassName: "w-32 border-r border-gray-200"
        },
        {
            header: "Action Taken",
            accessorKey: "actionTaken",
            cell: (item) => item.actionTaken > 0 ? String(item.actionTaken).padStart(2, '0') : "--",
            className: "w-32 border-r border-gray-100",
            headerClassName: "w-32 border-r border-gray-200"
        },
        {
            header: "Action Pending",
            accessorKey: "actionPending",
            cell: (item) => item.actionPending > 0 ? String(item.actionPending).padStart(2, '0') : "--",
            className: "w-32 border-r border-gray-100",
            headerClassName: "w-32 border-r border-gray-200"
        },
        {
            header: "Remark",
            accessorKey: "remark",
            cell: (item) => item.remark,
            className: "border-r border-gray-100",
            headerClassName: "border-r border-gray-200"
        },
        {
            header: "",
            cell: (row) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() => {
                                setEditingEntry(row);
                                setIsEditing(true);
                            }}
                        >
                            <Edit className="w-4 h-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="gap-2 cursor-pointer text-red-600 focus:text-red-600"
                            onClick={() => handleDelete(row._id)}
                        >
                            <Trash2 className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            className: "w-14 text-center sticky right-0 z-30 bg-gray-50/50 group-hover:bg-gray-100/50 backdrop-blur-sm",
            headerClassName: "w-14 sticky right-0 z-50 bg-[#F9FAFB]"
        }
    ];

    const mtAccidentColumns: Column<typeof tableData[0]>[] = [
        {
            header: "Sr no.",
            accessorKey: "id",
            cell: (item) => <span className="text-gray-500">{item.id}</span>,
            className: "w-16 text-center border-r border-gray-100",
            headerClassName: "w-16 text-center border-r border-gray-200"
        },
        {
            header: "Offence Type",
            accessorKey: "offenceType",
            className: "font-medium text-gray-900 border-r border-gray-100",
            headerClassName: "border-r border-gray-200"
        },
        {
            header: "Injured(Civ)",
            accessorKey: "injuredCiv",
            cell: (item) => item.injuredCiv > 0 ? String(item.injuredCiv).padStart(2, '0') : "--",
            className: "w-28 border-r border-gray-100 bg-red-50/30",
            headerClassName: "w-28 border-r border-gray-200 bg-gray-50"
        },
        {
            header: "Injured(Mil)",
            accessorKey: "injuredMil",
            cell: (item) => item.injuredMil > 0 ? String(item.injuredMil).padStart(2, '0') : "--",
            className: "w-28 border-r border-gray-100 bg-red-50/30",
            headerClassName: "w-28 border-r border-gray-200 bg-gray-50"
        },
        {
            header: "Died(Civ)",
            accessorKey: "diedCiv",
            cell: (item) => item.diedCiv > 0 ? String(item.diedCiv).padStart(2, '0') : "--",
            className: "w-24 border-r border-gray-100 bg-red-50/30",
            headerClassName: "w-24 border-r border-gray-200 bg-gray-50"
        },
        {
            header: "Died(Mil)",
            accessorKey: "diedMil",
            cell: (item) => item.diedMil > 0 ? String(item.diedMil).padStart(2, '0') : "--",
            className: "w-24 border-r border-gray-100 bg-red-50/30",
            headerClassName: "w-24 border-r border-gray-200 bg-gray-50"
        },
        {
            header: "Total Case",
            accessorKey: "totalCase",
            cell: (item) => item.totalCase > 0 ? String(item.totalCase).padStart(2, '0') : "--",
            className: "w-32 border-r border-gray-100",
            headerClassName: "w-32 border-r border-gray-200"
        },
        {
            header: "Action Taken",
            accessorKey: "actionTaken",
            cell: (item) => item.actionTaken > 0 ? String(item.actionTaken).padStart(2, '0') : "--",
            className: "w-32 border-r border-gray-100",
            headerClassName: "w-32 border-r border-gray-200"
        },
        {
            header: "Action Pending",
            accessorKey: "actionPending",
            cell: (item) => item.actionPending > 0 ? String(item.actionPending).padStart(2, '0') : "--",
            className: "w-32 border-r border-gray-100",
            headerClassName: "w-32 border-r border-gray-200"
        },
        {
            header: "Remark",
            accessorKey: "remark",
            cell: (item) => item.remark,
            className: "border-r border-gray-100",
            headerClassName: "border-r border-gray-200"
        },
        {
            header: "",
            cell: (row) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() => {
                                setEditingEntry(row);
                                setIsEditing(true);
                            }}
                        >
                            <Edit className="w-4 h-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="gap-2 cursor-pointer text-red-600 focus:text-red-600"
                            onClick={() => handleDelete(row._id)}
                        >
                            <Trash2 className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            className: "w-14 text-center sticky right-0 z-30 bg-gray-50/50 group-hover:bg-gray-100/50 backdrop-blur-sm",
            headerClassName: "w-14 sticky right-0 z-50 bg-[#F9FAFB]"
        }
    ];

    const handleResetFilters = () => {
        setSearchQuery("");
        setSelectedOffenceType("All");
        setSelectedDate(new Date());
    };

    if (isEditing) {
        return (
            <Hq36RapidDivisionForm
                formation={formation}
                onClose={() => {
                    setIsEditing(false);
                    setEditingEntry(null);
                }}
                initialData={editingEntry}
            />
        );
    }

    return (
        <div className="space-y-6 min-h-screen">
            {/* Header / Breadcrumbs */}
            <div className="flex justify-between items-center text-sm text-[#404040] mb-6 w-full border-b border-gray-300 pb-4">
                <div className="flex items-center">
                    {/* Icon if needed */}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                        <path d="M2 2V14H14" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.6641 6L9.33073 9.33333L6.66406 6.66667L4.66406 8.66667" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="h-4 w-px bg-[#E5E5E5] mr-3"></div>
                    <span className="text-[#404040]">Reports & Analysis</span>
                    <span className="mx-2 text-gray-400">›</span>
                    <span
                        className="hover:text-gray-700 cursor-pointer transition-colors"
                        onClick={onBack}
                    >
                        MP Offence Analysis Monthly Report
                    </span>
                    <span className="mx-2 text-gray-400">›</span>
                    <span className="font-bold text-[#0A0A0A]">HQ 36 RAPID Division</span>
                </div>
                <Button
                    className="bg-[#0088FF] text-white font-medium hover:bg-blue-600 gap-2 px-6 cursor-pointer rounded-md"
                    onClick={() => setIsEditing(true)}
                >
                    Fill New Analysis Data
                    <Edit className="w-4 h-4 ml-1" />
                </Button>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-[#0A0A0A]">
                        {formation.groupKey}
                    </h1>
                    <div className="h-5 w-px bg-[#404040]"></div>
                    <span className="text-[#737373] text-base font-normal">
                        {formation.subtitle}
                    </span>
                </div>
                <Button className="bg-black text-white font-medium hover:bg-gray-800 gap-2 px-6 cursor-pointer rounded-md">
                    Download & Print Report
                    <Printer className="w-4 h-4 ml-1" />
                </Button>
            </div>

            {/* Filters Bar */}
            <div className="flex justify-between items-center gap-4 mb-2">
                <div className="relative w-80" title="Search by offence type">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${searchQuery ? "text-blue-500" : "text-gray-400"}`} />
                    <Input
                        placeholder="Search by offence type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`pl-9 h-10 rounded-md transition-colors ${searchQuery ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-200" : "bg-white border-gray-200"
                            }`}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center" title="Filter by Offence Type">
                        <Select value={selectedOffenceType} onValueChange={setSelectedOffenceType}>
                            <SelectTrigger className={`h-10 min-w-[200px] max-w-[200px] rounded-md text-gray-700 gap-2 bg-white border-gray-200`}>
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

                    <div className="relative" title="Filter by Month & Year">
                        <Button
                            variant="outline"
                            onClick={() => dateInputRef.current?.showPicker()}
                            className={`h-10 text-gray-700 font-normal rounded-md px-3 gap-2 bg-white border-gray-200`}
                        >
                            <span className="text-gray-500">Date:</span>
                            <span>{selectedDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
                            <Calendar className="w-4 h-4 ml-1 text-gray-400" />
                        </Button>
                        <input
                            ref={dateInputRef}
                            type="month"
                            value={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`}
                            className="invisible absolute top-0 left-0"
                            onChange={(e) => {
                                if (e.target.value) {
                                    const [year, month] = e.target.value.split('-').map(Number);
                                    const newDate = new Date(year, month - 1, 1);
                                    setSelectedDate(newDate);
                                }
                            }}
                        />
                    </div>
                    <div className="flex space-x-1">
                        <Button variant="outline" size="icon" className="h-10 w-10 border-gray-200 bg-white">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 4H14M4 8H12M6 12H10" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Button>
                        <Button variant="outline" size="icon" className="h-10 w-10 border-gray-200 bg-white">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 8L8 4M8 4L12 8M8 4V14" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tables */}
            <div className="space-y-4">
                {generalOffences.length > 0 && (
                    <DynamicTable
                        data={generalOffences}
                        columns={generalColumns}
                        className="max-h-full border-b-0 rounded-b-none"
                    />
                )}
                {mtAccidentOffences.length > 0 && (
                    <div className={generalOffences.length > 0 ? "-mt-4" : ""}>
                        {/* Negative margin to perform visual merge if needed, or just let them stack */}
                        <DynamicTable
                            data={mtAccidentOffences}
                            columns={mtAccidentColumns}
                            className="max-h-full rounded-t-none border-t-0"
                        />
                    </div>
                )}
                {generalOffences.length === 0 && mtAccidentOffences.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-white border border-gray-200 rounded-lg">
                        No records found
                    </div>
                )}
            </div>

        </div>
    );
}
