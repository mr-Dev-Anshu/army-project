"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ChevronRight, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactInfoArmyPersonnelForm from "@/features/RegisterBooks/contactInformationRegisters/contactInfoArmyPersonnel/components/form";
import ContactInfoArmyPersonnelTable from "@/features/RegisterBooks/contactInformationRegisters/contactInfoArmyPersonnel/components/contactInfoArmyPersonnelTable";
import RightSideSheet from "@/components/common/RightSideSheet";
import { useGetContactInfoArmyPersonnelRegisters, useDeleteContactInfoArmyPersonnelRegister } from "@/features/RegisterBooks/contactInformationRegisters/contactInfoArmyPersonnel/hooks";

const Page = () => {
    const router = useRouter();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    // Fetch data
    const { data: registers = [] } = useGetContactInfoArmyPersonnelRegisters();
    const deleteMutation = useDeleteContactInfoArmyPersonnelRegister();

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
                            Contact Info. of Army Personnel & their Appointment
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
                <ContactInfoArmyPersonnelTable
                    data={registers}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAddNew={handleAddNew}
                />
            </div>

            <RightSideSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                title={selectedRecord ? "Edit Army Personnel Contact" : "Add Army Personnel Contact"}
                description="Enter contact and appointment details"
            >
                <ContactInfoArmyPersonnelForm
                    initialData={selectedRecord}
                    onSuccess={handleSuccess}
                    onCancel={() => setIsSheetOpen(false)}
                />
            </RightSideSheet>
        </div>
    );
};

export default Page;
