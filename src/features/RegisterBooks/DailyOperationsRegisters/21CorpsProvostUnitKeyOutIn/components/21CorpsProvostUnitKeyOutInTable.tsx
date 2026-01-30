import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReportFilterBar, { FilterState } from "@/components/common/ReportFilterBar";
import ConfirmationModal from "@/components/common/ConfirmationModal";


interface KeyOutInTableProps {
    data: any[];
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
    onAddNew?: () => void;
}

const KeyOutInTable = ({ data, onEdit, onDelete, onAddNew }: KeyOutInTableProps) => {
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        date: "",
        unit: "",
        sortOrder: "asc",
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

    // Extract unique units for filter options
    const unitOptions = useMemo(() => {
        // const units = new Set<string>();
        // data.forEach((item) => {
        //     const unit = item.details?.individual?.unit;
        //     if (unit) units.add(unit);
        // });
        // return Array.from(units).sort();
        return [];
    }, [data]);

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            // Search logic
            const searchTerm = filters.search.toLowerCase();
            const ind = item.details?.individual || {};
            const matchesSearch =
                (ind.name?.toLowerCase() || "").includes(searchTerm) ||
                (ind.armyNo?.toLowerCase() || "").includes(searchTerm) ||
                (item.details?.storeName?.toLowerCase() || "").includes(searchTerm) ||
                (item.details?.keyNumber?.toLowerCase() || "").includes(searchTerm);

            // Date logic
            const matchesDate = filters.date
                ? item.date && item.date.startsWith(filters.date)
                : true;

            // Unit logic
            let matchesUnit = true;
            if (filters.unit) {
                // const selectedUnits = filters.unit.split(",");
                // const itemUnit = ind.unit || "";
                // if (!itemUnit || !selectedUnits.includes(itemUnit)) {
                //    matchesUnit = false;
                // }
            }

            return matchesSearch && matchesDate && matchesUnit;
        });
    }, [data, filters]);

    // Add serial numbers to display based on filtered view
    const dataWithSrNo = filteredData.map((item, index) => ({ ...item, serialNumber: index + 1 }));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="#E5E5E5" />
                        <path d="M34.4993 12.3359L32.166 14.6693M32.166 14.6693L35.666 18.1693L31.5827 22.2526L28.0827 18.7526M32.166 14.6693L28.0827 18.7526M23.2877 23.5476C23.8901 24.142 24.3689 24.8496 24.6967 25.6299C25.0245 26.4101 25.1947 27.2474 25.1975 28.0937C25.2004 28.9399 25.0358 29.7784 24.7132 30.5608C24.3907 31.3432 23.9166 32.054 23.3182 32.6524C22.7198 33.2508 22.0089 33.725 21.2265 34.0475C20.4441 34.37 19.6057 34.5346 18.7594 34.5318C17.9132 34.529 17.0758 34.3588 16.2956 34.031C15.5154 33.7032 14.8077 33.2243 14.2133 32.6219C13.0445 31.4117 12.3977 29.7909 12.4124 28.1084C12.427 26.426 13.1018 24.8166 14.2915 23.6269C15.4812 22.4372 17.0906 21.7624 18.773 21.7478C20.4554 21.7332 22.0763 22.3799 23.2865 23.5488L23.2877 23.5476ZM23.2877 23.5476L28.0827 18.7526" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h2 className="text-lg font-semibold text-[#404040]">21 Corps Provost Unit Key Out | In Register</h2>
                </div>
                <span className="text-sm font-medium  text-[#0A0A0A]">{filteredData.length} Reports</span>
            </div>
            <ReportFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                showOffenceType={false}
                showActionStatus={false}
                showDateRange={false}
                showDate={true}
                showUnit={false}
                unitOptions={unitOptions}
                showFilter={true}
                onReset={() => setFilters({
                    search: "",
                    date: "",
                    unit: "",
                    sortOrder: "asc",
                })}
                onAddNew={onAddNew}
                placeholder="Search by Name, Army No, Key No..."
            />

            <div className="rounded-md border border-gray-300 bg-white overflow-hidden shadow-sm">
                <div className="overflow-auto max-h-[75vh] relative [&::-webkit-scrollbar]:hidden">
                    <table className="w-full text-left text-sm text-gray-700 min-w-[1400px]">
                        <thead className="bg-[#F5F5F5] text-xs font-bold text-gray-900 border-b border-gray-300">
                            <tr>
                                <th className="px-4 py-3 border-r border-gray-300 w-28 align-middle sticky left-0 top-0 z-50 bg-[#F5F5F5]" rowSpan={2}>
                                    Sr no.
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-28 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Date
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-64 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Individuals Particular
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 align-middle w-64 sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Store/Office Name
                                </th>
                                { /* <th className="px-4 py-3 border-r border-gray-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Unit
                                </th> */ }
                                <th className="px-4 py-3 border-r border-gray-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Key No.
                                </th>
                                {/* Grouped Header: Key Out */}
                                <th className="px-4 py-2 border-r border-gray-300 text-center border-b border-gray-300 sticky top-0 z-40 bg-[#F5F5F5]" colSpan={2}>
                                    Key Out
                                </th>
                                {/* Grouped Header: Key In */}
                                <th className="px-4 py-2 border-r border-gray-300 text-center border-b border-gray-300 sticky top-0 z-40 bg-[#F5F5F5]" colSpan={2}>
                                    Key In
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-28 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Initials of MPCR NCO
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-28 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Initials of SM/SJCO
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-28 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Initials of 2IC
                                </th>
                                <th className="px-2 py-3 w-10 text-center align-middle sticky right-0 top-0 z-50 bg-[#F5F5F5]" rowSpan={2}></th>
                            </tr>
                            <tr>
                                {/* Key Out Subcols */}
                                <th className="px-4 py-2 border-r border-gray-300 w-24 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">Out Time</th>
                                <th className="px-4 py-2 border-r border-gray-300 w-24 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">Signature</th>

                                {/* Key In Subcols */}
                                <th className="px-4 py-2 border-r border-gray-300 w-24 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">In Time</th>
                                <th className="px-4 py-2 border-r border-gray-300 w-24 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">Signature</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {dataWithSrNo.length > 0 ? (
                                dataWithSrNo.map((item, index) => {
                                    const ind = item.details?.individual || {};
                                    return (
                                        <tr key={item._id || index} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-4 py-4 align-middle font-medium text-gray-900 border-r border-gray-300 text-center sticky left-0 z-30 bg-white group-hover:bg-gray-50">
                                                {item.serialNumber}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.date ? format(new Date(item.date), "dd/MM/yyyy") : "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300">
                                                <div className="flex flex-col space-y-1 text-xs">
                                                    <div className="grid grid-cols-[60px_1fr]">
                                                        <span className="font-bold text-gray-900">Army no.:</span>
                                                        <span className="text-[#0A0A0A]">{ind.armyNo || "-"}</span>
                                                    </div>
                                                    <div className="grid grid-cols-[60px_1fr]">
                                                        <span className="font-bold text-gray-900">Rank:</span>
                                                        <span className="text-[#0A0A0A]">{ind.rank || "-"}</span>
                                                    </div>
                                                    <div className="grid grid-cols-[60px_1fr]">
                                                        <span className="font-bold text-gray-900">Name:</span>
                                                        <span className="text-[#0A0A0A] font-medium uppercase">{ind.name || "-"}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.storeName || "-"}
                                            </td>
                                            {/* <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {ind.unit || ind.fmn || "-"}
                                            </td> */}
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.keyNumber || "-"}
                                            </td>

                                            {/* Key Out */}
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-gray-900 font-medium">
                                                {item.outTime ? format(new Date(item.outTime), "HH:mm") : "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-gray-900 font-medium">
                                                {item.outSignature?.value || "-"}
                                            </td>

                                            {/* Key In */}
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-gray-900 font-medium">
                                                {item.inTime ? format(new Date(item.inTime), "HH:mm") : "--"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300">
                                                {item.inSignature?.value || "--"}
                                            </td>

                                            {/* Initials */}
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-center">
                                                {item.authentication?.initialsMPCPNCO || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-center">
                                                {item.authentication?.initialsQMSJCO || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-center">
                                                {item.authentication?.initials2IC || "-"}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-2 py-4 align-middle text-center sticky right-0 z-30 bg-white group-hover:bg-gray-50">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreVertical className="h-4 w-4 text-gray-500" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => onEdit(item)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text[#0A0A0A]" onClick={() => handleDeleteClick(item._id)}>
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            <span>Delete</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={13} className="px-4 py-12 text-center text-gray-500">
                                        No records found matching your filters.
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
                title="Delete Entry"
                message="Are you sure you want to delete this entry? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
            />
        </div>
    );
};

export default KeyOutInTable;
