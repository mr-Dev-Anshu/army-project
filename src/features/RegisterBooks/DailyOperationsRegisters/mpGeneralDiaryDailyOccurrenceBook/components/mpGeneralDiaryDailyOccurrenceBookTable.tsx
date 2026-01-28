"use client";

import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import { MoreVertical, Eye, Printer, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    useUpdateMpGeneralDiaryEntry,
    useDeleteMpGeneralDiaryEntry,
} from "../hooks";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import ReportFilterBar, { FilterState } from "@/components/common/ReportFilterBar";
import MpDetailsCell from "@/app/(report-view)/reports/mp-occurrence-reports/_components/MpDetailsCell";

// Simplified Offender Cell for this table
const OffenderCell = ({ details }: { details: any }) => {
    if (!details) return <span className="text-gray-400">-</span>;
    return (
        <div className="flex flex-col space-y-1 text-xs">
            <div className="grid grid-cols-[60px_1fr]">
                <span className="font-bold text-gray-900">Army no.:</span>
                <span className="text-gray-700">{details.armyNo || details.armyNumber || "-"}</span>
            </div>
            <div className="grid grid-cols-[60px_1fr]">
                <span className="font-bold text-gray-900">Rank:</span>
                <span className="text-gray-700">{details.rank || "-"}</span>
            </div>
            <div className="grid grid-cols-[60px_1fr]">
                <span className="font-bold text-gray-900">Name:</span>
                <span className="text-gray-700 uppercase">{details.name || "-"}</span>
            </div>
            <div className="grid grid-cols-[60px_1fr]">
                <span className="font-bold text-gray-900">Unit:</span>
                <span className="text-gray-700">{details.unit || "-"}</span>
            </div>
        </div>
    );
};

interface MpGeneralDiaryDailyOccurrenceBookTableProps {
    data: any[];
    onView?: (item: any) => void;
    onPrint?: (item: any) => void;
    onEdit?: (item: any) => void;
}

