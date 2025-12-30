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

            return matchesSearch && matchesDate;
        });
    }, [shopkeepers, filters]);

    const columns: Column<Shopkeeper>[] = [
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
            header: "Shop Address",
            accessorKey: "shopAddress",
            className: "font-medium text-gray-900 border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100",
        },
        {
            header: "Shop Name",
            accessorKey: "shopName",
            className: "border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100",
        },
        {
            header: "Shop Owner Name & Mobile No.",
            cell: (item) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{item.ownerName}</span>
                    <span className="text-gray-500 text-xs">{item.ownerMobile}</span>
                </div>
            ),
            className: "border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100",
        },
        {
            header: "Unit",
            accessorKey: "unit",
            className: "border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100",
        },
        {
            header: "Price List Status",
            cell: (item) => (
                <span>{item.priceListApproved ? "Yes" : "No"}</span>
            ),
            className: "border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100",
        },
        // Flattened Man Power columns
        {
            header: "Ex-Man",
            cell: (item) => {
                const count = item.workers?.filter(w => w.type === "ex-man").length || 0;
                return String(count).padStart(2, '0');
            },
            className: "border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100",
        },
        {
            header: "Civ(M)",
            cell: (item) => {
                const count = item.workers?.filter(w => w.type === "civil-male").length || 0;
                return String(count).padStart(2, '0');
            },
            className: "border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100",
        },
        {
            header: "Civ(F)",
            cell: (item) => {
                const count = item.workers?.filter(w => w.type === "civil-female").length || 0;
                return String(count).padStart(2, '0');
            },
            className: "border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100",
        },
        {
            header: "Total",
            cell: (item) => (
                <span className="font-bold">{item.workers?.length || 0}</span>
            ),
            className: "border-r border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100",
        },
        {
            header: "Worker Details (each)",
            cell: (item) => (
                <div className="space-y-1 max-h-[60px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    {item.workers?.map((w, i) => (
                        <div key={i} className="text-xs text-gray-700">
                            {i + 1}. {w.name}
                        </div>
                    ))}
                </div>
            ),
            className: "min-w-[150px] border-r border-gray-300",
            headerClassName: "min-w-[150px] border-r border-gray-300 bg-gray-100",
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
        return <div className="p-8 text-center text-gray-500">Loading shopkeepers...</div>;
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                        {/* Placeholder icon */}
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Shopkeepers & Workers Security Passes</h2>
                </div>
                <span className="text-sm font-medium text-gray-500">{shopkeepers.length} Shop owners & Workers</span>
            </div>

            <ReportFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                offenceTypeOptions={["Option 1", "Option 2"]} // Example options
                showOffenceType={true}
                showActionStatus={true}
                statusLabel="Pass Status"
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
