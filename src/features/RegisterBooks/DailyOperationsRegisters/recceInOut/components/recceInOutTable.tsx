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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import { useUpdateRecceInOutRegister } from "../hooks";

interface RecceInOutTableProps {
    data: any[];
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
    onAddNew?: () => void;
}

const RecceInOutTable = ({ data, onEdit, onDelete, onAddNew }: RecceInOutTableProps) => {
    const { mutateAsync: updateReport } = useUpdateRecceInOutRegister();
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

    const handleInitialToggle = async (record: any, field: string) => {
        try {
            const currentAuth = record.authentication || {};
            const isAdding = !currentAuth[field];
            const newAuth = {
                initialsOfMPCRNCO: currentAuth.initialsOfMPCRNCO || false,
                initialsOfSMSJCO: currentAuth.initialsOfSMSJCO || false,
                initialsOf2IC: currentAuth.initialsOf2IC || false,
                [field]: isAdding
            };

            await updateReport({
                id: record._id,
                payload: {
                    authentication: newAuth
                },
                suppressToast: true
            });

            if (isAdding) {
                toast.success("Sign added.");
            } else {
                toast.success("Sign removed.");
            }
        } catch (error) {
            console.error("Failed to update initial", error);
            toast.error("Failed to update sign");
        }
    };

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            // Search logic
            const searchTerm = filters.search.toLowerCase();
            const ind = item.details?.individual || {};
            const matchesSearch =
                (ind.name?.toLowerCase() || "").includes(searchTerm) ||
                (ind.armyNo?.toLowerCase() || "").includes(searchTerm) ||
                (item.details?.placeOfRecce?.toLowerCase() || "").includes(searchTerm);

            // Date logic
            const matchesDate = filters.date
                ? item.date && item.date.startsWith(filters.date)
                : true;

            return matchesSearch && matchesDate;
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
                        <path d="M21.666 21.6641H26.3327" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M32.1667 18.1667V14.6667C32.1667 14.3572 32.0438 14.0605 31.825 13.8417C31.6062 13.6229 31.3094 13.5 31 13.5H28.6667C28.3572 13.5 28.0605 13.6229 27.8417 13.8417C27.6229 14.0605 27.5 14.3572 27.5 14.6667V18.1667" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M33.334 34.4974C33.9528 34.4974 34.5463 34.2516 34.9839 33.814C35.4215 33.3764 35.6673 32.7829 35.6673 32.1641V27.6712C35.6673 26.0496 33.334 24.2156 33.334 22.0374V19.3307C33.334 19.0213 33.2111 18.7246 32.9923 18.5058C32.7735 18.287 32.4767 18.1641 32.1673 18.1641H27.5007C27.1912 18.1641 26.8945 18.287 26.6757 18.5058C26.4569 18.7246 26.334 19.0213 26.334 19.3307V32.1641C26.334 32.7829 26.5798 33.3764 27.0174 33.814C27.455 34.2516 28.0485 34.4974 28.6673 34.4974H33.334Z" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M35.6673 28.6641H12.334" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14.6673 34.4974C14.0485 34.4974 13.455 34.2516 13.0174 33.814C12.5798 33.3764 12.334 32.7829 12.334 32.1641V27.6712C12.334 26.0496 14.6673 24.2156 14.6673 22.0374V19.3307C14.6673 19.0213 14.7902 18.7246 15.009 18.5058C15.2278 18.287 15.5246 18.1641 15.834 18.1641H20.5007C20.8101 18.1641 21.1068 18.287 21.3256 18.5058C21.5444 18.7246 21.6673 19.0213 21.6673 19.3307V32.1641C21.6673 32.7829 21.4215 33.3764 20.9839 33.814C20.5463 34.2516 19.9528 34.4974 19.334 34.4974H14.6673Z" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20.5007 18.1667V14.6667C20.5007 14.3572 20.3777 14.0605 20.1589 13.8417C19.9401 13.6229 19.6434 13.5 19.334 13.5H17.0007C16.6912 13.5 16.3945 13.6229 16.1757 13.8417C15.9569 14.0605 15.834 14.3572 15.834 14.6667V18.1667" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h2 className="text-lg font-semibold text-[#404040]">Recce In | Out Register</h2>
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
                showFilter={true}
                showFmn={false}
                showPlaceOfOffence={false}
                showDutyType={false}
                showVehicleType={false}
                onReset={() => setFilters({
                    search: "",
                    date: "",
                    unit: "",
                    sortOrder: "asc",
                })}
                onAddNew={onAddNew}
                placeholder="Search by Name, Army No, Place..."
            />

            <div className="rounded-md border border-gray-300 bg-white overflow-hidden shadow-sm">
                <div className="overflow-auto max-h-[75vh] relative [&::-webkit-scrollbar]:hidden">
                    <table className="w-full text-left text-sm text-gray-700 min-w-[1200px]">
                        <thead className="bg-[#F5F5F5] text-xs font-bold text-gray-900 border-b border-gray-300">
                            <tr>
                                <th className="px-4 py-3 border-r border-gray-300 w-16 align-middle sticky left-0 top-0 z-50 bg-[#F5F5F5]" rowSpan={2}>
                                    Sr no.
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Date
                                </th>
                                {/* Grouped Header: Out|In Time */}
                                <th className="px-4 py-2 border-r border-gray-300 text-center border-b border-gray-300 sticky top-0 z-40 bg-[#F5F5F5]" colSpan={2}>
                                    Out|In Time
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Signature of Indvi.
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-64 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Individuals Particular
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-48 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Place of Recce
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
                                <th className="px-4 py-3 border-r border-gray-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Remark
                                </th>
                                <th className="px-2 py-3 w-10 text-center align-middle sticky right-0 top-0 z-50 bg-[#F5F5F5]" rowSpan={2}></th>
                            </tr>
                            <tr>
                                {/* Out|In Time Subcols */}
                                <th className="px-4 py-2 border-r border-gray-300 w-24 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">Out Time</th>
                                <th className="px-4 py-2 border-r border-gray-300 w-24 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">In Time</th>
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

                                            {/* Out|In Time */}
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 font-medium">
                                                {item.details?.recceOutTime || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 font-medium">
                                                {item.details?.dutyInTime || "-"}
                                            </td>

                                            {/* Signature */}
                                            <td className="px-4 py-4 align-middle border-r border-gray-300">
                                                {item.details?.outSignature?.value || "-"}
                                            </td>

                                            {/* Individuals Particular */}
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

                                            {/* Place of Recce */}
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.placeOfRecce || "-"}
                                            </td>

                                            {/* Initials */}
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-center">
                                                <div className="flex justify-center">
                                                    <Checkbox
                                                        className="border-black"
                                                        checked={item.authentication?.initialsOfMPCRNCO || false}
                                                        onCheckedChange={() => handleInitialToggle(item, "initialsOfMPCRNCO")}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-center">
                                                <div className="flex justify-center">
                                                    <Checkbox
                                                        className="border-black"
                                                        checked={item.authentication?.initialsOfSMSJCO || false}
                                                        onCheckedChange={() => handleInitialToggle(item, "initialsOfSMSJCO")}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-center">
                                                <div className="flex justify-center">
                                                    <Checkbox
                                                        className="border-black"
                                                        checked={item.authentication?.initialsOf2IC || false}
                                                        onCheckedChange={() => handleInitialToggle(item, "initialsOf2IC")}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.remark || "-"}
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
                                                        <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteClick(item._id)}>
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

export default RecceInOutTable;
