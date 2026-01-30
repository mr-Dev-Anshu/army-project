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

interface ConvoyInOutTableProps {
    data: any[];
    onEdit: (item: any) => void;
    onDelete: (id: string) => void;
    onAddNew?: () => void;
}

const ConvoyInOutTable = ({ data, onEdit, onDelete, onAddNew }: ConvoyInOutTableProps) => {
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        date: "",
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
            const ind = item.details?.individual || {};
            const matchesSearch =
                (ind.name?.toLowerCase() || "").includes(searchTerm) ||
                (ind.armyNo?.toLowerCase() || "").includes(searchTerm) ||
                (item.details?.vehicleBaNumber?.toLowerCase() || "").includes(searchTerm) ||
                (item.details?.fromLocation?.toLowerCase() || "").includes(searchTerm) ||
                (item.details?.toLocation?.toLowerCase() || "").includes(searchTerm);

            const matchesDate = filters.date
                ? item.date && item.date.startsWith(filters.date)
                : true;

            return matchesSearch && matchesDate;
        });
    }, [data, filters]);

    const dataWithSrNo = filteredData.map((item, index) => ({ ...item, serialNumber: index + 1 }));

    // Helper to sum requirements
    const sum = (...values: any[]) => values.reduce((acc, v) => acc + (parseInt(v) || 0), 0);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="#E5E5E5" />
                        <path d="M32.1673 29.8359H34.5007L35.2473 26.8726C35.5273 25.7538 35.5273 24.5836 35.2473 23.4659L33.999 18.4843C33.8092 17.7276 33.372 17.0561 32.7569 16.5763C32.1418 16.0965 31.3841 15.8359 30.604 15.8359H14.6673C14.0485 15.8359 13.455 16.0818 13.0174 16.5194C12.5798 16.9569 12.334 17.5504 12.334 18.1693V29.8359H14.6673" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M26.3333 29.8359H20.5" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17.5827 33.3333C19.1935 33.3333 20.4993 32.0275 20.4993 30.4167C20.4993 28.8058 19.1935 27.5 17.5827 27.5C15.9719 27.5 14.666 28.8058 14.666 30.4167C14.666 32.0275 15.9719 33.3333 17.5827 33.3333Z" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M29.2507 33.3333C30.8615 33.3333 32.1673 32.0275 32.1673 30.4167C32.1673 28.8058 30.8615 27.5 29.2507 27.5C27.6398 27.5 26.334 28.8058 26.334 30.4167C26.334 32.0275 27.6398 33.3333 29.2507 33.3333Z" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h2 className="text-lg font-semibold text-[#404040]">Convoy In | Out Register</h2>
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
                showFilter={false} // Minimal filters for now matching image
                showFmn={false}
                showPlaceOfOffence={false}
                onReset={() => setFilters({
                    search: "",
                    date: "",
                    sortOrder: "asc",
                })}
                onAddNew={onAddNew}
                placeholder="Search by Name, Army No, Vehicle No..."
            />

            <div className="rounded-md border border-gray-300 bg-white overflow-hidden shadow-sm">
                <div className="overflow-auto max-h-[75vh] relative [&::-webkit-scrollbar]:hidden">
                    <table className="w-full text-left text-sm text-gray-700 min-w-[2000px]">
                        <thead className="bg-[#F5F5F5] text-xs font-bold text-gray-900 border-b border-gray-300">
                            <tr>
                                <th className="px-4 py-3 border-r border-gray-300 w-16 align-middle sticky left-0 top-0 z-50 bg-[#F5F5F5]" rowSpan={2}>
                                    Sr no.
                                </th>
                                {/* Convoy Out|In Time */}
                                <th className="px-4 py-2 border-r border-gray-300 text-center border-b border-gray-300 sticky top-0 z-40 bg-[#F5F5F5]" colSpan={3}>
                                    Convoy Out|In Time
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-64 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Particular
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Vehicle BA No.
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Tac No
                                </th>
                                {/* Vehicle Location */}
                                <th className="px-4 py-2 border-r border-gray-300 text-center border-b border-gray-300 sticky top-0 z-40 bg-[#F5F5F5]" colSpan={2}>
                                    Vehicle Location
                                </th>
                                {/* Personnel */}
                                <th className="px-4 py-2 border-r border-gray-300 text-center border-b border-gray-300 sticky top-0 z-40 bg-[#F5F5F5]" colSpan={4}>
                                    Personnel
                                </th>
                                {/* Vehicles */}
                                <th className="px-4 py-2 border-r border-gray-300 text-center border-b border-gray-300 sticky top-0 z-40 bg-[#F5F5F5]" colSpan={7}>
                                    Vehicles
                                </th>
                                {/* Weapons */}
                                <th className="px-4 py-2 border-r border-gray-300 text-center border-b border-gray-300 sticky top-0 z-40 bg-[#F5F5F5]" colSpan={3}>
                                    Weapons
                                </th>
                                {/* Ammo */}
                                <th className="px-4 py-2 border-r border-gray-300 text-center border-b border-gray-300 sticky top-0 z-40 bg-[#F5F5F5]" colSpan={4}>
                                    Ammo
                                </th>
                                {/* Auth */}
                                <th className="px-4 py-3 border-r border-gray-300 w-28 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Initials of MPCR NCO
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 w-28 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Initials of SM/2IC
                                </th>
                                <th className="px-4 py-3 border-r border-gray-300 align-middle sticky top-0 z-40 bg-[#F5F5F5]" rowSpan={2}>
                                    Remark
                                </th>
                                <th className="px-2 py-3 w-10 text-center align-middle sticky right-0 top-0 z-50 bg-[#F5F5F5]" rowSpan={2}></th>
                            </tr>
                            <tr>
                                {/* Time Subcols */}
                                <th className="px-2 py-2 border-r border-gray-300 w-20 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">Out Time</th>
                                <th className="px-2 py-2 border-r border-gray-300 w-20 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">Sig</th>
                                <th className="px-2 py-2 border-r border-gray-300 w-20 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">In Time</th>

                                {/* Location Subcols */}
                                <th className="px-2 py-2 border-r border-gray-300 w-24 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">From</th>
                                <th className="px-2 py-2 border-r border-gray-300 w-24 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">To</th>

                                {/* Personnel Subcols */}
                                <th className="px-2 py-2 border-r border-gray-300 w-12 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">OFF</th>
                                <th className="px-2 py-2 border-r border-gray-300 w-12 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">JCO</th>
                                <th className="px-2 py-2 border-r border-gray-300 w-12 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">ORS</th>
                                <th className="px-2 py-2 border-r border-gray-300 w-12 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">Total</th>

                                {/* Vehicles Subcols */}
                                <th className="px-2 py-2 border-r border-gray-300 w-12 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">MIG</th>
                                <th className="px-2 py-2 border-r border-gray-300 w-16 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">2.5 Ton</th>
                                <th className="px-2 py-2 border-r border-gray-300 w-12 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">ALS</th>
                                <th className="px-2 py-2 border-r border-gray-300 w-12 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">Amb.</th>
                                <th className="px-2 py-2 border-r border-gray-300 w-16 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">TATR n.</th>
                                <th className="px-2 py-2 border-r border-gray-300 w-12 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">Other</th>
                                <th className="px-2 py-2 border-r border-gray-300 w-12 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">Total</th>

                                {/* Weapons Subcols */}
                                <th className="px-2 py-2 border-r border-gray-300 w-12 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">INS</th>
                                <th className="px-2 py-2 border-r border-gray-300 w-12 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">AK47</th>
                                <th className="px-2 py-2 border-r border-gray-300 w-12 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">Total</th>

                                {/* Ammo Subcols */}
                                <th className="px-2 py-2 border-r border-gray-300 w-16 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">5.56</th>
                                <th className="px-2 py-2 border-r border-gray-300 w-16 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">7.62</th>
                                <th className="px-2 py-2 border-r border-gray-300 w-12 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">9mm</th>
                                <th className="px-2 py-2 border-r border-gray-300 w-12 align-middle bg-[#F5F5F5] sticky top-[31px] z-40">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {dataWithSrNo.length > 0 ? (
                                dataWithSrNo.map((item, index) => {
                                    const ind = item.details?.individual || {};
                                    const req = item.details?.requirements || {};

                                    return (
                                        <tr key={item._id || index} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-4 py-4 align-middle font-medium text-gray-900 border-r border-gray-300 text-center sticky left-0 z-30 bg-white group-hover:bg-gray-50">
                                                {item.serialNumber}
                                            </td>

                                            {/* Times */}
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-center">
                                                {item.details?.convoyOutTime || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-center">
                                                {item.details?.outSignature?.value || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-center">
                                                {item.details?.convoyInTime || "-"}
                                            </td>

                                            {/* Particulars */}
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
                                                    <div className="grid grid-cols-[60px_1fr]">
                                                        <span className="font-bold text-gray-900">Unit:</span>
                                                        <span className="text-[#0A0A0A]">{ind.unit || "-"}</span>
                                                    </div>
                                                    <div className="grid grid-cols-[60px_1fr]">
                                                        <span className="font-bold text-gray-900">FMN:</span>
                                                        <span className="text-[#0A0A0A]">{ind.fmn || "-"}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.vehicleBaNumber || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.tacNumber || "-"}
                                            </td>

                                            {/* Location */}
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.fromLocation || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-[#0A0A0A]">
                                                {item.details?.toLocation || "-"}
                                            </td>

                                            {/* Personnel */}
                                            <td className="px-2 py-4 align-middle border-r border-gray-300 text-center">{req.off || "-"}</td>
                                            <td className="px-2 py-4 align-middle border-r border-gray-300 text-center">{req.jco || "-"}</td>
                                            <td className="px-2 py-4 align-middle border-r border-gray-300 text-center">{req.ors || "-"}</td>
                                            <td className="px-2 py-4 align-middle border-r border-gray-300 text-center font-bold">{sum(req.off, req.jco, req.ors) || "-"}</td>

                                            {/* Vehicles */}
                                            <td className="px-2 py-4 align-middle border-r border-gray-300 text-center">{req.mig || "-"}</td>
                                            <td className="px-2 py-4 align-middle border-r border-gray-300 text-center">{req.ton25 || "-"}</td>
                                            <td className="px-2 py-4 align-middle border-r border-gray-300 text-center">{req.als || "-"}</td>
                                            <td className="px-2 py-4 align-middle border-r border-gray-300 text-center">{req.amb || "-"}</td>
                                            <td className="px-2 py-4 align-middle border-r border-gray-300 text-center">{req.tatr || "-"}</td>
                                            <td className="px-2 py-4 align-middle border-r border-gray-300 text-center">{req.other || "-"}</td>
                                            <td className="px-2 py-4 align-middle border-r border-gray-300 text-center font-bold">{sum(req.mig, req.ton25, req.als, req.amb, req.tatr, req.other) || "-"}</td>

                                            {/* Weapons */}
                                            <td className="px-2 py-4 align-middle border-r border-gray-300 text-center">{req.ins || "-"}</td>
                                            <td className="px-2 py-4 align-middle border-r border-gray-300 text-center">{req.ak47 || "-"}</td>
                                            <td className="px-2 py-4 align-middle border-r border-gray-300 text-center font-bold">{sum(req.ins, req.ak47) || "-"}</td>

                                            {/* Ammo */}
                                            <td className="px-2 py-4 align-middle border-r border-gray-300 text-center">{req.amn556 || "-"}</td>
                                            <td className="px-2 py-4 align-middle border-r border-gray-300 text-center">{req.amn762 || "-"}</td>
                                            <td className="px-2 py-4 align-middle border-r border-gray-300 text-center">{req.mm9 || "-"}</td>
                                            <td className="px-2 py-4 align-middle border-r border-gray-300 text-center font-bold">{sum(req.amn556, req.amn762, req.mm9) || "-"}</td>

                                            {/* Initials */}
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-center">
                                                {item.authentication?.initialsMPCPNCO || "-"}
                                            </td>
                                            <td className="px-4 py-4 align-middle border-r border-gray-300 text-center">
                                                {/* Combining QMSJCO and 2IC as per column header suggestion */}
                                                {[item.authentication?.initialsQMSJCO, item.authentication?.initials2IC].filter(Boolean).join(" / ") || "-"}
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
                                    <td colSpan={26} className="px-4 py-12 text-center text-gray-500">
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

export default ConvoyInOutTable;
