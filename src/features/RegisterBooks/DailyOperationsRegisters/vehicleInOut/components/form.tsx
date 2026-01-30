"use client";

import React, { useState, useEffect } from "react";
import { Pen, X, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IndividualInputFields, IndividualData } from "@/features/RegisterBooks/components/IndividualInputFields";
import { AuthenticationSection } from "@/features/RegisterBooks/components/AuthenticationSection";
import { FormFooter } from "@/features/RegisterBooks/components/FormFooter";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { useCreateVehicleInOutRegister, useUpdateVehicleInOutRegister } from "../hooks";

interface VehicleInOutFormProps {
    initialData?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

const VehicleInOutForm = ({ initialData, onSuccess, onCancel }: VehicleInOutFormProps) => {
    const createMutation = useCreateVehicleInOutRegister();
    const updateMutation = useUpdateVehicleInOutRegister();

    const [individual, setIndividual] = useState<IndividualData>({
        armyNo: "",
        rank: "",
        name: "",
    });

    const [formData, setFormData] = useState({
        vehicleOutTime: "",
        outSignature: "",
        natureOfDuty: "",
        fromLocation: "",
        toLocation: "",
        vehicleBaNumber: "",
        typeOfVehicle: "",
        vehicleInTime: "",
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
                vehicleOutTime: initialData.details?.vehicleOutTime || "",
                outSignature: initialData.details?.outSignature?.value || "",
                natureOfDuty: initialData.details?.natureOfDuty || "",
                fromLocation: initialData.details?.fromLocation || "",
                toLocation: initialData.details?.toLocation || "",
                vehicleBaNumber: initialData.details?.vehicleBaNumber || "",
                typeOfVehicle: initialData.details?.typeOfVehicle || "",
                vehicleInTime: initialData.details?.vehicleInTime || "",
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
            { field: formData.vehicleOutTime, message: "Vehicle OUT Time is required" },
            { field: individual.armyNo, message: "Army Number is required" },
        ];

        for (const { field, message } of requiredFields) {
            if (!field) {
                toast.error(message);
                return;
            }
        }

        const payload = {
            type: "vehicle",
            date: new Date().toISOString(),
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
            <div className="p-6 space-y-8">
                {/* Vehicle OUT Details */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-900">Vehicle OUT Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="vehicleOutTime" className="text-xs font-medium text-neutral-700">
                                Vehicle OUT Time
                            </Label>
                            <Input
                                id="vehicleOutTime"
                                type="time"
                                className="block w-full"
                                value={formData.vehicleOutTime}
                                onChange={(e) => handleFormChange("vehicleOutTime", e.target.value)}
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

                {/* Duty Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Duty Details</h3>
                    <div className="space-y-1.5">
                        <SuggestionInput
                            label="Nature of Duty"
                            fieldType="natureOfDuty"
                            placeholder="eg. Mobile Duty"
                            value={formData.natureOfDuty}
                            onChange={(val) => handleFormChange("natureOfDuty", val)}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <SuggestionInput
                                label="From"
                                fieldType="location"
                                placeholder="Enter Location"
                                value={formData.fromLocation}
                                onChange={(val) => handleFormChange("fromLocation", val)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <SuggestionInput
                                label="To"
                                fieldType="location"
                                placeholder="Enter Location"
                                value={formData.toLocation}
                                onChange={(val) => handleFormChange("toLocation", val)}
                            />
                        </div>
                    </div>
                </section>

                {/* Vehicle Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Vehicle Details</h3>
                    <div className="space-y-1.5">
                        <SuggestionInput
                            label="Vehicle BA Number"
                            fieldType="vehicleNumber"
                            placeholder="eg. 12A123456B"
                            value={formData.vehicleBaNumber}
                            onChange={(val) => handleFormChange("vehicleBaNumber", val)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <SuggestionInput
                            label="Type of Vehicle"
                            fieldType="vehicleType"
                            placeholder="eg. Gypsy"
                            value={formData.typeOfVehicle}
                            onChange={(val) => handleFormChange("typeOfVehicle", val)}
                        />
                    </div>
                </section>

                {/* Vehicle IN Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">Vehicle IN Details</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="vehicleInTime" className="text-xs font-medium text-neutral-700">
                                Vehicle IN Time
                            </Label>
                            <Input
                                id="vehicleInTime"
                                type="time"
                                className="block w-full"
                                value={formData.vehicleInTime}
                                onChange={(e) => handleFormChange("vehicleInTime", e.target.value)}
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

export default VehicleInOutForm;
