"use client";

import React, { useState } from "react";
import Link from "next/link";
import TemporaryHiredTable from "./temporaryHired/components/TemporaryHiredTable";
import RightSideSheet from "@/components/common/RightSideSheet";
import TemporaryHiredWorkerPassForm from "./temporaryHired/components/form";

const TemporaryWorkerView = () => {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingTemporaryWorker, setEditingTemporaryWorker] = useState<any>(null);

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="border-b bg-white px-6 py-4">
                <div className="mb-2 flex items-center text-sm text-gray-500">
                    <button
                        className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                    >
                        <span className="h-4 w-4">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5.33337C11.3137 5.33337 14 4.43794 14 3.33337C14 2.2288 11.3137 1.33337 8 1.33337C4.68629 1.33337 2 2.2288 2 3.33337C2 4.43794 4.68629 5.33337 8 5.33337Z" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 8C14 9.10667 11.3333 10 8 10C4.66667 10 2 9.10667 2 8" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 3.33337V12.6667C2 13.7734 4.66667 14.6667 8 14.6667C11.3333 14.6667 14 13.7734 14 12.6667V3.33337" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        System Setup
                    </button>
                    <span className="mx-2">|</span>
                    <button className="hover:text-gray-900 transition-colors">Basic Information</button>
                    <span className="mx-2 text-gray-400">&gt;</span>
                    <Link
                        href="/setup/civil-employees"
                        className="text-gray-500 hover:text-gray-900"
                    >
                        Civil Employees Management
                    </Link>
                    <span className="mx-2 text-gray-400">&gt;</span>
                    <span className="font-medium text-gray-900">
                        Temporary Hired Worker Security Passes
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                <TemporaryHiredTable
                    onAddNew={() => {
                        setEditingTemporaryWorker(null);
                        setIsAddOpen(true);
                    }}
                    onEdit={(item) => {
                        setEditingTemporaryWorker(item);
                        setIsAddOpen(true);
                    }}
                />
            </div>

            {/* Right Side Sheet for Add New */}
            <RightSideSheet
                isOpen={isAddOpen}
                onClose={() => {
                    setIsAddOpen(false);
                    setEditingTemporaryWorker(null);
                }}
                title={editingTemporaryWorker ? "Edit Temporary Worker Pass" : "Add Temporary Worker Pass"}
                description={editingTemporaryWorker ? "Update details to modify temporary worker pass" : "Fill details to generate temporary worker pass"}
            >
                <TemporaryHiredWorkerPassForm
                    onCancel={() => {
                        setIsAddOpen(false);
                        setEditingTemporaryWorker(null);
                    }}
                    onSuccess={() => {
                        setIsAddOpen(false);
                        setEditingTemporaryWorker(null);
                    }}
                    initialData={editingTemporaryWorker}
                />
            </RightSideSheet>
        </div>
    );
};

export default TemporaryWorkerView;
