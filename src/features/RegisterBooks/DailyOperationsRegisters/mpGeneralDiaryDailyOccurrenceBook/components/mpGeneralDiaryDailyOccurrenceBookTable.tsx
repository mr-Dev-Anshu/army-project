"use client";

import React, { useMemo, useState } from "react";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
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
import { useGetFieldSuggestions } from "@/features/suggestions/hooks";
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
                <span className="text-[#0A0A0A]">{details.armyNo || details.armyNumber || "-"}</span>
            </div>
            <div className="grid grid-cols-[60px_1fr]">
                <span className="font-bold text-gray-900">Rank:</span>
                <span className="text-[#0A0A0A]">{details.rank || "-"}</span>
            </div>
            <div className="grid grid-cols-[60px_1fr]">
                <span className="font-bold text-gray-900">Name:</span>
                <span className="text-[#0A0A0A uppercase">{details.name || "-"}</span>
            </div>
            <div className="grid grid-cols-[60px_1fr]">
                <span className="font-bold text-gray-900">Unit:</span>
                <span className="text-[#0A0A0A]">{details.unit || "-"}</span>
            </div>
        </div>
    );
};

interface MpGeneralDiaryDailyOccurrenceBookTableProps {
    data: any[];
    onEdit?: (item: any) => void;
}

export default function MpGeneralDiaryDailyOccurrenceBookTable({
    data,
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

            let selectedOffences: string[] = [];
            if (Array.isArray(filters.offenceType)) {
                selectedOffences = filters.offenceType;
            } else if (filters.offenceType && filters.offenceType !== "All") {
                selectedOffences = [filters.offenceType];
            }

            const matchesOffenceType =
                selectedOffences.length === 0 ||
                selectedOffences.some(filterType => {
                    const type = filterType.toLowerCase();
                    return (
                        (d.offenceType?.toLowerCase().split(',').map((s: string) => s.trim()).includes(type)) ||
                        (d.offenceTypes?.some((t: string) => t.toLowerCase() === type))
                    );
                });

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

    const { data: suggestionsData } = useGetFieldSuggestions("offenceType", "");

    // Options for filters
    const offenceTypeOptions = useMemo(() => {
        if (suggestionsData?.data && Array.isArray(suggestionsData.data)) {
            return suggestionsData.data.map((item: any) => item.value).sort();
        }

        const types = new Set<string>();
        data.forEach(item => {
            const d = item.details || {};
            if (d.offenceType) {
                d.offenceType.split(',').map((s: string) => s.trim()).filter(Boolean).forEach((t: string) => types.add(t));
            }
            if (d.offenceTypes && Array.isArray(d.offenceTypes)) {
                d.offenceTypes.forEach((t: string) => types.add(t));
            }
        });
        return Array.from(types);
    }, [data, suggestionsData]);

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
                <div className="flex items-center gap-2 ">
                    <div className="bg-[#E5E5E5] rounded-lg p-1">
                        <svg width="18" height="18" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.6665 22.7526C4.6665 21.9791 4.97379 21.2372 5.52078 20.6902C6.06776 20.1432 6.80962 19.8359 7.58317 19.8359H23.3332" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M7.58317 2.33594H23.3332V25.6693H7.58317C6.80962 25.6693 6.06776 25.362 5.52078 24.815C4.97379 24.268 4.6665 23.5262 4.6665 22.7526V5.2526C4.6665 4.47906 4.97379 3.73719 5.52078 3.19021C6.06776 2.64323 6.80962 2.33594 7.58317 2.33594Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>

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
                showPlaceOfOffence={false}
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
                                <th colSpan={4} className="px-4 py-2 border-r border-neutral-300 text-center border-b border-neutral-300 bg-[#F5F5F5] sticky top-0 z-40">Occurrence Details</th>

                                <th rowSpan={2} className="px-4 py-3 border-r border-neutral-300 w-56 align-middle sticky top-0 z-40 bg-[#F5F5F5]">Assigned MP Particulars</th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-neutral-300 w-24 text-center align-middle sticky top-0 z-40 bg-[#F5F5F5]">Initials of MPCR NCO</th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-neutral-300 w-24 text-center align-middle sticky top-0 z-40 bg-[#F5F5F5]">Initials of CO</th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-neutral-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]">Remark</th>
                                <th rowSpan={2} className="px-2 py-3 w-10 text-center align-middle sticky right-0 top-0 z-50 bg-[#F5F5F5] border-l border-neutral-300">Action</th>
                            </tr>
                            <tr>
                                {/* Sub Headers for Occurrence Details */}
                                <th className="px-4 py-3 border-r border-neutral-300 w-40 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">Offence Type</th>
                                <th className="px-4 py-3 border-r border-neutral-300 w-64 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">Particulars of Individual/Victim</th>
                                <th className="px-4 py-3 border-r border-neutral-300 w-64 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">Brief of Occurrence</th>
                                <th className="px-4 py-3 border-r border-neutral-300 w-64 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">List of Attached Documents & Statements</th>
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
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-[#0A0A0A] ">
                                                {d.unitOfOccurrence || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-[#0A0A0A] text-xs">
                                                {d.caseNo || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300">
                                                <div className="flex flex-col">
                                                    <span className=" text-[#0A0A0A]">
                                                        {d.dateOfOccurrence ? new Date(d.dateOfOccurrence).toLocaleDateString("en-GB") : "-"}
                                                    </span>
                                                    <span className="text-gray-500 text-xs">
                                                        {d.timeOfOccurrence ? new Date(d.timeOfOccurrence).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false }) : ""}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-[#0A0A0A]">
                                                {d.placeOfOccurrence || "-"}
                                            </td>

                                            {/* Occurrence Details Group */}
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-[#0A0A0A] ">
                                                {(d.offenceTypes && d.offenceTypes.length > 0) ? d.offenceTypes.join(", ") : (d.offenceType || "-")}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300">
                                                <OffenderCell details={d.individual} />
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300">
                                                <p className="text-[#0A0A0A] text-xs">{d.brief || "-"}</p>
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300">
                                                <ul className="list-decimal pl-4 text-xs text-[#0A0A0A] space-y-1">
                                                    {d.documents?.map((doc: any, i: number) => (
                                                        <li key={i}>{typeof doc === 'string' ? doc : (doc.statement || "Document")}</li>
                                                    ))}
                                                    {(!d.documents || d.documents.length === 0) && <li>-</li>}
                                                </ul>
                                            </td>


                                            <td className="px-4 py-4 align-top border-r border-neutral-300 ">
                                                {/* If array exists and has length, map it. Else show single or empty. */}
                                                {(d.assignedMPs && d.assignedMPs.length > 0) ? (
                                                    <div className="space-y-4  pr-1 ">
                                                        {d.assignedMPs.map((mp: any, i: number) => (
                                                            <div key={i} className={i > 0 ? "pt-2 border-t border-gray-200" : ""}>
                                                                <MpDetailsCell details={mp} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <MpDetailsCell details={d.assignedMP || {}} />
                                                )}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-center">
                                                {/* Initials Placeholder */}
                                                {item.authentication?.initialsMPCPNCO && <div className="text-xs text-[#0A0A0A] ">{item.authentication.initialsMPCPNCO}</div>}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-center">
                                                {/* Initials Placeholder */}
                                                {item.authentication?.initials2IC && <div className="text-xs text-[#0A0A0A] ">{item.authentication.initials2IC}</div>}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300">
                                                <span className="text-[#0A0A0A] text-xs">{item.remark || "-"}</span>
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
