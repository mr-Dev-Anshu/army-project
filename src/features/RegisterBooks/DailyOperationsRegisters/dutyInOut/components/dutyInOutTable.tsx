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

interface DutyInOutTableProps {
    data: any[];
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
    onAddNew?: () => void;
}

const DutyInOutTable = ({ data, onEdit, onDelete, onAddNew }: DutyInOutTableProps) => {
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

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            // Search logic
            const searchTerm = filters.search.toLowerCase();
            const ind = item.details?.individual || {};
            const devices = item.details?.assignedDevices || {};

            const matchesSearch =
                (ind.name?.toLowerCase() || "").includes(searchTerm) ||
                (ind.armyNo?.toLowerCase() || "").includes(searchTerm) ||
                (ind.rank?.toLowerCase() || "").includes(searchTerm) ||
                (devices.motorolas?.some((id: string) => id.toLowerCase().includes(searchTerm))) ||
                (devices.cameras?.some((id: string) => id.toLowerCase().includes(searchTerm)));

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
                        <path d="M13.5 7.5H15.5C15.7652 7.5 16.0196 7.60536 16.2071 7.79289C16.3946 7.98043 16.5 8.23478 16.5 8.5V15.5C16.5 15.7652 16.3946 16.0196 16.2071 16.2071C16.0196 16.3946 15.7652 16.5 15.5 16.5H13.5" stroke="#404040" strokeWidth="1.2" strokeLinejoin="round" />
                        <path d="M11 14.5L13.5 12L11 9.5" stroke="#404040" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="round" />
                        <path d="M13.5 12H7.5" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    <h2 className="text-lg font-semibold text-[#404040]">Duty Out|In Register</h2>
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
                placeholder="Search by Name, Army No, Device ID..."
            />

            <div className="rounded-xl border border-neutral-300 bg-white overflow-hidden shadow-sm">
                <div className="overflow-auto max-h-[75vh] relative [&::-webkit-scrollbar]:hidden">
                    <table className="w-full text-left text-sm text-neutral-600 min-w-[1700px]">
                        <thead className="bg-[#F5F5F5] text-xs font-bold text-neutral-900 border-b border-neutral-300">
                            <tr>
                                <th className="px-4 py-3 border-r border-neutral-300 w-16 align-middle sticky left-0 top-0 z-50 bg-[#F5F5F5]" rowSpan={2}>
                                    Sr no.
                                </th>
                                <th className="px-4 py-3 border-r border-neutral-300 w-64 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Individuals Particular
                                </th>
                                <th className="px-4 py-3 border-r border-neutral-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Type of Duty/Event
                                </th>
                                <th className="px-4 py-3 border-r border-neutral-300 w-40 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Place of Duty
                                </th>
                                <th className="px-4 py-3 border-r border-neutral-300 w-36 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    ID No. of Motorola
                                </th>
                                <th className="px-4 py-3 border-r border-neutral-300 w-36 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    ID No. of Body Worn Camera
                                </th>

                                {/* Duty Out|In Time */}
                                <th className="px-4 py-2 border-r border-neutral-300 text-center border-b border-neutral-300 sticky top-0 z-40 bg-[#F5F5F5]" colSpan={3}>
                                    Duty Out|In Time
                                </th>

                                <th className="px-4 py-3 border-r border-neutral-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Initials of MPCR NCO
                                </th>
                                <th className="px-4 py-3 border-r border-neutral-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Initials of SM/SJCO
                                </th>
                                <th className="px-4 py-3 border-r border-neutral-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Initials of 2IC
                                </th>
                                <th className="px-4 py-3 border-r border-neutral-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Remark
                                </th>
                                <th className="px-2 py-3 w-10 text-center align-middle sticky right-0 top-0 z-50 bg-[#F5F5F5] border-l border-neutral-300" rowSpan={2}></th>
                            </tr>
                            <tr>
                                {/* Duty Out|In Time Subcols */}
                                <th className="px-4 py-2 border-r border-neutral-300 w-24 align-middle bg-[#F5F5F5] sticky top-[31px] z-40 text-center">Out Time</th>
                                <th className="px-4 py-2 border-r border-neutral-300 w-24 align-middle bg-[#F5F5F5] sticky top-[31px] z-40 text-center">Signature</th>
                                <th className="px-4 py-2 border-r border-neutral-300 w-24 align-middle bg-[#F5F5F5] sticky top-[31px] z-40 text-center">In Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                            {dataWithSrNo.length > 0 ? (
                                dataWithSrNo.map((item, index) => {
                                    const ind = item.details?.individual || {};
                                    const devices = item.details?.assignedDevices || {};

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
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-[#0A0A0A]">
                                                {devices.motorolas && devices.motorolas.length > 0 ? (
                                                    <div className="flex flex-col gap-1 max-h-[130px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                                                        {devices.motorolas.map((id: string, i: number) => (
                                                            id && <span key={i} className={`px-1.5 py-1 text-xs inline-block w-fit ${i === devices.motorolas.length - 1 ? "" : "border-b border-neutral-300"}`}>{id}</span>
                                                        ))}
                                                    </div>
                                                ) : "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-[#0A0A0A]">
                                                {devices.cameras && devices.cameras.length > 0 ? (
                                                    <div className="flex flex-col gap-1 max-h-[130px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                                                        {devices.cameras.map((id: string, i: number) => (
                                                            id && <span key={i} className={`px-1.5 py-1 text-xs inline-block w-fit ${i === devices.cameras.length - 1 ? "" : "border-b border-neutral-300"}`}>{id}</span>
                                                        ))}
                                                    </div>
                                                ) : "-"}
                                            </td>

                                            {/* Duty Out|In Time */}
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-[#0A0A0A] font-medium text-center">
                                                {item.details?.dutyOutTime || "-- : --"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-[#0A0A0A] text-center">
                                                {/* Showing Out signature as primary, or fallback to placeholder */}
                                                {item.details?.outSignature ? (
                                                    <div>{item.details.outSignature}</div>
                                                ) : ""}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-[#0A0A0A] font-medium text-center">
                                                {item.details?.dutyInTime || "-- : --"}
                                            </td>

                                            {/* Initials */}
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-center text-[#0A0A0A]">
                                                {item.authentication?.initialsMPCPNCO || ""}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-center text-[#0A0A0A]">
                                                {item.authentication?.initialsSM_SJCO || item.authentication?.initialsQMSJCO || ""}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-center text-[#0A0A0A]">
                                                {item.authentication?.initials2IC || ""}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-neutral-300 text-[#0A0A0A]">
                                                <p className="line-clamp-2 max-w-[200px]">{item.remark || ""}</p>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-2 py-4 align-top text-center sticky right-0 z-30 bg-white group-hover:bg-neutral-50 border-l border-neutral-300 h-full">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-neutral-100 rounded-full">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreVertical className="h-4 w-4 text-neutral-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-[160px]">
                                                        <DropdownMenuItem onClick={() => onEdit(item)} className="cursor-pointer">
                                                            <Edit className="mr-2 h-4 w-4 text-neutral-500" />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer" onClick={() => handleDeleteClick(item._id)}>
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
                                    <td colSpan={14} className="px-4 py-12 text-center text-neutral-500">
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

export default DutyInOutTable;
