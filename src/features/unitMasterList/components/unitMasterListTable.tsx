"use client";

import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import { MoreVertical, Edit, Trash } from "lucide-react";

import { DynamicTable, Column } from "@/components/common/DynamicTable";
import ReportFilterBar, { FilterState } from "@/components/common/ReportFilterBar";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";

import { useGetAllUnitMasterLists, useDeleteUnitMasterList, useUpdateUnitMasterList } from "../hooks";
import { UnitMasterList } from "@/apis/unitMasterList/types";

interface UnitMasterListTableProps {
    onAddNew: () => void;
    onEdit: (item: UnitMasterList) => void;
}

const UnitMasterListTable: React.FC<UnitMasterListTableProps> = ({ onAddNew, onEdit }) => {
    const { data: unitList = [], isLoading } = useGetAllUnitMasterLists();
    const { mutateAsync: deleteUnit, isPending: isDeleting } = useDeleteUnitMasterList();
    const { mutateAsync: updateUnit } = useUpdateUnitMasterList();

    const [filters, setFilters] = useState<FilterState>({
        search: "",
        sortOrder: "asc",
    });

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null,
    });

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleDeleteClick = (id: string) => {
        setDeleteModal({ isOpen: true, id });
    };

    const handleConfirmDelete = async () => {
        if (!deleteModal.id) return;
        try {
            await deleteUnit(deleteModal.id);
            toast.success("Unit deleted successfully");
            setDeleteModal({ isOpen: false, id: null });
        } catch (error) {
            console.error("Failed to delete unit:", error);
            toast.error("Failed to delete unit");
        }
    };

    const handleStatusToggle = async (item: UnitMasterList, checked: boolean) => {
        try {
            await updateUnit({ id: item._id, data: { unitActiveStatus: checked } });
            toast.success("Unit status updated");
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error("Failed to update status");
        }
    };

    const filteredData = useMemo(() => {
        return unitList.filter((item: UnitMasterList) => {
            const searchTerm = filters.search.toLowerCase();
            const matchesSearch =
                (item.unitIdentifier.unit || "").toLowerCase().includes(searchTerm) ||
                (item.unitIdentifier.unitShortForm || "").toLowerCase().includes(searchTerm) ||
                (item.unitIdentifier.unitType || "").toLowerCase().includes(searchTerm) ||
                (item.unitIdentifier.locationStation || "").toLowerCase().includes(searchTerm);

            let matchesStatus = true;
            if (filters.actionStatus && filters.actionStatus !== "All") {
                const isStatusActive = filters.actionStatus === "Active";
                matchesStatus = item.unitActiveStatus === isStatusActive;
            }

            return matchesSearch && matchesStatus;
        });
    }, [unitList, filters]);

    const columns: Column<UnitMasterList>[] = [
        {
            header: "Sr no.",
            cell: (item) => (
                <span className="font-normal font-[Arial] text-[#0A0A0A]">
                    {filteredData.indexOf(item) + 1}.
                </span>
            ),
            className: "w-16 border-r border-gray-300 border-b border-gray-300 bg-white sticky left-0 z-20",
            headerClassName: "w-16 border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] sticky left-0 z-30",
        },
        {
            header: "Unit Name",
            accessorKey: "unitIdentifier",
            cell: (item) => item.unitIdentifier.unit,
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 border-b border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Unit Type",
            accessorKey: "unitIdentifier",
            cell: (item) => item.unitIdentifier.unitType,
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 border-b border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Arm / Service",
            accessorKey: "unitIdentifier",
            cell: (item) => item.unitIdentifier.serviceArm,
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 border-b border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Parent Formation",
            accessorKey: "unitIdentifier",
            cell: (item) => item.unitIdentifier.parentFormation,
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 border-b border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Location",
            accessorKey: "unitIdentifier",
            cell: (item) => item.unitIdentifier.locationStation,
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 border-b border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Command",
            accessorKey: "unitHierarchyAndControl",
            cell: (item) => item.unitHierarchyAndControl.command,
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 border-b border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Unit Status",
            accessorKey: "unitClassification",
            cell: (item) => {
                const statusMap: Record<string, string> = {
                    permanent: "Permanent",
                    attached: "Attached",
                    visiting: "Visiting",
                    detached: "Detached",
                    onTemporaryDuty: "On Temporary Duty",
                };
                return statusMap[item.unitClassification?.unitStatus as string] || item.unitClassification?.unitStatus || "N/A";
            },
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 border-b border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Attachment Valid From",
            accessorKey: "unitClassification",
            cell: (item) => item.unitClassification?.attachmentValidFrom ? format(new Date(item.unitClassification.attachmentValidFrom), "dd-MM-yyyy") : "--",
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 border-b border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Attachment Valid To",
            accessorKey: "unitClassification",
            cell: (item) => item.unitClassification?.attachmentValidTo ? format(new Date(item.unitClassification.attachmentValidTo), "dd-MM-yyyy") : "--",
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 border-b border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Status",
            accessorKey: "unitActiveStatus",
            cell: (item) => (
                <span className={item.unitActiveStatus ? "text-[#34C759]" : "text-red-600"}>
                    {item.unitActiveStatus ? "Active" : "Inactive"}
                </span>
            ),
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 border-b border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "",
            cell: (item) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px] p-0">
                        <DropdownMenuItem onClick={() => onEdit(item)} className="px-3 py-2.5 cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="m-0" />

                        <div className="flex items-center justify-between px-3 py-2.5 text-sm">
                            <span className="font-normal text-[#0A0A0A]">Unit Status: {item.unitActiveStatus ? "Active" : "Inactive"}</span>
                            <Switch
                                checked={item.unitActiveStatus}
                                onCheckedChange={(checked) => handleStatusToggle(item, checked)}
                                className="h-5 w-9 data-[state=checked]:bg-[#34C759]"
                            />
                        </div>

                        <DropdownMenuSeparator className="m-0" />

                        <DropdownMenuItem
                            onClick={() => handleDeleteClick(item._id)}
                            className="text-[#FF3B30] focus:text-[#FF3B30] focus:bg-red-50 px-3 py-2.5 cursor-pointer"
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            className: "w-[50px] border-l border-gray-300 border-b border-gray-300 bg-white sticky right-0 z-20",
            headerClassName: "w-[50px] border-l border-gray-300 bg-gray-100 font-bold text-[#0A0A0A] sticky right-0 z-30",
        },
    ];

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading units...</div>;
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-[#404040]">Unit Master List</h2>
                </div>
                <span className="text-sm font-medium text-[#0A0A0A]">Total Units: {filteredData.length}</span>
            </div>

            <ReportFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onAddNew={onAddNew}
                onReset={() => setFilters({ search: "", sortOrder: "asc" })}
                placeholder="Search by Unit Name, Type, Location..."
                showFilter={true}
                showActionStatus={true}
                statusLabel="Unit Status"
                actionStatusOptions={["Active", "Inactive"]}
                showDateRange={false}
                showOffenceType={false}
                showFmn={false}
                showPlaceOfOffence={false}
                showUnit={false}
                showDate={false}
            />

            <DynamicTable
                className="max-h-[calc(100vh-170px)] [&::-webkit-scrollbar]:hidden border-gray-300 [&_tbody]:divide-gray-300 [&_table]:border-gray-300"
                data={filteredData}
                columns={columns}
                getRowClassName={() => "border-b border-gray-300 hover:bg-white"}
            />

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={handleConfirmDelete}
                title="Delete Unit"
                message="Are you sure you want to delete this unit? This action cannot be undone."
                confirmLabel="Delete"
                isProcessing={isDeleting}
            />
        </div>
    );
};

export default UnitMasterListTable;
