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
import { useUpdateArmyHelpLineComplaintsRegister } from "../hooks";

interface ArmyHelpLineComplaintsRecordTableProps {
    data: any[];
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
    onAddNew?: () => void;
}

const ArmyHelpLineComplaintsRecordTable = ({ data, onEdit, onDelete, onAddNew }: ArmyHelpLineComplaintsRecordTableProps) => {
    const { mutateAsync: updateReport } = useUpdateArmyHelpLineComplaintsRegister();
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        date: "",
        fromDate: "",
        toDate: "",
        unit: "",
        fmn: "",
        placeOfOffence: "", // Reusing this filter key for Related Police Station as it's a location concept
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
                (ind.rank?.toLowerCase() || "").includes(searchTerm) ||
                (ind.unit?.toLowerCase() || "").includes(searchTerm) ||
                (ind.fmn?.toLowerCase() || "").includes(searchTerm) ||
                (item.details?.relatedPoliceStation?.toLowerCase() || "").includes(searchTerm) ||
                (item.details?.briefOfCase?.toLowerCase() || "").includes(searchTerm) ||
                (item.details?.mobileNo?.toLowerCase() || "").includes(searchTerm) ||
                (item.details?.civilAddress?.toLowerCase() || "").includes(searchTerm);

            // Date logic
            const matchesDate = filters.date
                ? item.date && item.date.startsWith(filters.date) // Assuming dateOfComplaint is stored in item.date
                : true;

            // Date Range Logic
            let matchesDateRange = true;
            if (filters.fromDate || filters.toDate) {
                const itemDate = new Date(item.date);
                if (filters.fromDate && new Date(filters.fromDate) > itemDate) {
                    matchesDateRange = false;
                }
                if (filters.toDate) {
                    const toDate = new Date(filters.toDate);
                    toDate.setHours(23, 59, 59, 999);
                    if (toDate < itemDate) {
                        matchesDateRange = false;
                    }
                }
            }

            // Unit Logic
            const matchesUnit = filters.unit
                ? (ind.unit?.toLowerCase() || "").includes(filters.unit.toLowerCase())
                : true;

            // FMN Logic
            const matchesFmn = filters.fmn
                ? (ind.fmn?.toLowerCase() || "").includes(filters.fmn.toLowerCase())
                : true;

            // Related Police Station Logic (using placeOfOffence filter)
            const matchesPoliceStation = filters.placeOfOffence
                ? (item.details?.relatedPoliceStation?.toLowerCase() || "") === filters.placeOfOffence.toLowerCase()
                : true;

            return matchesSearch && matchesDate && matchesDateRange && matchesUnit && matchesFmn && matchesPoliceStation;
        });
    }, [data, filters]);

    // Add serial numbers
    const dataWithSrNo = filteredData.map((item, index) => ({ ...item, serialNumber: index + 1 }));

    // Extract options for filters
    const unitOptions = useMemo(() => {
        const units = new Set(data.map(item => item.details?.individual?.unit).filter(Boolean));
        return Array.from(units) as string[];
    }, [data]);

    const fmnOptions = useMemo(() => {
        const fmns = new Set(data.map(item => item.details?.individual?.fmn).filter(Boolean));
        return Array.from(fmns) as string[];
    }, [data]);

    const policeStationOptions = useMemo(() => {
        const stations = new Set(data.map(item => item.details?.relatedPoliceStation).filter(Boolean));
        return Array.from(stations) as string[];
    }, [data]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="12" fill="#E5E5E5" />
                        <g clipPath="url(#clip0_737_46610)">
                            <path d="M17.0002 14.46V15.96C17.0008 16.0993 16.9723 16.2371 16.9165 16.3647C16.8607 16.4923 16.7789 16.6068 16.6762 16.701C16.5736 16.7951 16.4525 16.8668 16.3206 16.9114C16.1887 16.956 16.0489 16.9726 15.9102 16.96C14.3716 16.7929 12.8937 16.2671 11.5952 15.425C10.3871 14.6574 9.36288 13.6331 8.59521 12.425C7.7502 11.1207 7.22433 9.63555 7.06021 8.09005C7.04772 7.95178 7.06415 7.81243 7.10846 7.68086C7.15277 7.54929 7.224 7.42839 7.31759 7.32586C7.41119 7.22332 7.52511 7.1414 7.65211 7.08531C7.7791 7.02922 7.91638 7.00018 8.05521 7.00005H9.55521C9.79786 6.99766 10.0331 7.08359 10.2171 7.24181C10.4011 7.40004 10.5212 7.61977 10.5552 7.86005C10.6185 8.34008 10.7359 8.81141 10.9052 9.26505C10.9725 9.44401 10.987 9.63851 10.9472 9.82549C10.9073 10.0125 10.8146 10.1841 10.6802 10.32L10.0452 10.955C10.757 12.2068 11.7934 13.2433 13.0452 13.955L13.6802 13.32C13.8162 13.1856 13.9878 13.093 14.1748 13.0531C14.3618 13.0132 14.5562 13.0278 14.7352 13.095C15.1888 13.2643 15.6602 13.3817 16.1402 13.445C16.3831 13.4793 16.6049 13.6017 16.7635 13.7888C16.922 13.9759 17.0063 14.2148 17.0002 14.46Z" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.0249 7C14.044 7.10738 14.996 7.5594 15.7233 8.28129C16.4507 9.00318 16.9098 9.95171 17.0249 10.97" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.0249 9C13.5167 9.09697 13.9679 9.33951 14.3201 9.69615C14.6723 10.0528 14.9091 10.5071 14.9999 11" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_737_46610">
                                <rect width="12" height="12" fill="white" transform="translate(6 6)" />
                            </clipPath>
                        </defs>
                    </svg>

                    <h2 className="text-lg font-semibold text-[#404040]">Army Help Line Complaints Record Register</h2>
                </div>
                <span className="text-sm font-medium text-[#0A0A0A]">{filteredData.length} Reports</span>
            </div>

            <ReportFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                showDate={true}
                dateLabel="Complaint Date"
                showDateRange={false} // Screenshot shows specific date but no range explicitly, keeping false or as per need. Screenshot shows "Complaint Date", singular.
                showFilter={true}
                showUnit={true}
                unitOptions={unitOptions}
                showFmn={true}
                fmnOptions={fmnOptions}
                showPlaceOfOffence={true} // Using this for "Related Police Station"
                placeLabel="Related Police Station"
                placeOptions={policeStationOptions}

                // Explicitly disable unused filters
                showOffenceType={false}
                showActionStatus={false}

                onReset={() => setFilters({
                    search: "",
                    date: "",
                    fromDate: "",
                    toDate: "",
                    unit: "",
                    fmn: "",
                    placeOfOffence: "",
                    sortOrder: "asc",
                })}
                onAddNew={onAddNew}
                placeholder="Search by Name, Army No, Unit, FMN, Police Station..."
            />

            <div className="rounded-md border border-gray-300 bg-white overflow-hidden shadow-sm">
                <div className="overflow-auto max-h-[75vh] relative [&::-webkit-scrollbar]:hidden">
                    <table className="w-full text-left text-sm text-gray-700 min-w-[1400px]">
                        <thead className="bg-[#F5F5F5] text-xs font-bold text-gray-900 border-b border-gray-300">
                            <tr>
                                <th className="px-4 py-3 border-r border-gray-300 w-16 align-middle sticky left-0 top-0 z-50 bg-[#F5F5F5]">
                                    Sr no.
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-64 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Individuals Particular
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-28 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Unit
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-28 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    FMN
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-28 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Date of Complaint
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-40 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Related Police Station
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-48 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Civil Address
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Mobile No.
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-64 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Brief of case
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-28 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Initials of MPCR NCO
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-28 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Initials of SM/SJCO
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-28 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Initials of 2IC
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Remark
                                </th>
                                <th className="px-2 py-3 w-10 text-center align-middle sticky right-0 top-0 z-50 bg-[#F5F5F5] border-l border-gray-300"></th>
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
                                                {ind.unit || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {ind.fmn || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.date ? format(new Date(item.date), "dd/MM/yyyy") : "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.relatedPoliceStation || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.civilAddress || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.mobileNo || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.briefOfCase || "-"}
                                            </td>

                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-center text-center">
                                                <div className="flex justify-center">
                                                    <Checkbox
                                                        className="border-black"
                                                        checked={item.authentication?.initialsOfMPCRNCO || false}
                                                        onCheckedChange={() => handleInitialToggle(item, "initialsOfMPCRNCO")}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-center text-center">
                                                <div className="flex justify-center">
                                                    <Checkbox
                                                        className="border-black"
                                                        checked={item.authentication?.initialsOfSMSJCO || false}
                                                        onCheckedChange={() => handleInitialToggle(item, "initialsOfSMSJCO")}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-center text-center">
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
                                    <td colSpan={14} className="px-4 py-12 text-center text-gray-500">
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

export default ArmyHelpLineComplaintsRecordTable;
