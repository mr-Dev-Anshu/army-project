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

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    // Extract unique units for filter options
    const unitOptions = useMemo(() => {
        const units = new Set<string>();
        data.forEach((item) => {
            const unit = item.details?.individual?.unit;
            if (unit) units.add(unit);
        });
        return Array.from(units).sort();
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
                const selectedUnits = filters.unit.split(",");
                const itemUnit = ind.unit || "";
                if (!itemUnit || !selectedUnits.includes(itemUnit)) {
                    matchesUnit = false;
                }
            }

            return matchesSearch && matchesDate && matchesUnit;
        });
    }, [data, filters]);

    // Add serial numbers to display based on filtered view
    const dataWithSrNo = filteredData.map((item, index) => ({ ...item, serialNumber: index + 1 }));

    return (
        <div className="space-y-4">
            <ReportFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                showOffenceType={false}
                showActionStatus={false}
                showDateRange={false}
                showDate={true}
                showUnit={true}
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

            <div className="rounded-md border border-gray-200 bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-700 min-w-[1400px]">
                        <thead className="bg-[#F5F5F5] text-xs font-bold text-gray-900 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 border-r border-gray-200 w-16 align-top" rowSpan={2}>
                                    Sr<br />no.
                                </th>
                                <th className="px-4 py-3 border-r border-gray-200 w-28 align-top" rowSpan={2}>
                                    Date
                                </th>
                                <th className="px-4 py-3 border-r border-gray-200 w-64 align-top" rowSpan={2}>
                                    Individuals Particular
                                </th>
                                <th className="px-4 py-3 border-r border-gray-200 align-top" rowSpan={2}>
                                    Store/Office<br />Name
                                </th>
                                <th className="px-4 py-3 border-r border-gray-200 align-top" rowSpan={2}>
                                    Unit
                                </th>
                                <th className="px-4 py-3 border-r border-gray-200 align-top" rowSpan={2}>
                                    Key No.
                                </th>
                                {/* Grouped Header: Key Out */}
                                <th className="px-4 py-2 border-r border-gray-200 text-center border-b border-gray-300" colSpan={2}>
                                    Key Out
                                </th>
                                {/* Grouped Header: Key In */}
                                <th className="px-4 py-2 border-r border-gray-200 text-center border-b border-gray-300" colSpan={2}>
                                    Key In
                                </th>
                                <th className="px-4 py-3 border-r border-gray-200 w-28 align-top" rowSpan={2}>
                                    Initials of<br />MPCR NCO
                                </th>
                                <th className="px-4 py-3 border-r border-gray-200 w-28 align-top" rowSpan={2}>
                                    Initials of<br />SM/SJCO
                                </th>
                                <th className="px-4 py-3 border-r border-gray-200 w-28 align-top" rowSpan={2}>
                                    Initials of<br />2IC
                                </th>
                                <th className="px-2 py-3 w-10 text-center align-top" rowSpan={2}></th>
                            </tr>
                            <tr>
                                {/* Key Out Subcols */}
                                <th className="px-4 py-2 border-r border-gray-200 w-24 align-top font-normal text-gray-600 bg-white">Out Time</th>
                                <th className="px-4 py-2 border-r border-gray-200 w-24 align-top font-normal text-gray-600 bg-white">Signature</th>

                                {/* Key In Subcols */}
                                <th className="px-4 py-2 border-r border-gray-200 w-24 align-top font-normal text-gray-600 bg-white">In Time</th>
                                <th className="px-4 py-2 border-r border-gray-200 w-24 align-top font-normal text-gray-600 bg-white">Signature</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {dataWithSrNo.length > 0 ? (
                                dataWithSrNo.map((item, index) => {
                                    const ind = item.details?.individual || {};
                                    return (
                                        <tr key={item._id || index} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-4 align-top font-medium text-gray-900 border-r border-gray-50 text-center">
                                                {item.serialNumber}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-50 text-gray-600">
                                                {item.date ? format(new Date(item.date), "dd/MM/yyyy") : "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-50">
                                                <div className="flex flex-col space-y-1 text-xs">
                                                    <div className="grid grid-cols-[60px_1fr]">
                                                        <span className="font-bold text-gray-900">Army no.:</span>
                                                        <span className="text-gray-600">{ind.armyNo || "-"}</span>
                                                    </div>
                                                    <div className="grid grid-cols-[60px_1fr]">
                                                        <span className="font-bold text-gray-900">Rank:</span>
                                                        <span className="text-gray-600">{ind.rank || "-"}</span>
                                                    </div>
                                                    <div className="grid grid-cols-[60px_1fr]">
                                                        <span className="font-bold text-gray-900">Name:</span>
                                                        <span className="text-gray-600 font-medium uppercase">{ind.name || "-"}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-50 text-gray-600">
                                                {item.details?.storeName || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-50 text-gray-600">
                                                {ind.unit || ind.fmn || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-50 text-gray-600">
                                                {item.details?.keyNumber || "-"}
                                            </td>

                                            {/* Key Out */}
                                            <td className="px-4 py-4 align-top border-r border-gray-50 text-gray-900 font-medium">
                                                {item.outTime ? format(new Date(item.outTime), "HH:mm") : "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-50">
                                                {/* Signature Placeholder */}
                                            </td>

                                            {/* Key In */}
                                            <td className="px-4 py-4 align-top border-r border-gray-50 text-gray-900 font-medium">
                                                {item.inTime ? format(new Date(item.inTime), "HH:mm") : "--"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-50">
                                                {item.inTime ? "--" : ""}
                                            </td>

                                            {/* Initials */}
                                            <td className="px-4 py-4 align-top border-r border-gray-50 text-center">
                                                {/* MPCR NCO */}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-50 text-center">
                                                {/* SM/SJCO */}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-50 text-center">
                                                {/* 2IC */}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-2 py-4 align-top text-center">
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
                                                        <DropdownMenuItem className="text-red-600" onClick={() => onDelete(item._id)}>
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
        </div>
    );
};

export default KeyOutInTable;
