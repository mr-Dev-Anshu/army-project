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

interface MTAccidentReportTableProps {
    data: any[];
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
    onAddNew?: () => void;
}

const MTAccidentReportTable = ({ data, onEdit, onDelete, onAddNew }: MTAccidentReportTableProps) => {
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        date: "",
        fromDate: "",
        toDate: "",
        unit: "",
        sortOrder: "asc",
    });

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
            const searchTerm = filters.search.toLowerCase();
            const matchesSearch =
                (item.individualDetails?.individualType?.toLowerCase() || "").includes(searchTerm) ||
                (item.accidentDetails?.placeOfAccident?.toLowerCase() || "").includes(searchTerm) ||
                (item.vehicleDetails?.vehicleNumber?.toLowerCase() || "").includes(searchTerm);

            let matchesDate = true;
            if (filters.date) {
                matchesDate = item.accidentDetails?.accidentDate && item.accidentDetails.accidentDate.startsWith(filters.date);
            }

            let matchesDateRange = true;
            if (filters.fromDate || filters.toDate) {
                const itemDate = new Date(item.accidentDetails?.accidentDate);
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

    const dataWithSrNo = filteredData.map((item, index) => ({ ...item, serialNumber: index + 1 }));

    const renderParticulars = (details: any) => {
        const type = details?.individualType;
        const d = details?.individualDetails || {};

        if (!type) return "-";

        const TypeLabel = (
            <div className="text-xs font-semibold text-gray-500 mb-1">
                {type === 'militaryPersonnel' ? 'Military Personnel' :
                    type === 'civilian' ? 'Civilian / Dependent' :
                        type === 'employee' ? 'Employee' :
                            type.replace(/([A-Z])/g, ' $1').trim()}
            </div>
        );

        if (type === 'militaryPersonnel') {
            return (
                <div className="space-y-0.5 text-sm">
                    {TypeLabel}
                    <div><span className="font-medium text-gray-700">Army No:</span> {d.militaryPersonnelArmyNo || "-"}</div>
                    <div><span className="font-medium text-gray-700">Rank:</span> {d.militaryPersonnelRank || "-"}</div>
                    {d.militaryPersonnelName && <div><span className="font-medium text-gray-700">Name:</span> {d.militaryPersonnelName}</div>}
                </div>
            );
        }
        if (type === 'employee') {
            return (
                <div className="space-y-0.5 text-sm">
                    {TypeLabel}
                    <div><span className="font-medium text-gray-700">Svc No:</span> {d.employeeServiceNumber || "-"}</div>
                    <div><span className="font-medium text-gray-700">Rank:</span> {d.employeeRank || "-"}</div>
                </div>
            );
        }
        if (type === 'civilian') {
            return (
                <div className="space-y-0.5 text-sm">
                    {TypeLabel}
                    <div><span className="font-medium text-gray-700">Aadhar:</span> {d.civilianAadharCardNumber || "-"}</div>
                    <div><span className="font-medium text-gray-700">Father/Husband:</span> {d.civilianFathersName || "-"}</div>
                    {d.isDependent && (
                        <div className="mt-1 pt-1 border-t border-gray-100">
                            <span className="text-xs text-blue-600 font-medium">Dependent: {d.relationName}</span>
                        </div>
                    )}
                </div>
            );
        }
        // Fallback for others (Servant, Shopkeeper, etc.)
        return (
            <div className="space-y-0.5 text-sm">
                {TypeLabel}
                {Object.entries(d).slice(0, 3).map(([k, v]: any) => (
                    <div key={k}><span className="font-medium text-gray-700 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}:</span> {v}</div>
                ))}
            </div>
        );
    };

    const getUnitFmn = (details: any) => {
        const d = details?.individualDetails || {};
        const type = details?.individualType;
        let unit = "-";
        let fmn = "-";

        if (type === 'militaryPersonnel') {
            unit = d.militaryPersonnelUnit || "-";
            fmn = d.militaryPersonnelFmn || "-";
        } else if (type === 'employee') {
            unit = d.employeeUnit || "-";
            fmn = d.employeeFmn || "-";
        } else if (type === 'servantMaid') {
            unit = d.maidUnit || "-";
            fmn = d.maidFmn || "-";
        }
        // Add other types if they have Unit/FMN
        return { unit, fmn };
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="12" fill="#E5E5E5" />
                        <path d="M12 7V17M12 17L9 14M12 17L15 14" stroke="#404040" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h2 className="text-lg font-semibold text-[#404040]">MT Accident Register: 21 CORPs PRO</h2>
                </div>
                <span className="text-sm font-medium text-[#0A0A0A]">{filteredData.length} Reports</span>
            </div>

            <ReportFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                showOffenceType={true}
                showActionStatus={true}
                showDate={true}
                showDateRange={false}
                showUnit={false}
                showFilter={true}
                showFmn={false}
                showPlaceOfOffence={false}
                onReset={() => setFilters({
                    search: "",
                    date: "",
                    fromDate: "",
                    toDate: "",
                    unit: "",
                    sortOrder: "asc",
                })}
                onAddNew={onAddNew}
                placeholder="Search by report no, unit, offence type..."
            />

            <div className="rounded-md border border-gray-300 bg-white overflow-hidden shadow-sm">
                <div className="overflow-auto max-h-[75vh] relative [&::-webkit-scrollbar]:hidden">
                    <table className="w-full text-left text-sm text-gray-700 min-w-[1800px]">
                        <thead className="bg-[#F5F5F5] text-xs font-bold text-gray-900 border-b border-gray-300">
                            <tr>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-300 w-14 align-top sticky left-0 top-0 z-50 bg-[#F5F5F5]">
                                    Sr no.
                                </th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-300 w-64 align-top sticky top-0 z-40 bg-[#F5F5F5]">
                                    Particulars of Offender(s), Victim(s) and Vehicles Involved
                                </th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-300 w-32 align-top sticky top-0 z-40 bg-[#F5F5F5]">
                                    Unit
                                </th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-300 w-32 align-top sticky top-0 z-40 bg-[#F5F5F5]">
                                    FMN
                                </th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-300 w-32 align-top sticky top-0 z-40 bg-[#F5F5F5]">
                                    Date & Time of Accident
                                </th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-300 w-40 align-top sticky top-0 z-40 bg-[#F5F5F5]">
                                    Place of Accident
                                </th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-300 w-40 align-top sticky top-0 z-40 bg-[#F5F5F5]">
                                    Veh. BA No. / Make & Type
                                </th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-300 w-32 align-top sticky top-0 z-40 bg-[#F5F5F5]">
                                    Type of Accident
                                </th>
                                {/* Casualty Header Group */}
                                <th colSpan={4} className="px-4 py-2 border-r border-gray-300 align-top text-center border-b sticky top-0 z-40 bg-[#F5F5F5]">
                                    No. of Casualty
                                </th>

                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-300 w-48 align-top sticky top-0 z-40 bg-[#F5F5F5]">
                                    Damage to Vehicle
                                </th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-300 w-48 align-top sticky top-0 z-40 bg-[#F5F5F5]">
                                    Probable Cause of Accident
                                </th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-300 w-32 align-top sticky top-0 z-40 bg-[#F5F5F5]">
                                    FIR/MACT. Status
                                </th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-300 w-40 align-top sticky top-0 z-40 bg-[#F5F5F5]">
                                    Report no.
                                </th>
                                <th rowSpan={2} className="px-4 py-3 border-r border-gray-300 w-32 align-top sticky top-0 z-40 bg-[#F5F5F5]">
                                    Action Status
                                </th>
                                <th rowSpan={2} className="px-2 py-3 w-10 text-center align-middle sticky right-0 top-0 z-50 bg-[#F5F5F5]"></th>
                            </tr>
                            <tr>
                                {/* Sub-headers for Casualty */}
                                <th className="px-2 py-2 border-r border-gray-300 text-center w-20 sticky top-[37px] z-40 bg-[#F5F5F5]">Injured (Civ)</th>
                                <th className="px-2 py-2 border-r border-gray-300 text-center w-20 sticky top-[37px] z-40 bg-[#F5F5F5]">Injured (Mil)</th>
                                <th className="px-2 py-2 border-r border-gray-300 text-center w-20 sticky top-[37px] z-40 bg-[#F5F5F5]">Died (Civ)</th>
                                <th className="px-2 py-2 border-r border-gray-300 text-center w-20 sticky top-[37px] z-40 bg-[#F5F5F5]">Died (Mil)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {dataWithSrNo.length > 0 ? (
                                dataWithSrNo.map((item, index) => {
                                    const { unit, fmn } = getUnitFmn(item.individualDetails);
                                    return (
                                        <tr key={item._id || index} className="hover:bg-gray-50/50 transition-colors group bg-white">
                                            <td className="px-4 py-4 align-top font-medium text-gray-900 border-r border-gray-300 text-center sticky left-0 z-30 bg-white group-hover:bg-gray-50">
                                                {item.serialNumber}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300">
                                                {renderParticulars(item.individualDetails)}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-[#0A0A0A]">
                                                {unit}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-[#0A0A0A]">
                                                {fmn}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">
                                                        {item.accidentDetails?.accidentDate ? format(new Date(item.accidentDetails.accidentDate), "dd/MM/yyyy") : "-"}
                                                    </span>
                                                    <span className="text-gray-500 text-xs">
                                                        {item.accidentDetails?.accidentTime || ""}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-[#0A0A0A]">
                                                {item.accidentDetails?.placeOfAccident || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-[#0A0A0A]">
                                                <div className="font-medium">{item.vehicleDetails?.vehicleNumber || "-"}</div>
                                                <div className="text-gray-500 text-xs">{item.vehicleDetails?.vehicleModel || ""}</div>
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-[#0A0A0A] capitalize">
                                                {item.accidentDetails?.accidentType || "-"}
                                            </td>

                                            {/* Casualty Columns */}
                                            <td className="px-2 py-4 align-top border-r border-gray-300 text-center text-[#0A0A0A] tabular-nums">
                                                {item.casualtyDetails?.injuredCivil ? String(item.casualtyDetails.injuredCivil).padStart(2, '0') : "00"}
                                            </td>
                                            <td className="px-2 py-4 align-top border-r border-gray-300 text-center text-[#0A0A0A] tabular-nums">
                                                {item.casualtyDetails?.injuredMilitary ? String(item.casualtyDetails.injuredMilitary).padStart(2, '0') : "00"}
                                            </td>
                                            <td className="px-2 py-4 align-top border-r border-gray-300 text-center text-[#0A0A0A] tabular-nums">
                                                {item.casualtyDetails?.diedCivil ? String(item.casualtyDetails.diedCivil).padStart(2, '0') : "00"}
                                            </td>
                                            <td className="px-2 py-4 align-top border-r border-gray-300 text-center text-[#0A0A0A] tabular-nums">
                                                {item.casualtyDetails?.diedMilitary ? String(item.casualtyDetails.diedMilitary).padStart(2, '0') : "00"}
                                            </td>

                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-[#0A0A0A] text-sm">
                                                {/* Placeholder for Damage to Vehicle as we don't have it in schema yet */}
                                                <span className="text-gray-400 italic">--</span>
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-[#0A0A0A] text-sm">
                                                {item.accidentDetails?.causeOfAccident || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-[#0A0A0A]">
                                                {item.firMactDetails?.firMactNumber || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300 text-[#0A0A0A]">
                                                {/* Mock Report No */}
                                                <span className="text-xs text-gray-600 block">PRO/21 CPU/</span>
                                                <span className="text-xs text-gray-600 block">00042/102/25</span>
                                            </td>
                                            <td className="px-4 py-4 align-top border-r border-gray-300">
                                                <div className="flex items-center gap-2">
                                                    {item.actionStatus === 'taken' ? (
                                                        <>
                                                            <div className="h-4 w-8 bg-green-500 rounded-full relative">
                                                                <div className="absolute right-0.5 top-0.5 h-3 w-3 bg-white rounded-full"></div>
                                                            </div>
                                                            <span className="text-xs font-medium text-green-700">Taken</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="h-4 w-8 bg-red-200 rounded-full relative">
                                                                <div className="absolute left-0.5 top-0.5 h-3 w-3 bg-red-500 rounded-full"></div>
                                                            </div>
                                                            <span className="text-xs font-medium text-red-700">Pending</span>
                                                        </>
                                                    )}
                                                </div>
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
                                    );
                                })
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
                message="Are you sure you want to delete this report? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
            />
        </div>
    );
};

export default MTAccidentReportTable;
