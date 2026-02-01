
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ChevronRight, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactInfoCivilPoliceStationForm from "@/features/RegisterBooks/contactInformationRegisters/contactInfoCivilPoliceStation/components/form";
import ContactInfoCivilPoliceStationTable from "@/features/RegisterBooks/contactInformationRegisters/contactInfoCivilPoliceStation/components/contactInfoCivilPoliceStationTable";
import { useGetContactInfoCivilPoliceRegisters, useDeleteContactInfoCivilPoliceRegister } from "@/features/RegisterBooks/contactInformationRegisters/contactInfoCivilPoliceStation/hooks";
import RightSideSheet from "@/components/common/RightSideSheet";
import { toast } from "react-toastify";

const Page = () => {
    const router = useRouter();
    const { data: registers = [], refetch, isLoading } = useGetContactInfoCivilPoliceRegisters({ limit: 1000 }); // Fetch all for client-side filtering
    const deleteMutation = useDeleteContactInfoCivilPoliceRegister();

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
        // Toast is handled by the hook
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section (Breadcrumb + Title) */}
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
                            Contact Info. of Civil Police Station
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
                    title={selectedRecord ? "Edit Civil Police Station Contact" : "Add Civil Police Station Contact"}
                    description="Registers / Contact Info – Civil Police Station"
                >
                    <ContactInfoCivilPoliceStationForm
                        initialData={selectedRecord}
                        onSuccess={handleFormSuccess}
                        onCancel={() => setIsSheetOpen(false)}
                    />
                </RightSideSheet>

                <div className="space-y-6">
                    {/* Header Section if needed, or integrated in Table */}

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <ContactInfoCivilPoliceStationTable
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
