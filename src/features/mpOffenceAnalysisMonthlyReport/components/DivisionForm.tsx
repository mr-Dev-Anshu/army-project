"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
    ArrowDown,
    Save
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DynamicTable, Column } from "@/components/common/DynamicTable";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { toast } from "react-toastify";
import { useGetDivisionAnalysis, useCreateDivisionAnalysis, useDeleteDivisionAnalysis, useUpdateDivisionAnalysis } from "../hooks/useDivisionAnalysis";

interface DivisionFormProps {
    onClose: () => void;
    formation: {
        groupKey: string;
        subtitle: string;
    };
    initialData?: {
        _id: string;
        offence?: string; // Correct field from DB
        offenceType?: string; // Legacy/frontend prop name
        actionTaken: number;
        actionPending: number;
        remark: string;
        monthYear: Date | string;
    } | null;
}

export default function DivisionForm({ onClose, formation, initialData }: DivisionFormProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // State
    const [selectedDate, setSelectedDate] = useState<Date>(initialData?.monthYear ? new Date(initialData.monthYear) : new Date());
    const dateInputRef = React.useRef<HTMLInputElement>(null);

    // Form State
    const [offenceType, setOffenceType] = useState(initialData?.offence || initialData?.offenceType || "");
    const [actionTaken, setActionTaken] = useState<string>(initialData?.actionTaken?.toString() || "00");
    const [actionPending, setActionPending] = useState<string>(initialData?.actionPending?.toString() || "00");
    const [remark, setRemark] = useState(initialData?.remark || "");
    const [sessionAddedIds, setSessionAddedIds] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(initialData?._id || null);

    // Date Change Confirmation State
    const [isDateConfirmOpen, setIsDateConfirmOpen] = useState(false);
    const [pendingDate, setPendingDate] = useState<Date | null>(null);

    const handleConfirmDateChange = () => {
        if (pendingDate) {
            setSelectedDate(pendingDate);
            setPendingDate(null);
            setIsDateConfirmOpen(false);
        }
    };

    // Calculate sum for total cases
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
    const { mutate: updateEntry, isPending: isUpdating } = useUpdateDivisionAnalysis();
    const { mutate: deleteEntry, isPending: isDeleting } = useDeleteDivisionAnalysis();

    // Sync state with initialData changes (e.g. when data loads)
    useEffect(() => {
        if (initialData) {
            setOffenceType(initialData.offence || initialData.offenceType || "");
            setActionTaken(initialData.actionTaken?.toString() || "00");
            setActionPending(initialData.actionPending?.toString() || "00");
            setRemark(initialData.remark || "");
            setEditingId(initialData._id);
            if (initialData.monthYear) {
                setSelectedDate(new Date(initialData.monthYear));
            }
        } else {
            // Optional: Reset if initialData becomes null? 
            // Usually we don't want to wipe if user is typing, but if ID param is removed, we might.
            // For now, let's strictly sync if initialData is present.
        }
    }, [initialData]);

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
        };

        if (editingId) {
            updateEntry({ id: editingId, data: payload }, {
                onSuccess: () => {
                    toast.success("Entry updated successfully");
                    if (initialData) {
                        // If we are in "Edit Mode" (initialData present), closing is expected
                        onClose();
                    } else {
                        // If we are in "Add Mode" but editing a drafted item
                        setEditingId(null);
                        setOffenceType("");
                        setActionTaken("00");
                        setActionPending("00");
                        setRemark("");

                        // Clear URL param if exists
                        const params = new URLSearchParams(searchParams.toString());
                        if (params.has("id")) {
                            params.delete("id");
                            router.replace(`${pathname}?${params.toString()}`);
                        }
                    }
                },
                onError: (err) => {
                    toast.error("Failed to update entry");
                    console.error(err);
                }
            });
        } else {
            createEntry(payload, {
                onSuccess: (data: any) => {
                    toast.success("Entry added successfully");
                    // Reset form
                    setOffenceType("");
                    setActionTaken("00");
                    setActionPending("00");
                    setRemark("");
                    if (data && data._id) {
                        setSessionAddedIds(prev => [...prev, data._id]);
                    }
                },
                onError: (err) => {
                    toast.error("Failed to add entry");
                    console.error(err);
                }
            });
        }
    };

    // Use URL for editing logic
    const handleEditRow = (row: any) => {
        // Update URL to reflect editing state, this will trigger the parent to pass new initialData
        const params = new URLSearchParams(searchParams.toString());
        params.set("id", row._id);
        router.replace(`${pathname}?${params.toString()}`);
        // Visual feedback immediate update (optional as useEffect will handle it)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Update onClose to handle clearing edit mode if we are editing
    const handleCancelEdit = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (params.has("id")) {
            params.delete("id");
            router.replace(`${pathname}?${params.toString()}`);
        }

        // Always reset local state
        setEditingId(null);
        setOffenceType("");
        setActionTaken("00");
        setActionPending("00");
        setRemark("");
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = () => {
        if (!deleteId) return;
        deleteEntry(deleteId, {
            onSuccess: () => {
                toast.success("Entry deleted");
                setSessionAddedIds(prev => prev.filter(sid => sid !== deleteId));
                setDeleteId(null);
                if (editingId === deleteId) {
                    setEditingId(null);
                    setOffenceType("");
                    setActionTaken("00");
                    setActionPending("00");
                    setRemark("");
                }
            },
            onError: () => toast.error("Failed to delete entry")
        });
    };

    // Table Data Mapping
    const tableData = useMemo(() => {
        if (!analysisData || !Array.isArray(analysisData)) return [];


        return analysisData.filter((item: any) => {
            if (!item.monthYear) return false;
            // Only show items added in this session
            if (!sessionAddedIds.includes(item._id)) return false;

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
    }, [analysisData, selectedDate, formation.groupKey, sessionAddedIds]);

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
                        <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() => handleEditRow(row)}
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
                    <span
                        className="text-[#404040] hover:text-gray-700 cursor-pointer transition-colors"
                        onClick={onClose}
                    >
                        MP Offence Analysis Monthly Report
                    </span>
                    <span className="mx-2 text-gray-400">›</span>
                    <span
                        className="text-[#404040] hover:text-gray-700 cursor-pointer transition-colors"
                        onClick={onClose}
                    >
                        {formation.groupKey}
                    </span>
                    <span className="mx-2 text-gray-400">›</span>
                    <span className="font-bold text-[#0A0A0A]">Fill New Analysis Data</span>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className=" bg-white rounded-lg shadow-xl cursor-pointer">
                    <X className="w-5 h-5 text-gray-500" />
                </Button>
            </div>

            <h1 className="text-xl font-bold text-[#404040]">
                {initialData ? "Edit Monthly Offence Data" : "Enter Monthly Offence Data"}
            </h1>

            {/* Info Bar */}
            <div className="bg-[#171717] text-white py-4 px-6 rounded-md flex flex-wrap items-center justify-between gap-x-8 gap-y-2 text-sm shadow-md">
                <div className="flex items-center gap-2">
                    <span className="text-[#E5E5E5] font-normal">Division</span>
                    <span className="font-semibold text-white">{formation.groupKey}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#E5E5E5] font-normal">Unit:</span>
                    <span className="font-semibold text-white">{formation.subtitle}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#E5E5E5] font-normal">Reporting Period:</span>
                    <span className="font-semibold text-white">{currentMonthYearStr}</span>
                    <span className="text-[#E5E5E5] font-normal">(Month & Year)</span>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-[#0A0A0A]">
                            {(initialData || editingId) ? "Edit Offence Entry" : "Add Offence Entry One By One"}
                        </h2>
                        {(!initialData && !editingId) && (
                            <p className="text-gray-500 text-sm mt-1">Each submission adds one row to the table below</p>
                        )}
                        {(editingId && !initialData) && (
                            <p className="text-blue-500 text-sm mt-1">Currently editing a drafted entry below</p>
                        )}
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
                                    setPendingDate(newDate);
                                    setIsDateConfirmOpen(true);
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

                    <div className="flex justify-end gap-3">
                        {(initialData || editingId) && (
                            <Button
                                variant="outline"
                                className="h-11 px-6 rounded-md"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            className="bg-[#0A0A0A] hover:bg-gray-800 text-white font-medium gap-2 px-6 h-11 rounded-md"
                            onClick={handleAddEntry}
                            disabled={isCreating || isUpdating}
                        >
                            {(initialData || editingId) ? (
                                <>
                                    <Save className="w-4 h-4" />
                                    Update Entry
                                </>
                            ) : (
                                <>
                                    <PlusIcon className="w-4 h-4" />
                                    Add to Analysis Table
                                    <ArrowDown className="w-4 h-4 ml-1" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {!initialData && (
                    <>
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
                                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.626 4.58423C14.0164 4.19384 14.6495 4.19412 15.04 4.58423C15.4306 4.97475 15.4306 5.60777 15.04 5.99829L10.04 10.9983C9.64951 11.3888 9.0165 11.3888 8.62598 10.9983L7.62598 9.99829C7.23587 9.60773 7.23559 8.97462 7.62598 8.58423C8.01636 8.19384 8.64948 8.19412 9.04004 8.58423L9.33301 8.8772L13.626 4.58423ZM10.96 1.91821C11.3505 1.52785 11.9836 1.52774 12.374 1.91821C12.7643 2.3087 12.7643 2.94182 12.374 3.33228L5.04004 10.6653C4.64953 11.0556 4.01645 11.0557 3.62598 10.6653L0.292969 7.33228C-0.0975012 6.94181 -0.0973928 6.30875 0.292969 5.91821C0.683493 5.52769 1.31651 5.52769 1.70703 5.91821L4.33301 8.54419L10.96 1.91821Z" fill="white" />
                                </svg>

                                Submit Monthly Report
                            </Button>
                        </div>
                    </>
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

            <ConfirmationModal
                isOpen={isDateConfirmOpen}
                onClose={() => setIsDateConfirmOpen(false)}
                onConfirm={handleConfirmDateChange}
                title="Change Reporting Period"
                message="Changing the reporting period may clear your current form data or change the view. Are you sure you want to proceed?"
                confirmLabel="Change Period"
                variant="info"
            />
        </div >
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
