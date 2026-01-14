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
import { MoreVertical, Edit, Trash, Paperclip, X, Check, CheckCheck } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import ConfirmationModal from "@/components/common/ConfirmationModal";

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

    // Inline Edit State for References (Modal)
    const [editingRefIndex, setEditingRefIndex] = useState<number | null>(null);
    const [editingRefText, setEditingRefText] = useState("");

    // Inline Edit State for Pending References (Create Form)
    const [pendingEditingIndex, setPendingEditingIndex] = useState<number | null>(null);
    const [pendingEditingText, setPendingEditingText] = useState("");

    // Confirmation Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [offenceTypeToDelete, setOffenceTypeToDelete] = useState<string | null>(null);

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
        setPendingReferences(newRefs);
    };

    // --- PENDING REFERENCES INLINE EDIT ---
    const startEditingPendingRef = (index: number) => {
        setPendingEditingIndex(index);
        setPendingEditingText(pendingReferences[index]);
    };

    const cancelEditingPendingRef = () => {
        setPendingEditingIndex(null);
        setPendingEditingText("");
    };

    const savePendingRef = (index: number) => {
        if (!pendingEditingText.trim()) {
            toast.warning("Reference text cannot be empty");
            return;
        }
        // Check for duplicates
        if (pendingEditingText.trim().toLowerCase() !== pendingReferences[index].toLowerCase()) {
            if (pendingReferences.some((r, i) => i !== index && r.toLowerCase() === pendingEditingText.trim().toLowerCase())) {
                toast.warning("Reference already added");
                return;
            }
        }
        const newRefs = [...pendingReferences];
        newRefs[index] = pendingEditingText.trim();
        setPendingReferences(newRefs);
        setPendingEditingIndex(null);
        setPendingEditingText("");
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
    const handleDeleteClick = (offenceType: string) => {
        setOffenceTypeToDelete(offenceType);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!offenceTypeToDelete) return;

        try {
            await axios.delete(`/api/offence-references?offenceType=${encodeURIComponent(offenceTypeToDelete)}`);
            toast.success("Deleted successfully");
            fetchOffenceTypes();
        } catch (error: any) {
            console.error("Delete error", error);
            toast.error("Failed to delete");
        } finally {
            setDeleteModalOpen(false);
            setOffenceTypeToDelete(null);
        }
    };

    // --- EDIT HANDLERS ---
    const openEditModal = (group: OffenceGroup) => {
        setOriginalOffenceType(group.offenceType);
        setEditOffenceType(group.offenceType); // Initialize with capitalisation from DB usually
        setEditReferences([...group.references]);
        setNewReferenceInput("");
        setEditingRefIndex(null); // Reset
        setEditingRefText("");
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

    // --- INLINE EDIT HANDLERS ---
    const startEditingRef = (index: number) => {
        setEditingRefIndex(index);
        setEditingRefText(editReferences[index]);
    };

    const cancelEditingRef = () => {
        setEditingRefIndex(null);
        setEditingRefText("");
    };

    const saveEditingRef = (index: number) => {
        if (!editingRefText.trim()) {
            toast.warning("Reference text cannot be empty");
            return;
        }
        // Check duplicate if changed
        if (editingRefText.trim().toLowerCase() !== editReferences[index].toLowerCase()) {
            if (editReferences.some((r, i) => i !== index && r.toLowerCase() === editingRefText.trim().toLowerCase())) {
                toast.warning("Reference already exists");
                return;
            }
        }

        const newRefs = [...editReferences];
        newRefs[index] = editingRefText.trim();
        setEditReferences(newRefs);
        setEditingRefIndex(null);
        setEditingRefText("");
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
                <div className="mb-2 flex items-center text-sm text-[#404040]">
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
                    <span className="font-semibold text-[#404040]">
                        Offence Types Management
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                <h1 className="mb-8 text-base font-semibold text-[#404040]">
                    Offence Types Management
                </h1>

                {/* Add New Section */}
                <div className="bg-white p-6 rounded-md shadow-sm border border-slate-200 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-[#0A0A0A]">Add New Offence Type</h2>

                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#0A0A0A]">
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
                            <label className="text-sm font-medium text-[#0A0A0A]">
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
                                    className="text-blue-500 hover:text-blue-600 text-sm font-medium cursor-pointer flex items-center self-center shrink-0 whitespace-nowrap"
                                >
                                    + Add New Reference
                                </span>
                            </div>

                            {/* Pending References List (Stacked) */}
                            {pendingReferences.length > 0 && (
                                <div className="mt-4 border border-[#E5E5E5]  divide-y divide-[#E5E5E5]">
                                    {pendingReferences.map((ref, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-white">
                                            <div className="flex gap-3 text-sm text-[#0A0A0A] items-center flex-1 mr-4">
                                                <span className="text-[#0A0A0A] font-medium">{idx + 1}.</span>

                                                {pendingEditingIndex === idx ? (
                                                    <div className="flex items-center gap-2 w-full">
                                                        <Input
                                                            value={pendingEditingText}
                                                            onChange={(e) => setPendingEditingText(e.target.value)}
                                                            className="h-8 text-sm"
                                                            autoFocus
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") savePendingRef(idx);
                                                                if (e.key === "Escape") cancelEditingPendingRef();
                                                            }}
                                                        />
                                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-green-600 text-green-500" onClick={() => savePendingRef(idx)}>
                                                            <Check className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-red-500 text-slate-400" onClick={cancelEditingPendingRef}>
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="break-all">{ref}</span>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            {pendingEditingIndex !== idx && (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => startEditingPendingRef(idx)}
                                                        className="text-slate-400 hover:text-blue-500 transition-colors p-1"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemovePendingReference(idx)}
                                                        className="text-red-400 hover:text-red-600 transition-colors bg-red-50 hover:bg-red-100 p-1 rounded-full"
                                                        title="Remove"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center mt-6 pt-2">
                            <Button variant="outline" onClick={handleCancel} className="px-6">Cancel</Button>
                            <Button onClick={handleSave} className="bg-black text-white hover:bg-slate-800 px-6">
                                <CheckCheck className="w-4 h-4 mr-2" />
                                Save to list
                            </Button>
                        </div>
                    </div>
                </div>

                {/* List Section */}
                <div className="bg-white p-6 rounded-md shadow-sm border border-slate-200">
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="text-sm font-semibold text-[#404040] uppercase tracking-tight">
                            Monthly Offence Analysis – Data Entered
                        </h2>
                        <div className="text-sm text-[#404040]">
                            Total Offences: <span className="font-semibold">{offenceGroups.length}</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto border border-[#E5E5E5] rounded-md">
                        <table className="w-full text-left text-sm text-[#0A0A0A]">
                            <thead className="bg-[#E5E5E5] font-bold text-[#0A0A0A]">
                                <tr>
                                    <th className="px-4 py-3 w-18 border-r border-[#E5E5E5]">Sr no.</th>
                                    <th className="px-4 py-3 w-1/4 border-r border-[#E5E5E5]">Offence Type</th>
                                    <th className="px-4 py-3 border-r border-[#E5E5E5]">Reference Related</th>
                                    <th className="px-4 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E5E5] bg-white">
                                {loading ? (
                                    <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
                                ) : offenceGroups.length === 0 ? (
                                    <tr><td colSpan={4} className="p-4 text-center text-slate-400">No records found</td></tr>
                                ) : (
                                    offenceGroups.map((group, idx) => (
                                        <tr key={idx} className="divide-x divide-[#E5E5E5]">
                                            <td className="px-4 py-3 align-top text-center font-medium text-[#0A0A0A]">
                                                {idx + 1}.
                                            </td>
                                            <td className="px-4 py-3 align-top font-medium text-[#0A0A0A] bg-white">
                                                {/* Capitalize first letter */}
                                                {group.offenceType.charAt(0).toUpperCase() + group.offenceType.slice(1)}
                                            </td>
                                            <td className="px-0 py-0 align-top bg-white">
                                                {/* Nested list with borders */}
                                                {group.references.length > 0 ? (
                                                    <div className="flex flex-col">
                                                        {group.references.map((ref, rIdx) => (
                                                            <div key={rIdx} className={`px-4 py-3 flex gap-2 ${rIdx !== group.references.length - 1 ? 'border-b border-[#E5E5E5]' : ''}`}>
                                                                <span className="text-[#0A0A0A] font-medium min-w-[1.2rem]">{rIdx + 1}.</span>
                                                                <span>{ref}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="px-4 py-3 text-slate-400 italic">No Reference added</div>
                                                )}
                                            </td>
                                            <td className="px-2 py-3 align-top text-center">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-slate-100">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreVertical className="h-4 w-4 text-slate-500" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 shadow-lg border-slate-200">
                                                        <DropdownMenuItem className="cursor-pointer py-2 focus:bg-slate-50" onClick={() => openEditModal(group)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer py-2 focus:bg-slate-50">
                                                            <Paperclip className="mr-2 h-4 w-4" />
                                                            <span>Attach Forms / Certificates / Letters</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600 cursor-pointer py-2 focus:bg-red-50 focus:text-red-700"
                                                            onClick={() => handleDeleteClick(group.offenceType)}
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
                <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0">
                    <DialogHeader className="px-6 py-4 border-b border-[#E5E5E5] shrink-0">
                        <DialogTitle className="text-xl font-semibold text-[#0A0A0A]">Edit Offence Type</DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                        {/* 1. Offence Type Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#737373]">
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
                            <div className="flex justify-between text-sm font-semibold text-[#737373]  tracking-wide">
                                <span>Reference Related to the Above Offence:</span>
                                <span>{String(editReferences.length).padStart(2, '0')}</span>
                            </div>
                            <div className="space-y-2">
                                {editReferences.map((ref, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white border border-[#E5E5E5] rounded-md">
                                        <div className="flex gap-3 text-sm text-[#0A0A0A] items-center flex-1 mr-4">
                                            <span className="text-[#A3A3A3] font-medium">{idx + 1}.</span>

                                            {editingRefIndex === idx ? (
                                                <div className="flex items-center gap-2 w-full">
                                                    <Input
                                                        value={editingRefText}
                                                        onChange={(e) => setEditingRefText(e.target.value)}
                                                        className="h-8 text-sm"
                                                        autoFocus
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") saveEditingRef(idx);
                                                            if (e.key === "Escape") cancelEditingRef();
                                                        }}
                                                    />
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-green-600 text-green-500" onClick={() => saveEditingRef(idx)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-red-500 text-slate-400" onClick={cancelEditingRef}>
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="break-all">{ref}</span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        {editingRefIndex !== idx && (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => startEditingRef(idx)}
                                                    className="text-slate-400 hover:text-blue-500 transition-colors p-1"
                                                    title="Edit Reference"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveReferenceInEdit(idx)}
                                                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                                                    title="Remove Reference"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {editReferences.length === 0 && (
                                    <div className="p-4 text-center text-slate-400 text-sm italic border border-dashed border-[#E5E5E5] rounded-md">
                                        No references
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Add New Reference */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#0A0A0A]">
                                Add Additional References for this Offence Type
                            </label>
                            <Textarea
                                value={newReferenceInput}
                                onChange={(e) => setNewReferenceInput(e.target.value)}
                                placeholder="Offence Reference"
                                className="bg-slate-50 min-h-[80px]"
                            />
                            <div className="flex justify-end pt-2">
                                <span
                                    onClick={handleAddNewReferenceInEdit}
                                    className="text-blue-500 hover:text-blue-600 text-sm font-medium cursor-pointer flex items-center gap-1"
                                >
                                    + Add New Reference
                                </span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex gap-2 justify-between w-full px-6 py-4 border-t border-slate-100 bg-white shrink-0 sm:justify-between">
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="h-10 px-6 text-[#0A0A0A] font-medium border-slate-200">Cancel</Button>
                        <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white h-10 px-6 font-medium" onClick={handleSaveEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* DELETE CONFIRMATION MODAL */}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Confirm Delete"
                message={<span>Are you sure you want to delete all references for <span className="font-semibold text-red-600">"{offenceTypeToDelete}"</span> ? This action cannot be undone.</span>}
                confirmLabel="Delete"
                variant="danger"
            />
        </div>
    );
}
