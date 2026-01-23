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

interface VehicleInOutTableProps {
    data: any[];
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
    onAddNew?: () => void;
}

const VehicleInOutTable = ({ data, onEdit, onDelete, onAddNew }: VehicleInOutTableProps) => {
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        date: "",
        unit: "",
        sortOrder: "asc",
        vehicleType: "",
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
            const matchesSearch =
                (ind.name?.toLowerCase() || "").includes(searchTerm) ||
                (ind.armyNo?.toLowerCase() || "").includes(searchTerm) ||
                (item.details?.vehicleBaNumber?.toLowerCase() || "").includes(searchTerm) ||
                (item.details?.typeOfVehicle?.toLowerCase() || "").includes(searchTerm);

            // Date logic
            const matchesDate = filters.date
                ? item.date && item.date.startsWith(filters.date)
                : true;

            // Vehicle Type Filter
            const matchesVehicleType =
                !filters.vehicleType ||
                filters.vehicleType === "All" ||
                (item.details?.typeOfVehicle?.toLowerCase() === filters.vehicleType.toLowerCase());

            // Duty Type Filter (Nature of Duty)
            const matchesDutyType =
                !filters.dutyType ||
                filters.dutyType === "All" ||
                (item.details?.natureOfDuty?.toLowerCase() === filters.dutyType.toLowerCase());

            return matchesSearch && matchesDate && matchesVehicleType && matchesDutyType;
        });
    }, [data, filters]);

    // Generate dynamic options from data
    const vehicleTypeOptions = useMemo(() => {
        const unique = new Set(data.map(item => item.details?.typeOfVehicle).filter(Boolean));
        return Array.from(unique) as string[];
    }, [data]);

    const dutyTypeOptions = useMemo(() => {
        const unique = new Set(data.map(item => item.details?.natureOfDuty).filter(Boolean));
        return Array.from(unique) as string[];
    }, [data]);

    // Add serial numbers to display based on filtered view
    const dataWithSrNo = filteredData.map((item, index) => ({ ...item, serialNumber: index + 1 }));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="#E5E5E5" />
                        <path d="M26.334 28.6641H20.5007M32.1673 28.6641H35.6673V24.9891C35.6681 24.7115 35.5699 24.4427 35.3903 24.2309C35.2106 24.0192 34.9614 23.8785 34.6873 23.8341L28.6673 22.8308L25.5173 18.6308C25.4086 18.4859 25.2677 18.3683 25.1057 18.2873C24.9437 18.2063 24.7651 18.1641 24.584 18.1641H16.114C15.6791 18.1611 15.2521 18.2796 14.881 18.5064C14.51 18.7332 14.2097 19.0591 14.014 19.4475L13.0807 21.3491C12.5908 22.3228 12.3351 23.3975 12.334 24.4875V28.6641H14.6673" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17.5827 32.1693C19.1935 32.1693 20.4993 30.8634 20.4993 29.2526C20.4993 27.6418 19.1935 26.3359 17.5827 26.3359C15.9719 26.3359 14.666 27.6418 14.666 29.2526C14.666 30.8634 15.9719 32.1693 17.5827 32.1693Z" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M29.2507 32.1693C30.8615 32.1693 32.1673 30.8634 32.1673 29.2526C32.1673 27.6418 30.8615 26.3359 29.2507 26.3359C27.6398 26.3359 26.334 27.6418 26.334 29.2526C26.334 30.8634 27.6398 32.1693 29.2507 32.1693Z" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h2 className="text-lg font-semibold text-[#404040]">Vehicle In | Out Register</h2>
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
                showDutyType={true}
                showVehicleType={true}
                vehicleTypeOptions={vehicleTypeOptions}
                dutyTypeOptions={dutyTypeOptions}
                onReset={() => setFilters({
                    search: "",
                    date: "",
                    unit: "",
                    sortOrder: "asc",
                    vehicleType: "",
                    dutyType: "",
                })}
                onAddNew={onAddNew}
                placeholder="Search by Name, Army No, Vehicle No..."
            />

            <div className="rounded-md border border-gray-300 bg-white overflow-hidden shadow-sm">
                <div className="overflow-auto max-h-[75vh] relative [&::-webkit-scrollbar]:hidden">
                    <table className="w-full text-left text-sm text-gray-700 min-w-[1400px]">
                        <thead className="bg-[#F5F5F5] text-xs font-bold text-gray-900 border-b border-gray-300">
                            <tr>
                                <th className="px-4 py-3 border-r border-gray-300 w-16 align-middle sticky left-0 top-0 z-50 bg-[#F5F5F5]" rowSpan={2}>
                                    Sr no.
                                </th>
                                {/* Grouped Header: Vehicle Out|In Time */}
                                <th className="px-4 py-2 border-r border-gray-300 text-center border-b border-gray-300 sticky top-0 z-40 bg-[#F5F5F5]" colSpan={3}>
                                    Vehicle Out|In Time
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-64 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Individuals Particular
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Vehicle BA No.
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Type of Vehicle
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Type of Duty/Event
                                </th>
                                {/* Grouped Header: Vehicle Location */}
                                <th className="px-4 py-2 border-r border-gray-300 text-center border-b border-gray-300 sticky top-0 z-40 bg-[#F5F5F5]" colSpan={2}>
                                    Vehicle Location
                                </th>
                                {/* Grouped Header: Kilometer */}
                                <th className="px-4 py-2 border-r border-gray-300 text-center border-b border-gray-300 sticky top-0 z-40 bg-[#F5F5F5]" colSpan={2}>
                                    Kilometer
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
                                {/* Vehicle Out|In Time Subcols */}
                                <th className="px-4 py-2 border-r border-gray-300 w-24 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">Out Time</th>
                                <th className="px-4 py-2 border-r border-gray-300 w-24 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">Out Sig</th>
                                <th className="px-4 py-2 border-r border-gray-300 w-24 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">In Time</th>

                                {/* Vehicle Location Subcols */}
                                <th className="px-4 py-2 border-r border-gray-300 w-32 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">From</th>
                                <th className="px-4 py-2 border-r border-gray-300 w-32 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">To</th>

                                {/* Kilometer Subcols */}
                                <th className="px-4 py-2 border-r border-gray-300 w-24 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">km Out</th>
                                <th className="px-4 py-2 border-r border-gray-300 w-24 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">km In</th>
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

                                            {/* Vehicle Out|In Time */}
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 font-medium">
                                                {item.details?.vehicleOutTime || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300">
                                                {item.details?.outSignature?.value || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 font-medium">
                                                {item.details?.vehicleInTime || "-- : --"}
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
                                                {item.details?.vehicleBaNumber || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.typeOfVehicle || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.natureOfDuty || "-"}
                                            </td>

                                            {/* Location */}
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.fromLocation || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.toLocation || "-"}
                                            </td>

                                            {/* Kilometers - Placeholder as these fields are not in form yet, but in table design */}
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.kmOut || "--"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.kmIn || "--"}
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
                                    <td colSpan={16} className="px-4 py-12 text-center text-gray-500">
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

export default VehicleInOutTable;
