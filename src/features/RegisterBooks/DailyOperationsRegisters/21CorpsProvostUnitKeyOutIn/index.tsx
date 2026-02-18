"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Book, ChevronRight, Printer, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import RightSideSheet from "@/components/common/RightSideSheet";
import KeyOutInTable from "./components/21CorpsProvostUnitKeyOutInTable";
import KeyOutInForm from "./components/form";
import { useGetKeyOutInRegisters, useDeleteKeyOutInRegister } from "./hooks";

const KeyOutInRegisterPage = () => {
    const router = useRouter();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Fetch Data
    const { data: registers = [], isLoading } = useGetKeyOutInRegisters();
    const deleteMutation = useDeleteKeyOutInRegister();

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
                            21 Corps Provost Unit Key Out|In Register
                        </span>
                    </div>
                </div>
                {/* <Button className="bg-neutral-900 text-white hover:bg-neutral-800 gap-2">
                    Download & Print Report
                    <Printer className="h-4 w-4" />
                </Button> */}
            </div>

            {/* Main Content */}
            <div className="p-6">
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <KeyOutInTable
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
                title={editingItem ? "Edit Key Out Entry" : "Add Key Out Entry"}
                description={editingItem ? "Modify details of the key departure." : "Record Key departure details"}
            >
                <KeyOutInForm
                    initialData={editingItem}
                    onSuccess={() => setIsAddOpen(false)}
                    onCancel={() => setIsAddOpen(false)}
                />
            </RightSideSheet>
        </div>
    );
};



export default KeyOutInRegisterPage;
