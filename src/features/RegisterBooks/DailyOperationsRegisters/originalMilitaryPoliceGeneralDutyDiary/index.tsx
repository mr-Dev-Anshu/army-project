"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ChevronRight, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import RightSideSheet from "@/components/common/RightSideSheet";
import GeneralDutyDiaryTable from "./components/originalMilitaryPoliceGeneralDutyDiaryTable";
import GeneralDutyDiaryForm from "./components/form";
import { useGetGeneralDutyDiaryRegisters, useDeleteGeneralDutyDiaryRegister } from "./hooks";

const GeneralDutyDiaryRegisterPage = () => {
    const router = useRouter();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Fetch Data
    const { data: registers = [], isLoading } = useGetGeneralDutyDiaryRegisters();
    const deleteMutation = useDeleteGeneralDutyDiaryRegister();

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setIsAddOpen(true);
    };

    const handleDelete = async (id: string) => {
        await deleteMutation.mutateAsync(id);
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
                            Original Military Police General Duty Diary
                        </span>
                    </div>
                </div>
                <Button className="bg-neutral-900 text-white hover:bg-neutral-800 gap-2">
                    Download & Print Report
                    <Printer className="h-4 w-4" />
                </Button>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <GeneralDutyDiaryTable
                        data={registers}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAddNew={() => {
                            setEditingItem(null);
                            setIsAddOpen(true);
                        }}
                    />
                )}
            </div>

            {/* Add/Edit Modal */}
            <RightSideSheet
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title={editingItem ? "Edit General Duty Diary Entry" : "Add General Duty Diary Entry"}
                description={editingItem ? "Modify details of the duty entry." : "Record duty details"}
            >
                <GeneralDutyDiaryForm
                    initialData={editingItem}
                    onSuccess={() => setIsAddOpen(false)}
                    onCancel={() => setIsAddOpen(false)}
                />
            </RightSideSheet>
        </div>
    );
};

export default GeneralDutyDiaryRegisterPage;
