"use client";

import React, { useState, useEffect } from "react";
import { Pen, X } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IndividualInputFields, IndividualData } from "@/features/RegisterBooks/components/IndividualInputFields";
import { AuthenticationSection } from "@/features/RegisterBooks/components/AuthenticationSection";
import { FormFooter } from "@/features/RegisterBooks/components/FormFooter";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { useCreateRecceInOutRegister, useUpdateRecceInOutRegister } from "../hooks";

interface RecceInOutFormProps {
    initialData?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

const RecceInOutForm = ({ initialData, onSuccess, onCancel }: RecceInOutFormProps) => {
    const createMutation = useCreateRecceInOutRegister();
    const updateMutation = useUpdateRecceInOutRegister();

    const [individual, setIndividual] = useState<IndividualData>({
        armyNo: "",
        rank: "",
        name: "",
    });

    const [formData, setFormData] = useState({
        dateOfRecce: new Date().toISOString().split('T')[0],
        recceFrom: "",
        recceTill: "",
        placeOfRecce: "",
        recceOutTime: "",
        outSignature: "",
        dutyInTime: "",
        inSignature: "",
    });

    const [remark, setRemark] = useState("");

    const [authData, setAuthData] = useState({
        initialsMPCPNCO: "",
        initialsQMSJCO: "",
        initials2IC: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                dateOfRecce: initialData.date ? initialData.date.split('T')[0] : "",
                recceFrom: initialData.details?.recceFrom || "",
                recceTill: initialData.details?.recceTill || "",
                placeOfRecce: initialData.details?.placeOfRecce || "",
                recceOutTime: initialData.details?.recceOutTime || "",
                outSignature: initialData.details?.outSignature?.value || "",
                dutyInTime: initialData.details?.dutyInTime || "",
                inSignature: initialData.details?.inSignature?.value || "",
            });
            setRemark(initialData.remark || "");

            if (initialData.details?.individual) {
                setIndividual(initialData.details.individual);
            }

            if (initialData.authentication) {
                setAuthData(initialData.authentication);
            }
        }
    }, [initialData]);

    const handleFieldChange = (field: keyof IndividualData, value: string) => {
        setIndividual((prev) => ({ ...prev, [field]: value }));
    };

    const handleFormChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAuthChange = (field: string, value: string) => {
        setAuthData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        // Validation
        const requiredFields = [
            { field: formData.dateOfRecce, message: "Date of Recce is required" },
            { field: formData.recceOutTime, message: "Recce OUT Time is required" },
            { field: individual.armyNo, message: "Army Number is required" },
        ];

        for (const { field, message } of requiredFields) {
            if (!field) {
                toast.error(message);
                return;
            }
        }

        const payload = {
            type: "recce",
            date: new Date(formData.dateOfRecce).toISOString(),
            details: {
                ...formData,
                individual,
                outSignature: { type: "text", value: formData.outSignature },
                inSignature: { type: "text", value: formData.inSignature },
            },
            remark,
            authentication: authData
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
        }
    };

    return (
        <div className="mx-auto w-full max-w-4xl bg-white font-inter">
            {/* Header removed as it will be in the Sheet or Modal */}

            <div className="p-6 space-y-8">
                {/* Recce Details */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-900">Recce Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1.5 md:col-span-2">
                            <Label htmlFor="dateOfRecce" className="text-xs font-medium text-neutral-700">
                                Date of Recce
                            </Label>
                            <Input
                                id="dateOfRecce"
                                type="date"
                                className="block w-full"
                                value={formData.dateOfRecce}
                                onChange={(e) => handleFormChange("dateOfRecce", e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="recceFrom" className="text-xs font-medium text-neutral-700">
                                From
                            </Label>
                            <Input
                                id="recceFrom"
                                type="time"
                                className="block w-full"
                                value={formData.recceFrom}
                                onChange={(e) => handleFormChange("recceFrom", e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="recceTill" className="text-xs font-medium text-neutral-700">
                                Till
                            </Label>
                            <Input
                                id="recceTill"
                                type="time"
                                className="block w-full"
                                value={formData.recceTill}
                                onChange={(e) => handleFormChange("recceTill", e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <SuggestionInput
                            label="Place of Recce"
                            fieldType="location"
                            placeholder="Location"
                            value={formData.placeOfRecce}
                            onChange={(val) => handleFormChange("placeOfRecce", val)}
                        />
                    </div>
                </section>

                {/* Recce OUT Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Recce OUT Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="recceOutTime" className="text-xs font-medium text-neutral-700">
                                Recce OUT Time
                            </Label>
                            <Input
                                id="recceOutTime"
                                type="time"
                                className="block w-full"
                                value={formData.recceOutTime}
                                onChange={(e) => handleFormChange("recceOutTime", e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <SuggestionInput
                                label="OUT Signature"
                                fieldType="signature"
                                placeholder="Text / Digital"
                                value={formData.outSignature}
                                onChange={(val) => handleFormChange("outSignature", val)}
                                className="pr-10"
                            />
                        </div>
                    </div>
                </section>

                {/* Individual Details Section */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Individual Details
                    </h3>
                    <IndividualInputFields
                        data={individual}
                        onChange={handleFieldChange}
                    />
                </section>

                {/* Duty IN Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Duty IN Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="dutyInTime" className="text-xs font-medium text-neutral-700">
                                Duty IN Time
                            </Label>
                            <Input
                                id="dutyInTime"
                                type="time"
                                className="block w-full"
                                value={formData.dutyInTime}
                                onChange={(e) => handleFormChange("dutyInTime", e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <SuggestionInput
                                label="IN Signature"
                                fieldType="signature"
                                placeholder="Text / Digital"
                                value={formData.inSignature}
                                onChange={(val) => handleFormChange("inSignature", val)}
                                className="pr-10"
                            />
                        </div>
                    </div>
                </section>

                {/* Add Remark */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Add Remark</h3>
                    <div className="space-y-1.5">
                        <Textarea
                            id="remark"
                            placeholder="Enter remark"
                            className="resize-none min-h-[80px]"
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                        />
                    </div>
                </section>

                {/* Initials / Authentication */}
                <AuthenticationSection data={authData} onChange={handleAuthChange} />
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

export default RecceInOutForm;
