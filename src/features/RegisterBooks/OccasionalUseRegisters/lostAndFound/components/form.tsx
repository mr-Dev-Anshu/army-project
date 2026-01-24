"use client";

import React, { useState, useEffect } from "react";
import { Pen } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { SuggestionTextarea } from "@/common/component/SuggestionTextarea";
import { FormFooter } from "@/features/RegisterBooks/components/FormFooter";
import { AuthenticationSection } from "@/features/RegisterBooks/components/AuthenticationSection";
import { useCreateLostAndFoundRegister, useUpdateLostAndFoundRegister } from "../hooks";

interface LostAndFoundFormProps {
    initialData?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

const LostAndFoundForm = ({ initialData, onSuccess, onCancel }: LostAndFoundFormProps) => {
    const createMutation = useCreateLostAndFoundRegister();
    const updateMutation = useUpdateLostAndFoundRegister();

    // Form State
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        itemName: "",
        place: "",
        handedByName: "",
        caseDetails: "",
        takeoverBy: "",
        takeoverDate: "",
        takeoverTime: "",
        remark: "",
    });

    const [authData, setAuthData] = useState({
        initialsMPCPNCO: "",
        initialsQMSJCO: "",
        initials2IC: "",
    });

    const [takeoverAuthData, setTakeoverAuthData] = useState({
        initialsMPCPNCO: "",
        initialsQMSJCO: "",
        initials2IC: "",
    });

    // Populate data on edit
    useEffect(() => {
        if (initialData) {
            setFormData({
                date: initialData.date ? initialData.date.split("T")[0] : "",
                time: initialData.details?.time || "",
                itemName: initialData.details?.itemName || "",
                place: initialData.details?.place || "",
                handedByName: initialData.details?.handedByName || "",
                caseDetails: initialData.details?.caseDetails || "",
                takeoverBy: initialData.details?.takeoverBy || "",
                takeoverDate: initialData.details?.takeoverDate ? initialData.details.takeoverDate.split("T")[0] : "",
                takeoverTime: initialData.details?.takeoverTime || "",
                remark: initialData.remark || "",
            });

            if (initialData.authentication) {
                setAuthData(initialData.authentication);
            }
            if (initialData.details?.takeoverAuth) {
                setTakeoverAuthData(initialData.details.takeoverAuth);
            }
        }
    }, [initialData]);

    const handleFormChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAuthChange = (field: any, value: string) => {
        setAuthData((prev) => ({ ...prev, [field]: value }));
    };

    const handleTakeoverAuthChange = (field: any, value: string) => {
        setTakeoverAuthData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        // Validation
        const requiredFields = [
            { field: formData.date, message: "Date is required" },
            { field: formData.time, message: "Time is required" },
            { field: formData.itemName, message: "Item Name is required" },
            { field: formData.place, message: "Place is required" },
            { field: formData.handedByName, message: "Handed By Name is required" },
        ];

        for (const { field, message } of requiredFields) {
            if (!field) {
                toast.error(message);
                return;
            }
        }

        const payload = {
            type: "lost_and_found",
            date: formData.date,
            details: {
                time: formData.time,
                itemName: formData.itemName,
                place: formData.place,
                handedByName: formData.handedByName,
                caseDetails: formData.caseDetails,
                takeoverBy: formData.takeoverBy,
                takeoverDate: formData.takeoverDate,
                takeoverTime: formData.takeoverTime,
                takeoverAuth: takeoverAuthData,
            },
            remark: formData.remark,
            authentication: authData,
        };

        try {
            if (initialData?._id) {
                await updateMutation.mutateAsync({ id: initialData._id, payload });
            } else {
                await createMutation.mutateAsync(payload);
            }
            onSuccess();
        } catch (error) {
            console.error("Failed to save:", error);
            toast.error("Failed to save entry");
        }
    };

    return (
        <div className="mx-auto w-full max-w-4xl bg-white font-inter">
            <div className="p-6 space-y-8">
                <section className="space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-neutral-900">
                            Incident & Item Details
                        </h3>
                        <p className="text-xs text-neutral-500">
                            What was found, where, and when
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="date" className="text-xs font-medium text-neutral-700">
                                Date
                            </Label>
                            <Input
                                id="date"
                                type="date"
                                className="block w-full"
                                value={formData.date}
                                onChange={(e) => handleFormChange("date", e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="time" className="text-xs font-medium text-neutral-700">
                                Time
                            </Label>
                            <Input
                                id="time"
                                type="time"
                                className="block w-full"
                                value={formData.time}
                                onChange={(e) => handleFormChange("time", e.target.value)}
                            />
                        </div>
                    </div>



                    <div className="space-y-1.5">
                        <SuggestionInput
                            label="Item Name"
                            fieldType="itemName"
                            placeholder="Enter Name of Item Found"
                            value={formData.itemName}
                            onChange={(val) => handleFormChange("itemName", val)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <SuggestionInput
                            label="Place"
                            fieldType="place"
                            placeholder="Enter Location"
                            value={formData.place}
                            onChange={(val) => handleFormChange("place", val)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <SuggestionInput
                            label="Handed by (Name)"
                            fieldType="name"
                            placeholder="Enter Location"
                            value={formData.handedByName}
                            onChange={(val) => handleFormChange("handedByName", val)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <SuggestionInput
                            label="Case Details"
                            fieldType="caseDetails"
                            placeholder="Enter Case Details"
                            value={formData.caseDetails}
                            onChange={(val) => handleFormChange("caseDetails", val)}
                        />
                    </div>
                </section>

                {/* Authorization (At Time of Deposit) */}
                <AuthenticationSection
                    title="Authorization (At Time of Deposit)"
                    description="Verification at the time item is deposited"
                    data={authData}
                    onChange={handleAuthChange}
                />

                {/* Takeover / Handover Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-neutral-900">
                            Takeover / Handover Details
                        </h3>
                        <p className="text-xs text-neutral-500">
                            Filled only when item is taken over/returned
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <SuggestionInput
                                label="Takeover By (Name)"
                                fieldType="name"
                                placeholder="Enter Name of Item Found"
                                value={formData.takeoverBy}
                                onChange={(val) => handleFormChange("takeoverBy", val)}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="takeoverDate" className="text-xs font-medium text-neutral-700">
                                    Date
                                </Label>
                                <Input
                                    id="takeoverDate"
                                    type="date"
                                    className="block w-full"
                                    value={formData.takeoverDate}
                                    onChange={(e) => handleFormChange("takeoverDate", e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="takeoverTime" className="text-xs font-medium text-neutral-700">
                                    Time
                                </Label>
                                <Input
                                    id="takeoverTime"
                                    type="time"
                                    className="block w-full"
                                    value={formData.takeoverTime}
                                    onChange={(e) => handleFormChange("takeoverTime", e.target.value)}
                                />
                            </div>
                        </div>

                        <AuthenticationSection
                            data={takeoverAuthData}
                            onChange={handleTakeoverAuthChange}
                            variant="minimal"
                        />
                    </div>
                </section>

                {/* Add Remark */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Add Remark</h3>
                    <div className="space-y-1.5">
                        <SuggestionTextarea
                            label=""
                            fieldType="remarks"
                            placeholder="Enter remark"
                            className="resize-none min-h-[80px]"
                            value={formData.remark}
                            onChange={(val) => handleFormChange("remark", val)}
                        />
                    </div>
                </section>
            </div>

            {/* Footer */}
            <FormFooter
                onCancel={onCancel}
                onSave={handleSubmit}
                isLoading={createMutation.isPending || updateMutation.isPending}
                saveLabel={initialData?._id ? "Update Entry" : "Save & Add Another"}
            />
        </div>
    );
};

export default LostAndFoundForm;
