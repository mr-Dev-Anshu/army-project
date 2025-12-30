"use client";

import React, { useMemo, useState } from "react";
import { format, differenceInDays } from "date-fns";
import { MoreVertical } from "lucide-react";
import { toast } from "react-toastify";

import { DynamicTable, Column } from "@/components/common/DynamicTable";
import ReportFilterBar, {
    FilterState,
} from "@/components/common/ReportFilterBar";
import { useGetAllMaidServants, useDeleteMaidServant } from "../hook";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { MaidServant } from "../types";

// Extending types locally if needed to include _id which comes from DB
interface MaidServantWithId extends MaidServant {
    _id: string;
    createdAt: string;
}

const MaidServantTable = ({ onAddNew, onEdit }: { onAddNew: () => void; onEdit: (item: MaidServantWithId) => void }) => {
    const { data: maidServants = [], isLoading } = useGetAllMaidServants();
    const { mutateAsync: deleteMaidServant, isPending: isDeleting } = useDeleteMaidServant();

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null,
    });

    const [filters, setFilters] = useState<FilterState>({
        search: "",
        offenceType: "All",
        date: "",
        actionStatus: "All",
        sortOrder: "asc",
    });

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleDeleteClick = (id: string) => {
        setDeleteModal({ isOpen: true, id });
    };

    const handleConfirmDelete = async () => {
        if (!deleteModal.id) return;
        try {
            await deleteMaidServant(deleteModal.id);
            toast.success("Maid Servant deleted successfully");
            setDeleteModal({ isOpen: false, id: null });
        } catch (error) {
            console.error("Failed to delete maid servant:", error);
            toast.error("Failed to delete maid servant");
        }
    };

    const filteredData = useMemo(() => {
        return maidServants.filter((item: MaidServantWithId) => {
            const searchTerm = filters.search.toLowerCase();
            const matchesSearch =
                item.servantName?.toLowerCase().includes(searchTerm) ||
                item.ownerName?.toLowerCase().includes(searchTerm) ||
                item.qtrNumber?.toLowerCase().includes(searchTerm) ||
                item.passNumber?.toLowerCase().includes(searchTerm);

            const matchesDate = filters.date
                ? (item.validFrom && item.validFrom.includes(filters.date)) ||
                (item.createdAt && item.createdAt.includes(filters.date))
                : true;

            // Pass Status Logic
            let matchesStatus = true;
            if (filters.actionStatus && filters.actionStatus !== "All") {
                const isExpired = item.validTill ? new Date(item.validTill) < new Date() : false;
                if (filters.actionStatus === "Valid") {
                    matchesStatus = !isExpired;
                } else if (filters.actionStatus === "Expired") {
                    matchesStatus = isExpired;
                }
            }

            return matchesSearch && matchesDate && matchesStatus;
        });
    }, [maidServants, filters]);

    const columns: Column<MaidServantWithId>[] = [
        {
            header: "Sr no.",
            cell: (item) => (
                <span className="font-medium text-gray-900">
                    {filteredData.indexOf(item) + 1}
                </span>
            ),
            className: (item) => {
                const isExpired = item.validTill ? new Date(item.validTill) < new Date() : false;
                return `w-16 sticky left-0 z-10 border-r border-gray-300 ${isExpired ? "bg-red-50 hover:bg-red-50" : "bg-white border-b border-gray-300"}`;
            },
            headerClassName: "z-20 left-0 bg-gray-100 border-r border-gray-300",
        },
        {
            header: "QTR No.",
            accessorKey: "qtrNumber",
            className: "font-medium text-gray-900 min-w-[100px] border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100",
        },
        {
            header: "Name of Owner",
            cell: (item) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900"><span className="text-gray-500 font-normal">Name:</span> {item.ownerName}</span>
                    <span className="text-gray-700"><span className="text-gray-500 font-normal">Rank:</span> {item.ownerRank}</span>
                </div>
            ),
            className: "min-w-[180px] border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100",
        },
        {
            header: "Unit",
            accessorKey: "ownerUnit",
            className: "min-w-[120px] border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100",
        },
        {
            header: "Name of Servant & Mobile No.",
            cell: (item) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{item.servantName}</span>
                    <span className="text-gray-500 text-xs">{item.servantMobile}</span>
                </div>
            ),
            className: "min-w-[180px] border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100",
        },
        {
            header: "Permanent Address",
            cell: (item) => (
                <div className="text-sm text-gray-700 max-w-[200px]">
                    {item.permanentAddressLine}, {item.permanentCityDistrict}, {item.permanentState} - {item.permanentPincode}
                </div>
            ),
            className: "min-w-[200px] border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100",
        },
        {
            header: "Pass No.",
            accessorKey: "passNumber",
            className: "font-medium text-gray-900 border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100",
        },
        {
            header: "Pass ID",
            cell: (item) => (
                <span className="font-medium text-gray-900">
                    {item._id ? item._id.slice(-4).toUpperCase() : "-"}
                </span>
            ),
            className: "min-w-[100px] border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100",
        },
        {
            header: (
                <div className="flex flex-col h-full">
                    <div className="text-xs font-semibold uppercase text-gray-900 pb-2 border-b border-gray-300 px-4 pt-3 bg-gray-100">
                        Pass Valid Date
                    </div>
                    <div className="flex text-[10px] items-center text-black font-medium bg-gray-100">
                        <div className="flex-1 px-4 py-1 border-r border-gray-300 ">From</div>
                        <div className="flex-1 px-4 py-1">To</div>
                    </div>
                </div>
            ),
            cell: (item) => {
                const validFrom = item.validFrom ? new Date(item.validFrom) : null;
                const validTill = item.validTill ? new Date(item.validTill) : null;
                const isExpired = validTill ? validTill < new Date() : false;
                const daysAgo = isExpired && validTill ? differenceInDays(new Date(), validTill) : 0;

                return (
                    <div className="relative h-full flex flex-col items-center justify-center">
                        <div className="flex w-full">
                            <div className={`flex-1 px-4 border-r border-gray-100 text-sm font-medium text-center ${isExpired ? "text-[#AEAEB2]" : "text-gray-900"}`}>
                                {validFrom ? format(validFrom, "dd/MM/yyyy") : "-"}
                            </div>
                            <div className={`flex-1 px-4 text-sm font-medium text-center ${isExpired ? "text-[#AEAEB2]" : "text-gray-900"}`}>
                                {validTill ? format(validTill, "dd/MM/yyyy") : "-"}
                            </div>
                        </div>
                        {isExpired && (
                            <div className="flex flex-col items-center justify-center mt-1">
                                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">
                                    PASS EXPIRED
                                </span>
                                <span className="text-[10px] font-semibold text-gray-700">
                                    {daysAgo} Days Ago
                                </span>
                            </div>
                        )}
                    </div>
                );
            },
            className: "min-w-[220px] py-4 align-top border-r border-gray-300",
            headerClassName: "p-0 min-w-[220px] border-r border-gray-300",
        },
        {
            header: (
                <div className="flex flex-col h-full">
                    <div className="text-xs font-semibold uppercase text-gray-900 pb-2 border-b border-gray-300 px-4 pt-3 bg-gray-100">
                        Servant's Family Details
                    </div>
                    <div className="flex text-[10px] items-center text-black font-medium bg-gray-100">
                        <div className="w-[140px] px-4 py-1 border-r border-gray-300">Name</div>
                        <div className="w-[100px] px-4 py-1 border-r border-gray-300">Relationship</div>
                        <div className="w-[50px] px-4 py-1 text-center">Age</div>
                    </div>
                </div>
            ),
            cell: (item) => (
                <div className="flex flex-col w-full max-h-[150px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    {item.familyMembers && item.familyMembers.length > 0 ? (
                        item.familyMembers.map((member, i) => (
                            <div key={i} className="flex border-b border-gray-300 last:border-0 text-sm text-gray-700 items-center shrink-0">
                                <div className="w-[140px] px-4 py-2 border-r border-gray-300 font-medium truncate" title={member.name}>
                                    {i + 1}. {member.name}
                                </div>
                                <div className="w-[100px] px-4 py-2 border-r border-gray-300 truncate" title={member.relationship}>
                                    {member.relationship}
                                </div>
                                <div className="w-[50px] px-4 py-2 text-center">
                                    {member.age}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-gray-400 text-xs">-</div>
                    )}
                </div>
            ),
            className: "min-w-[300px] p-0 align-top border-r border-gray-300",
            headerClassName: "p-0 min-w-[300px] border-r border-gray-300",
        },
        {
            header: "Actions",
            cell: (item) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => onEdit(item)}
                        >
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleDeleteClick(item._id)}
                            className="text-red-600"
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            className: (item) => {
                const isExpired = item.validTill ? new Date(item.validTill) < new Date() : false;
                return `w-[50px] sticky right-0 z-10 border-l border-gray-300 ${isExpired ? "bg-red-50 hover:bg-red-50" : "bg-white border-b border-gray-300"}`;
            },
            headerClassName: "z-20 right-0 bg-gray-100 border-l border-gray-300",
        },
    ];

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading maid servants...</div>;
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                        {/* Icon for Maid Servant */}
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 28 28"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-gray-600"
                        >
                            <path
                                d="M18.6667 25.6667L17.5 21"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M22.1641 16.3217C22.4735 16.3217 22.7702 16.1988 22.989 15.98C23.2078 15.7612 23.3307 15.4645 23.3307 15.155V14C23.3307 13.3812 23.0849 12.7877 22.6473 12.3501C22.2097 11.9125 21.6162 11.6667 20.9974 11.6667H17.4974C17.188 11.6667 16.8912 11.5438 16.6724 11.325C16.4536 11.1062 16.3307 10.8095 16.3307 10.5V4.66671C16.3307 4.04787 16.0849 3.45438 15.6473 3.01679C15.2097 2.57921 14.6162 2.33337 13.9974 2.33337C13.3786 2.33337 12.7851 2.57921 12.3475 3.01679C11.9099 3.45438 11.6641 4.04787 11.6641 4.66671V10.5C11.6641 10.8095 11.5411 11.1062 11.3224 11.325C11.1036 11.5438 10.8068 11.6667 10.4974 11.6667H6.9974C6.37856 11.6667 5.78506 11.9125 5.34748 12.3501C4.9099 12.7877 4.66406 13.3812 4.66406 14V15.155C4.66406 15.4645 4.78698 15.7612 5.00577 15.98C5.22456 16.1988 5.52131 16.3217 5.83073 16.3217"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M5.83394 16.3334H22.1673L24.4691 24.2282C24.5102 24.3997 24.5119 24.5783 24.474 24.7506C24.4361 24.9229 24.3597 25.0843 24.2504 25.2228C24.1411 25.3612 24.0019 25.4731 23.8432 25.55C23.6844 25.6269 23.5103 25.6668 23.3339 25.6667H4.66728C4.4909 25.6668 4.31679 25.6269 4.15805 25.55C3.99932 25.4731 3.86008 25.3612 3.75082 25.2228C3.64155 25.0843 3.56511 24.9229 3.52723 24.7506C3.48934 24.5783 3.49101 24.3997 3.53211 24.2282L5.83394 16.3334Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M9.33594 25.6667L10.5026 21"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Maid Servants Security Passes</h2>
                </div>
                <span className="text-sm font-medium text-gray-500">{maidServants.length} Servants</span>
            </div>

            <ReportFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                offenceTypeOptions={[]}
                showOffenceType={true}
                showActionStatus={true}
                statusLabel="Pass Status"
                actionStatusOptions={["Valid", "Expired"]}
                showDate={true}
                showSort={true}
                showFilter={true}
                onAddNew={onAddNew}
                onReset={() => setFilters({
                    search: "",
                    offenceType: "All",
                    date: "",
                    actionStatus: "All",
                    sortOrder: "asc",
                })}
                placeholder="Search by name, qtr no, pass number..."
            />

            <DynamicTable
                className="[&::-webkit-scrollbar]:hidden border-gray-300 [&_tbody]:divide-gray-300 [&_table]:border-gray-300"
                data={filteredData}
                columns={columns}
                getRowClassName={(item) => {
                    const isExpired = item.validTill ? new Date(item.validTill) < new Date() : false;
                    return isExpired ? "bg-red-50 border border-red-500 hover:bg-red-50" : "border-b border-gray-300 hover:bg-white";
                }}
            />

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={handleConfirmDelete}
                title="Delete Maid Servant"
                message="Are you sure you want to delete this maid servant record? This action cannot be undone."
                confirmLabel="Delete"
                isProcessing={isDeleting}
            />
        </div>
    );
};

export default MaidServantTable;