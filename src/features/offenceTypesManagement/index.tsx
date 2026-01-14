"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { MoreVertical, Edit, Trash, Paperclip, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface OffenceGroup {
    offenceType: string;
    references: string[];
    count: number;
}

export default function OffenceTypesManagement() {
    // State for List
    const [offenceGroups, setOffenceGroups] = useState<OffenceGroup[]>([]);
    const [loading, setLoading] = useState(false);

    // State for Create Form
    const [offenceTypeInput, setOffenceTypeInput] = useState("");
    const [referenceInput, setReferenceInput] = useState("");
    const [pendingReferences, setPendingReferences] = useState<string[]>([]);

    // State for Edit Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [originalOffenceType, setOriginalOffenceType] = useState("");
    const [editOffenceType, setEditOffenceType] = useState("");
    const [editReferences, setEditReferences] = useState<string[]>([]);
    const [newReferenceInput, setNewReferenceInput] = useState("");

    // Fetch Data
    const fetchOffenceTypes = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/offence-references?groupBy=offenceType");
            if (res.data.success) {
                setOffenceGroups(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch offence types", error);
            toast.error("Failed to load offence types");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOffenceTypes();
    }, []);

    // --- CREATE HANDLERS ---
    const handleAddReference = () => {
        if (!referenceInput.trim()) return;
        if (pendingReferences.includes(referenceInput.trim())) {
            toast.warning("Reference already added");
            return;
        }
        setPendingReferences([...pendingReferences, referenceInput.trim()]);
        setReferenceInput("");
    };

    const handleRemovePendingReference = (index: number) => {
        const newRefs = [...pendingReferences];
        newRefs.splice(index, 1);
        setPendingReferences(newRefs);
    };

    const handleSave = async () => {
        if (!offenceTypeInput.trim()) {
            toast.error("Please enter an Offence Type");
            return;
        }

        if (pendingReferences.length === 0) {
            toast.error("Please add at least one reference");
            return;
        }

        try {
            const existingGroup = offenceGroups.find(
                (g) => g.offenceType.toLowerCase() === offenceTypeInput.trim().toLowerCase()
            );

            if (existingGroup) {
                // Update (Replace) Mode
                await axios.put("/api/offence-references", {
                    offenceType: offenceTypeInput.trim(),
                    references: pendingReferences
                });
                toast.success("Offence Type updated successfully");
            } else {
                // Create Mode
                const payload = pendingReferences.map((ref) => ({
                    offenceType: offenceTypeInput.trim(),
                    reference: ref,
                }));
                await axios.post("/api/offence-references", payload);
                toast.success("Offence Type saved successfully");
            }
            // Reset form
            setOffenceTypeInput("");
            setReferenceInput("");
            setPendingReferences([]);
            // Refresh list
            fetchOffenceTypes();
        } catch (error: any) {
            console.error("Save error", error);
            toast.error(error.response?.data?.message || "Failed to save");
        }
    };

    const handleCancel = () => {
        setOffenceTypeInput("");
        setReferenceInput("");
        setPendingReferences([]);
    };

    // --- DELETE HANDLER ---
    const handleDelete = async (offenceType: string) => {
        if (!confirm(`Are you sure you want to delete all references for "${offenceType}"?`)) return;
        try {
            await axios.delete(`/api/offence-references?offenceType=${encodeURIComponent(offenceType)}`);
            toast.success("Deleted successfully");
            fetchOffenceTypes();
        } catch (error: any) {
            console.error("Delete error", error);
            toast.error("Failed to delete");
        }
    };

    // --- EDIT HANDLERS ---
    const openEditModal = (group: OffenceGroup) => {
        setOriginalOffenceType(group.offenceType);
        setEditOffenceType(group.offenceType); // Initialize with capitalisation from DB usually
        setEditReferences([...group.references]);
        setNewReferenceInput("");
        setIsEditModalOpen(true);
    };

    const handleRemoveReferenceInEdit = (index: number) => {
        const newRefs = [...editReferences];
        newRefs.splice(index, 1);
        setEditReferences(newRefs);
    };

    const handleAddNewReferenceInEdit = () => {
        if (!newReferenceInput.trim()) return;
        // Check duplicate
        if (editReferences.some(r => r.toLowerCase() === newReferenceInput.trim().toLowerCase())) {
            toast.warning("Reference already exists in this list");
            return;
        }
        setEditReferences([...editReferences, newReferenceInput.trim()]);
        setNewReferenceInput("");
    };

    const handleSaveEdit = async () => {
        if (!editOffenceType.trim()) {
            toast.error("Offence Type cannot be empty");
            return;
        }
        if (editReferences.length === 0) {
            toast.error("Must have at least one reference");
            return;
        }

        try {
            // Case 1: Name changed (Rename)
            if (editOffenceType.trim().toLowerCase() !== originalOffenceType.toLowerCase()) {
                // Delete old
                await axios.delete(`/api/offence-references?offenceType=${encodeURIComponent(originalOffenceType)}`);
                // Create new (Post/Put)
                const payload = editReferences.map((ref) => ({
                    offenceType: editOffenceType.trim(),
                    reference: ref,
                }));
                await axios.post("/api/offence-references", payload);
            }
            // Case 2: Same name, just update references
            else {
                await axios.put("/api/offence-references", {
                    offenceType: originalOffenceType, // Use original to match exact DB record if case sensitivity matters, but mostly it's lowercased in backend
                    references: editReferences
                });
            }

            toast.success("Changes saved successfully");
            setIsEditModalOpen(false);
            fetchOffenceTypes();

        } catch (error: any) {
            console.error("Edit save error", error);
            toast.error("Failed to save changes");
        }
    };

    return (
        <div className="w-full bg-white">
            {/* Header / Breadcrumb Section */}
            <div className="border-b bg-white px-6 py-4">
                <div className="mb-2 flex items-center text-sm text-gray-500">
                    <button className="flex items-center gap-2 hover:text-gray-900 transition-colors">
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
                    <span className="font-medium text-gray-900">
                        Offence Types Management
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                <h1 className="mb-8 text-xl font-semibold text-gray-700">
                    Offence Types Management
                </h1>

                {/* Add New Section */}
                <div className="bg-white p-6 rounded-md shadow-sm border border-slate-200 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Add New Offence Type</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Add New Offence Type if not present in the list
                            </label>
                            <Input
                                value={offenceTypeInput}
                                onChange={(e) => setOffenceTypeInput(e.target.value)}
                                placeholder="Enter Offence Type Name"
                                className="bg-slate-50 border-gray-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Enter Reference Related to the Above Offence
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    value={referenceInput}
                                    onChange={(e) => setReferenceInput(e.target.value)}
                                    placeholder="Offence Reference"
                                    className="bg-slate-50 border-gray-200 flex-1"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddReference();
                                        }
                                    }}
                                />
                                <span
                                    onClick={handleAddReference}
                                    className="text-blue-500 hover:text-blue-600 text-sm font-medium cursor-pointer flex items-center self-center shrink-0"
                                >
                                    + Add New Reference
                                </span>
                            </div>

                            {/* Pending References List */}
                            {pendingReferences.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {pendingReferences.map((ref, idx) => (
                                        <div key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                            <span>{ref}</span>
                                            <button
                                                onClick={() => handleRemovePendingReference(idx)}
                                                className="hover:text-red-500 font-bold"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-start gap-3 mt-6">
                            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                            <Button onClick={handleSave} className="bg-black text-white hover:bg-slate-800">
                                Save to list
                            </Button>
                        </div>
                    </div>
                </div>

                {/* List Section */}
                <div className="bg-white p-6 rounded-md shadow-sm border border-slate-200">
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-tight">
                            Monthly Offence Analysis – Data Entered
                        </h2>
                        <div className="text-sm text-slate-500">
                            Total Offences: <span className="font-semibold text-slate-800">{offenceGroups.length}</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-700">
                            <thead className="bg-slate-50 text-slate-600 font-medium">
                                <tr>
                                    <th className="px-4 py-3 w-16">Sr no.</th>
                                    <th className="px-4 py-3 w-1/4">Offence Type</th>
                                    <th className="px-4 py-3">Reference Related</th>
                                    <th className="px-4 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
                                ) : offenceGroups.length === 0 ? (
                                    <tr><td colSpan={4} className="p-4 text-center text-slate-400">No records found</td></tr>
                                ) : (
                                    offenceGroups.map((group, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 group transition-colors">
                                            <td className="px-4 py-3 align-top">{idx + 1}.</td>
                                            <td className="px-4 py-3 align-top font-medium text-slate-900 border-r border-slate-100">
                                                {/* Capitalize first letter */}
                                                {group.offenceType.charAt(0).toUpperCase() + group.offenceType.slice(1)}
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                                                    {group.references.map((ref, rIdx) => (
                                                        <li key={rIdx}>{ref}</li>
                                                    ))}
                                                </ol>
                                                {group.references.length === 0 && <span className="text-slate-400 italic">No Reference added</span>}
                                            </td>
                                            <td className="px-4 py-3 align-top text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem className="cursor-pointer" onClick={() => openEditModal(group)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <Paperclip className="mr-2 h-4 w-4" />
                                                            <span>Attach Forms / Certificates / Letters</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600 cursor-pointer focus:text-red-600"
                                                            onClick={() => handleDelete(group.offenceType)}
                                                        >
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            <span>Delete</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* EDIT MODAL */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Offence Type</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* 1. Offence Type Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Add New Offence Type if not present in the list
                            </label>
                            <Input
                                value={editOffenceType}
                                onChange={(e) => setEditOffenceType(e.target.value)}
                                placeholder="Enter Offence Type"
                                className="bg-white border-blue-400 focus:border-blue-500 rounded-md"
                            />
                        </div>

                        {/* 2. Existing References List */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wide">
                                <span>Reference Related to the Above Offence:</span>
                                <span>{String(editReferences.length).padStart(2, '0')}</span>
                            </div>
                            <div className="border rounded-md divide-y divide-slate-100 border-slate-200">
                                {editReferences.map((ref, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white">
                                        <div className="flex gap-3 text-sm text-slate-700">
                                            <span className="text-slate-400 font-medium">{idx + 1}.</span>
                                            <span>{ref}</span>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveReferenceInEdit(idx)}
                                            className="text-red-400 hover:text-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {editReferences.length === 0 && (
                                    <div className="p-4 text-center text-slate-400 text-sm italic">
                                        No references
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Add New Reference */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Add Additional References for this Offence Type
                            </label>
                            <Textarea
                                value={newReferenceInput}
                                onChange={(e) => setNewReferenceInput(e.target.value)}
                                placeholder="Offence Reference"
                                className="bg-slate-50 min-h-[80px]"
                            />
                            <div className="flex justify-end">
                                <span
                                    onClick={handleAddNewReferenceInEdit}
                                    className="text-blue-500 hover:text-blue-600 text-sm font-medium cursor-pointer flex items-center gap-1"
                                >
                                    + Add New Reference
                                </span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex gap-2 sm:justify-between w-full">
                        <div className="flex-1"></div> {/* Spacer to push buttons right if needed, but layout expects right align */}
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleSaveEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
