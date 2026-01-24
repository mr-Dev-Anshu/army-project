import React, { useState, useEffect } from "react";
import { X, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IndividualInputFields, IndividualData } from "@/features/RegisterBooks/components/IndividualInputFields";
import { AuthenticationSection } from "@/features/RegisterBooks/components/AuthenticationSection";
import { FormFooter } from "@/features/RegisterBooks/components/FormFooter";
import { useCreateVehicleDemandRegister, useUpdateVehicleDemandRegister } from "../hooks";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { SuggestionTextarea } from "@/common/component/SuggestionTextarea";

interface VehicleDemandFormProps {
    initialData?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

const VehicleDemandForm = ({ initialData, onSuccess, onCancel }: VehicleDemandFormProps) => {
    const createMutation = useCreateVehicleDemandRegister();
    const updateMutation = useUpdateVehicleDemandRegister();

    const [individual, setIndividual] = useState<IndividualData>({
        armyNo: "",
        rank: "",
        name: "",
    });

    const [formData, setFormData] = useState({
        dateOfRequest: "",
        dateOfDemand: "",
        typeOfVehicle: "",
        purposeOfDemand: "",
        fromLocation: "",
        toLocation: "",
        remark: "",
    });

    const [authData, setAuthData] = useState({
        initialsMPCPNCO: "",
        initialsQMSJCO: "",
        initials2IC: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                dateOfRequest: initialData.date ? initialData.date.split('T')[0] : "",
                dateOfDemand: initialData.details?.dateOfDemand || "",
                typeOfVehicle: initialData.details?.typeOfVehicle || "",
                purposeOfDemand: initialData.details?.purposeOfDemand || "",
                fromLocation: initialData.details?.fromLocation || "",
                toLocation: initialData.details?.toLocation || "",
                remark: initialData.remark || "",
            });

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
            { field: formData.dateOfRequest, message: "Date of Request is required" },
            { field: formData.typeOfVehicle, message: "Type of Vehicle is required" },
            { field: individual.armyNo, message: "Requestor Army No is required" },
        ];

        for (const { field, message } of requiredFields) {
            if (!field) {
                toast.error(message);
                return;
            }
        }

        const payload = {
            type: "vehicle_demand",
            date: formData.dateOfRequest,
            details: {
                individual,
                dateOfDemand: formData.dateOfDemand,
                typeOfVehicle: formData.typeOfVehicle,
                purposeOfDemand: formData.purposeOfDemand,
                fromLocation: formData.fromLocation,
                toLocation: formData.toLocation,
            },
            remark: formData.remark,
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
            toast.error("Failed to save entry");
        }
    };

    return (
        <div className="mx-auto w-full max-w-4xl bg-white font-inter">
            {/* Header removed to use Sheet Header */}

            <div className="p-6 space-y-8">
                {/* Requestor Particulars */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Requestor Particulars
                    </h3>
                    <IndividualInputFields
                        data={individual}
                        onChange={handleFieldChange}
                    />
                </section>

                {/* Demand Details */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Demand Details
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="dateOfRequest" className="text-xs font-medium text-neutral-700">
                                Date of Request
                            </Label>
                            <Input
                                id="dateOfRequest"
                                type="date"
                                className="block w-full"
                                value={formData.dateOfRequest}
                                onChange={(e) => handleFormChange("dateOfRequest", e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="dateOfDemand" className="text-xs font-medium text-neutral-700">
                                Date of Demand
                            </Label>
                            <Input
                                id="dateOfDemand"
                                type="date"
                                className="block w-full"
                                value={formData.dateOfDemand}
                                onChange={(e) => handleFormChange("dateOfDemand", e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Vehicle Requirement */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">
                        Vehicle Requirement
                    </h3>

                    <div className="space-y-1.5">
                        <SuggestionInput
                            label="Type of Vehicle"
                            fieldType="typeOfVehicle"
                            placeholder="eg. jeep"
                            value={formData.typeOfVehicle}
                            onChange={(val) => handleFormChange("typeOfVehicle", val)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <SuggestionInput
                            label="Purpose of Vehicle Demand"
                            fieldType="purposeOfDemand"
                            placeholder="Enter reason here"
                            value={formData.purposeOfDemand}
                            onChange={(val) => handleFormChange("purposeOfDemand", val)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-neutral-500">
                            Movement Details:
                        </Label>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-1.5">
                                <SuggestionInput
                                    label="From Location"
                                    fieldType="location"
                                    placeholder="Enter Address"
                                    value={formData.fromLocation}
                                    onChange={(val) => handleFormChange("fromLocation", val)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <SuggestionInput
                                    label="To Location"
                                    fieldType="location"
                                    placeholder="Enter Address"
                                    value={formData.toLocation}
                                    onChange={(val) => handleFormChange("toLocation", val)}
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

export default VehicleDemandForm;
