"use client";

import React, { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
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
    MoreVertical,
    Trash2,
    ArrowUpDown,
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
import ConfirmationModal from "@/components/common/ConfirmationModal";

interface DivisionTableProps {
    formation: {
        groupKey: string;
        subtitle: string;
    };
    onBack: () => void;
}

export default function DivisionTable({
    formation,
    onBack,
}: DivisionTableProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [deleteId, setDeleteId] = React.useState<string | null>(null);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedOffenceType, setSelectedOffenceType] = React.useState("All");
    const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
    const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
    const dateInputRef = React.useRef<HTMLInputElement>(null);

    const currentMonth = selectedDate.getMonth() + 1;
    const currentYear = selectedDate.getFullYear();

    // Fetch data from new API
    // We fetch all and filter client side as per current backend implementation
    const { data: analysisData, isLoading, refetch } = useGetDivisionAnalysis({
        divisionName: formation.groupKey
    });

    const { mutate: deleteEntry, isPending: isDeleting } = useDeleteDivisionAnalysis();

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = () => {
        if (!deleteId) return;
        deleteEntry(deleteId, {
            onSuccess: () => {
                toast.success("Entry deleted");
                setDeleteId(null);
            },
            onError: () => toast.error("Failed to delete entry")
        });
    };

    const handleEditEntry = (row: any) => {
        router.push(`${pathname}/entry?id=${row._id}`);
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

        data.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.totalCase - b.totalCase;
            } else {
                return b.totalCase - a.totalCase;
            }
        });

        // Re-assign IDs for display purposes based on sort order if needed, 
        // but typically IDs should persist. 
        // If "Sr no." is meant to be just a row number, we can map it here.
        // Let's keep original IDs for now as they might track back to something,
        // OR if the user wants row numbers 1,2,3... regardless of sort:
        return data.map((item, index) => ({ ...item, displayId: index + 1 }));
    }, [tableData, searchQuery, selectedOffenceType, sortOrder]);

    const isFilterActive = searchQuery !== "" ||
        selectedOffenceType !== "All" ||
        sortOrder !== "desc" ||
        (selectedDate.getMonth() !== new Date().getMonth() || selectedDate.getFullYear() !== new Date().getFullYear());

    // Split data into General and MT Accident
    const generalOffences = filteredData.filter(d => d.offenceType !== "MT Accident");
    const mtAccidentOffences = filteredData.filter(d => d.offenceType === "MT Accident");

    const generalColumns: Column<any>[] = [
        {
            header: "Sr no.",
            accessorKey: "displayId",
            cell: (item: any) => <span className="text-gray-500 font-medium">{item.displayId}</span>,
            className: "w-16 text-center border-r border-b border-gray-300",
            headerClassName: "w-16 text-center border-r border-b border-gray-300 bg-[#E5E5E5] text-[#0A0A0A] font-bold text-sm normal-case sticky left-0 z-50"
        },
        {
            header: "Offence Type",
            accessorKey: "offenceType",
            className: "font-medium text-[#404040] border-r border-b border-gray-300",
            headerClassName: "border-r border-b border-gray-300 bg-[#E5E5E5] text-[#0A0A0A] font-bold text-sm normal-case"
        },
        {
            header: "Total Case",
            accessorKey: "totalCase",
            cell: (item) => item.totalCase > 0 ? <span className="font-semibold">{String(item.totalCase).padStart(2, '0')}</span> : <span className="text-gray-400">0</span>,
            className: "w-32 border-r border-b border-gray-300",
            headerClassName: "w-32 border-r border-b border-gray-300 bg-[#E5E5E5] text-[#0A0A0A] font-bold text-sm normal-case"
        },
        {
            header: "Action Taken",
            accessorKey: "actionTaken",
            cell: (item) => item.actionTaken > 0 ? <span className="font-semibold">{String(item.actionTaken).padStart(2, '0')}</span> : <span className="text-gray-400">0</span>,
            className: "w-32 border-r border-b border-gray-300",
            headerClassName: "w-32 border-r border-b border-gray-300 bg-[#E5E5E5] text-[#0A0A0A] font-bold text-sm normal-case"
        },
        {
            header: "Action Pending",
            accessorKey: "actionPending",
            cell: (item) => item.actionPending > 0 ? <span className="font-semibold">{String(item.actionPending).padStart(2, '0')}</span> : <span className="text-gray-400">0</span>,
            className: "w-32 border-r border-b border-gray-300",
            headerClassName: "w-32 border-r border-b border-gray-300 bg-[#E5E5E5] text-[#0A0A0A] font-bold text-sm normal-case"
        },
        {
            header: "Remark",
            accessorKey: "remark",
            cell: (item) => item.remark !== "--" ? item.remark : <span className="text-gray-400">--</span>,
            className: "border-r border-b border-gray-300",
            headerClassName: "border-r border-b border-gray-300 bg-[#E5E5E5] text-[#0A0A0A] font-bold text-sm normal-case"
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
                            onClick={() => handleEditEntry(row)}
                        >
                            <Edit className="w-4 h-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="gap-2 cursor-pointer text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteClick(row._id)}
                        >
                            <Trash2 className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            className: "w-14 text-center sticky right-0 z-30 bg-white group-hover:bg-gray-50 border-l border-b border-gray-300",
            headerClassName: "w-14 sticky right-0 z-50 bg-[#E5E5E5] border-l border-b border-gray-300"
        }
    ];

    const mtAccidentColumns: Column<any>[] = [
        {
            header: "Sr no.",
            accessorKey: "displayId",
            cell: (item: any) => <span className="text-gray-500 font-medium">{item.displayId}</span>,
            className: "w-16 text-center border-r border-b border-gray-300",
            headerClassName: "w-16 text-center border-r border-b border-gray-300 bg-[#E5E5E5] text-[#0A0A0A] font-bold text-sm normal-case sticky left-0 z-50"
        },
        {
            header: "Offence Type",
            accessorKey: "offenceType",
            className: "font-medium text-[#404040] border-r border-b border-gray-300",
            headerClassName: "border-r border-b border-gray-300 bg-[#E5E5E5] text-[#0A0A0A] font-bold text-sm normal-case"
        },
        {
            header: "Injured(Civ)",
            accessorKey: "injuredCiv",
            cell: (item) => item.injuredCiv > 0 ? <span className="font-semibold">{String(item.injuredCiv).padStart(2, '0')}</span> : <span className="text-gray-400">--</span>,
            className: "w-28 border-r border-b border-gray-300 bg-red-50/30",
            headerClassName: "w-28 border-r border-b border-gray-300 bg-gray-50 text-[#0A0A0A] font-bold text-sm normal-case"
        },
        {
            header: "Injured(Mil)",
            accessorKey: "injuredMil",
            cell: (item) => item.injuredMil > 0 ? <span className="font-semibold">{String(item.injuredMil).padStart(2, '0')}</span> : <span className="text-gray-400">--</span>,
            className: "w-28 border-r border-b border-gray-300 bg-red-50/30",
            headerClassName: "w-28 border-r border-b border-gray-300 bg-gray-50 text-[#0A0A0A] font-bold text-sm normal-case"
        },
        {
            header: "Died(Civ)",
            accessorKey: "diedCiv",
            cell: (item) => item.diedCiv > 0 ? <span className="font-semibold">{String(item.diedCiv).padStart(2, '0')}</span> : <span className="text-gray-400">--</span>,
            className: "w-24 border-r border-b border-gray-300 bg-red-50/30",
            headerClassName: "w-24 border-r border-b border-gray-300 bg-gray-50 text-[#0A0A0A] font-bold text-sm normal-case"
        },
        {
            header: "Died(Mil)",
            accessorKey: "diedMil",
            cell: (item) => item.diedMil > 0 ? <span className="font-semibold">{String(item.diedMil).padStart(2, '0')}</span> : <span className="text-gray-400">--</span>,
            className: "w-24 border-r border-b border-gray-300 bg-red-50/30",
            headerClassName: "w-24 border-r border-b border-gray-300 bg-gray-50 text-[#0A0A0A] font-bold text-sm normal-case"
        },
        {
            header: "Total Case",
            accessorKey: "totalCase",
            cell: (item) => item.totalCase > 0 ? <span className="font-semibold">{String(item.totalCase).padStart(2, '0')}</span> : <span className="text-gray-400">0</span>,
            className: "w-32 border-r border-b border-gray-300",
            headerClassName: "w-32 border-r border-b border-gray-300 bg-[#E5E5E5] text-[#0A0A0A] font-bold text-sm normal-case"
        },
        {
            header: "Action Taken",
            accessorKey: "actionTaken",
            cell: (item) => item.actionTaken > 0 ? <span className="font-semibold">{String(item.actionTaken).padStart(2, '0')}</span> : <span className="text-gray-400">0</span>,
            className: "w-32 border-r border-b border-gray-300",
            headerClassName: "w-32 border-r border-b border-gray-300 bg-[#E5E5E5] text-[#0A0A0A] font-bold text-sm normal-case"
        },
        {
            header: "Action Pending",
            accessorKey: "actionPending",
            cell: (item) => item.actionPending > 0 ? <span className="font-semibold">{String(item.actionPending).padStart(2, '0')}</span> : <span className="text-gray-400">0</span>,
            className: "w-32 border-r border-b border-gray-300",
            headerClassName: "w-32 border-r border-b border-gray-300 bg-[#E5E5E5] text-[#0A0A0A] font-bold text-sm normal-case"
        },
        {
            header: "Remark",
            accessorKey: "remark",
            cell: (item) => item.remark !== "--" ? item.remark : <span className="text-gray-400">--</span>,
            className: "border-r border-b border-gray-300",
            headerClassName: "border-r border-b border-gray-300 bg-[#E5E5E5] text-[#0A0A0A] font-bold text-sm normal-case"
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
                            onClick={() => handleEditEntry(row)}
                        >
                            <Edit className="w-4 h-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="gap-2 cursor-pointer text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteClick(row._id)}
                        >
                            <Trash2 className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            className: "w-14 text-center sticky right-0 z-30 bg-white group-hover:bg-gray-50 border-l border-b border-gray-300",
            headerClassName: "w-14 sticky right-0 z-50 bg-[#E5E5E5] border-l border-b border-gray-300"
        }
    ];

    const handleResetFilters = () => {
        setSearchQuery("");
        setSelectedOffenceType("All");
        setSortOrder("desc");
        setSelectedDate(new Date());
    };

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
                    <span className="font-bold text-[#0A0A0A]">{formation.groupKey}</span>
                </div>
                <Button
                    className="bg-[#0088FF] text-white font-medium hover:bg-blue-600 gap-2 px-6 cursor-pointer rounded-md"
                    onClick={() => router.push(`${pathname}/entry`)}
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
            <div className="flex justify-between items-center gap-4 mb-6">
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
                            <SelectTrigger className={`h-10 min-w-[200px] max-w-[200px] rounded-md text-gray-700 gap-2 overflow-hidden transition-colors ${selectedOffenceType !== "All" ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-200" : "bg-white border-gray-200"
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
                                : "bg-white border-gray-200"
                                }`}
                        >
                            <span className={(selectedDate.getMonth() !== new Date().getMonth() || selectedDate.getFullYear() !== new Date().getFullYear()) ? "text-blue-700" : "text-gray-500"}>Date:</span>
                            <span>{selectedDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
                            <Calendar className={`w-4 h-4 ml-1 ${(selectedDate.getMonth() !== new Date().getMonth() || selectedDate.getFullYear() !== new Date().getFullYear()) ? "text-blue-500" : "text-gray-400"}`} />
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
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleResetFilters}
                            className={`h-10 w-10 rounded-md transition-colors ${isFilterActive ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300" : "bg-white border-gray-200 text-gray-500"
                                }`}
                            title="Reset Filters"
                        >
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 11.125C9.41421 11.125 9.75 11.4608 9.75 11.875C9.75 12.2892 9.41421 12.625 9 12.625H6C5.58579 12.625 5.25 12.2892 5.25 11.875C5.25 11.4608 5.58579 11.125 6 11.125H9ZM11.25 6.625C11.6642 6.625 12 6.96079 12 7.375C12 7.78921 11.6642 8.125 11.25 8.125H3.75C3.33579 8.125 3 7.78921 3 7.375C3 6.96079 3.33579 6.625 3.75 6.625H11.25ZM14.25 2.125C14.6642 2.125 15 2.46079 15 2.875C15 3.28921 14.6642 3.625 14.25 3.625H0.75C0.335786 3.625 0 3.28921 0 2.875C0 2.46079 0.335786 2.125 0.75 2.125H14.25Z" fill="currentColor" />
                            </svg>
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                            className={`h-10 w-10 rounded-md transition-colors ${sortOrder === 'asc' ? "border-blue-500 bg-blue-50 text-blue-600" : "bg-white border-gray-200 text-gray-500"
                                }`}
                            title={`Sort by Total Cases ${sortOrder === 'asc' ? '(Ascending)' : '(Descending)'}`}
                        >
                            <ArrowUpDown className="w-4 h-4" />
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
                        className="max-h-full border-b-0 rounded-b-none border-gray-300"
                    />
                )}
                {mtAccidentOffences.length > 0 && (
                    <div className={generalOffences.length > 0 ? "-mt-4" : ""}>
                        {/* Negative margin to perform visual merge if needed, or just let them stack */}
                        <DynamicTable
                            data={mtAccidentOffences}
                            columns={mtAccidentColumns}
                            className="max-h-full rounded-t-none border-t-0 border-gray-300"
                        />
                    </div>
                )}
                {generalOffences.length === 0 && mtAccidentOffences.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-white border border-gray-200 rounded-lg">
                        No records found
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Entry"
                message="Are you sure you want to delete this offence entry? This action cannot be undone."
                confirmLabel="Delete"
                variant="danger"
                isProcessing={isDeleting}
            />
        </div>
    );
}
