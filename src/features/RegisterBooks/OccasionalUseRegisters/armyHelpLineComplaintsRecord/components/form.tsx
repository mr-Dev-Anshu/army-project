import React, { useState, useEffect } from "react";
import { X, MapPin } from "lucide-react";
import { SuggestionInput } from "@/common/component/SuggestionInput";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IndividualInputFields, IndividualData } from "@/features/RegisterBooks/components/IndividualInputFields";
import { AuthenticationSection } from "@/features/RegisterBooks/components/AuthenticationSection";
import { FormFooter } from "@/features/RegisterBooks/components/FormFooter";
import { useCreateArmyHelpLineComplaintsRegister, useUpdateArmyHelpLineComplaintsRegister } from "../hooks";

interface ArmyHelpLineComplaintsFormProps {
    initialData?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

const ArmyHelpLineComplaintsForm = ({ initialData, onSuccess, onCancel }: ArmyHelpLineComplaintsFormProps) => {
    const createMutation = useCreateArmyHelpLineComplaintsRegister();
    const updateMutation = useUpdateArmyHelpLineComplaintsRegister();

    const [individual, setIndividual] = useState<IndividualData>({
        armyNo: "",
        rank: "",
        name: "",
        unit: "",
        fmn: "",
        command: "",
    });

    const [formData, setFormData] = useState({
        dateOfComplaint: "",
        relatedPoliceStation: "",
        mobileNo: "",
        civilAddress: "",
        briefOfCase: "",
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
                dateOfComplaint: initialData.date ? initialData.date.split('T')[0] : "",
                relatedPoliceStation: initialData.details?.relatedPoliceStation || "",
                mobileNo: initialData.details?.mobileNo || "",
                civilAddress: initialData.details?.civilAddress || "",
                briefOfCase: initialData.details?.briefOfCase || "",
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
            { field: formData.dateOfComplaint, message: "Date of Complaint is required" },
            { field: individual.armyNo, message: "Individual Army No is required" },
        ];

        for (const { field, message } of requiredFields) {
            if (!field) {
                toast.error(message);
                return;
            }
        }

        const payload = {
            type: "army_help_line_complaints",
            date: formData.dateOfComplaint,
            details: {
                individual,
                relatedPoliceStation: formData.relatedPoliceStation,
                mobileNo: formData.mobileNo,
                civilAddress: formData.civilAddress,
                briefOfCase: formData.briefOfCase,
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

            <div className="p-6 space-y-8">
                {/* Individual Particulars */}
                <section className="space-y-4">
                    <h3 className="text-base font-bold text-neutral-900">
                        Individual Particulars
                    </h3>
                    <IndividualInputFields
                        data={individual}
                        onChange={handleFieldChange}
                        showExtendedFields={true}
                    />
                </section>

                {/* Complaint Information */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-[#0A0A0A]">
                        Complaint Information
                    </h3>

                    <div className="space-y-1.5">
                        <Label htmlFor="dateOfComplaint" className="text-xs font-medium text-[#0A0A0A]">
                            Date of Complaint
                        </Label>
                        <Input
                            id="dateOfComplaint"
                            type="date"
                            className="block w-full"
                            value={formData.dateOfComplaint}
                            onChange={(e) => handleFormChange("dateOfComplaint", e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="relatedPoliceStation" className="text-xs font-medium text-[#0A0A0A]">
                            Related Police Station
                        </Label>
                        <SuggestionInput
                            id="relatedPoliceStation"
                            placeholder="Text"
                            fieldType="relatedPoliceStation"
                            value={formData.relatedPoliceStation}
                            onChange={(v) => handleFormChange("relatedPoliceStation", v)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="mobileNo" className="text-xs font-medium text-[#0A0A0A]">
                            Mobile No. of Person Complaining
                        </Label>
                        <SuggestionInput
                            id="mobileNo"
                            placeholder="+91 ----- -----"
                            fieldType="mobileNumber"
                            value={formData.mobileNo}
                            onChange={(v) => handleFormChange("mobileNo", v)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="civilAddress" className="text-xs font-medium text-[#0A0A0A]">
                            Civil Address
                        </Label>
                        <div className="relative">
                            <SuggestionInput
                                id="civilAddress"
                                placeholder="Enter Address"
                                fieldType="civilAddress"
                                value={formData.civilAddress}
                                onChange={(v) => handleFormChange("civilAddress", v)}
                                icon={<MapPin className="h-4 w-4 text-neutral-400" />}
                            />
                        </div>
                    </div>
                </section>

                {/* Case Summary */}
                <section className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="text-sm font-bold text-[#0A0A0A]">
                        Case Summary
                    </h3>
                    <Textarea
                        id="briefOfCase"
                        placeholder="Brief of Case"
                        className="resize-none min-h-[80px]"
                        value={formData.briefOfCase}
                        onChange={(e) => handleFormChange("briefOfCase", e.target.value)}
                    />
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
                            value={formData.remark}
                            onChange={(e) => handleFormChange("remark", e.target.value)}
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

export default ArmyHelpLineComplaintsForm;
