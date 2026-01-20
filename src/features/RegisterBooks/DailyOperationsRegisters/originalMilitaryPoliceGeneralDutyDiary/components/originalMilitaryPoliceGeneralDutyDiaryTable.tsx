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

interface GeneralDutyDiaryTableProps {
    data: any[];
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
    onAddNew?: () => void;
}

const GeneralDutyDiaryTable = ({ data, onEdit, onDelete, onAddNew }: GeneralDutyDiaryTableProps) => {
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        dutyType: "All",
        date: "",
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

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            // Search logic
            const searchTerm = filters.search.toLowerCase();
            const matchesSearch =
                (item.details?.placeOfDuty?.toLowerCase() || "").includes(searchTerm) ||
                (item.details?.briefOfDuty?.toLowerCase() || "").includes(searchTerm) ||
                (item.details?.individuals || []).some((ind: any) =>
                    (ind.name?.toLowerCase() || "").includes(searchTerm) ||
                    (ind.armyNo?.toLowerCase() || "").includes(searchTerm)
                );

            // Date logic
            const matchesDate = filters.date
                ? item.date && item.date.startsWith(filters.date)
                : true;

            // Duty Type logic
            const matchesDutyType = filters.dutyType && filters.dutyType !== "All"
                ? item.details?.typeOfDuty === filters.dutyType
                : true;

            return matchesSearch && matchesDate && matchesDutyType;
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
                showDutyType={true}
                showFilter={true}
                onReset={() => setFilters({
                    search: "",
                    dutyType: "All",
                    date: "",
                    sortOrder: "asc",
                })}
                onAddNew={onAddNew}
                placeholder="Search by..."
            />

            <div className="rounded-md border border-gray-300 bg-white overflow-hidden shadow-sm">
                <div className="overflow-auto max-h-[75vh] relative [&::-webkit-scrollbar]:hidden">
                    <table className="w-full text-left text-sm text-gray-700 min-w-[1400px]">
                        <thead className="bg-[#F5F5F5] text-xs font-bold text-gray-900 border-b border-gray-300">
                            <tr>
                                <th className="px-4 py-3 border-r border-gray-300 w-16 align-middle sticky left-0 top-0 z-50 bg-[#F5F5F5]" rowSpan={2}>
                                    Sr no.
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-28 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Date of Duty
                                </th>
                                {/* Duty Time Group */}
                                <th className="px-4 py-2 border-r border-gray-300 text-center border-b border-gray-300 sticky top-0 z-40 bg-[#F5F5F5]" colSpan={2}>
                                    Duty Time
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Place of Duty
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Type of Duty/Event
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-20 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Total Strength
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-72 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Assigned Individuals Particular
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Brief of Duty
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-24 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Initials of MPCR NCO
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-24 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Initials of SM/SJCO
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-24 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Initials of 2IC
                                </th>
                                <th className="px-2 py-3 w-10 text-center align-middle sticky right-0 top-0 z-50 bg-[#F5F5F5]" rowSpan={2}></th>
                            </tr>
                            <tr>
                                {/* Duty Time Subcols */}
                                <th className="px-4 py-2 border-r border-gray-300 w-20 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">From</th>
                                <th className="px-4 py-2 border-r border-gray-300 w-20 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">To</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {dataWithSrNo.length > 0 ? (
                                dataWithSrNo.map((item, index) => {
                                    return (
                                        <tr key={item._id || index} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-4 py-4 align-top font-medium text-gray-900 border-r border-gray-300 text-center sticky left-0 z-30 bg-white group-hover:bg-gray-50">
                                                {item.serialNumber}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-gray-900">
                                                {item.date ? format(new Date(item.date), "dd/MM/yyyy") : "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-gray-900">
                                                {item.details?.dutyFrom ? format(new Date(`2000-01-01T${item.details.dutyFrom}`), "HH:mm") : "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-gray-900">
                                                {item.details?.dutyTill ? format(new Date(`2000-01-01T${item.details.dutyTill}`), "HH:mm") : "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-gray-900">
                                                {item.details?.placeOfDuty || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-gray-900">
                                                {item.details?.typeOfDuty || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-center text-gray-900">
                                                {item.details?.totalStrength || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300">
                                                <div className="space-y-4">
                                                    {(item.details?.individuals || []).map((ind: any, i: number) => (
                                                        <div key={i} className="text-xs space-y-0.5">
                                                            <div className="grid grid-cols-[60px_1fr]">
                                                                <span className="font-bold text-gray-900">Army no.:</span>
                                                                <span className="text-gray-900">{ind.armyNo || "-"}</span>
                                                            </div>
                                                            <div className="grid grid-cols-[60px_1fr]">
                                                                <span className="font-bold text-gray-900">Rank:</span>
                                                                <span className="text-gray-900">{ind.rank || "-"}</span>
                                                            </div>
                                                            <div className="grid grid-cols-[60px_1fr]">
                                                                <span className="font-bold text-gray-900">Name:</span>
                                                                <span className="text-gray-900">{ind.name || "-"}</span>
                                                            </div>
                                                            <div className="grid grid-cols-[60px_1fr]">
                                                                <span className="font-bold text-gray-900">Unit:</span>
                                                                <span className="text-gray-900">{ind.unit || "-"}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-gray-900">
                                                <div className="space-y-2 text-xs">
                                                    {item.details?.briefOfDuty && (
                                                        <p>{item.details.briefOfDuty}</p>
                                                    )}
                                                    {item.details?.offenceOccurred && (
                                                        <>
                                                            <div className="pt-2 border-t border-gray-200 mt-2">
                                                                <span className="font-bold block">Report No.</span>
                                                                <span className="text-blue-600">{item.details.reportNo}</span>
                                                            </div>
                                                            <div>
                                                                <span className="font-bold block">Place of Offence:</span>
                                                                <span>{item.details.placeOfOffence}</span>
                                                            </div>
                                                            <div>
                                                                <span className="font-bold block">Offence Type:</span>
                                                                <span>{item.details.offenceType}</span>
                                                            </div>
                                                            <div>
                                                                <span className="font-bold block">Occurrence Brief:</span>
                                                                <span>{item.details.occurrenceBrief}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-center text-gray-900">
                                                {item.authentication?.initialsMPCPNCO || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-center text-gray-900">
                                                {item.authentication?.initialsQMSJCO || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-center text-gray-900">
                                                {item.authentication?.initials2IC || "-"}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-2 py-4 align-top text-center sticky right-0 z-30 bg-white group-hover:bg-gray-50">
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
                                                        <DropdownMenuItem className="text-[#0A0A0A]" onClick={() => handleDeleteClick(item._id)}>
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
                                    <td colSpan={12} className="px-4 py-12 text-center text-gray-500">
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

export default GeneralDutyDiaryTable;
