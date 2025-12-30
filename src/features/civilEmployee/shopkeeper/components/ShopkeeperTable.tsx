"use client";

import React, { useMemo, useState } from "react";
import { format, differenceInDays } from "date-fns";
import { MoreVertical } from "lucide-react";

import { DynamicTable, Column } from "@/components/common/DynamicTable";
// ... (rest of imports)

import ReportFilterBar, {
    FilterState,
} from "@/components/common/ReportFilterBar";
import { useGetAllShopkeepers } from "../hook";
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
    unit: string;
    priceListApproved: boolean;
    workers: {
        name: string;
        type: string;
        aadhar: string;
    }[];
    validFrom: string;
    validTill: string;
    createdAt: string;
}

const ShopkeeperTable = ({ onAddNew }: { onAddNew: () => void }) => {
    const { data: shopkeepers = [], isLoading } = useGetAllShopkeepers();

    const [filters, setFilters] = useState<FilterState>({
        search: "",
        offenceType: "All",
        date: "",
        actionStatus: "All",
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
            className: "w-16 sticky left-0 z-10 bg-white group-hover:bg-gray-50 border-r border-gray-200",
            headerClassName: "z-20 left-0 bg-gray-50 border-r border-gray-200",
        },
        {
            header: "Shop Address",
            accessorKey: "shopAddress",
            className: "font-medium text-gray-900",
        },
        {
            header: "Shop Name",
            accessorKey: "shopName",
        },
        {
            header: "Shop Owner Name & Mobile No.",
            cell: (item) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{item.ownerName}</span>
                    <span className="text-gray-500 text-xs">{item.ownerMobile}</span>
                </div>
            ),
        },
        {
            header: "Unit",
            accessorKey: "unit",
        },
        {
            header: "Price List Status",
            cell: (item) => (
                <span>{item.priceListApproved ? "Yes" : "No"}</span>
            ),
        },
        // Flattened Man Power columns
        {
            header: "Ex-Man",
            cell: (item) => {
                const count = item.workers?.filter(w => w.type === "ex-man").length || 0;
                return String(count).padStart(2, '0');
            },
        },
        {
            header: "Civ(M)",
            cell: (item) => {
                const count = item.workers?.filter(w => w.type === "civil-male").length || 0;
                return String(count).padStart(2, '0');
            },
        },
        {
            header: "Civ(F)",
            cell: (item) => {
                const count = item.workers?.filter(w => w.type === "civil-female").length || 0;
                return String(count).padStart(2, '0');
            },
        },
        {
            header: "Total",
            cell: (item) => (
                <span className="font-bold">{item.workers?.length || 0}</span>
            ),
        },
        {
            header: "Worker Details (each)",
            cell: (item) => (
                <div className="space-y-1">
                    {item.workers?.slice(0, 3).map((w, i) => (
                        <div key={i} className="text-xs text-gray-700">
                            {i + 1}. {w.name}
                        </div>
                    ))}
                    {/* Show '...' if more */}
                </div>
            ),
            className: "min-w-[150px]",
        },
        {
            header: "Pass Valid Date From",
            cell: (item) => (
                <span className="whitespace-nowrap">
                    {item.validFrom ? format(new Date(item.validFrom), "dd/MM/yyyy") : "-"}
                </span>
            ),
        },
        {
            header: "Pass Valid Date To",
            cell: (item) => {
                const validTill = item.validTill ? new Date(item.validTill) : null;
                const isExpired = validTill ? validTill < new Date() : false;
                const daysAgo = isExpired && validTill ? differenceInDays(new Date(), validTill) : 0;

                return (
                    <div className="flex flex-col items-center justify-center">
                        <span className="whitespace-nowrap text-gray-500 font-medium">
                            {validTill ? format(validTill, "dd/MM/yyyy") : "-"}
                        </span>
                        {isExpired && (
                            <>
                                <span className="text-[11px] font-bold text-red-500 mt-1 uppercase leading-tight">
                                    PASS EXPIRED
                                </span>
                                <span className="text-[11px] text-gray-700 font-medium leading-tight">
                                    {daysAgo} Days Ago
                                </span>
                            </>
                        )}
                    </div>
                );
            },
            className: "min-w-[110px]",
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
                            onClick={() => console.log("Edit", item._id)}
                        >
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => console.log("Delete", item._id)}
                            className="text-red-600"
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            className: "w-[50px] sticky right-0 z-10 bg-white group-hover:bg-gray-50 border-l border-gray-200",
            headerClassName: "z-20 right-0 bg-gray-50 border-l border-gray-200",
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
                showDate={true}
                onAddNew={onAddNew}
                placeholder="Search by shop name, owner, unit..."
            />

            <DynamicTable
                className="[&::-webkit-scrollbar]:hidden"
                data={filteredData}
                columns={columns}
                getRowClassName={(item) => {
                    const isExpired = item.validTill ? new Date(item.validTill) < new Date() : false;
                    return isExpired ? "bg-red-50 border-red-200 border !text-gray-900" : "";
                }}
            />
        </div>
    );
};

export default ShopkeeperTable;