export default function MpGeneralDiaryDailyOccurrenceBookTable({
    data,
    onView,
    onPrint,
    onEdit,
}: MpGeneralDiaryDailyOccurrenceBookTableProps) {
    const { mutateAsync: updateRegister, isPending: isUpdating } =
        useUpdateMpGeneralDiaryEntry();
    const { mutateAsync: deleteRegister, isPending: isDeleting } =
        useDeleteMpGeneralDiaryEntry();

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Filter State
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        date: "",
        sortOrder: "asc",
        offenceType: "",
        unit: "",
        fmn: "",
    });

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            try {
                await deleteRegister(deleteId);
                setIsDeleteModalOpen(false);
                setDeleteId(null);
            } catch (error) {
                console.error("Failed to delete", error);
            }
        }
    };


    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    // Filtering Logic
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const d = item.details || {};

            // Search logic (Report No, Place, Brief)
            const searchTerm = filters.search.toLowerCase();
            const matchesSearch =
                (d.caseNo?.toLowerCase() || "").includes(searchTerm) ||
                (d.placeOfOccurrence?.toLowerCase() || "").includes(searchTerm) ||
                (d.brief?.toLowerCase() || "").includes(searchTerm);

            // Date logic
            const itemDateStr = item.date || d.dateOfOccurrence;
            const matchesDate = filters.date
                ? itemDateStr && new Date(itemDateStr).toISOString().startsWith(filters.date)
                : true;

            const itemDate = itemDateStr ? new Date(itemDateStr) : null;
            const fromDateAtStart = filters.fromDate ? new Date(filters.fromDate) : null;
            const toDateAtEnd = filters.toDate ? new Date(filters.toDate) : null;

            if (fromDateAtStart) fromDateAtStart.setHours(0, 0, 0, 0);
            if (toDateAtEnd) toDateAtEnd.setHours(23, 59, 59, 999);

            const matchesDateRange = (!fromDateAtStart || (itemDate && itemDate >= fromDateAtStart)) &&
                (!toDateAtEnd || (itemDate && itemDate <= toDateAtEnd));

            const matchesOffenceType =
                !filters.offenceType ||
                filters.offenceType === "All" ||
                (d.offenceType?.toLowerCase() === filters.offenceType.toLowerCase());

            const matchesUnit =
                !filters.unit ||
                filters.unit === "All" ||
                (d.assignedMP?.unit?.toLowerCase() === filters.unit.toLowerCase());

            const matchesFmn =
                !filters.fmn ||
                filters.fmn === "All" ||
                (d.assignedMP?.fmn?.toLowerCase() === filters.fmn.toLowerCase());

            return matchesSearch && matchesDate && matchesDateRange && matchesOffenceType && matchesUnit && matchesFmn;
        });
    }, [data, filters]);

    const processedData = useMemo(() => {
        return filteredData.map((item, index) => ({
            ...item,
            displayIndex: index + 1,
        }));
    }, [filteredData]);

    // Options for filters
    const offenceTypeOptions = useMemo(() => {
        const unique = new Set(data.map(item => item.details?.offenceType).filter(Boolean));
        return Array.from(unique) as string[];
    }, [data]);

    const unitOptions = useMemo(() => {
        const unique = new Set(data.map(item => item.details?.assignedMP?.unit).filter(Boolean));
        return Array.from(unique) as string[];
    }, [data]);

    const fmnOptions = useMemo(() => {
        const unique = new Set(data.map(item => item.details?.assignedMP?.fmn).filter(Boolean));
        return Array.from(unique) as string[];
    }, [data]);


    return (
        <div className="space-y-4 font-inter">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="12" fill="#E5E5E5" />
                        <path d="M7 16H17M7 12H17M7 8H13" stroke="#404040" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h2 className="text-lg font-semibold text-[#404040]">MP General Diary & Daily Occurrence Book</h2>
                </div>
                <span className="text-sm font-medium text-[#0A0A0A]">{filteredData.length} Reports</span>
            </div>

            <ReportFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                showOffenceType={true}
                offenceTypeOptions={offenceTypeOptions}
                showActionStatus={false}
                showDateRange={true}
                showDate={true}
                showUnit={true}
                unitOptions={unitOptions}
                showFilter={true}
                showFmn={true}
                fmnOptions={fmnOptions}
                onReset={() => setFilters({
                    search: "",
                    date: "",
                    fromDate: "",
                    toDate: "",
                    sortOrder: "asc",
                    offenceType: "",
                    unit: "",
                    fmn: "",
                })}
                onReset={() => setFilters({
                    search: "",
                    date: "",
                    fromDate: "",
                    toDate: "",
                    sortOrder: "asc",
                    offenceType: "",
                    unit: "",
                    fmn: "",
                })}
                placeholder="Search by report no..."
            />

            <div className="rounded-xl border border-neutral-300 bg-white overflow-hidden shadow-sm">
                <div className="overflow-auto max-h-[75vh] relative [&::-webkit-scrollbar]:hidden">
                    <table className="w-full text-left text-sm text-neutral-600 min-w-[2000px]">
                        <thead className="bg-[#F5F5F5] text-xs font-bold text-neutral-900 border-b border-neutral-300">
                            <tr>
                                <th rowSpan={2} className="px-4 py-3 border-r border-neutral-300 w-16 align-middle sticky left-0 top-0 z-50 bg-[#F5F5F5]">Sr no.</th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-neutral-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]">Unit of Occu. Location</th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-neutral-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]">Case No.<br /><span className="text-gray-400 font-normal">(Report No.)</span></th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-neutral-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]">Date & Time of Occu.</th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-neutral-300 w-40 align-middle sticky top-0 z-40 bg-[#F5F5F5]">Place of Occurrence</th>

                                {/* Group Header */}
                                <th colSpan={4} className="px-4 py-2 border-r border-neutral-300 text-center border-b border-neutral-300 bg-[#E5E5E5] sticky top-0 z-40">Occurrence Details</th>

                                <th rowSpan={2} className="px-4 py-3 border-r border-neutral-300 w-56 align-middle sticky top-0 z-40 bg-[#F5F5F5]">Assigned MP Particulars</th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-neutral-300 w-24 text-center align-middle sticky top-0 z-40 bg-[#F5F5F5]">Initials of MPCR NCO</th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-neutral-300 w-24 text-center align-middle sticky top-0 z-40 bg-[#F5F5F5]">Initials of CO</th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-neutral-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]">Remark</th>
                                <th rowSpan={2} className="px-2 py-3 w-10 text-center align-middle sticky right-0 top-0 z-50 bg-[#F5F5F5] border-l border-neutral-300">Action</th>
                            </tr>
                            <tr>
                                {/* Sub Headers for Occurrence Details */}
                                <th className="px-4 py-3 border-r border-neutral-300 w-40 align-middle bg-[#F5F5F5] sticky top-[37px] z-40">Offence Type</th>
                                <th className="px-4 py-3 border-r border-neutral-300 w-64 align-middle bg-[#F5F5F5] sticky top-[37px] z-40">Particulars of Individual/Victim</th>
                                <th className="px-4 py-3 border-r border-neutral-300 w-64 align-middle bg-[#F5F5F5] sticky top-[37px] z-40">Brief of Occurrence</th>
                                <th className="px-4 py-3 border-r border-neutral-300 w-64 align-middle bg-[#F5F5F5] sticky top-[37px] z-40">List of Attached Documents & Statements</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                            {processedData.length > 0 ? (
                                processedData.map((item, index) => {
                                    const d = item.details || {};
                                    return (
                                        <tr key={item._id || index} className="hover:bg-neutral-50 transition-colors group">
                                            <td className="px-4 py-4 align-top font-medium text-neutral-900 border-r border-neutral-300 text-center sticky left-0 z-30 bg-white group-hover:bg-neutral-50">
                                                {item.displayIndex}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-gray-900 font-medium">
                                                {d.unitOfOccurrence || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-gray-600 text-xs">
                                                {d.caseNo || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900">
                                                        {d.dateOfOccurrence ? new Date(d.dateOfOccurrence).toLocaleDateString("en-GB") : "-"}
                                                    </span>
                                                    <span className="text-gray-500 text-xs">
                                                        {d.timeOfOccurrence ? new Date(d.timeOfOccurrence).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false }) : ""}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-gray-900 font-medium">
                                                {d.placeOfOccurrence || "-"}
                                            </td>

                                            {/* Occurrence Details Group */}
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-gray-900 font-medium">
                                                {d.offenceType || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300">
                                                <OffenderCell details={d.individual} />
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300">
                                                <p className="text-gray-700 text-xs line-clamp-4">{d.brief || "-"}</p>
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300">
                                                <ul className="list-decimal pl-4 text-xs text-gray-600 space-y-1">
                                                    {d.documents?.map((doc: any, i: number) => (
                                                        <li key={i}>{typeof doc === 'string' ? doc : (doc.statement || "Document")}</li>
                                                    ))}
                                                    {(!d.documents || d.documents.length === 0) && <li>-</li>}
                                                </ul>
                                            </td>

                                            {/* Assigned MP */}
                                            <td className="px-4 py-4 align-top border-r border-neutral-300">
                                                <MpDetailsCell details={d.assignedMP || {}} />
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-center">
                                                {/* Initials Placeholder */}
                                                {item.authentication?.initialsMPCPNCO && <div className="text-xs font-script">{item.authentication.initialsMPCPNCO}</div>}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-center">
                                                {/* Initials Placeholder */}
                                                {item.authentication?.initials2IC && <div className="text-xs font-script">{item.authentication.initials2IC}</div>}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300">
                                                <span className="text-gray-600 text-xs">{item.remark || "-"}</span>
                                            </td>

                                            {/* Action Menu */}
                                            <td className="px-2 py-4 align-top text-center sticky right-0 z-30 bg-white group-hover:bg-neutral-50 border-l border-neutral-300">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 hover:bg-gray-100"
                                                        >
                                                            <MoreVertical className="w-4 h-4 text-gray-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-[160px]">
                                                        <DropdownMenuItem
                                                            className="gap-2 cursor-pointer"
                                                            onClick={() => onView && onView(item.details)}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            View
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="gap-2 cursor-pointer"
                                                            onClick={() => onPrint && onPrint(item.details)}
                                                        >
                                                            <Printer className="w-4 h-4" />
                                                            Print
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="gap-2 cursor-pointer"
                                                            onClick={() => onEdit && onEdit(item)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                                            onClick={() => item._id && handleDeleteClick(item._id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={14} className="px-4 py-12 text-center text-neutral-500">
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Record"
                message="Are you sure you want to delete this record? This will NOT delete the original MP Report."
                confirmLabel="Yes, Delete"
                isProcessing={isDeleting}
                variant="danger"
            />
        </div>
    );
}
