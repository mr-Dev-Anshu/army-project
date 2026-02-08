
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ChevronRight, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import MilitaryPoliceControlRoomContactForm from "@/features/RegisterBooks/contactInformationRegisters/militaryPoliceControlRoomContactDirectory/components/form";
import MilitaryPoliceControlRoomContactDirectoryTable from "@/features/RegisterBooks/contactInformationRegisters/militaryPoliceControlRoomContactDirectory/components/militaryPoliceControlRoomContactDirectoryTable";
import { useGetMilitaryPoliceControlRoomRegisters, useDeleteMilitaryPoliceControlRoomRegister } from "@/features/RegisterBooks/contactInformationRegisters/militaryPoliceControlRoomContactDirectory/hooks";
import RightSideSheet from "@/components/common/RightSideSheet";
import { toast } from "react-toastify";

const Page = () => {
    const router = useRouter();
    const { data: registers = [], isLoading } = useGetMilitaryPoliceControlRoomRegisters({ limit: 1000 });
    const deleteMutation = useDeleteMilitaryPoliceControlRoomRegister();

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    const handleEdit = (item: any) => {
        setSelectedRecord(item);
        setIsSheetOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(id);
            // Toast handled by hook
        } catch (error) {
            console.error("Delete failed:", error);
            // Toast handled by hook
        }
    };

    const handleAddNew = () => {
        setSelectedRecord(null);
        setIsSheetOpen(true);
    };

    const handleFormSuccess = () => {
        setIsSheetOpen(false);
        setSelectedRecord(null);
        // Toast handled by hook
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b bg-white px-6 py-4">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <BookOpen className="h-5 w-5 text-gray-700" />
                    <div className="h-5 w-[1px] bg-gray-300"></div>
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
                            Military Police Control Room – Contact Directory (All India)
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button className="bg-neutral-900 text-white hover:bg-neutral-800 gap-2">
                        Download & Print
                        <Printer className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="p-6">
                <RightSideSheet
                    isOpen={isSheetOpen}
                    onClose={() => setIsSheetOpen(false)}
                    title={selectedRecord ? "Edit Contact" : "Add Military Police Control Room Contact"}
                    description="Enter unit, officer, and MPCR contact details"
                >
                    <MilitaryPoliceControlRoomContactForm
                        initialData={selectedRecord}
                        onSuccess={handleFormSuccess}
                        onCancel={() => setIsSheetOpen(false)}
                    />
                </RightSideSheet>

                <div className="space-y-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <MilitaryPoliceControlRoomContactDirectoryTable
                            data={registers}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onAddNew={handleAddNew}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;
