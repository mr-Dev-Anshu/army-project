"use client";

import React, { useState, useMemo } from "react";
import { Edit2, Trash2, MoreVertical, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReportFilterBar from "@/components/common/ReportFilterBar";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import { useUpdateMobilePhoneInOutRegister } from "../hooks";
import ConfirmationModal from "@/components/common/ConfirmationModal";


// Define interface for data item
interface RegisterItem {
    _id?: string;
    serialNumber?: number;
    date?: string;
    details?: {
        individual?: {
            armyNo?: string;
            rank?: string;
            name?: string;
        };
        dutyType?: string;
        placeOfDuty?: string;
        mobilePhoneOutTime?: string; // Or mobileOutTime if specific
        outSignature?: string;
        mobilePhoneInTime?: string; // Or mobileInTime
        inSignature?: string;
    };
    authentication?: {
        initialsMPCPNCO?: string;
        initialsQMSJCO?: string;
        initials2IC?: string;
        initialsOfMPCRNCO?: boolean;
        initialsOfSMSJCO?: boolean;
        initialsOf2IC?: boolean;
    };
    remark?: string;
}

interface FilterState {
    search: string;
    date: string;
    sortOrder: "asc" | "desc";
    dutyType: string;
    fromDate?: string;
    toDate?: string;
    [key: string]: any;
}

interface MobilePhoneInOutTableProps {
    data: RegisterItem[];
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
    onAddNew: () => void;
}

const MobilePhoneInOutTable = ({
    data = [],
    onEdit,
    onDelete,
    onAddNew,
}: MobilePhoneInOutTableProps) => {
    const { mutate: updateReport } = useUpdateMobilePhoneInOutRegister();
    // Filter State
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        date: "",
        sortOrder: "asc",
        dutyType: "",
    });

    // Delete confirmation state
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            onDelete(deleteId);
            setIsDeleteModalOpen(false);
            setDeleteId(null);
        }
    };

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleInitialToggle = async (record: any, field: string) => {
        try {
            const currentAuth = record.authentication || {};
            const isAdding = !currentAuth[field];
            const newAuth = {
                initialsOfMPCRNCO: currentAuth.initialsOfMPCRNCO || false,
                initialsOfSMSJCO: currentAuth.initialsOfSMSJCO || false,
                initialsOf2IC: currentAuth.initialsOf2IC || false,
                [field]: isAdding // Toggle the specific field
            };

            await updateReport({
                id: record._id,
                payload: {
                    authentication: newAuth
                },
                suppressToast: true
            });

            if (isAdding) {
                toast.success("Sign added.");
            } else {
                toast.success("Sign removed.");
            }
        } catch (error) {
            console.error("Failed to update initial", error);
            toast.error("Failed to update sign");
        }
    };

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            // Search logic
            const searchTerm = filters.search.toLowerCase();
            const ind = item.details?.individual || {};

            const matchesSearch =
                (ind.name?.toLowerCase() || "").includes(searchTerm) ||
                (ind.armyNo?.toLowerCase() || "").includes(searchTerm) ||
                (ind.rank?.toLowerCase() || "").includes(searchTerm);

            // Date logic
            const matchesDate = filters.date
                ? item.date && item.date.startsWith(filters.date)
                : true;

            const itemDate = item.date ? new Date(item.date) : null;
            const fromDateAtStart = filters.fromDate ? new Date(filters.fromDate) : null;
            const toDateAtEnd = filters.toDate ? new Date(filters.toDate) : null;

            const matchesDateRange = (!fromDateAtStart || (itemDate && itemDate >= fromDateAtStart)) &&
                (!toDateAtEnd || (itemDate && itemDate <= toDateAtEnd));

            // Duty Type Filter
            const matchesDutyType =
                !filters.dutyType ||
                filters.dutyType === "All" ||
                (item.details?.dutyType?.toLowerCase() === filters.dutyType.toLowerCase());

            return matchesSearch && matchesDate && matchesDateRange && matchesDutyType;
        });
    }, [data, filters]);

    // Generate dynamic options for filters
    const dutyTypeOptions = useMemo(() => {
        const unique = new Set(data.map(item => item.details?.dutyType).filter(Boolean));
        return Array.from(unique) as string[];
    }, [data]);

    // Add serial numbers to display based on filtered view
    const dataWithSrNo = filteredData.map((item, index) => ({ ...item, serialNumber: index + 1 }));

    return (
        <div className="space-y-4 font-inter">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="12" fill="#E5E5E5" />
                        <g clipPath="url(#clip0_536_85919)">
                            <path d="M14.5 7H9.5C8.94772 7 8.5 7.44772 8.5 8V16C8.5 16.5523 8.94772 17 9.5 17H14.5C15.0523 17 15.5 16.5523 15.5 16V8C15.5 7.44772 15.0523 7 14.5 7Z" stroke="#404040" stroke-width="1.2" stroke-linejoin="round" />
                            <path d="M12 15H12.005" stroke="#404040" stroke-width="1.2" stroke-linecap="square" stroke-linejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_536_85919">
                                <rect width="12" height="12" fill="white" transform="translate(6 6)" />
                            </clipPath>
                        </defs>
                    </svg>

                    <h2 className="text-lg font-semibold text-[#404040]">Mobile Phone Out|In Register</h2>
                </div>
                <span className="text-sm font-medium text-[#0A0A0A]">{filteredData.length} Reports</span>
            </div>

            <ReportFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                showOffenceType={false}
                showActionStatus={false}
                showDateRange={true}
                showDate={true}
                showUnit={false}
                showFilter={true}
                showFmn={false}
                showPlaceOfOffence={false}
                dateRangeLabel="Date Range"
                showDutyType={true}
                dutyTypeOptions={dutyTypeOptions}
                onReset={() => setFilters({
                    search: "",
                    date: "",
                    fromDate: "",
                    toDate: "",
                    sortOrder: "asc",
                    dutyType: "",
                })}
                onAddNew={onAddNew}
                placeholder="Search by Name, Army No..."
            />

            <div className="rounded-xl border border-neutral-300 bg-white overflow-hidden shadow-sm">
                <div className="overflow-auto max-h-[75vh] relative [&::-webkit-scrollbar]:hidden">
                    <table className="w-full text-left text-sm text-neutral-600 min-w-[1400px]">
                        <thead className="bg-[#F5F5F5] text-xs font-bold text-neutral-900 border-b border-neutral-300">
                            <tr>
                                <th className="px-4 py-3 border-r border-neutral-300 w-16 align-middle sticky left-0 top-0 z-50 bg-[#F5F5F5]" rowSpan={2}>
                                    Sr no.
                                </th>
                                <th className="px-4 py-3 border-r border-neutral-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Individuals Particular
                                </th>
                                <th className="px-4 py-3 border-r border-neutral-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Type of Duty/Event
                                </th>
                                <th className="px-4 py-3 border-r border-neutral-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Place of Duty
                                </th>

                                {/* Mobile Phone Out | In Time */}
                                <th className="px-4 py-2 border-r border-neutral-300 text-center border-b sticky top-0 z-40 bg-[#F5F5F5]" colSpan={3}>
                                    Mobile Phone Out|In Time
                                </th>

                                <th className="px-4 py-3 border-r border-neutral-300 text-center w-24 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Initials of MPCR NCO
                                </th>
                                <th className="px-4 py-3 border-r border-neutral-300 text-center w-24 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Initials of SM/SJCO
                                </th>
                                <th className="px-4 py-3 border-r border-neutral-300 text-center w-24 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Initials of 2IC
                                </th>
                                <th className="px-4 py-3 border-r border-neutral-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Remark
                                </th>
                                <th className="px-2 py-3 w-10 text-center align-middle sticky right-0 top-0 z-50 bg-[#F5F5F5] border-l border-neutral-300" rowSpan={2}></th>
                            </tr>
                            <tr>
                                {/* Sub-headers for Mobile Phone Out | In Time */}
                                <th className="px-4 py-2 border-r border-neutral-300 text-center text-xs font-semibold bg-[#F5F5F5] sticky top-[31px] z-40">Out Time</th>
                                <th className="px-4 py-2 border-r border-neutral-300 text-center text-xs font-semibold bg-[#F5F5F5] sticky top-[31px] z-40">Signature</th>
                                <th className="px-4 py-2 border-r border-neutral-300 text-center text-xs font-semibold bg-[#F5F5F5] sticky top-[31px] z-40">In Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                            {dataWithSrNo.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="p-8 text-center text-neutral-500">
                                        No records found.
                                    </td>
                                </tr>
                            ) : (
                                dataWithSrNo.map((item, index) => {
                                    const ind = item.details?.individual || {};

                                    return (
                                        <tr key={item._id || index} className="hover:bg-neutral-50 transition-colors group">
                                            <td className="px-4 py-4 align-top font-medium text-neutral-900 border-r border-neutral-300 text-center sticky left-0 z-30 bg-white group-hover:bg-neutral-50">
                                                {item.serialNumber}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300">
                                                <div className="flex flex-col space-y-1 text-xs">
                                                    <div className="grid grid-cols-[65px_1fr]">
                                                        <span className="font-bold text-neutral-900">Army no.:</span>
                                                        <span className="text-[#0A0A0A]">{ind.armyNo || "-"}</span>
                                                    </div>
                                                    <div className="grid grid-cols-[65px_1fr]">
                                                        <span className="font-bold text-neutral-900">Rank:</span>
                                                        <span className="text-[#0A0A0A]">{ind.rank || "-"}</span>
                                                    </div>
                                                    <div className="grid grid-cols-[65px_1fr]">
                                                        <span className="font-bold text-neutral-900">Name:</span>
                                                        <span className="text-[#0A0A0A] font-medium uppercase">{ind.name || "-"}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-[#0A0A0A]">
                                                {item.details?.dutyType || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-[#0A0A0A]">
                                                {item.details?.placeOfDuty || "-"}
                                            </td>

                                            {/* Mobile Phone Out|In Time Data */}
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-[#0A0A0A] font-medium text-center">
                                                {item.details?.mobilePhoneOutTime || "-- : --"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-[#0A0A0A] text-center">
                                                {item.details?.outSignature ? (
                                                    <div>{item.details.outSignature}</div>
                                                ) : ""}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-[#0A0A0A] font-medium text-center">
                                                {item.details?.mobilePhoneInTime || "-- : --"}
                                            </td>

                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-[#0A0A0A] text-center">
                                                <div className="flex justify-center">
                                                    <Checkbox
                                                        className="border-black"
                                                        checked={item.authentication?.initialsOfMPCRNCO || false}
                                                        onCheckedChange={() => handleInitialToggle(item, "initialsOfMPCRNCO")}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-[#0A0A0A] text-center">
                                                <div className="flex justify-center">
                                                    <Checkbox
                                                        className="border-black"
                                                        checked={item.authentication?.initialsOfSMSJCO || false}
                                                        onCheckedChange={() => handleInitialToggle(item, "initialsOfSMSJCO")}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-[#0A0A0A] text-center">
                                                <div className="flex justify-center">
                                                    <Checkbox
                                                        className="border-black"
                                                        checked={item.authentication?.initialsOf2IC || false}
                                                        onCheckedChange={() => handleInitialToggle(item, "initialsOf2IC")}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-[#0A0A0A] text-xs">
                                                {item.remark || "-"}
                                            </td>
                                            <td className="px-2 py-4 align-top text-center sticky right-0 z-30 bg-white group-hover:bg-neutral-50 border-l border-neutral-300 h-full">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => onEdit(item)}
                                                            className="text-neutral-700"
                                                        >
                                                            <Edit2 className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => item._id && handleDeleteClick(item._id)}
                                                            className="text-red-600 focus:text-red-600"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    );
                                })
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
                message="Are you sure you want to delete this specific mobile phone record? This action cannot be undone."
            />
        </div>
    );
};

export default MobilePhoneInOutTable;
