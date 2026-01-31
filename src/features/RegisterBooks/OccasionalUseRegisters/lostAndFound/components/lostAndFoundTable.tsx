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
import { useUpdateLostAndFoundRegister } from "../hooks";

interface LostAndFoundTableProps {
    data: any[];
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
    onAddNew?: () => void;
}

const LostAndFoundTable = ({ data, onEdit, onDelete, onAddNew }: LostAndFoundTableProps) => {
    const { mutateAsync: updateReport } = useUpdateLostAndFoundRegister();
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        date: "",
        fromDate: "",
        toDate: "",
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

    // Toggle for standard authentication (Deposit)
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

    // Toggle for Takeover authentication (details.takeoverAuth)
    const handleTakeoverToggle = async (record: any, field: string) => {
        try {
            const currentDetails = record.details || {};
            const currentAuth = currentDetails.takeoverAuth || {};
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
                    details: {
                        ...currentDetails,
                        takeoverAuth: newAuth
                    }
                },
                suppressToast: true
            });

            if (isAdding) {
                toast.success("Sign added.");
            } else {
                toast.success("Sign removed.");
            }
        } catch (error) {
            console.error("Failed to update takeover initial", error);
            toast.error("Failed to update sign");
        }
    };

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            // Search logic
            const searchTerm = filters.search.toLowerCase();
            const matchesSearch =
                (item.details?.itemName?.toLowerCase() || "").includes(searchTerm) ||
                (item.details?.place?.toLowerCase() || "").includes(searchTerm) ||
                (item.details?.handedByName?.toLowerCase() || "").includes(searchTerm) ||
                (item.details?.takeoverBy?.toLowerCase() || "").includes(searchTerm);

            // Date logic
            const matchesDate = filters.date
                ? item.date && item.date.startsWith(filters.date)
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

            return matchesSearch && matchesDate && matchesDateRange;
        });
    }, [data, filters]);

    // Add serial numbers
    const dataWithSrNo = filteredData.map((item, index) => ({ ...item, serialNumber: index + 1 }));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">

                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="12" fill="#E5E5E5" />
                        <g clip-path="url(#clip0_565_39474)">
                            <path d="M12 14.5H12.75" stroke="#404040" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M12 17H12.75" stroke="#404040" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M12 7H12.75" stroke="#404040" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M14.75 17H15.5C15.6326 17 15.7598 16.9473 15.8536 16.8536C15.9473 16.7598 16 16.6326 16 16.5" stroke="#404040" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M14.75 7H15.5C15.6326 7 15.7598 7.05268 15.8536 7.14645C15.9473 7.24021 16 7.36739 16 7.5V8.25" stroke="#404040" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M16 13V14.5H14.75" stroke="#404040" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M16 10.25V11" stroke="#404040" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M8 11V10.25" stroke="#404040" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M8 15.75V13" stroke="#404040" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M8 8.25C8 7.91848 8.1317 7.60054 8.36612 7.36612C8.60054 7.1317 8.91848 7 9.25 7H10" stroke="#404040" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M10 17H9.25C8.91848 17 8.60054 16.8683 8.36612 16.6339C8.1317 16.3995 8 16.0815 8 15.75C8 15.4185 8.1317 15.1005 8.36612 14.8661C8.60054 14.6317 8.91848 14.5 9.25 14.5H10" stroke="#404040" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_565_39474">
                                <rect width="12" height="12" fill="white" transform="translate(6 6)" />
                            </clipPath>
                        </defs>
                    </svg>


                    <h2 className="text-lg font-semibold text-[#404040]">Lost & Found Register</h2>
                </div>
                <span className="text-sm font-medium text-[#0A0A0A]">{filteredData.length} Reports</span>
            </div>

            <ReportFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                showOffenceType={false}
                showActionStatus={false}
                showDate={true}
                showDateRange={true}
                showUnit={false}
                showFilter={true}
                showFmn={false}
                showPlaceOfOffence={false}
                dateRangeLabel="Date Range"
                onReset={() => setFilters({
                    search: "",
                    date: "",
                    fromDate: "",
                    toDate: "",
                    unit: "",
                    sortOrder: "asc",
                })}
                onAddNew={onAddNew}
                placeholder="Search by Item Name, Place, Handed by, Takeover by"
            />

            <div className="rounded-md border border-gray-300 bg-white overflow-hidden shadow-sm">
                <div className="overflow-auto max-h-[75vh] relative [&::-webkit-scrollbar]:hidden">
                    <table className="w-full text-left text-sm text-gray-700 min-w-[1400px]">
                        <thead className="bg-[#F5F5F5] text-xs font-bold text-gray-900 border-b border-gray-300">
                            <tr>
                                <th className="px-4 py-3 border-r border-gray-300 w-16 align-middle sticky left-0 top-0 z-50 bg-[#F5F5F5]">
                                    Sr no.
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Date & Time
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Item Name
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Case Details
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Place
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Handed by (Name)
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
                                <th className="px-4 py-3 border-r border-gray-300 w-32 align-middle sticky top-0 z-40 bg-[#F5F5F5]">
                                    Takeover By
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
                                <th className="px-2 py-3 w-10 text-center align-middle sticky right-0 top-0 z-50 bg-[#F5F5F5]"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {dataWithSrNo.length > 0 ? (
                                dataWithSrNo.map((item, index) => (
                                    <tr key={item._id || index} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-4 py-4 align-middle font-medium text-gray-900 border-r border-gray-300 text-center sticky left-0 z-30 bg-white group-hover:bg-gray-50">
                                            {item.serialNumber}
                                        </td>
                                        <td className="px-4 py-4 align-middle border-r border-gray-300">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">
                                                    {item.date ? format(new Date(item.date), "dd/MM/yyyy") : "-"}
                                                </span>
                                                <span className="text-gray-500 text-xs">
                                                    {item.details?.time || "--:--"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                            {item.details?.itemName || "-"}
                                        </td>
                                        <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                            {item.details?.caseDetails || "-"}
                                        </td>
                                        <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                            {item.details?.place || "-"}
                                        </td>
                                        <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                            {item.details?.handedByName || "-"}
                                        </td>
                                        {/* Authorization (Deposit) */}
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
                                            {item.details?.takeoverBy || "-"}
                                        </td>

                                        {/* Authorization (Takeover) */}
                                        <td className="px-4 py-4 align-middle border-r border-gray-300 text-center">
                                            <div className="flex justify-center">
                                                <Checkbox
                                                    className="border-black"
                                                    checked={item.details?.takeoverAuth?.initialsOfMPCRNCO || false}
                                                    onCheckedChange={() => handleTakeoverToggle(item, "initialsOfMPCRNCO")}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 align-middle border-r border-gray-300 text-center">
                                            <div className="flex justify-center">
                                                <Checkbox
                                                    className="border-black"
                                                    checked={item.details?.takeoverAuth?.initialsOfSMSJCO || false}
                                                    onCheckedChange={() => handleTakeoverToggle(item, "initialsOfSMSJCO")}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 align-middle border-r border-gray-300 text-center">
                                            <div className="flex justify-center">
                                                <Checkbox
                                                    className="border-black"
                                                    checked={item.details?.takeoverAuth?.initialsOf2IC || false}
                                                    onCheckedChange={() => handleTakeoverToggle(item, "initialsOf2IC")}
                                                />
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                            {item.remark || "-"}
                                        </td>

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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={15} className="px-4 py-12 text-center text-gray-500">
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

export default LostAndFoundTable;
