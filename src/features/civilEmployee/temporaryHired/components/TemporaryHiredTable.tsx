"use client";

import React, { useMemo, useState } from "react";
import { format, differenceInDays } from "date-fns";
import { MoreVertical } from "lucide-react";
import { toast } from "react-toastify";

import { DynamicTable, Column } from "@/components/common/DynamicTable";
import ReportFilterBar, {
    FilterState,
} from "@/components/common/ReportFilterBar";
import { useGetAllTemporaryHiredWorkers, useDeleteTemporaryHiredWorker } from "../hook";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { TemporaryHiredWorker } from "../types";

// Extend type to include backend fields
interface TemporaryHiredWorkerWithId extends TemporaryHiredWorker {
    _id: string;
    createdAt: string;
}

const TemporaryHiredTable = ({ onAddNew, onEdit }: { onAddNew: () => void; onEdit: (item: TemporaryHiredWorkerWithId) => void }) => {
    const { data: workers = [], isLoading } = useGetAllTemporaryHiredWorkers();
    const { mutateAsync: deleteWorker, isPending: isDeleting } = useDeleteTemporaryHiredWorker();

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
            await deleteWorker(deleteModal.id);
            toast.success("Worker deleted successfully");
            setDeleteModal({ isOpen: false, id: null });
        } catch (error) {
            console.error("Failed to delete worker:", error);
            toast.error("Failed to delete worker");
        }
    };

    const filteredData = useMemo(() => {
        return workers.filter((item: TemporaryHiredWorkerWithId) => {
            const searchTerm = filters.search.toLowerCase();
            const matchesSearch =
                item.workerName?.toLowerCase().includes(searchTerm) ||
                item.placeOfDuty?.toLowerCase().includes(searchTerm) ||
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
    }, [workers, filters]);

    const columns: Column<TemporaryHiredWorkerWithId>[] = [
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
            header: "Name of Worker & Mobile No.",
            cell: (item) => (
                <div className="flex flex-col font-[Arial]">
                    <span className="font-normal text-[#0A0A0A]">{item.workerName}</span>
                    <span className="text-[#0A0A0A] font-normal text-xs">{item.workerMobile}</span>
                </div>
            ),
            className: "min-w-[180px] border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Place of Stay",
            accessorKey: "placeOfStay",
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Place of Work",
            accessorKey: "placeOfDuty",
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Pass Status",
            cell: (item) => (
                <span className="font-normal font-[Arial] text-[#0A0A0A]">
                    {item.passNumber ? "Yes" : "No"}
                </span>
            ),
            className: "border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Pass No.",
            accessorKey: "passNumber",
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300",
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
                        List of Sub-Worker & their details
                    </div>
                    <div className="flex text-[10px] items-center text-[#0A0A0A] font-medium bg-gray-100">
                        <div className="w-[150px] px-4 py-1 border-r border-gray-300">Name</div>
                        <div className="w-[150px] px-4 py-1 border-r border-gray-300">Aadhar Card No.</div>
                        <div className="w-[150px] px-4 py-1 text-center">Mobile No.</div>
                    </div>
                </div>
            ),
            cell: (item) => (
                <div className="flex flex-col w-full max-h-[150px] overflow-y-auto [&::-webkit-scrollbar]:hidden font-[Arial]">
                    {item.subWorkers && item.subWorkers.length > 0 ? (
                        item.subWorkers.map((worker, i) => (
                            <div key={i} className="flex border-b border-gray-300 last:border-0 text-sm text-[#0A0A0A] items-center shrink-0">
                                <div className="w-[150px] px-4 py-2 border-r border-gray-300 font-normal truncate" title={worker.name}>
                                    {i + 1}. {worker.name}
                                </div>
                                <div className="w-[150px] px-4 py-2 border-r border-gray-300 truncate font-normal" title={worker.aadhar}>
                                    {worker.aadhar}
                                </div>
                                <div className="w-[150px] px-4 py-2 text-center font-normal">
                                    {worker.mobile}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-gray-400 text-xs font-normal">-</div>
                    )}
                </div>
            ),
            className: "min-w-[450px] p-0 align-top border-r border-gray-300",
            headerClassName: "p-0 min-w-[450px] border-r border-gray-300 font-bold text-[#0A0A0A]",
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
        return <div className="p-8 text-center text-gray-500">Loading temporary hired workers...</div>;
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="12" fill="#E5E5E5" />
                        <g clip-path="url(#clip0_683_99301)">
                            <path d="M7 15C7 15.1326 7.05268 15.2598 7.14645 15.3536C7.24021 15.4473 7.36739 15.5 7.5 15.5H16.5C16.6326 15.5 16.7598 15.4473 16.8536 15.3536C16.9473 15.2598 17 15.1326 17 15V14C17 13.8674 16.9473 13.7402 16.8536 13.6464C16.7598 13.5527 16.6326 13.5 16.5 13.5H7.5C7.36739 13.5 7.24021 13.5527 7.14645 13.6464C7.05268 13.7402 7 13.8674 7 14V15Z" stroke="#404040" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M11 11V8.5C11 8.36739 11.0527 8.24021 11.1464 8.14645C11.2402 8.05268 11.3674 8 11.5 8H12.5C12.6326 8 12.7598 8.05268 12.8536 8.14645C12.9473 8.24021 13 8.36739 13 8.5V11" stroke="#404040" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M8 13.5V12C8 11.2044 8.31607 10.4413 8.87868 9.87868C9.44129 9.31607 10.2044 9 11 9" stroke="#404040" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M13 9C13.7956 9 14.5587 9.31607 15.1213 9.87868C15.6839 10.4413 16 11.2044 16 12V13.5" stroke="#404040" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_683_99301">
                                <rect width="12" height="12" fill="white" transform="translate(6 6)" />
                            </clipPath>
                        </defs>
                    </svg>
                    <h2 className="text-lg font-semibold text-[#404040]">Temporary Hired Worker Security Passes</h2>
                </div>
                <span className="text-sm font-semibold text-[#0A0A0A]">{filteredData.length} Servants</span>
            </div>

            <ReportFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                offenceTypeOptions={[]}
                showOffenceType={false}
                showActionStatus={true}
                statusLabel="Pass Status"
                actionStatusOptions={["Valid", "Expired"]}
                showDateRange={false}
                showFilter={true}
                onAddNew={onAddNew}
                onReset={() => setFilters({
                    search: "",
                    offenceType: "All",
                    date: "",
                    actionStatus: "All",
                    sortOrder: "asc",
                })}
                placeholder="Search by worker name, place of work, pass no..."
                showFmn={false}
                showPlaceOfOffence={false}
                showUnit={false}
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
                title="Delete Worker"
                message="Are you sure you want to delete this worker record? This action cannot be undone."
                confirmLabel="Delete"
                isProcessing={isDeleting}
            />
        </div>
    );
};

export default TemporaryHiredTable;
