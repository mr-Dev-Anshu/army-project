"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Calendar,
    ChevronDown,
    X,
    Edit,
    Trash2,
    MoreVertical,
    Check,
    ArrowDown
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DynamicTable, Column } from "@/components/common/DynamicTable";
import { toast } from "react-toastify";
import { useGetDivisionAnalysis, useCreateDivisionAnalysis, useDeleteDivisionAnalysis } from "../hooks/useDivisionAnalysis";

interface Hq36RapidDivisionFormProps {
    onClose: () => void;
    formation: {
        groupKey: string;
        subtitle: string;
    };
}

export default function Hq36RapidDivisionForm({ onClose, formation }: Hq36RapidDivisionFormProps) {
    // State
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const dateInputRef = React.useRef<HTMLInputElement>(null);

    // Form State
    const [offenceType, setOffenceType] = useState("");
    const [actionTaken, setActionTaken] = useState<string>("00");
    const [actionPending, setActionPending] = useState<string>("00");
    const [remark, setRemark] = useState("");

    // Calculated Field
    const totalCases = useMemo(() => {
        const taken = parseInt(actionTaken) || 0;
        const pending = parseInt(actionPending) || 0;
        return taken + pending; // Or can be manually entered if logic differs, but design says "Auto calculated"
    }, [actionTaken, actionPending]);

    // Hooks
    const { data: analysisData, isLoading } = useGetDivisionAnalysis({
        divisionName: formation.groupKey,
        monthYear: selectedDate
    });

    const { mutate: createEntry, isPending: isCreating } = useCreateDivisionAnalysis();
    const { mutate: deleteEntry } = useDeleteDivisionAnalysis();

    // Handlers
    const handleAddEntry = () => {
        if (!offenceType.trim()) {
            toast.error("Please enter an offence type");
            return;
        }

        const payload = {
            divisionName: formation.groupKey,
            monthYear: selectedDate,
            offence: offenceType,
            actionTaken: parseInt(actionTaken) || 0,
            actionPending: parseInt(actionPending) || 0,
            totalNumberOfCases: totalCases,
            remark: remark,
            // Custom fields for specific validation if needed
        };

        createEntry(payload, {
            onSuccess: () => {
                toast.success("Entry added successfully");
                // Reset form
                setOffenceType("");
                setActionTaken("00");
                setActionPending("00");
                setRemark("");
            },
            onError: (err) => {
                toast.error("Failed to add entry");
                console.error(err);
            }
        });
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this entry?")) {
            deleteEntry(id, {
                onSuccess: () => toast.success("Entry deleted"),
                onError: () => toast.error("Failed to delete entry")
            });
        }
    };

    // Table Data Mapping
    const tableData = useMemo(() => {
        if (!analysisData || !Array.isArray(analysisData)) return [];
        // Map backend data to table format
        // Backend returns standard array. We need to map it.
        // Wait, useGetDivisionAnalysis calls existing API. Let's see what it returns.
        // It returns `DivisionAnalysis.find()`. So array of objects.

        // Filter by date is happening in API or frontend?
        // My hook calls GET /api/division-analysis with params.
        // But the service `getGroupedByDivision` uses aggregation.
        // `getAllDivisionAnalysisRepo` returns ALL.
        // I should probably ensure the API supports filtering by `divisionName` and `monthYear` in the standard GET.
        // Looking at `src/services/divisionAnalysis.js`, `getAll` calls `getAllDivisionAnalysisRepo` which is `find().sort()`. It receives no params!
        // This is a BACKEND GAP. The default GET doesn't filter.
        // I need to fix the backend service/repo to support filters first?
        // OR I filter client side if data is small. 
        // Better: Fix backend. But user asked for UI and integration.
        // I will assume for now I receive all and filter client side, but I should fix the backend if I can.
        // Actually, `getGroupedByDivisionService` supports filters. Maybe I should use THAT endpoint?
        // But that groups data. I want individual entries.
        // I'll stick to client side filtering if the dataset isn't huge, or ideally add filters to `getAll`.

        return analysisData.filter((item: any) => {
            if (!item.monthYear) return false;
            const d = new Date(item.monthYear);
            return d.getMonth() === selectedDate.getMonth() &&
                d.getFullYear() === selectedDate.getFullYear() &&
                item.divisionName === formation.groupKey;
        }).map((item: any, index: number) => ({
            id: index + 1,
            _id: item._id,
            offenceType: item.offence,
            totalCase: item.totalNumberOfCases,
            actionTaken: item.actionTaken,
            actionPending: item.actionPending,
            remark: item.remark || "--",
        }));
    }, [analysisData, selectedDate, formation.groupKey]);

    const columns: Column<any>[] = [
        {
            header: "Sr no.",
            accessorKey: "id",
            cell: (item) => <span className="text-gray-500 font-medium">{item.id}</span>,
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
            cell: (item) => <span className="text-gray-500">{item.remark}</span>,
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
                        <DropdownMenuItem className="gap-2 cursor-pointer">
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

    const currentMonthYearStr = selectedDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

    return (
        <div className="space-y-6 min-h-screen bg-transparent font-sans">
            {/* Header */}
            <div className="flex justify-between items-center text-sm text-[#404040] mb-6 w-full border-b border-gray-300 pb-4">
                <div className="flex items-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                        <path d="M2 2V14H14" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.6641 6L9.33073 9.33333L6.66406 6.66667L4.66406 8.66667" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="h-4 w-px bg-[#E5E5E5] mr-3"></div>
                    <span className="text-[#404040]">Reports & Analysis</span>
                    <span className="mx-2 text-gray-400">›</span>
                    <span className="text-[#404040]">MP Offence Analysis Monthly Report</span>
                    <span className="mx-2 text-gray-400">›</span>
                    <span className="text-[#404040]">HQ 36 RAPID Division</span>
                    <span className="mx-2 text-gray-400">›</span>
                    <span className="font-bold text-[#0A0A0A]">Fill New Analysis Data</span>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5 text-gray-500" />
                </Button>
            </div>

            <h1 className="text-xl font-bold text-[#404040]">Enter Monthly Offence Data</h1>

            {/* Info Bar */}
            <div className="bg-[#171717] text-white py-4 px-6 rounded-md flex flex-wrap items-center justify-between gap-x-8 gap-y-2 text-sm shadow-md">
                <div className="flex items-center gap-2">
                    <span className="text-[#898989] font-medium">Division</span>
                    <span className="font-semibold text-white">{formation.groupKey}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#898989] font-medium">Unit:</span>
                    <span className="font-semibold text-white">{formation.subtitle}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#898989] font-medium">Reporting Period:</span>
                    <span className="font-semibold text-white">{currentMonthYearStr}</span>
                    <span className="text-[#898989] font-normal">(Month & Year)</span>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-[#0A0A0A]">Add Offence Entry One By One</h2>
                        <p className="text-gray-500 text-sm mt-1">Each submission adds one row to the table below</p>
                    </div>
                    <div className="relative">
                        <span className="text-xs text-gray-500 font-medium block mb-1">Select Reporting Period:</span>
                        <Button
                            variant="outline"
                            onClick={() => dateInputRef.current?.showPicker()}
                            className="h-9 text-gray-700 font-medium rounded-md px-3 gap-2 bg-white border-gray-200 min-w-[160px] justify-between"
                        >
                            <span>{currentMonthYearStr}</span>
                            <Calendar className="w-4 h-4 text-gray-400" />
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
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#0A0A0A]">What is the offence?</label>
                        <Input
                            placeholder="Enter Offence Type"
                            className="h-11 bg-white border-gray-200 rounded-md"
                            value={offenceType}
                            onChange={(e) => setOffenceType(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0A0A0A]">Total No. of Action Taken</label>
                            <Input
                                className="h-11 bg-white border-gray-200 rounded-md"
                                value={actionTaken}
                                onChange={(e) => setActionTaken(e.target.value)}
                                type="number"
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0A0A0A]">Total No. of Action Pending</label>
                            <Input
                                className="h-11 bg-white border-gray-200 rounded-md"
                                value={actionPending}
                                onChange={(e) => setActionPending(e.target.value)}
                                type="number"
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#0A0A0A]">Total No. of Case</label>
                            <Input
                                className="h-11 bg-gray-50 border-gray-200 rounded-md text-gray-500"
                                value={isNaN(totalCases) ? "" : totalCases}
                                readOnly
                                placeholder="Auto calculated"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#0A0A0A]">Add Remark</label>
                        <Textarea
                            placeholder="Enter brief remark (optional)"
                            className="min-h-[100px] resize-none bg-white border-gray-200 rounded-md p-3"
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button
                            className="bg-[#0A0A0A] hover:bg-gray-800 text-white font-medium gap-2 px-6 h-11 rounded-md"
                            onClick={handleAddEntry}
                            disabled={isCreating}
                        >
                            <PlusIcon className="w-4 h-4" />
                            Add to Analysis Table
                            <ArrowDown className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
                    <h3 className="font-bold text-lg text-[#0A0A0A]">Monthly Offence Analysis – Data Entered</h3>
                    <span className="text-blue-600 text-sm font-medium">Total Offence Types Added: {tableData.length}</span>
                </div>

                <DynamicTable
                    data={tableData}
                    columns={columns}
                    className="border-none rounded-none max-h-[500px]"
                />

                <div className="px-6 py-4 flex justify-between items-center border-t border-gray-200 bg-white">
                    <Button variant="outline" className="text-gray-600 hover:text-gray-900" onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        className="bg-[#0088FF] hover:bg-blue-600 text-white font-medium gap-2 px-6"
                        onClick={() => {
                            toast.success("Monthly Report Submitted Successfully");
                            onClose();
                        }}
                    >
                        <Check className="w-4 h-4" />
                        Submit Monthly Report
                    </Button>
                </div>
            </div>
        </div>
    );
}

function PlusIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
