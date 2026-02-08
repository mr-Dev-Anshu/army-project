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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import { useUpdateMiniKoteArmsAmnInOutRegister } from "../hooks";
import ConfirmationModal from "@/components/common/ConfirmationModal";

interface MiniKoteArmsAmnInOutTableProps {
    data: any[];
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
    onAddNew?: () => void;
}

const MiniKoteArmsAmnInOutTable = ({ data, onEdit, onDelete, onAddNew }: MiniKoteArmsAmnInOutTableProps) => {
    const { mutate: updateReport } = useUpdateMiniKoteArmsAmnInOutRegister();
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
                [field]: isAdding // Toggle the specific field
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
                (item.details?.typeOfArms?.toLowerCase() || "").includes(searchTerm) ||
                (item.details?.buttNo?.toLowerCase() || "").includes(searchTerm) ||
                (item.details?.registrationNo?.toLowerCase() || "").includes(searchTerm);

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
                        <path d="M23.9993 35.6693C23.9993 35.6693 33.3327 31.0026 33.3327 24.0026V15.8359L23.9993 12.3359L14.666 15.8359V24.0026C14.666 31.0026 23.9993 35.6693 23.9993 35.6693Z" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    <h2 className="text-lg font-semibold text-[#404040]">MINI Kote Arms / AMN Out|In Register</h2>
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
                placeholder="Search by Name, Army No, Arms, BUTT No..."
            />

            <div className="rounded-md border border-gray-300 bg-white overflow-hidden shadow-sm">
                <div className="overflow-auto max-h-[75vh] relative [&::-webkit-scrollbar]:hidden">
                    <table className="w-full text-left text-sm text-gray-700 min-w-[2000px]">
                        <thead className="bg-[#F5F5F5] text-xs font-bold text-gray-900 border-b border-gray-300">
                            <tr>
                                <th className="px-4 py-3 border-r border-gray-300 w-16 align-middle sticky left-0 top-0 z-50 bg-[#F5F5F5]" rowSpan={2}>
                                    Sr no.
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-64 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Individuals Particular
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Type of Arms
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    BUTT No.
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Registration No.
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Type of AMN
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-24 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Quantity of AMN
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Type of Duty/Event
                                </th>

                                {/* Grouped Header: Out */}
                                <th className="px-4 py-2 border-r border-gray-300 text-center border-b border-gray-300 sticky top-0 z-40 bg-[#F5F5F5]" colSpan={2}>
                                    Out
                                </th>

                                {/* Grouped Header: In */}
                                <th className="px-4 py-2 border-r border-gray-300 text-center border-b border-gray-300 sticky top-0 z-40 bg-[#F5F5F5]" colSpan={2}>
                                    In
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
                                <th className="px-2 py-3 w-10 text-center align-middle sticky right-0 top-0 z-50 bg-[#F5F5F5] border-l border-gray-300" rowSpan={2}></th>
                            </tr>
                            <tr>
                                {/* Out Subcols */}
                                <th className="px-4 py-2 border-r border-gray-300 w-24 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">Out Time</th>
                                <th className="px-4 py-2 border-r border-gray-300 w-24 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">Signature</th>

                                {/* In Subcols */}
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

                                            {/* Arms Details */}
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.typeOfArms || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.buttNo || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.registrationNo || "-"}
                                            </td>

                                            {/* AMN Details */}
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.typeOfAmn || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.quantityOfAmn || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.typeOfDuty || "-"}
                                            </td>


                                            {/* Out */}
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 font-medium">
                                                {item.details?.armsOutTime || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300">
                                                {item.details?.outSignature?.value || "-"}
                                            </td>

                                            {/* In */}
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 font-medium">
                                                {item.details?.armsInTime || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300">
                                                {item.details?.inSignature?.value || "-"}
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
                                            <td className="px-2 py-4 align-middle text-center sticky right-0 z-30 bg-white group-hover:bg-gray-50 border-l border-gray-300">
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
                                    <td colSpan={17} className="px-4 py-12 text-center text-gray-500">
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

export default MiniKoteArmsAmnInOutTable;
