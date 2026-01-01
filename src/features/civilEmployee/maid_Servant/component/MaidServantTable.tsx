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
                <span className="font-normal font-[Arial] text-[#0A0A0A]">
                    {filteredData.indexOf(item) + 1}
                </span>
            ),
            className: (item) => {
                const isExpired = item.validTill ? new Date(item.validTill) < new Date() : false;
                return `w-16 sticky left-0 z-10 border-r border-gray-300 ${isExpired ? "bg-red-50 hover:bg-red-50" : "bg-white border-b border-gray-300"}`;
            },
            headerClassName: "z-20 left-0 bg-gray-100 border-r border-gray-300 font-bold text-[#0A0A0A]",
        },
        {
            header: "QTR No.",
            accessorKey: "qtrNumber",
            className: "font-normal font-[Arial] text-[#0A0A0A] min-w-[100px] border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Name of Owner",
            cell: (item) => (
                <div className="flex flex-col font-[Arial]">
                    <span className="font-normal text-[#0A0A0A]"><span className="text-[#0A0A0A] font-semibold">Name:</span> {item.ownerName}</span>
                    <span className="text-[#0A0A0A] font-normal"><span className="text-[#0A0A0A] font-semibold">Rank:</span> {item.ownerRank}</span>
                </div>
            ),
            className: "min-w-[180px] border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Unit",
            accessorKey: "ownerUnit",
            className: "min-w-[120px] font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Name of Servant & Mobile No.",
            cell: (item) => (
                <div className="flex flex-col font-[Arial]">
                    <span className="font-normal text-[#0A0A0A]">{item.servantName}</span>
                    <span className="text-[#0A0A0A] font-normal text-xs">{item.servantMobile}</span>
                </div>
            ),
            className: "min-w-[180px] border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Permanent Address",
            cell: (item) => (
                <div className="text-sm font-normal font-[Arial] text-[#0A0A0A] max-w-[200px]">
                    {item.permanentAddressLine}, {item.permanentCityDistrict}, {item.permanentState} - {item.permanentPincode}
                </div>
            ),
            className: "min-w-[200px] border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Pass No.",
            accessorKey: "passNumber",
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Pass ID",
            cell: (item) => (
                <span className="font-normal font-[Arial] text-[#0A0A0A]">
                    {item._id ? item._id.slice(-4).toUpperCase() : "-"}
                </span>
            ),
            className: "min-w-[100px] border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: (
                <div className="flex flex-col h-full">
                    <div className="text-xs text-center font-bold uppercase text-[#0A0A0A] pb-2 border-b border-gray-300 px-4 pt-3 bg-gray-100">
                        Pass Valid Date
                    </div>
                    <div className="flex text-[10px] items-center text-[#0A0A0A] font-medium bg-gray-100">
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
                    <div className="relative h-full flex flex-col items-center justify-center font-[Arial]">
                        <div className="flex w-full">
                            <div className={`flex-1 px-4 border-r border-gray-100 text-sm font-normal text-center ${isExpired ? "text-[#AEAEB2]" : "text-[#0A0A0A]"}`}>
                                {validFrom ? format(validFrom, "dd/MM/yyyy") : "-"}
                            </div>
                            <div className={`flex-1 px-4 text-sm font-normal text-center ${isExpired ? "text-[#AEAEB2]" : "text-[#0A0A0A]"}`}>
                                {validTill ? format(validTill, "dd/MM/yyyy") : "-"}
                            </div>
                        </div>
                        {isExpired && (
                            <div className="flex flex-col items-center justify-center mt-3">
                                <span className="text-[12px] font-bold text-red-600 uppercase tracking-wide">
                                    PASS EXPIRED
                                </span>
                                <span className="text-[10px] font-semibold text-[#0A0A0A]">
                                    {daysAgo} Days Ago
                                </span>
                            </div>
                        )}
                    </div>
                );
            },
            className: "min-w-[220px] py-4 align-top border-r border-gray-300",
            headerClassName: "p-0 min-w-[220px] border-r border-gray-300 font-bold text-[#0A0A0A]",
        },
        {
            header: (
                <div className="flex flex-col h-full">
                    <div className="text-xs text-center font-bold uppercase text-[#0A0A0A] pb-2 border-b border-gray-300 px-4 pt-3 bg-gray-100">
                        Servant's Family Details
                    </div>
                    <div className="flex text-[10px] items-center text-[#0A0A0A] font-medium bg-gray-100">
                        <div className="w-[140px] px-4 py-1 border-r border-gray-300">Name</div>
                        <div className="w-[100px] px-4 py-1 border-r border-gray-300">Relationship</div>
                        <div className="w-[50px] px-4 py-1 text-center">Age</div>
                    </div>
                </div>
            ),
            cell: (item) => (
                <div className="flex flex-col w-full max-h-[150px] overflow-y-auto [&::-webkit-scrollbar]:hidden font-[Arial]">
                    {item.familyMembers && item.familyMembers.length > 0 ? (
                        item.familyMembers.map((member, i) => (
                            <div key={i} className="flex border-b border-gray-300 last:border-0 text-sm text-[#0A0A0A] items-center shrink-0">
                                <div className="w-[140px] px-4 py-2 border-r border-gray-300 font-normal truncate" title={member.name}>
                                    {i + 1}. {member.name}
                                </div>
                                <div className="w-[100px] px-4 py-2 border-r border-gray-300 truncate font-normal" title={member.relationship}>
                                    {member.relationship}
                                </div>
                                <div className="w-[50px] px-4 py-2 text-center font-normal">
                                    {member.age}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-gray-400 text-xs font-normal">-</div>
                    )}
                </div>
            ),
            className: "min-w-[300px] p-0 align-top border-r border-gray-300",
            headerClassName: "p-0 min-w-[300px] border-r border-gray-300 font-bold text-[#0A0A0A]",
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
            headerClassName: "z-20 right-0 bg-gray-100 border-l border-gray-300 font-bold text-[#0A0A0A]",
        },
    ];

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading maid servants...</div>;
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="12" fill="#E5E5E5" />
                        <g clip-path="url(#clip0_683_98670)">
                            <path d="M14 17L13.5 15" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15.5 12.995C15.6326 12.995 15.7598 12.9423 15.8536 12.8486C15.9473 12.7548 16 12.6276 16 12.495V12C16 11.7348 15.8946 11.4804 15.7071 11.2929C15.5196 11.1054 15.2652 11 15 11H13.5C13.3674 11 13.2402 10.9473 13.1464 10.8536C13.0527 10.7598 13 10.6326 13 10.5V8C13 7.73478 12.8946 7.48043 12.7071 7.29289C12.5196 7.10536 12.2652 7 12 7C11.7348 7 11.4804 7.10536 11.2929 7.29289C11.1054 7.48043 11 7.73478 11 8V10.5C11 10.6326 10.9473 10.7598 10.8536 10.8536C10.7598 10.9473 10.6326 11 10.5 11H9C8.73478 11 8.48043 11.1054 8.29289 11.2929C8.10536 11.4804 8 11.7348 8 12V12.495C8 12.6276 8.05268 12.7548 8.14645 12.8486C8.24021 12.9423 8.36739 12.995 8.5 12.995" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8.50026 13H15.5003L16.4868 16.3835C16.5044 16.457 16.5051 16.5336 16.4889 16.6074C16.4726 16.6812 16.4399 16.7504 16.393 16.8097C16.3462 16.8691 16.2865 16.917 16.2185 16.95C16.1505 16.9829 16.0759 17 16.0003 17H8.00026C7.92467 17 7.85005 16.9829 7.78202 16.95C7.71399 16.917 7.65432 16.8691 7.60749 16.8097C7.56067 16.7504 7.5279 16.6812 7.51167 16.6074C7.49543 16.5336 7.49615 16.457 7.51376 16.3835L8.50026 13Z" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 17L10.5 15" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_683_98670">
                                <rect width="12" height="12" fill="white" transform="translate(6 6)" />
                            </clipPath>
                        </defs>
                    </svg>

                    <h2 className="text-lg font-semibold text-[#404040]">Maid Servants Security Passes</h2>
                </div>
                <span className="text-sm font-medium text-[#0A0A0A]">{maidServants.length} Servants</span>
            </div>

            <ReportFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                offenceTypeOptions={[]}
                showOffenceType={false}
                showActionStatus={true}
                statusLabel="Pass Status"
                actionStatusOptions={["Valid", "Expired"]}
                showDate={false}
                showSort={false}
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