"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ChevronRight, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import DutyInOutTable from "@/features/RegisterBooks/DailyOperationsRegisters/dutyInOut/components/dutyInOutTable";
import DutyKeyOutInForm from "@/features/RegisterBooks/DailyOperationsRegisters/dutyInOut/components/form";
import { useGetDutyInOutRegisters, useDeleteDutyInOutRegister } from "@/features/RegisterBooks/DailyOperationsRegisters/dutyInOut/hooks";
import RightSideSheet from "@/components/common/RightSideSheet";

const Page = () => {
    const router = useRouter();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    const { data: registers, isLoading } = useGetDutyInOutRegisters();
    const deleteMutation = useDeleteDutyInOutRegister();

    const handleEdit = (record: any) => {
        setSelectedRecord(record);
        setIsSheetOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(id);
        } catch (error) {
            console.error("Failed to delete record:", error);
        }
    };

    const handleAddNew = () => {
        setSelectedRecord(null);
        setIsSheetOpen(true);
    };

    const handleSuccess = () => {
        setIsSheetOpen(false);
        setSelectedRecord(null);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section (Breadcrumb + Title) */}
            <div className="flex items-center justify-between border-b bg-white px-6 py-4">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    {/* Icon */}
                    <BookOpen className="h-5 w-5 text-gray-700" />
                    {/* Separator */}
                    <div className="h-5 w-[1px] bg-gray-300"></div>
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2">
                        <span className="hover:text-[#0A0A0A] text-[#0A0A0A] transition-colors cursor-pointer">Reports & Analysis</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span
                            className="hover:text-[#0A0A0A] text-[#0A0A0A] transition-colors cursor-pointer"
                            onClick={() => router.push('/analysis/registers-books')}
                        >
                            Registers/Books
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span className="font-bold text-[#0A0A0A]">
                            Duty Out|In Register
                        </span>
                    </div>
                </div>
                <Button className="bg-neutral-900 text-white hover:bg-neutral-800 gap-2">
                    Download & Print Report
                    <Printer className="h-4 w-4" />
                </Button>
            </div>

            <div className="p-6">
                <DutyInOutTable
                    data={registers || []}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAddNew={handleAddNew}
                />
            </div>

            <RightSideSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                title={selectedRecord ? "Edit Duty Out Entry" : "Add Duty Out Entry"}
                description="Record individual duty departure details"
            >
                <DutyKeyOutInForm
                    initialData={selectedRecord}
                    onSuccess={handleSuccess}
                    onCancel={() => setIsSheetOpen(false)}
                />
            </RightSideSheet>
        </div>
    );
};

export default Page;
