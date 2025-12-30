"use client";

import React, { useMemo, useState } from "react";
import { format, differenceInDays } from "date-fns";
import { MoreVertical } from "lucide-react";

import { DynamicTable, Column } from "@/components/common/DynamicTable";
// ... (rest of imports)

import ReportFilterBar, {
    FilterState,
} from "@/components/common/ReportFilterBar";
import { useGetAllShopkeepers, useDeleteShopkeeper } from "../hook";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Shopkeeper {
    _id: string;
    shopAddress: string;
    shopName: string;
    ownerName: string;
    ownerMobile: string;
    ownerAadhar: string;
    passNumber: string;
    unit: string;
    priceListApproved: boolean;
    priceListEffectiveFrom: string;
    workers: {
        name: string;
        type: string;
        aadhar: string;
    }[];
    validFrom: string;
    validTill: string;
    createdAt: string;
}

const ShopkeeperTable = ({ onAddNew, onEdit }: { onAddNew: () => void; onEdit: (item: Shopkeeper) => void }) => {
    const { data: shopkeepers = [], isLoading } = useGetAllShopkeepers();
    const { mutateAsync: deleteShopkeeper, isPending: isDeleting } = useDeleteShopkeeper();

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null,
    });

    const handleDeleteClick = (id: string) => {
        setDeleteModal({ isOpen: true, id });
    };

    const handleConfirmDelete = async () => {
        if (!deleteModal.id) return;
        try {
            await deleteShopkeeper(deleteModal.id);
            toast.success("Shopkeeper deleted successfully");
            setDeleteModal({ isOpen: false, id: null });
        } catch (error) {
            console.error("Failed to delete shopkeeper:", error);
            toast.error("Failed to delete shopkeeper");
        }
    };


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

    const filteredData = useMemo(() => {
        return shopkeepers.filter((item: Shopkeeper) => {
            // Search logic (Shop Name, Owner Name, Unit)
            const searchTerm = filters.search.toLowerCase();
            const matchesSearch =
                item.shopName?.toLowerCase().includes(searchTerm) ||
                item.ownerName?.toLowerCase().includes(searchTerm) ||
                item.unit?.toLowerCase().includes(searchTerm);

            // Date logic (Valid From/Till or CreatedAt?)
            // Assuming 'date' filter matches Valid From or just ignores for now if not specific
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
    }, [shopkeepers, filters]);





    const columns: Column<Shopkeeper>[] = [
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
            header: "Shop Address",
            accessorKey: "shopAddress",
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Shop Name",
            accessorKey: "shopName",
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Shop Owner Name & Mobile No.",
            cell: (item) => (
                <div className="flex flex-col font-[Arial]">
                    <span className="font-normal text-[#0A0A0A]">{item.ownerName}</span>
                    <span className="text-[#0A0A0A] font-normal text-xs">{item.ownerMobile}</span>
                </div>
            ),
            className: "border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Unit",
            accessorKey: "unit",
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Price List Status",
            cell: (item) => (
                <span className="font-normal font-[Arial] text-[#0A0A0A]">{item.priceListApproved ? "Yes" : "No"}</span>
            ),
            className: "border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: (
                <div className="flex flex-col h-full">
                    <div className="text-xs font-bold uppercase text-[#0A0A0A] pb-2 border-b border-gray-300 px-4 pt-3 bg-gray-100 text-center">
                        Man Power
                    </div>
                    <div className="flex text-[10px] items-center text-[#0A0A0A] font-medium bg-gray-100">
                        <div className="w-[70px] px-2 py-1 border-r border-gray-300 text-center">Ex-Man</div>
                        <div className="w-[70px] px-2 py-1 border-r border-gray-300 text-center">Civ(M)</div>
                        <div className="w-[70px] px-2 py-1 border-r border-gray-300 text-center">Civ(F)</div>
                        <div className="w-[70px] px-2 py-1 text-center font-bold">Total</div>
                    </div>
                </div>
            ),
            cell: (item) => {
                const exMan = item.workers?.filter(w => w.type === "ex-man").length || 0;
                const civM = item.workers?.filter(w => w.type === "civil-male").length || 0;
                const civF = item.workers?.filter(w => w.type === "civil-female").length || 0;
                const total = item.workers?.length || 0;

                return (
                    <div className="flex h-full items-center font-[Arial]">
                        <div className="w-[70px] px-2 text-center border-r border-gray-300 text-sm font-normal py-4 text-[#0A0A0A]">{String(exMan).padStart(2, '0')}</div>
                        <div className="w-[70px] px-2 text-center border-r border-gray-300 text-sm font-normal py-4 text-[#0A0A0A]">{String(civM).padStart(2, '0')}</div>
                        <div className="w-[70px] px-2 text-center border-r border-gray-300 text-sm font-normal py-4 text-[#0A0A0A]">{String(civF).padStart(2, '0')}</div>
                        <div className="w-[70px] px-2 text-center font-bold text-sm py-4 text-[#0A0A0A]">{String(total).padStart(2, '0')}</div>
                    </div>
                );
            },
            className: "p-0 align-top border-r border-gray-300 min-w-[280px]",
            headerClassName: "p-0 border-r border-gray-300 min-w-[280px] font-bold text-[#0A0A0A]",
        },
        {
            header: "Worker Details (each)",
            cell: (item) => (
                <div className="space-y-1 max-h-[60px] overflow-y-auto [&::-webkit-scrollbar]:hidden font-[Arial]">
                    {item.workers?.map((w, i) => (
                        <div key={i} className="text-xs font-normal text-[#0A0A0A]">
                            {i + 1}. {w.name}
                        </div>
                    ))}
                </div>
            ),
            className: "min-w-[150px] border-r border-gray-300",
            headerClassName: "min-w-[150px] border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
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
        return <div className="p-8 text-center text-gray-500">Loading shopkeepers...</div>;
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="12" fill="#E5E5E5" />
                        <g clip-path="url(#clip0_670_96759)">
                            <path d="M10 17C10.2761 17 10.5 16.7761 10.5 16.5C10.5 16.2239 10.2761 16 10 16C9.72386 16 9.5 16.2239 9.5 16.5C9.5 16.7761 9.72386 17 10 17Z" stroke="#404040" stroke-width="1.2" stroke-linejoin="round" />
                            <path d="M15.5 17C15.7761 17 16 16.7761 16 16.5C16 16.2239 15.7761 16 15.5 16C15.2239 16 15 16.2239 15 16.5C15 16.7761 15.2239 17 15.5 17Z" stroke="#404040" stroke-width="1.2" stroke-linecap="square" stroke-linejoin="round" />
                            <path d="M7.02344 7.02499H8.02344L9.35344 13.235C9.40223 13.4624 9.52877 13.6657 9.71129 13.8099C9.89381 13.9541 10.1209 14.0302 10.3534 14.025H15.2434C15.471 14.0246 15.6917 13.9466 15.869 13.8039C16.0462 13.6612 16.1695 13.4623 16.2184 13.24L17.0434 9.52499H8.55844" stroke="#404040" stroke-width="1.2" stroke-linecap="square" stroke-linejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_670_96759">
                                <rect width="12" height="12" fill="white" transform="translate(6 6)" />
                            </clipPath>
                        </defs>
                    </svg>

                    <h2 className="text-lg font-semibold text-[#404040]">Shopkeepers & Workers Security Passes</h2>
                </div>
                <span className="text-sm font-medium  text-[#0A0A0A]">{shopkeepers.length} Shop owners & Workers</span>
            </div>

            <ReportFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                offenceTypeOptions={["Option 1", "Option 2"]} // Example options
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
                placeholder="Search by shop name, owner, unit..."
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
                title="Delete Shopkeeper"
                message="Are you sure you want to delete this shopkeeper? This action cannot be undone."
                confirmLabel="Delete"
                isProcessing={isDeleting}
            />
        </div>
    );
};

export default ShopkeeperTable;
