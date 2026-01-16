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

import { useGetAllRankMasterLists, useDeleteRankMasterList, useUpdateRankMasterList } from "../hooks";
import { RankMasterList } from "@/apis/rankMasterList/types";

interface RankMasterListTableProps {
    onAddNew: () => void;
    onEdit: (item: RankMasterList) => void;
}

const RankMasterListTable: React.FC<RankMasterListTableProps> = ({ onAddNew, onEdit }) => {
    const { data: rankList = [], isLoading } = useGetAllRankMasterLists();
    const { mutateAsync: deleteRank, isPending: isDeleting } = useDeleteRankMasterList();
    const { mutateAsync: updateRank } = useUpdateRankMasterList();

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
            await deleteRank(deleteModal.id);
            toast.success("Rank deleted successfully");
            setDeleteModal({ isOpen: false, id: null });
        } catch (error) {
            console.error("Failed to delete rank:", error);
            toast.error("Failed to delete rank");
        }
    };

    const handleStatusToggle = async (item: RankMasterList, checked: boolean) => {
        try {
            await updateRank({ id: item._id, data: { rankActiveStatus: checked } });
            toast.success("Rank status updated");
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error("Failed to update status");
        }
    };

    const filteredData = useMemo(() => {
        return rankList.filter((item: RankMasterList) => {
            const searchTerm = filters.search.toLowerCase();
            const matchesSearch =
                item.rank.toLowerCase().includes(searchTerm) ||
                item.rankShortForm.toLowerCase().includes(searchTerm) ||
                item.rankCategory.toLowerCase().includes(searchTerm);

            let matchesStatus = true;
            if (filters.actionStatus && filters.actionStatus !== "All") {
                const isStatusActive = filters.actionStatus === "Active";
                matchesStatus = item.rankActiveStatus === isStatusActive;
            }

            return matchesSearch && matchesStatus;
        });
    }, [rankList, filters]);

    const columns: Column<RankMasterList>[] = [
        {
            header: "Sr no.",
            cell: (item) => (
                <span className="font-normal font-[Arial] text-[#0A0A0A]">
                    {filteredData.indexOf(item) + 1}.
                </span>
            ),
            className: "w-16 border-r border-gray-300 border-b border-gray-300 bg-white",
            headerClassName: "w-16 border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Rank Category",
            accessorKey: "rankCategory",
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 border-b border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Rank Name",
            accessorKey: "rank",
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 border-b border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Rank Short Form",
            accessorKey: "rankShortForm",
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 border-b border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Seniority Order",
            accessorKey: "rankSeniorityOrder",
            className: "font-normal font-[Arial] text-[#0A0A0A] border-r border-gray-300 border-b border-gray-300",
            headerClassName: "border-r border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
        {
            header: "Status",
            accessorKey: "rankActiveStatus",
            cell: (item) => (
                <span className={item.rankActiveStatus ? "text-[#34C759]" : "text-red-600"}>
                    {item.rankActiveStatus ? "Active" : "Inactive"}
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
                            <span className="font-normal text-[#0A0A0A]">Rank Status: {item.rankActiveStatus ? "Active" : "Inactive"}</span>
                            <Switch
                                checked={item.rankActiveStatus}
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
            className: "w-[50px] border-l border-gray-300 border-b border-gray-300 bg-white",
            headerClassName: "w-[50px] border-l border-gray-300 bg-gray-100 font-bold text-[#0A0A0A]",
        },
    ];

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading ranks...</div>;
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-[#404040]">Rank Master List</h2>
                </div>
                <span className="text-sm font-medium text-[#0A0A0A]">Total Ranks: {filteredData.length}</span>
            </div>

            <ReportFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onAddNew={onAddNew}
                onReset={() => setFilters({ search: "", sortOrder: "asc" })}
                placeholder="Search by Rank Name, Short Form, Category"
                showFilter={true}
                showActionStatus={true}
                statusLabel="Rank Status"
                actionStatusOptions={["Active", "Inactive"]}
                showDateRange={false}
                showOffenceType={false}
                showFmn={false}
                showPlaceOfOffence={false}
                showUnit={false}
                showDate={false}
            />

            <DynamicTable
                className="[&::-webkit-scrollbar]:hidden border-gray-300 [&_tbody]:divide-gray-300 [&_table]:border-gray-300"
                data={filteredData}
                columns={columns}
                getRowClassName={() => "border-b border-gray-300 hover:bg-white"}
            />

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={handleConfirmDelete}
                title="Delete Rank"
                message="Are you sure you want to delete this rank? This action cannot be undone."
                confirmLabel="Delete"
                isProcessing={isDeleting}
            />
        </div>
    );
};

export default RankMasterListTable;
