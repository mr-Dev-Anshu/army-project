"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IndividualInputFields, IndividualData } from "@/features/RegisterBooks/components/IndividualInputFields";
import { AuthenticationSection } from "@/features/RegisterBooks/components/AuthenticationSection";
import { FormFooter } from "@/features/RegisterBooks/components/FormFooter";
import { useCreateDutyRosterRegister, useUpdateDutyRosterRegister } from "@/features/RegisterBooks/DailyOperationsRegisters/dutyRoster/hooks";
import { formatDateForInput } from "@/utils/dateUtils";

interface DutyRosterFormProps {
    initialData?: any;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const DutyRosterForm = ({ initialData, onSuccess, onCancel }: DutyRosterFormProps) => {
    const createMutation = useCreateDutyRosterRegister();
    const updateMutation = useUpdateDutyRosterRegister();

    // Form States
    const [individual, setIndividual] = useState<IndividualData>({
        armyNo: "",
        rank: "",
        name: "",
    });

    const [dateOfDuty, setDateOfDuty] = useState("");

    // Time Slots
    const [morningDutyFrom, setMorningDutyFrom] = useState("");
    const [morningDutyTill, setMorningDutyTill] = useState("");
    const [eveningDutyFrom, setEveningDutyFrom] = useState("");
    const [eveningDutyTill, setEveningDutyTill] = useState("");

    const [authData, setAuthData] = useState({
        initialsMPCPNCO: "",
        initialsQMSJCO: "",
        initials2IC: "",
    });

    const [remark, setRemark] = useState("");

    // Load initial data for editing
    useEffect(() => {
        if (initialData) {
            if (initialData.details?.individual) {
                setIndividual({
                    armyNo: initialData.details.individual.armyNo || "",
                    rank: initialData.details.individual.rank || "",
                    name: initialData.details.individual.name || "",
                });
            }
            if (initialData.date) {
                setDateOfDuty(formatDateForInput(initialData.date));
            }
            if (initialData.details?.morningSlot) {
                setMorningDutyFrom(initialData.details.morningSlot.from || "");
                setMorningDutyTill(initialData.details.morningSlot.to || "");
            }
            if (initialData.details?.eveningSlot) {
                setEveningDutyFrom(initialData.details.eveningSlot.from || "");
                setEveningDutyTill(initialData.details.eveningSlot.to || "");
            }
            if (initialData.authentication) {
                setAuthData({
                    initialsMPCPNCO: initialData.authentication.initialsMPCPNCO || "",
                    initialsQMSJCO: initialData.authentication.initialsQMSJCO || "",
                    initials2IC: initialData.authentication.initials2IC || "",
                });
            }
            if (initialData.remark) {
                setRemark(initialData.remark || "");
            }
        }
    }, [initialData]);

    const handleFieldChange = (field: keyof IndividualData, value: string) => {
        setIndividual((prev) => ({ ...prev, [field]: value }));
    };

    const handleAuthChange = (field: string, value: string) => {
        setAuthData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        // Validation
        const requiredFields = [
            { field: dateOfDuty, message: "Date of Duty is required" },
            { field: individual.armyNo, message: "Army Number is required" },
        ];

        for (const { field, message } of requiredFields) {
            if (!field) {
                toast.error(message);
                return;
            }
        }

        try {
            const payload = {
                date: dateOfDuty,
                details: {
                    individual,
                    morningSlot: {
                        from: morningDutyFrom,
                        to: morningDutyTill,
                    },
                    eveningSlot: {
                        from: eveningDutyFrom,
                        to: eveningDutyTill,
                    },
                },
                authentication: authData,
                remark,
                type: "duty_roster",
            };

            if (initialData?._id) {
                await updateMutation.mutateAsync({ id: initialData._id, payload: payload });
            } else {
                await createMutation.mutateAsync(payload);
            }

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="mx-auto w-full max-w-4xl font-inter">
            <div className="space-y-8">
                {/* Individual Details Section */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Individual Particulars
                    </h3>
                    <IndividualInputFields
                        data={individual}
                        onChange={handleFieldChange}
                    />
                </section>

                {/* Duty Details */}
                <section className="space-y-6 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Duty Details</h3>
                    <div className="space-y-1.5">
                        <Label htmlFor="dateOfDuty" className="text-xs font-medium text-neutral-700">
                            Date of Duty
                        </Label>
                        <Input
                            id="dateOfDuty"
                            type="date"
                            className="block w-full max-w-md"
                            value={dateOfDuty}
                            onChange={(e) => setDateOfDuty(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-neutral-900">Morning Slot Timing</h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="morningDutyFrom" className="text-xs font-medium text-neutral-700">
                                    Duty From
                                </Label>
                                <Input
                                    id="morningDutyFrom"
                                    type="time"
                                    className="block w-full"
                                    value={morningDutyFrom}
                                    onChange={(e) => setMorningDutyFrom(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="morningDutyTill" className="text-xs font-medium text-neutral-700">
                                    Duty Till
                                </Label>
                                <Input
                                    id="morningDutyTill"
                                    type="time"
                                    className="block w-full"
                                    value={morningDutyTill}
                                    onChange={(e) => setMorningDutyTill(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-neutral-900">Evening Slot Timing</h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="eveningDutyFrom" className="text-xs font-medium text-neutral-700">
                                    Duty From
                                </Label>
                                <Input
                                    id="eveningDutyFrom"
                                    type="time"
                                    className="block w-full"
                                    value={eveningDutyFrom}
                                    onChange={(e) => setEveningDutyFrom(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="eveningDutyTill" className="text-xs font-medium text-neutral-700">
                                    Duty Till
                                </Label>
                                <Input
                                    id="eveningDutyTill"
                                    type="time"
                                    className="block w-full"
                                    value={eveningDutyTill}
                                    onChange={(e) => setEveningDutyTill(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Initials / Authentication */}
                <AuthenticationSection data={authData} onChange={handleAuthChange} />

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
            </div>

            {/* Footer */}
            <div className="mt-8">
                <FormFooter
                    onSave={handleSubmit}
                    onCancel={onCancel}
                    isLoading={createMutation.isPending || updateMutation.isPending}
                    saveLabel={initialData?._id ? "Update Entry" : "Save & Add Another"}
                />
            </div>
        </div>
    );
};

export default DutyRosterForm;
