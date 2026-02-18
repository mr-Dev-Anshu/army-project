"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ChevronRight, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobilePhoneInOutTable from "@/features/RegisterBooks/DailyOperationsRegisters/mobilePhoneInOut/components/mobilePhoneInOutTable";
import MobilePhoneInOutForm from "@/features/RegisterBooks/DailyOperationsRegisters/mobilePhoneInOut/components/form";
import { useGetMobilePhoneInOutRegisters, useDeleteMobilePhoneInOutRegister } from "@/features/RegisterBooks/DailyOperationsRegisters/mobilePhoneInOut/hooks";
import RightSideSheet from "@/components/common/RightSideSheet";
import { toast } from "react-toastify";

const MobilePhoneInOutRegisters = () => {
    const router = useRouter();
    const { data: registers = [], isLoading, refetch } = useGetMobilePhoneInOutRegisters();
    const deleteMutation = useDeleteMobilePhoneInOutRegister();

    // Sheet State
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedRegister, setSelectedRegister] = useState<any>(null);

    const handleEdit = (register: any) => {
        setSelectedRegister(register);
        setIsSheetOpen(true);
    };

    const handleAddNew = () => {
        setSelectedRegister(null);
        setIsSheetOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(id);
            // toast is handled by the mutation hook
            refetch();
        } catch (error) {
            console.error("Error deleting register:", error);
            toast.error("Failed to delete register");
        }
    };

    const handleFormSuccess = () => {
        setIsSheetOpen(false);
        refetch();
    };

    return (
        <div className="min-h-screen bg-white">

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
                            Mobile Phone Out|In Register
                        </span>
                    </div>
                </div>
                {/* <Button className="bg-neutral-900 text-white hover:bg-neutral-800 gap-2">
                    Download & Print Report
                    <Printer className="h-4 w-4" />
                </Button> */}
            </div>

            {/* Content */}
            <div className="p-6">
                <MobilePhoneInOutTable
                    data={registers}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAddNew={handleAddNew}
                />
            </div>

            {/* Right Side Sheet */}
            <RightSideSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                title={selectedRegister ? "Edit Mobile Phone Out Entry" : "Add Mobile Phone Out Entry"}
                description="Record Mobile Phone departure details"
            >
                <MobilePhoneInOutForm
                    initialData={selectedRegister}
                    onSuccess={handleFormSuccess}
                    onCancel={() => setIsSheetOpen(false)}
                />
            </RightSideSheet>
        </div>
    );
};

export default MobilePhoneInOutRegisters;
