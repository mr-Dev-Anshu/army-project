
import React, { useState, useMemo } from "react";
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

interface ContactInfoCivilPoliceStationTableProps {
    data: any[];
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
    onAddNew?: () => void;
}

const ContactInfoCivilPoliceStationTable = ({ data, onEdit, onDelete, onAddNew }: ContactInfoCivilPoliceStationTableProps) => {
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        district: "",
        state: "",
        rankOfStation: "",
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
            const d = item.details || {};

            // Search logic
            const searchTerm = filters.search.toLowerCase();
            const matchesSearch =
                (d.policeStationName?.toLowerCase() || "").includes(searchTerm) ||
                (d.rankOfStation?.toLowerCase() || "").includes(searchTerm) ||
                (d.shoName?.toLowerCase() || "").includes(searchTerm) ||
                (d.addressOfStation?.toLowerCase() || "").includes(searchTerm) ||
                (d.district?.toLowerCase() || "").includes(searchTerm);

            // Filter logic
            const matchesDistrict = filters.district
                ? (d.district?.toLowerCase() || "").includes(filters.district.toLowerCase())
                : true;

            const matchesState = filters.state
                ? (d.state?.toLowerCase() || "").includes(filters.state.toLowerCase())
                : true;

            const matchesRankOfStation = filters.rankOfStation
                ? (d.rankOfStation?.toLowerCase() || "").includes(filters.rankOfStation.toLowerCase())
                : true;

            return matchesSearch && matchesDistrict && matchesState && matchesRankOfStation;
        });
    }, [data, filters]);

    // Add serial numbers
    const dataWithSrNo = filteredData.map((item, index) => ({ ...item, serialNumber: index + 1 }));

    // Extract options
    const districtOptions = useMemo(() => {
        const districts = new Set(data.map(item => item.details?.district).filter(Boolean));
        return Array.from(districts) as string[];
    }, [data]);

    const stateOptions = useMemo(() => {
        const states = new Set(data.map(item => item.details?.state).filter(Boolean));
        return Array.from(states) as string[];
    }, [data]);

    const rankOfStationOptions = useMemo(() => {
        const ranks = new Set(data.map(item => item.details?.rankOfStation).filter(Boolean));
        return Array.from(ranks) as string[];
    }, [data]);


    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="12" fill="#E5E5E5" />
                        <g clip-path="url(#clip0_1140_119898)">
                            <path d="M13.5 12.5C13.5 12.1022 13.342 11.7206 13.0607 11.4393C12.7794 11.158 12.3978 11 12 11C11.6022 11 11.2206 11.158 10.9393 11.4393C10.658 11.7206 10.5 12.1022 10.5 12.5" stroke="#525252" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M8 15.75V8.25C8 7.91848 8.1317 7.60054 8.36612 7.36612C8.60054 7.1317 8.91848 7 9.25 7H15.5C15.6326 7 15.7598 7.05268 15.8536 7.14645C15.9473 7.24021 16 7.36739 16 7.5V16.5C16 16.6326 15.9473 16.7598 15.8536 16.8536C15.7598 16.9473 15.6326 17 15.5 17H9.25C8.91848 17 8.60054 16.8683 8.36612 16.6339C8.1317 16.3995 8 16.0815 8 15.75ZM8 15.75C8 15.4185 8.1317 15.1005 8.36612 14.8661C8.60054 14.6317 8.91848 14.5 9.25 14.5H16" stroke="#525252" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M12 11C12.5523 11 13 10.5523 13 10C13 9.44772 12.5523 9 12 9C11.4477 9 11 9.44772 11 10C11 10.5523 11.4477 11 12 11Z" stroke="#525252" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_1140_119898">
                                <rect width="12" height="12" fill="white" transform="translate(6 6)" />
                            </clipPath>
                        </defs>
                    </svg>

                    <h2 className="text-lg font-semibold text-[#404040]">Contact Info. of Civil Police Station</h2>
                </div>
                <span className="text-sm font-medium text-[#0A0A0A]">{filteredData.length} Contacts</span>
            </div>

            <ReportFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                showDate={false}
                showDateRange={false}
                showFilter={true}

                showDistrict={true}
                districtOptions={districtOptions}

                showState={true}
                stateOptions={stateOptions}

                showRankOfStation={true}
                rankOfStationOptions={rankOfStationOptions}

                // Disable others
                showFmn={false}
                showPlaceOfOffence={false}
                showOffenceType={false}
                showActionStatus={false}
                showUnit={false} // Different type of unit/rank here

                onReset={() => setFilters({
                    search: "",
                    district: "",
                    state: "",
                    rankOfStation: "",
                    sortOrder: "asc",
                })}
                onAddNew={onAddNew}
                placeholder="Search by Station Name, District, Rank..."
            />

            <div className="rounded-md border border-gray-300 bg-white overflow-hidden shadow-sm">
                <div className="overflow-auto max-h-[75vh] relative [&::-webkit-scrollbar]:hidden">
                    <table className="w-full text-left text-sm text-gray-700 min-w-[1200px]">
                        <thead className="bg-[#F5F5F5] text-xs font-bold text-gray-900 border-b border-gray-300">
                            <tr>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-300 w-16 align-middle sticky left-0 top-0 z-45 bg-[#F5F5F5]">
                                    Sr no.
                                </th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-300 w-48 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Police Station Name
                                </th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Rank of Station
                                </th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-300 w-48 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Address of Police Station
                                </th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    District
                                </th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-300 w-40 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Head of Station (SHO) Name
                                </th>
                                <th colSpan={2} className="px-4 py-2 border-r border-b border-gray-300 text-center align-middle sticky top-0 z-40 bg-[#F5F5F5] text-sm md:text-base">
                                    Contact Number
                                </th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-300 w-48 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Station Email Id
                                </th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Remark
                                </th>
                                <th rowSpan={2} className="px-2 py-3 w-10 text-center align-middle sticky right-0 top-0 z-45 bg-[#F5F5F5] border-l border-gray-300"></th>
                            </tr>
                            <tr>
                                <th className="px-4 py-2 border-r border-gray-300 w-40 text-center align-middle sticky top-[31px] z-40 bg-[#F5F5F5]">
                                    Landline No.
                                </th>
                                <th className="px-4 py-2 border-r border-gray-300 w-40 text-center align-middle sticky top-[31px] z-40 bg-[#F5F5F5]">
                                    Mobile No.
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {dataWithSrNo.length > 0 ? (
                                dataWithSrNo.map((item, index) => {
                                    const d = item.details || {};
                                    return (
                                        <tr key={item._id || index} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-4 py-4 align-middle font-medium text-gray-900 border-r border-gray-300 text-center sticky left-0 z-30 bg-white group-hover:bg-gray-50">
                                                {item.serialNumber}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {d.policeStationName || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {d.rankOfStation || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {d.addressOfStation || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {d.district || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {d.shoName || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-center text-[#0A0A0A]">
                                                {d.officeLandlineNumber || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-center text-[#0A0A0A]">
                                                {d.mobileNumber || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {d.stationEmailId || "-"}
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
                                    <td colSpan={10} className="px-4 py-12 text-center text-gray-500">
                                        No contacts found matching your filters.
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
                message="Are you sure you want to delete this contact? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
            />
        </div>
    );
};

export default ContactInfoCivilPoliceStationTable;
